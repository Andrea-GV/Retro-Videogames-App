import pool from "@/app/lib/db";
import { Game, CreateGame, UpdateGame } from "@/app/models/game";

// ✅ CREATE createGame(data) ---> Devolverá <Game> --> el juego creado
export async function createGame(data: CreateGame): Promise<Game> {
  const { name, release_date, players_num, cover_url, rating, id_publisher } =
    data;
  // VALUES ($n) en vez de VALUES (${game.name}, ....) para proteger la inyeción de SQL
  //   --> $n corresponde a la posición del parámetro en la query
  // RETURNING * ---> RETORUNING se usa queries de actualizar, nueva inserción o eliminar
  //     🚩  Actualización 20.01: Eliminado el returning porque no es necesario que devuelva nada después de insertar
  // Tutoría    🟡  Actualización 21.01: Eliminar el returning hacía que al hacer post SIEMPRE devolviera Error 500 aunque lo posteaba
  //     🟡  Devolví el RETURNING * y volvió a dar 201 al postear
  //             ---> En este caso se hace para devolver el juego creado en la tabla games
  //             ---> * para:
  //             ---> devolver todos los campos de la fila
  //             ---> devolverá el id_game generado automáticamente (en la tabla usé SERIAL)
  //             ---> evito tener que hacer una segunda query con SELECT :
  //                  const result2 = await pool.query('SELECT * FROM games WHERE name = $1', [name])

  const query = `
    INSERT INTO games (name, release_date, players_num, cover_url, rating, id_publisher)
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING *
  `;

  const values = [
    name,
    release_date,
    players_num,
    cover_url,
    rating,
    id_publisher,
  ];

  try {
    // Parametrizando la query, no "ensucio" la petición y la hace más segura frente a inyección de SQL
    const result = await pool.query(query, values);
    return result.rows[0];
  } catch (error: any) {
    // Manejo de errores específicos de PostgreSQL
    // ⚠️  Docu sobre todos los códigos de error: https://www.postgresql.org/docs/current/errcodes-appendix.html
    //   Errores más comunes:
    //   - 23505: Unique violation (ya existe un juego con ese nombre/valor)
    //   - 23503: Foreign key violation (un publisher no existe)
    //   - 23502: Not null violation (falta un campo obligatorio)
    if (error.code === "23505") {
      throw new Error(`El juego "${name}" ya existe`);
    }
    if (error.code === "23503") {
      throw new Error(`El publisher con id ${id_publisher} no existe`);
    }
    if (error.code === "23502") {
      throw new Error(`Falta un campo obligatorio`);
    }
    // Si no es ninguno de estos, lo mando genérico y ya investigaremos
    throw new Error(`Error al crear el juego: ${error.message}`);
  }
}

// ✅ READ ---- GetAll & GetById & GetByName
// ✅ getAllGames() ---> Devolverá <Game[]> --> Array de juegos
// ✅ getGameById(number) ---> Devolverá <Game | null> --> un juego (x id)
// ❌getGameByName(string) ---> Devolverá <Game | null> --> un juego exacto (x name)
// ✅ searchGameByName es más adecuado que el getName por su parcialidad de info
export async function getAllGames(): Promise<Game[]> {
  //   Aquí ya no uso RETURNING porque quiero ver TODOS los juegos y no modificar
  const query = `
    SELECT 
      g.id_game,
      g.name,
      g.release_date,
      g.players_num,
      g.cover_url,
      g.rating,
      g.id_publisher,
      p.name AS publisher_name
    FROM games g
    LEFT JOIN publishers p ON g.id_publisher = p.id_publisher
    ORDER BY g.name ASC
    `;
  // Para no hacer games.name, games.id_game etc ASIGNO g como ALIAS (apodos)
  //   Asignado en FROM games g
  //   Tb usado en LEFT JOIN publishers ON games.id_publisher = publishers.id_publisher
  // IMPORTANTE ORDER BY g.name ASC ---> Para que se ordene por el name de la tabla games
  //      Mejor que devuelva la información ordenada en la query que en el front para mejorar rendimiento
  //      Así en vez de traer todos y luego tener que ordenarlo y que tarde más, ya traerá la información ordenada como le indique

  // ❗️❗️ LEFT JOIN publishers p ON g.id_publisher = p.id_publisher
  //   ---> Y aquí (como definí en el model) le UNO en una tabla consulta (JOIN)
  //   ---> Uno a la tabla GAMES (g) de la tabla PUBLISHERS (p)
  //   ---> Con ON g.id_publisher = p.id_publisher
  //   --->   columna de games ⬆️ = ⬆️ columna de publishers
  //   ---> Para que se relacionen las tablas y permita acceder a los campos de la tabla publishers
  //   ---> Y tener el name de la publisher que me parece más relevante q su id
  try {
    const result = await pool.query(query);
    return result.rows;
  } catch (error: any) {
    throw new Error(`Error al obtener los juegos: ${error.message}`);
  }
}

