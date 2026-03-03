import { Game } from "@/app/models/game";
import baseURL from "@/app/lib/baseURL";

import ButtonArrow from "@/app/components/ButtonArrow/ButtonArrow";
import UpdateGameForm from "@/app/components/Games/GameForm/UpdateGameForm/UpdateGameForm";
import styles from "./EditGame.module.scss";

// El fetch a la API para actualizar lo va a hacer su componente UpdateGameForm al hacer onSubmit
// Aquí hago el Render del Form CON los datos del juego pre-cargados
type PageProps = {
  params: {
    id: string;
    data: Game;
  };
};
export default async function EditGamePage({ params }: PageProps) {
  const resolvedParams = await params;
  console.log("params", resolvedParams);
  const gameId = resolvedParams.id;
  let game: Game | null = null; //   OK
  let error: string | null = null; // Para luego hacer un render del error

  try {
    const response = await fetch(`${baseURL}/games/${gameId}`, {
      cache: "no-store",
    });
    if (!response.ok) {
      throw new Error(
        `Error cargando el juego. ${response.status}: ${response.statusText}`,
      );
    }
    game = await response.json();
  } catch (err: any) {
    error = err.message;
    console.error("Error al cargar el juego:", error);
    return (
      <div>
        <h1>Ups, ha habido un error</h1>
        <p>{error}</p>
      </div>
    );
  }
  if (error || !game) {
    return (
      <div className="error__container">
        <p>No se pudo cargar el juego:</p>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div>
      <div className={styles["button__container"]}>
        <ButtonArrow href="/games" variant="back" size="medium">
          Volver
        </ButtonArrow>
      </div>
      <div className={styles["game__container"]}>
        <h1 className={styles["game__title"]}>Edita el videojuego</h1>
        {/* TODO: Hacer el componente Edit que reciba por prop la data del juego*/}
        <UpdateGameForm game={game} />
      </div>
    </div>
  );
}
