// Se crea este archivo para que reciba por prop el array de datos de juegos y poder utilizar el Search
// Debido al error previo que no se puede enviar funciones de un server a client component

"use client";

import { useState } from "react";
import { Game } from "@/app/models/game";
import Search from "../Search/Search";
import ButtonArrow from "../ButtonArrow/ButtonArrow";
import ButtonAction from "../ButtonAction/ButtonAction";
import btnStyles from "../../components/ButtonArrow/ButtonArrow.module.scss";
import styles from "./GamesList.module.scss";

type GameListProps = {
  data: Game[];
};

export const GamesList = ({ data }: GameListProps) => {
  //   const [allGames, setAllGames] = useState<Game[]>(data); // ❓ <--- Esto lo uso para algo? 🤨
  const [filteredGames, setFilteredGames] = useState<Game[]>([]);
  const [clicked, setClicked] = useState(false); // <-- Render condicional
  const [shouldClear, setShouldClear] = useState(false); // <-- Borrará contenido input
  const [searchTerm, setSearchTerm] = useState(""); // <-- Para traer el valor del input

  const filterGamesByName = async (name: string) => {
    setClicked(true);
    setSearchTerm(name);
    const filterGames = data.filter((game) => {
      return game.name.toLowerCase().includes(name.toLowerCase());
    });
    setFilteredGames(filterGames);
    setShouldClear(false);
  };

  const handleClearSearch = () => {
    setFilteredGames([]);
    setClicked(false);
    setShouldClear(true);
  };
  return (
    <>
      <section className={styles["games__filter-wrapper"]}>
        <Search
          placeholder="Buscar juegos"
          onSearch={filterGamesByName}
          shouldClear={shouldClear}
        />
        {clicked && (
          <ButtonAction
            variant="delete"
            size="small"
            icon="delete"
            onClick={handleClearSearch}
            ariaLabel="Limpiar la búsqueda"
          />
        )}
      </section>
      <section className={styles["games__create-wrapper"]}>
        <ButtonArrow
          children="Crear juego"
          href="/games/create-game"
          variant="link"
          size="medium"
        />
      </section>

      {/* Si se acciona el botón de búsqueda renderiza: A) No resultado coincidente B) Ok*/}
      {!clicked ? (
        <section className={styles["games__grid"]}>
          {data.map((game) => (
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
      ) : (
        <div className={styles["games__search-wrapper"]}>
          <h3 className={styles["games__search-title"]}>
            Resultado de la búsqueda
          </h3>

          {filteredGames.length === 0 ? (
            <p className={styles["games__search-no-results"]}>
              No hay juegos que coincidan con la búsqueda{" "}
              <strong>"{searchTerm}"</strong>
            </p>
          ) : (
            <section className={styles["games__grid"]}>
              {filteredGames.map((game) => (
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
                      <p className={styles["game__publisher"]}>
                        {game.publisher_name}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </section>
          )}
        </div>
      )}
    </>
  );
};
