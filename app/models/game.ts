import { Decimal } from "@prisma/client/runtime/client";

export interface Publisher {
  id_publisher: number;
  name?: string;
  country?: string;
}

// Construyo la interfaz usando los campos de la tabla
export interface Game {
  id_game: number;
  name: string;
  release_date: Date | null; // con pg -> string | null
  players_num: number | null;
  cover_url: string | null;
  rating: number | null; // Espera un Num, pero Prisma espera Decimal
  id_publisher: number | null;
  publisher?: Publisher | null;
}

export interface CreateGame {
  name: string; // El único campo not null
  release_date?: Date; //string;
  players_num?: number;
  cover_url?: string;
  rating?: number;
  id_publisher?: number;
}
// Todos los campos deberían ser ? porque no sé qué se va a querer modificar
export interface UpdateGame {
  name?: string;
  release_date?: Date; //string;
  players_num?: number;
  cover_url?: string;
  rating?: number;
  id_publisher?: number;
}