export async function getGameById(id: number): Promise<Game | null> {
  const query = `
    SELECT 
      g.*,
      p.name AS publisher_name
    FROM games g
    LEFT JOIN publishers p ON g.id_publisher = p.id_publisher 
    WHERE g.id_game = $1
  `;
  try {
    const result = await pool.query(query, [id]);
    return result.rows[0] || null;
  } catch (error: any) {
    throw new Error(`Error al obtener el id ${id}: ${error.message}`);
  }
}

// La búsqueda es por nombre EXACTO (para la lógica interna de búsqueda)
// ❗️⚠️ Estoy pensando... Igual esta función es innecesaria :/
// export async function getGameByName(name: string): Promise<Game | null> {
//   const query = `
//     SELECT
//       g.*,
//       p.name AS publisher_name
//     FROM games g
//     LEFT JOIN publishers p ON g.id_publisher = p.id_publisher
//     WHERE g.name = $1
//   `;
//   try {
//     const result = await pool.query(query, [name]);
//     return result.rows[0] || null;
//   } catch (error: any) {
//     throw new Error(
//       `Error al obtener el juego con nombre ${name}: ${error.message}`,
//     );
//   }
// }

// La búsqueda PARCIAL para los usuarios (el buscador con autocompletado y sugerencias por nombres q puedan coincidir)
// Devolverá un ARRAY de juegos que contienen "zelda" en el nombre
// ❓ Esta función tendría que llevármela a lib ...
export async function searchGamesByName(searchTerm: string): Promise<Game[]> {
  const query = `
    SELECT 
      g.id_game,
      g.name,
      g.release_date,
      g.rating,
      p.name as publisher_name
    FROM games g
    LEFT JOIN publishers p ON g.id_publisher = p.id_publisher
    WHERE g.name ILIKE $1
    ORDER BY g.name ASC
  `;
  // ILIKE ---> Case-insensitive ignora mayus y minus
  // Para que el parámetro de búsqueda omita caracteres le añado %
  // % ---> cualquier carácter
  const searchPattern = `%${searchTerm}%`;
  try {
    const result = await pool.query(query, [searchPattern]); // Le paso el parámetro de búsqueda a la query
    return result.rows;
  } catch (error: any) {
    throw new Error(`Error al buscar juegos por nombre: ${error.message}`);
  }
}

