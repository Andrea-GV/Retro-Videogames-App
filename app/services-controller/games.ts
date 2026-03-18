import { prisma } from "@/app/lib/prisma";
import { Prisma } from "../generated/prisma/client";
import { Game, CreateGame, UpdateGame } from "@/app/models/game";
import { Decimal } from "@prisma/client/runtime/client";

/* *** ACTUALZACIÓN: ***
  Este archivo se ha modificado al usar Prisma
*/

// 🚩 Necesito una función que convierta  rating Decimal a number parea compatibilizar con Prisma
const transformRatingDTO = (game: any): Game => ({
  ...game, // copia todos los campos
  rating: game.rating ? game.rating.toNumber() : null, // convierte el rating de Decimal (string) a number
});

// ✅ CREATE createGame(data) ---> Devolverá <Game> --> el juego creado
export async function createGame(data: CreateGame): Promise<Game> {
  try {
    // return await prisma.game.create({ // <-- ⚠️ Antes de aplicar función. Daba error por el formato de rating
    const game = await prisma.game.create({
      data: {
        name: data.name,
        release_date: data.release_date, // ? data.release_date.toString() : null, // ? new Date(data.release_date) : null,
        players_num: data.players_num,
        cover_url: data.cover_url,
        rating: data.rating ? new Decimal(data.rating) : undefined, // convierto number a Decimal
        id_publisher: data.id_publisher,
      },
      include: {
        publisher: true, // Equivale al JOIN que hacía en pg
      },
    });
    return transformRatingDTO(game); // 🚩 Devuelve el juego con el rating transformado
  } catch (error: any) {
    // Ya NO Manejo de errores específicos de PostgreSQL
    // Sino de Prisma con sus códigos https://www.prisma.io/docs/orm/prisma-client/debugging-and-troubleshooting/handling-exceptions-and-errors
    // ERROR CODES: https://www.prisma.io/docs/orm/reference/error-reference
    // Necesito comprobar el prototipo en la propiedad de su constructor
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        // Equivale al 23505 de pg (unique violation)
        throw new Error(`El juego "${data.name}" ya existe`);
      }
      if (error.code === "P2003") {
        // Equivale al 23503 (FK violation)
        throw new Error(`El publisher con id ${data.id_publisher} no existe`);
      }
      if (error.code === "P2012") {
        // Equivale a 23502 (missing field)
        throw new Error(`Falta un campo obligatorio`);
      }
    }
    // Si no es ninguno de estos, lo mando genérico y ya investigaremos
    throw new Error(`Error al crear el juego: ${error.message}`);
  }
}

// ✅ READ ---- GetAll & GetById & GetByName
// ✅ getAllGames() ---> Devolverá <Game[]> --> Array de juegos
// ✅ getGameById(number) ---> Devolverá <Game | null> --> un juego (x id)
// ✅ searchGameByName es más adecuado que el getName por su parcialidad de info
export async function getAllGames(): Promise<Game[]> {
  try {
    // return await prisma.game.findMany(); 🚩 <-- sin HELPER
    const game = await prisma.game.findMany({
      include: {
        publisher: true, // Trae los datos del publisher
      },
      orderBy: {
        name: "asc",
      },
    });
    return game.map(transformRatingDTO); // 🚩 Mapeo los games para transformar
  } catch (error: any) {
    throw new Error(`Error al obtener los juegos: ${error.message}`);
  }
}

export async function getGameById(id: number): Promise<Game | null> {
  try {
    // return await prisma.game.findUnique({ 🚩 <-- Sin HELPER
    const game = await prisma.game.findUnique({
      where: { id_game: id },
      include: {
        publisher: true, // Trae los datos del publisher
      },
    });
    return game ? transformRatingDTO(game) : null; // 🚩 Si lo encuentra, transforma.. Si es null XX
  } catch (error: any) {
    throw new Error(`Error al obtener el id ${id}: ${error.message}`);
  }
}

export async function searchGamesByName(searchTerm: string): Promise<Game[]> {
  // const searchPattern = `%${searchTerm}%`; // <-- parece que no le hace falta
  try {
    // return await prisma.game.findMany({ 🚩 <-- Sin el HELPER
    const game = await prisma.game.findMany({
      where: {
        name: {
          contains: searchTerm,
          mode: "insensitive", // Equivale a ILIKE --> Le da igual si es mayus / minus
        },
      },
      include: {
        publisher: true, // Trae los datos del publisher
      },
    });
    return game.map(transformRatingDTO); // 🚩 Igual que getAllGames mapeo cada uno parra transformar
  } catch (error: any) {
    throw new Error(`Error al buscar juegos por nombre: ${error.message}`);
  }
}

// UPDATE (number, data)----> Devolverá <Game | null> --> el juego actualizado o null
// Recibe un id y data (los datos para actualizar)
// Actualiza sus campos  en la fila que coincida su id_game = id
// Devolverá ese juego actualizado o null si no existe (mistaken id / field / ...)
export async function updateGame(
  id: number,
  data: UpdateGame,
): Promise<Game | null> {
  console.log("Entra en UPDATE?");
  console.log("Iniciado data:", data);

  try {
    console.log(`Juego con id ${id} y data: `, data);
    // return await prisma.game.update({
    const game = await prisma.game.update({
      where: { id_game: id },
      data: {
        name: data.name,
        release_date: data.release_date,
        players_num: data.players_num,
        cover_url: data.cover_url,
        rating: data.rating ? new Decimal(data.rating) : undefined,
        id_publisher: data.id_publisher,
      },
      include: {
        publisher: true, // Trae los datos del publisher
      },
    });
    return game ? transformRatingDTO(game) : null; // 🚩 Idem getGAmeById. SI encuentra, transforma y devuelve
  } catch (error: any) {
    // Contemplo errores posibles, mismos que al crear
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        // Equivale al 23505 de pg (unique violation)
        throw new Error(`El juego "${data.name}" ya existe`);
      }
      if (error.code === "P2003") {
        // Equivale al 23503 (FK violation)
        throw new Error(`El publisher con id ${data.id_publisher} no existe`);
      }
    }
    throw new Error(`Error al modificar el juego ${id}: ${error.message}`);
  }
}

// ✅ DELETE (number) ----> Devolverá Promise<boolean> --> True si se pudo borrar / False si no
export async function deleteGame(id: number): Promise<boolean> {
  try {
    await prisma.game.delete({
      where: { id_game: id },
    });
    return true;
  } catch (error: any) {
    throw new Error(`Error al borrar el juego ${id}: ${error.message}`);
  }
}
