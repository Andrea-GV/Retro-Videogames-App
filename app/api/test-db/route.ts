import { NextResponse } from "next/server";
import pool from "@/lib/db";

// Creo una función asíncrona para probar la conexión a la base de datos
// https://node-postgres.com/features/pooling
async function TestConnection() {
  try {
    const client = await pool.connect(); // Establece una nueva conexión
    const result = await client.query("SELECT NOW()"); // Hago una query simple
    console.log("✅ Connected to database:", result.rows[0].now);

    client.release(); // Devuelvo la conexión al pool (la corto para liberar recursos)
    return true;
  } catch (err) {
    console.error("❌ Error connecting to database", err);
    return false;
  }
}

// Uso esa función para realizar la prueba
export async function GET() {
  const connect = await TestConnection();

  if (connect) {
    return NextResponse.json({
      success: true,
      message: "✅ Successfully connected to database",
    });
  } else {
    return NextResponse.json(
      {
        success: false,
        message: "❌ Error connecting to database",
      },
      { status: 500 }
    );
  }
}
// ✅ Esta prueba ha dado success (visita http://localhost:3000/api/test-db). Parece que esté bien conectado
