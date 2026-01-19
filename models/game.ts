// Construyo la interfaz usando los campos de la tabla
export interface Game {
  id_game: number;
  name: string;
  release_date: string | null;
  players_num: number | null;
  cover_url: string | null;
  rating: number | null;
  id_publisher: number | null;
  publisher_name?: string; // Este campo no lo tengo en la tabla pero podría ser más útil que el id para mostrar en el Front
}

export interface CreateGame {
  name: string; // El único campo not null
  release_date?: string;
  players_num?: number;
  cover_url?: string;
  rating?: number;
  id_publisher?: number;
}
// Todos los campos deberían ser ? porque no sé qué se va a querer modificar
export interface UpdateGame {
  name?: string;
  release_date?: string;
  players_num?: number;
  cover_url?: string;
  rating?: number;
  id_publisher?: number;
}
