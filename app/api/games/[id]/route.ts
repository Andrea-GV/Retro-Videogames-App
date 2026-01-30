import { NextResponse } from "next/server";
import {
  getGameById,
  deleteGame,
  updateGame,
} from "@/app/services-controller/games";
import { Game, UpdateGame } from "@/app/models/game";

// Creo esta función para verificar en las 3 peticiones el ID que llega
// Recibe el id como string y en función de como haya ido la comprobación dovuelve:
// Opción 1 --> Si es OK   Es válido? -> T    Su id -> ya en number
// Opción 2 --> Si NO OK   Es válido? -> F    El error
// Intenté hacerlo todo en un único obj con id? pero luego en la petición al llamar al controller(id) daba error
function isValidId(idReceived: string):
  | { isValid: true; id: number }
  | {
      isValid: false;
      error: NextResponse;
    } {
  const id = Number(idReceived);
  // Traigo las funciones que realizaba en cada petición, devolviendo isValid (T/F) y su mensaje de error
  if (isNaN(id)) {
    return {
      isValid: false,
      error: NextResponse.json(
        { error: "El id debe ser un number" },
        { status: 400 },
      ),
    };
  }

  if (id <= 0) {
    return {
      isValid: false,
      error: NextResponse.json(
        { error: "El id debe ser un number positivo" },
        { status: 400 },
      ),
    };
  }
  console.log("Estado del ID -->");
  return { isValid: true, id };
}

// Hago lo mismo para comprobar que un juego existe antes de que se ejecute el resto de su código, y elimino repetición de bloque
async function gameExists(
  id: number,
): Promise<
  { isValid: true; game: Game } | { isValid: false; error: NextResponse }
> {
  const game: Game | null = await getGameById(id);
  console.log("Comprobando juego -->", game);

  // Si no existe / null --> 404
  if (!game || game === null) {
    return {
      isValid: false,
      error: NextResponse.json(
        { error: `No se ha encontrado el juego con id ${id}` },
        { status: 404 },
      ),
    };
  }
  return { isValid: true, game };
}

