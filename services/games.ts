import pool from "@/lib/db";
import { Game, CreateGame, UpdateGame } from "@/models/game";

// Construyo la interfaz usando los campos de la tabla
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
  // RETURNING * ---> * para:
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
// getGameByName(string) ---> Devolverá <Game | null> --> un juego (x name)
export async function getAllGames(): Promise<Game[]> {
  // Como antes, la parametrizo para hacerla más legible
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
    `;
  // Para ahorrar games.name, games.id_game etc ASIGNO g como ALIAS (apodos)
  //   Asignado en FROM games g
  //   Tb en LEFT JOIN publishers ON games.id_publisher = publishers.id_publisher

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

// UPDATE (number, data)----> Devolverá <Game | null> --> el juego actualizado o null
// DELETE (number) ----> Devolverá Promise<boolean> --> True si se pudo borrar / False si no
