import { Game } from "@/app/models/game";
import baseURL from "@/app/lib/baseURL";
import ButtonArrow from "@/app/components/ButtonArrow/ButtonArrow";
import btnStyles from "../../components/ButtonArrow/ButtonArrow.module.scss";
import styles from "./Games.module.scss";
import Search from "@/app/components/Search/Search";

export default async function Games() {
  // 🚩 prueba a recibir la info de la búsqueda de Search

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

  // Función para filtrar los games por nombre en el componente SEARCH
  const filterGamesByName = async (name: string) => {
    console.log("🚩 filterGamesByName");
  };
  // const filterGamesByName = (name: string) => {
  // return games.filter((game) => game.name.toLowerCase().includes(name));
  // };

  // 4. Renders
  // 4.1 Render si hay error
  // CAMBIARLO POR COMPONENTE
  {
    error && (
      <div className="error__container">
        <p>No se pudieron cargar los juegos</p>
        <p>{error}</p>
      </div>
    );
  }

  // 4.2 Render si no hay la info
  {
    !games ||
      (games.length === 0 && (
        <div className={styles["games__container"]}>
          <h2 className={styles["game__title"]}>No hay juegos que mostrar</h2>
        </div>
      ));
  }

  /* TODO: 
    - Que se muestre un máx de 12 juegos / pag
      --> Paginación para mostrarlos
      --> Usar btn volver + siguiente 
    - Mejorar sección CREAR JUEGO
  */

  // 4.3 Si todo ok
  return (
    <div className={styles["games__container"]}>
      <h1 className={styles["games__title"]}>Catalogo de Videojuegos</h1>
      <section className={styles["games__filter-wrapper"]}>
        {/* ⚠️⚠️ AÑADO EL SEARCH PARA BUSCAR EN LA PAG */}
        {/* Debería recibir por prop la función que ejecute el form */}
        <Search placeholder="Buscar juegos" onSearch={filterGamesByName} />
      </section>
      <section className={styles["games__create-wrapper"]}>
        <ButtonArrow
          children="Crear juego"
          href="/games/create-game"
          variant="link"
          size="medium"
        ></ButtonArrow>
      </section>
      <section className={styles["games__grid"]}>
        {games.map((game) => (
          <div key={game.id_game} className={styles["game__card"]}>
            {game.cover_url ? (
              <img
                src={game.cover_url}
                alt={game.name}
                className={styles["game__cover"]}
              />
            ) : (
              <div className={styles["game__cover"]} />
            )}
            <div className={styles["game__info-wrapper"]}>
              <h2 className={styles["game__title"]}>{game.name}</h2>
              {game.publisher_name && (
                <div className={styles["game__publisher"]}>
                  <p>Plubished by </p>
                  {game.publisher_name === "Atari" ? (
                    <h4
                      className={
                        styles[
                          `game__publisher--${game.publisher_name.toLowerCase()}`
                        ]
                      }
                    >
                      {game.publisher_name}
                    </h4>
                  ) : game.publisher_name === "SEGA" ? (
                    <h4
                      className={
                        styles[
                          `game__publisher--${game.publisher_name.toLowerCase()}`
                        ]
                      }
                    >
                      {game.publisher_name}
                    </h4>
                  ) : (
                    <h4 className={styles["game__publisher--name"]}>
                      {game.publisher_name}
                    </h4>
                  )}
                </div>
              )}
              {game.rating && (
                <p className={styles["game__rating"]}>{game.rating}</p>
              )}
            </div>

            <div className={styles["game__btn-wrapper"]}>
              <ButtonArrow
                children="Ver mas"
                href={`/games/${game.id_game}`}
                variant="forward"
                size="small"
                className={btnStyles["button--forward"] + styles["game__btn"]}
              ></ButtonArrow>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}
