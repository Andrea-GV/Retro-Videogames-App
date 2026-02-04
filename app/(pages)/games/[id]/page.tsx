import { Game } from "@/app/models/game";
import baseURL from "@/app/lib/baseURL";
import styles from "./GameDetail.module.scss";

type PageProps = {
  params: {
    id: string;
  };
};

export default async function GameDetail({ params }: PageProps) {
  // para poder hacer fetch a games[id] necesito resolver otra vez los params
  console.log("PARAMS", params);
  const resolvedParams = await params;
  console.log("RESOLVED PARAMS ---->", resolvedParams);
  const gameId = resolvedParams.id;
  console.log("GAME ID ---->", gameId);

  let game: Game | null = null; //   OK
  let error: string | null = null; // Para luego hacer un render del error

  try {
    const response = await fetch(`${baseURL}/games/${gameId}`, {
      cache: "no-store",
    });
    console.log("RESPONSE ....>", response);
    if (!response.ok) {
      throw new Error(
        `Error cargando el juego. ${response.status}: ${response.statusText}`,
      );
    }

    game = await response.json();
    console.log("GAME ---->", game);
  } catch (err: any) {
    error = err.message;
    console.error("Error al cargar el juego:", error);
  }

  return error ? (
    <div className="error-container">
      <p>No se pudo cargar el juego</p>
      <p>{error}</p>
    </div>
  ) : !game ? (
    <div className={styles["game-container"]}>
      <h2 className={styles["game-title"]}>No hay juego que mostrar</h2>
    </div>
  ) : (
    <div className={styles["game-container"]}>
      <div className={styles["game-header"]}>
        <h1 className={styles["game-title"]}>{game.name}</h1>
        {game.publisher_name && (
          <p className={styles["game-publisher"]}>
            Publicado por: <strong>{game.publisher_name}</strong>
          </p>
        )}
      </div>

      <div className={styles["game-details"]}>
        {game.cover_url && (
          <img
            src={game.cover_url}
            alt={game.name}
            className={styles["game-cover"]}
          />
        )}

        <div className={styles["game-info"]}>
          {game.rating && (
            <div className={styles["game-rating"]}>
              <span>Rating:</span>
              <strong>{game.rating}</strong>
            </div>
          )}

          {game.release_date && (
            <div className={styles["game-release-date"]}>
              <span>Fecha de lanzamiento:</span>
              <strong>{game.release_date}</strong>
            </div>
          )}

          {game.players_num && (
            <div className={styles["game-players"]}>
              <span>Número de jugadores:</span>
              <strong>{game.players_num}</strong>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