// Recibe una petición y los params (un id por el que va a buscar)
// params: { id: string } -- en este caso el id como es parte de la URL viene como string --> Necesito convertirlo
export async function GET(
  request: Request,
  { params }: { params: { id: string } },
) {
  console.log("Petición por id");
  // console.log(params); // Para ver su info --> muestra el error de que params es una Promise
  // Para poder acceder a la info de params, necesito que se cumpla su promesa. A partir de ahí ya podré acceder a sus propiedades
  const resolvedParams = await params;
  console.log("ESTE ID -> ", resolvedParams.id); // ✅ Ahora ya puedo ver el id

  try {
    // Convierto el id de string a number xq es el param que espera la función
    // const id = Number(resolvedParams.id); ----> ✅ Al aplicar la función isValidId LO HAGO EN 1 PASO
    // console.log("ID EN TRY ---> ", id);

    // Necesitaría verificar de alguna manera que la conversión se hace bien?
    // --> Probé metiendo 1d y devolvía -> "Error al obtener el id NaN: invalid input syntax for type integer: \"NaN\""
    // if (isNaN(id)) {
    //   return NextResponse.json(
    //     { error: "El id debe ser un number" },
    //     { status: 400 },
    //   );
    // }
    // // --> Probé a poner -3 y devolvía -> "error": "No se ha encontrado el juego con id -3"
    // // Asi que verifico que sea un num positivo
    // if (id <= 0) {
    //   return NextResponse.json(
    //     { error: "El id debe ser un number positivo" },
    //     { status: 400 },
    //   );
    // }
    // Lo cambio por la función isValidId
    const validateId = isValidId(resolvedParams.id);
    if (!validateId.isValid) {
      return validateId.error;
    }
    const id = validateId.id;

    // // Si no existe / null --> 404
    // const game: Game | null = await getGameById(id);
    // if (!game || game === null) {
    //   return NextResponse.json(
    //     { error: `No se ha encontrado el juego con id ${id}` },
    //     { status: 404 },
    //   );
    // }

    // Implemento gameExists
    const game = await gameExists(id);
    if (!game.isValid) {
      return game.error;
    }

    return NextResponse.json(game.game, { status: 200 });
  } catch (error: any) {
    console.error("Error en GETById", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// la función de DELETE como va por param(id) lo añado a esta ruta
// DELETE (number) ----> Devolverá Promise<boolean> --> True si se pudo borrar / False si no
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } },
) {
  // Recibe una petición y los params -> id para buscar. Una vez encontrado, se elimina si todo ok
  // Aprox al get(id) --> Sigo su proceso de resolver promise, convertir su id a num, comprobar el num, borrar
  // 1. Resuelvo params
  const resolvedParams = await params;

  try {
    console.log("Entra a borrar");

    // 2. Compruebo el id --> Ya con la función
    const validateId = isValidId(resolvedParams.id);
    if (!validateId.isValid) {
      return validateId.error;
    }
    const id = validateId.id;

    // 3. Compruebo que el juego existe antes de intentar borrar
    // const game = await getGameById(id);
    // console.log("----> Existe el juego?", game);
    // if (!game) {
    //   return NextResponse.json(
    //     { error: `No se ha encontrado el juego con id ${id}` },
    //     { status: 404 },
    //   );
    // }
    // Implemento gameExists
    const game = await gameExists(id);
    console.log("----> Existe el juego?", game.isValid);
    if (!game.isValid) {
      return game.error;
    }

    // 4. Borro el juego
    const isDeleted: boolean = await deleteGame(id);
    console.log("Resultado de isDeleted --->", isDeleted);

    if (!isDeleted) {
      return NextResponse.json(
        { error: `No se ha podido borrar el juego con id ${id}` },
        { status: 404 },
      );
    }
    // 204 No Content para casos de DELETE / PUT
    // pero su return sería diferente - Sólo devolvería el código de confirmación:
    // return new NextResponse(null, { status: 204 });
    // Prefiero que mande el success code OK y un mensaje que pueda mostrar en el Front
    return NextResponse.json(
      {
        success: isDeleted,
        message: `El juego con id ${id} ha sido borrado con éxito`,
      },
      { status: 200 },
    );
  } catch (error: any) {
    console.log(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// 🟡 NOTAS: Visto que se repite la validación al hacer get y delete..
// Igual debería realizar una función validate que ejecute esos ifs y así sólo ejecutarlo y quedar más limpia cada petición
// ✅ Creada la función isValidId para evitar repetición de código en las 3 peticiones

// Para hacer el UPDATE voy a usar PATCH que me permite modificar ALGUNOS campos. PUT obliga a reemplazar el objeto completo (aunque sólo haya cambiaod 1 campo)
// Recibe una petición a un id. Sigo misma estructura anterior a POST
export async function PATCH(
  request: Request,
  { params }: { params: { id: string } },
) {
  console.log("Entra la petición al patch");

  // 1. Resuelvo params
  const resolvedParams = await params;
  try {
    // 2. Compruebo el id --> Ya con la función
    const validateId = isValidId(resolvedParams.id);
    if (!validateId.isValid) {
      return validateId.error;
    }
    const id = validateId.id;
    // 3. Compruebo que el jkuego existe ANTES de intentar actualizarlo
    // const game = await getGameById(id);
    // if (!game) {
    //   return NextResponse.json(
    //     { error: `No se ha encontrado el juego con id ${id}` },
    //     { status: 404 },
    //   );
    // }

    // Implemento gameExists
    const game = await gameExists(id);
    if (!game.isValid) {
      return game.error;
    }
    console.log("----> Existe el juego?", game.game);

    // 4. Leo el body de la request --> No debería estar vacío (se manda SIN {})
    // Anidé este otro try-catch porque me daba error al intentar forzar mandar sin {} y no sabía el origen
    // Si está vacío, no le dejo mandar la info a updateGame -> Generaría error
    let body;
    try {
      body = await request.json();
    } catch (error: any) {
      return NextResponse.json(
        { error: "El body debe ser un JSON válido y no estar vacío" },
        { status: 400 },
      );
    }
    // 4.1 Si el body esta vacío (se manda SÓLO {}) -> que se haya dado a editar, pero no se edita nada / se borran TODOS los campos -> Devuelvo / muestro la ficha del juego
    if (Object.keys(body).length === 0) {
      console.log("No se ha modificado el body. Devuelvo el juego sin cambios");
      return NextResponse.json(game.game, { status: 200 });
    }
    // 4.2 Si se modifica el campo name (tenía valor, pero ahora se borra) --> NO debería permitirlo, es un campo OBLIGATORIO
    if (body.name !== undefined && (!body.name || body.name.trim() === "")) {
      return NextResponse.json(
        { error: "El campo name es obligatorio" },
        { status: 400 },
      );
    }
    // 4.3 Valido rating (definido como num 0-10), para que no se puede escribir un valor que no esté en ese rango
    if (
      body.rating !== undefined &&
      (isNaN(body.rating) || body.rating < 0 || body.rating > 10)
    ) {
      return NextResponse.json(
        { error: "El rating debe ser un número entre 0 y 10" },
        { status: 400 },
      );
    }

    console.log("----> Leyendo el body", body);

    // 5. Preparo su model con los datos del body
    const gameData: UpdateGame = {
      name: body.name,
      release_date: body.release_date || null,
      players_num: body.players_num || null,
      id_publisher: body.id_publisher || null,
      cover_url: body.cover_url || null,
      rating: body.rating || null,
    };
    // 5. Llamo al controller para actualizar el juego pasándole el id y los datos recogidos del body
    const updatedGame = await updateGame(id, gameData);
    console.log("----> Devolviendo el juego actualizado", updatedGame);

    // 6. Retorno el juego modificado y un status ok
    return NextResponse.json(updatedGame, { status: 200 });
  } catch (error: any) {
    console.log(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