// UPDATE (number, data)----> Devolverá <Game | null> --> el juego actualizado o null
// Recibe un id y data (los datos para actualizar)
// Actualiza sus campos  en la fila que coincida su id_game = id
// Devolverça ese juego actualizado o null si no existe (mistaken id / field / ...)
export async function updateGame(
  id: number,
  data: UpdateGame,
): Promise<Game | null> {
  console.log("Entra en UPDATE?");
  console.log("Iniciado data:", data);
  // La query UPDATE debería ser dinámica en función de los campos que se modifiquen
  // Los campos que se vayan modificando los iré almacenando en 2 arrays: fields para saber en qué campo y values qué datos
  const values: any[] = [];
  const fields: string[] = [];
  let counterQuery = 1; // Contador para $n

  // Aquí necesitaría verificar qué campos se están modificando, para pasar la info a la query
  // Comienzo a ver qué y dónde se modifica. Llenando los arrays fields y values
  if (data.name !== undefined) {
    // fields --> campo name y necesita un num para $n (name = $1)
    fields.push(`name = $${counterQuery++}`);
    values.push(data.name); // A values le paso el dato recogido
  }
  if (data.release_date !== undefined) {
    fields.push(`release_date = $${counterQuery++}`);
    values.push(data.release_date);
  }
  if (data.players_num !== undefined) {
    fields.push(`players_num = $${counterQuery++}`);
    values.push(data.players_num);
  }
  if (data.id_publisher !== undefined) {
    fields.push(`id_publisher = $${counterQuery++}`);
    values.push(data.id_publisher);
  }
  if (data.cover_url !== undefined) {
    fields.push(`cover_url = $${counterQuery++}`);
    values.push(data.cover_url);
  }
  if (data.rating !== undefined) {
    fields.push(`rating = $${counterQuery++}`);
    values.push(data.rating);
  }

  console.log("fields", fields);
  console.log("values", values);
  // Campos que son fijos para la query (e ir probando):
  //    - UPDATE tabla games    - SET (campos a modificar - dinámico)   - WHERE (condiciones - dinámico)   - RETURNING * (que devuelva los campos)
  // Esta query es de prueba para hacer un cambio fijo (en name) e ir probando con postman en su ruta
  //    1 --> Pruebo que cambie el nombre (SET name) por el valor recogido de la query (= $1), y el where que sea tb el recogido por la query (= $2)
  //      -----> Aquí array contenía  values = [data.name, id]
  //      -----> la query queda: UPDATE games SET name = $1 WHERE id_game = $2 RETURNING *

  //    2 --> Cambio a query dinámica que recoge los fields en SET y los values en WHERE
  //      -----> Aquí los arrays values & fields = []
  //      -----> Necesito una variable que lleve la cuenta para $n --> un contador
  //      -----> Para cada campo posible (de momento name) chequeo si se ha modificado:
  //         ---> Si data.CAMPO !== undefined -> Si existe, se agrega a fields el numero de $n y se pasa el dato a values en ese if
  //         ---> Fuera del if, a values le paso el id del juego a modificar porque sino
  //              el where daba error
  //      -----> Y la query queda: UPDATE games SET ${fields.join(',')} y WHERE id_game = $${counterQuery}

  values.push(id); // ⚠️⚠️  IMPORTANTE: Pasar el id al VALUES, porque es el último param para la pool

  //    3 --> Ahora que name ok, añado todos los ifs de todos los campos posibles, para construir la query completa
  const query = `
  UPDATE games
  SET ${fields.join(", ")}
  WHERE id_game = $${counterQuery}
  RETURNING *
  `;
  console.log(query);
  try {
    console.log(`Juego con id ${id} y data: `, data);
    // La info que le paso a la query recoge la query dinámica, y los valores modificados
    const result = await pool.query(query, values);
    console.log(`query --> ${query}, con value ---> ${values}`);

    // Si no se pasa data (porque no se hayan modificado campos), devolverá null
    return result.rows[0] || null;
  } catch (error: any) {
    // Contemplo errores posibles, mismos que al crear
    if (error.code === "23505") {
      throw new Error(`El juego "${data.name}" ya existe`);
    }
    if (error.code === "23503") {
      throw new Error(`El publisher con id ${data.id_publisher} no existe`);
    }
    throw new Error(`Error al modificar el juego ${id}: ${error.message}`);
  }
}

// ✅ DELETE (number) ----> Devolverá Promise<boolean> --> True si se pudo borrar / False si no
export async function deleteGame(id: number): Promise<boolean> {
  try {
    const query = `
      DELETE FROM games 
      WHERE id_game = $1 
      RETURNING id_game
    `;
    const result = await pool.query(query, [id]); // Le paso el ID a la query
    console.log("Se está borrando?", result);

    // Si se puede ejecutar, el rowCount debería estar vacío / not null y devolver true
    return result.rowCount !== null && result.rowCount > 0;
  } catch (error: any) {
    throw new Error(`Error al borrar el juego ${id}: ${error.message}`);
  }
}
