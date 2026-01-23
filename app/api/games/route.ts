// Creo la ruta para ver GET(getAllGames()) y POST(createGame()) del servicio de games
import { NextResponse } from "next/server";
import {
  getAllGames,
  createGame,
  searchGamesByName,
} from "@/app/services-controller/games";
import { CreateGame } from "@/app/models/game";

// Función para ver todos los juegos antes de modificarla para búsqueda x name
// export async function GET() {
//   try {
//     const games = await getAllGames();
//     return NextResponse.json(games, { status: 200 });
//   } catch (error: any) {
//     console.error("Error en GET games", error);
//     return NextResponse.json({ error: error.message }, { status: 500 });
//   }
// }

// Añado argumentos para poder hacer la búsqueda por name
export async function GET(request: Request) {
  try {
    // Leo y extraigo el query de la request
    // Si uso search me muestra --> search: '?kong='
    // Si uso searchParams me muestra --> searchParams: URLSearchParams { 'kong' => '' }
    const { searchParams } = new URL(request.url);
    console.log("URL -> ", searchParams);

    const searchTerm = searchParams.get("search"); // --> Término de la función searchGamesByName - recoge la info después de la ?
    console.log("searchTerm", searchTerm); // Recoge kong

    // Si tiene término, llamo a la función para que busque
    if (searchTerm) {
      const game = await searchGamesByName(searchTerm);
      // Pero quiero matchear que el name exista
      // Si pongo "kul" no existe en la BD por lo que debería saltar un msj: "el juego no existe"
      console.log("Qué tiene game?", game); // [] vacío si no encuentra coincidencias

      if (game.length === 0) {
        console.log("No coinciden");

        return NextResponse.json(
          {
            error: `No se encontraron juegos que contengan el nombre"${searchTerm}"`,
          },
          { status: 404 },
        );
      }
      console.log("Sí coinciden ->");

      return NextResponse.json(game, { status: 200 });
    }
    // Si no tiene arg, busco todos
    const games = await getAllGames();
    // Retorno el array de juegos y un status 200 (ok)
    return NextResponse.json(games, { status: 200 });
  } catch (error: any) {
    console.error("Error en GET games", error);
    // Retorno el error y un status 500 (error interno del servidor)
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    console.log("Entrando en petición");
    console.log(request);
    // 1. Leo el body de la request
    const body = await request.json();
    // 2. Valido que vengan los campos obligatorios (el name) y no vacíos
    if (!body.name || body.name.trim() === "") {
      return NextResponse.json(
        { error: "El campo name es obligatorio" },
        { status: 400 }, // 400 = bad request --> datos incorrectos
      );
    }
    // 3. Preparo su model con los datos del body
    const gameData: CreateGame = {
      name: body.name,
      release_date: body.release_date || null,
      players_num: body.players_num || null,
      id_publisher: body.id_publisher || null,
      cover_url: body.cover_url || null,
      rating: body.rating || null,
    };
    // 4. Llamo al servicio para crear el juego
    const game = await createGame(gameData);

    // 5. Retorno el juego creado y un status 201 (created ok)
    return NextResponse.json(game, { status: 201 });
  } catch (error: any) {
    console.error("Error en POST games", error);
    // Qué tipo de errores debería tener en cuenta?
    // - Juego ya existente (duplicado)
    // - El id_publisher no existe (su FK)
    // - Genérico

    if (error.message.includes("ya existe")) {
      return NextResponse.json({ error: error.message }, { status: 409 }); // 409 = conflict --> el recurso ya existe
    }
    if (error.message.includes("no existe")) {
      return NextResponse.json({ error: error.message }, { status: 400 }); // 400 = bad request --> datos incorrectos / faltan datos obligatorios
    }
    return NextResponse.json(
      {
        error: "Error al crear el juego",
        message: error.message,
      },
      { status: 500 },
    );
  }
}
