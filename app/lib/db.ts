import { Pool } from "pg";

/* En vez de crear una conexión por cada query , voy a crear un Pool de conexiones reutilizable 
Así, sólo lo creo una vez y lo reutilizo en toda la app
https://node-postgres.com/features/connecting

Podría hardcodearlo directamente (siendo más ineficiente y menos reutilizable)
export const db = new Pool({
    host: 'localhost',
    port: 5432,
    user: 'postgres',
    password: '3008',
    database: 'retro_games_db',
}) 
O dejar las propiedades separadas en el .env (instead of full URL)
const pool = new Pool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE
})
*/

// Le añado una comprobación para verificar que el .env tenga toda la info necesaria
if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not defined @ .env");
}
// Me conecto creando un pool nuevo, y usando la URL que creé en el .env que contiene toda la info construida
// En vez de ver las propiedades separadas (descrito antes)
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export default pool;
// ℹ️ He dejado una prueba para comprobar que se conectan bien en app > api > test-db > route.ts
// ✅ La prueba ha dado success (visita http://localhost:3000/api/test-db). Parece que esté bien conectado
