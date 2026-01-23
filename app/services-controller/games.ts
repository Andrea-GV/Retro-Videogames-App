import pool from "@/app/lib/db";
import { Game, CreateGame, UpdateGame } from "@/app/models/game";

// Construyo la interfaz (model) usando los campos de la tabla
// ❓ Debería llevármelo a un archivo separado en carpeta "models" ? Como se hace en Nexo
// ✅ Prefiero separar información, asi que sí, creo su archivo en models > game.ts

// Comienzo con el CRUD ----> ⚠️ De momento CREATE & GET más adelante UPDATE & DELETE

// CREATE createGame(data) ---> Devolverá <Game> --> el juego creado
export async function createGame(data: CreateGame): Promise<Game> {
  const { name, release_date, players_num, cover_url, rating, id_publisher } =
    data;
  // ❓ Lo más limpio sería parametrizar la query ?
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
    // No parametrizada:
    //   const result = await pool.query(
    //     `INSERT INTO games (name, release_date, players_num, cover_url, rating, id_publisher)
    //     VALUES ($1, $2, $3, $4, $5, $6)
    //     RETURNING *`,
    //     [name, release_date, players_num, cover_url, rating, id_publisher]
    //   );
    // Parametrizando la query, no "ensucio" la petición y la hace más segura frente a inyección de SQL
    // Parametrizada:
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

// READ ---- GetAll & GetById & GetByName
// getAllGames() ---> Devolverá <Game[]> --> Array de juegos
// getGameById(number) ---> Devolverá <Game | null> --> un juego (x id)
// getGameByName(string) ---> Devolverá <Game | null> --> un juego exacto (x name)
export async function getAllGames(): Promise<Game[]> {
  // Como antes, la parametrizo para hacerla más legible
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
    const result = await pool.query(query, [searchPattern]);
    return result.rows;
  } catch (error: any) {
    throw new Error(`Error al buscar juegos por nombre: ${error.message}`);
  }
}

// UPDATE (number, data)----> Devolverá <Game | null> --> el juego actualizado o null
// export async function updateGame(id: number, data: UpdateGame): Promise<Game | null> {

// }
// DELETE (number) ----> Devolverá Promise<boolean> --> True si se pudo borrar / False si no
// export async function deleteGame(id: number): Promise<boolean> {
//   try {
//   } catch (error: any) {}
// }
