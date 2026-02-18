// Se crea este archivo para que reciba por prop el array de datos de juegos y poder utilizar el Search
// Debido al error previo que no se puede enviar funciones de un server a client component

"use client";

import { useState } from "react";
import { Game } from "@/app/models/game";
import Search from "../../Search/Search";
import ButtonArrow from "../../ButtonArrow/ButtonArrow";
import ButtonAction from "../../ButtonAction/ButtonAction";
import styles from "./GamesList.module.scss";
import { GameCard } from "../../Card/Card";

type GameListProps = {
  data: Game[];
};

export const GamesList = ({ data }: GameListProps) => {
  const [filteredGames, setFilteredGames] = useState<Game[]>([]);
  const [clicked, setClicked] = useState(false); // <-- Render condicional por búsqueda
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

  console.log("DATOS EN GAMELIST", data);
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

      {/* Si se acciona el botón de búsqueda renderiza: A) No resultado coincidente B) Ok */}
      {!clicked ? (
        <section className={styles["games__grid"]}>
          {data.map((game) => (
            <GameCard data={game} key={game.id_game} />
          ))}
        </section>
      ) : (
        <div className={styles["games__search-wrapper"]}>
          <h3 className={styles["games__search-title"]}>
            Resultado de la búsqueda
          </h3>

          {filteredGames.length === 0 ? (
            <p className={styles["games__search-no-results"]}>
              No hay juegos que coincidan con la búsqueda
              <strong>"{searchTerm}"</strong>
            </p>
          ) : (
            <section className={styles["games__grid"]}>
              {filteredGames.map((game) => (
                <GameCard data={game} key={game.id_game} />
              ))}
            </section>
          )}
        </div>
      )}
    </>
  );
};
