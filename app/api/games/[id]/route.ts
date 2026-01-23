import { NextResponse } from "next/server";
import { getGameById } from "@/app/services-controller/games";
import { Game } from "@/app/models/game";

// Recibe una petición y los params (un id por el que va a buscar)
// params: { id: string } -- en este caso el id como es parte de la URL viene como string --> Necesito convertirlo
export async function GET(
  request: Request,
  { params }: { params: { id: string } },
) {
  console.log("Petición por id");
  console.log(params); // Para ver su info --> muestra el error de que params es una Promise
  // Para poder acceder a la info de params, necesito que se cumpla su promesa. A partir de ahí ya podré acceder a sus propiedades
  const resolvedParams = await params;
  console.log("ESTE ID -> ", resolvedParams.id); // ✅ Ahora ya puedo ver el id
  console.log(typeof resolvedParams.id);

  try {
    // Convierto el id de string a number xq es el param que espera la función
    const id = Number(resolvedParams.id);
    console.log("ID EN TRY ---> ", id);

    // Necesitaría verificar de alguna manera que la conversión se hace bien?
    // --> Probé metiendo 1d y devolvía -> "Error al obtener el id NaN: invalid input syntax for type integer: \"NaN\""
    if (isNaN(id)) {
      return NextResponse.json(
        { error: "El id debe ser un number" },
        { status: 400 },
      );
    }
    // --> Probé a poner -3 y devolvía -> "error": "No se ha encontrado el juego con id -3"
    // Asi que verifico que sea un num positivo
    if (id <= 0) {
      return NextResponse.json(
        { error: "El id debe ser un number positivo" },
        { status: 400 },
      );
    }

    const game: Game | null = await getGameById(id);

    // Si no existe / null --> 404
    if (!game || game === null) {
      return NextResponse.json(
        { error: `No se ha encontrado el juego con id ${id}` },
        { status: 404 },
      );
    }

    return NextResponse.json(game, { status: 200 });
  } catch (error: any) {
    console.error("Error en GETById", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
