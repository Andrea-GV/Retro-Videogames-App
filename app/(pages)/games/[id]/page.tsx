import { Game } from "@/app/models/game";
import baseURL from "@/app/lib/baseURL";
import ButtonArrow from "@/app/components/ButtonArrow/ButtonArrow";
import styles from "./GameDetail.module.scss";

type PageProps = {
  params: {
    id: string;
  };
};

// TODO:⚠️ necesito transformar el formato de la fecha UTF a DD/MM/YYYY

export default async function GameDetail({ params }: PageProps) {
  // para poder hacer fetch a games[id] necesito resolver otra vez los params
  const resolvedParams = await params;
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

  return error ? (
    <div className="error__container">
      <p>No se pudo cargar el juego</p>
      <p>{error}</p>
    </div>
  ) : !game ? (
    <div className={styles["game__container"]}>
      <h2 className={styles["game__title"]}>No hay juego que mostrar</h2>
    </div>
  ) : (
    <div>
      <div className={styles["button__container"]}>
        <ButtonArrow href="/games" variant="back" size="large">
          Volver
        </ButtonArrow>
        <ButtonArrow
          href={`/games/${game.id_game + 1}`}
          variant="forward"
          size="large"
        >
          Siguiente
        </ButtonArrow>
      </div>

      <div className={styles["game__container"]}>
        <div className={styles["game__header"]}>
          <h1 className={styles["game__title"]}>{game.name}</h1>
          {game.publisher_name && (
            <p className={styles["game__publisher"]}>
              Publicado por: <strong>{game.publisher_name}</strong>
            </p>
          )}
        </div>

        <div className={styles["game__details"]}>
          {game.cover_url && (
            <img
              src={game.cover_url}
              alt={game.name}
              className={styles["game__cover"]}
            />
          )}

          <div className={styles["game__info"]}>
            {game.rating && (
              <div className={styles["game__rating"]}>
                <span>Rating:</span>
                <strong>{game.rating}</strong>
              </div>
            )}

            {game.release_date && (
              <div className={styles["game__release-date"]}>
                <span>Fecha de lanzamiento:</span>
                <strong>{game.release_date}</strong>
              </div>
            )}

            {game.players_num && (
              <div className={styles["game__players"]}>
                <span>Número de jugadores:</span>
                <strong>{game.players_num}</strong>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
