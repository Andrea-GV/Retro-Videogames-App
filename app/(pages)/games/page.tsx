import Link from "next/link";
import { Game } from "@/app/models/game";
import baseURL from "@/app/lib/baseURL";
import styles from "./Games.module.scss";

export default async function Games() {
  // 1. Inicializo vacío el array q recogerá todos los games para poder tenerla en scope general después del fetch
  let games: Game[] = [];
  let error: string | null = null; // Para luego hacer un render

  try {
    // 2. Hago el fetch de info a la api
    //    ----> Si en algún momento esto pasa a producción se cambia la url por: process.env.NEXT_PUBLIC_API_URL
    const response = await fetch(`${baseURL}/games`, { cache: "no-store" }); // Next Le puede indicar que no guarde nada en caché

    // 2.1 En caso que falle que muestre un mensaje rápido
    if (!response.ok) {
      throw new Error(
        `Error cargando juegos. ${response.status}: ${response.statusText}`,
      );
    }

    // 3. Parseo los datos y los guardo (vienen en formato [{...}, {...}] )
    games = await response.json();
    console.log("GAMES tiene ---> ", games);
  } catch (err: any) {
    error = err.message;
  }
  // 4. Renders
  // 4.1 Render si hay error
  {
    error && (
      <div className="error-container">
        <p>No se pudieron cargar los juegos</p>
        <p>{error}</p>
      </div>
    );
  }
  console.log("GAMES FUERA DEL TRY", games);
  // 4.2 Render si no hay la info
  {
    !games ||
      (games.length === 0 && (
        <div className={styles["games-container"]}>
          <h2 className={styles["game-title"]}>No hay juegos que mostrar</h2>
        </div>
      ));
  }

  // 4.3 Si todo ok
  return (
    <div className={styles["games-container"]}>
      <h1 className={styles["title"]}>Catalogo de Videojuegos</h1>

      <div className={styles["games-grid"]}>
        {games.map((game) => (
          <div key={game.id_game} className={styles["game-card"]}>
            {game.cover_url && (
              <img
                src={game.cover_url}
                alt={game.name}
                className={styles["game-cover"]}
              />
            )}
            <h2 className={styles["game-title"]}>{game.name}</h2>

            {/*  Lo mejoraré en función de su publisher */}
            {game.publisher_name && (
              <div className={styles["game-publisher"]}>
                <p>Plubished by </p>
                {game.publisher_name === "Atari" ? (
                  <h4
                    className={
                      styles[
                        `game-publisher__${game.publisher_name.toLowerCase()}`
                      ]
                    }
                  >
                    {game.publisher_name}
                  </h4>
                ) : game.publisher_name === "SEGA" ? (
                  <h4
                    className={
                      styles[
                        `game-publisher__${game.publisher_name.toLowerCase()}`
                      ]
                    }
                  >
                    {game.publisher_name}
                  </h4>
                ) : (
                  <h4 className={styles["game-publisher__name"]}>
                    {game.publisher_name}
                  </h4>
                )}
              </div>
            )}
            <p className={styles["game-rating"]}>{game.rating}</p>

            {/* Botón en proceso ahora que estoy haciendo la pag de [id] 
            El botón será un componente que reciba por props su texto link etc cuando escale esto
          
             <button>
               Ver más<Link href="/[id]"></Link>
             </button>
              */}
          </div>
        ))}
      </div>
    </div>
  );
}
