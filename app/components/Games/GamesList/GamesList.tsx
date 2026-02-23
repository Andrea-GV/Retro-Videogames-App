// Se crea este archivo para que reciba por prop el array de datos de juegos y poder utilizar el Search
// Debido al error previo que no se puede enviar funciones de un server a client component

"use client";

import { useEffect, useState } from "react";
import { Game } from "@/app/models/game";
import Search from "../../Search/Search";
import ButtonArrow from "../../ButtonArrow/ButtonArrow";
import ButtonAction from "../../ButtonAction/ButtonAction";
import { GameCard } from "../../Card/Card";
import { Select } from "../../Select/Select";
import styles from "./GamesList.module.scss";

type GameListProps = {
  data: Game[];
};

export const GamesList = ({ data }: GameListProps) => {
  const [filteredGames, setFilteredGames] = useState<Game[]>([]);
  const [clicked, setClicked] = useState(false); // <-- Render condicional por búsqueda
  const [shouldClear, setShouldClear] = useState(false); // <-- Borrará contenido input
  const [searchTerm, setSearchTerm] = useState(""); // <-- Para traer el valor del input
  const [selectedPublisher, setSelectedPublisher] = useState<string | null>(
    null,
  ); // Lo cambio para poder seleccionar varios publisher
  // <-- Registra el publisher para filtrar
  // const [selectedPublisher, setSelectedPublisher] = useState<string[]>([]); // Lo cambio de string a string[]  y quito null para poder seleccionar varios publisher
  // const [selectedRating, setSelectedRating] = useState<string | null>(null); // Para añadir otro filtro por rating

  // ❓ USar un useEffect para escuchar searchTerm y que renderice filteredGames según typing
  useEffect(() => {
    if (!searchTerm) {
      console.log("No hay nada en el input", searchTerm);
      setFilteredGames([]);
      setShouldClear(true);
    }
    if (searchTerm) {
      filterGamesByName(searchTerm);
    }
  }, [searchTerm]);

  const filterGamesByName = async (name: string) => {
    // Si está vacío el término de búsqueda, reseteo y muestro todos los games
    if (name.trim() === "") {
      setFilteredGames([]);
      setClicked(false);
      setSearchTerm("");
      return;
    }

    setClicked(true);
    setSearchTerm(name);

    const filterGames = data.filter((game) => {
      return game.name.toLowerCase().includes(name.toLowerCase());
    });

    setFilteredGames(filterGames);
    setShouldClear(false);
  };

  const filterGamesByPublisher = async (publisher: string) => {
    console.log("FILTRA?!", publisher);
    setClicked(true);
    const filterGames = data.filter((game) => {
      console.log("JUEGO: ", game);
      console.log("ID PUBLISHER: ", game.id_publisher?.toString());
      console.log("PUBLISHER: ", publisher);
      return game.id_publisher?.toString() === publisher;
    });
    setFilteredGames(filterGames);
    setShouldClear(false);
  };
  // const filterGamesByRating = async (rating: string) => {
  //   setClicked(true);
  //   const filterGames = data.filter((game) => {
  //     console.log("JUEGO: ", game);
  //     console.log("RATING: ", game.rating);
  //   });
  //   setFilteredGames(filterGames);
  //   setShouldClear(false);
  // };

  // Borra sólo un filtro

  // BORRA TODO
  const handleClearSearch = () => {
    setSelectedPublisher(null); // <---- SELECT al placeholder después de borrar
    setFilteredGames([]);
    setClicked(false);
    setShouldClear(true);
  };
  // Función para manejar el cambio en el Select de publisher
  const handlePublisherChange = async (value: string | number) => {
    console.log("Publisher seleccionado:", value);
    const publisherId = value as string;
    console.log("publisherId", publisherId);
    // Cuando solo podía seleccionar un publisher tenía
    setSelectedPublisher(publisherId);
    if (publisherId) {
      console.log("Filtro por publisher", publisherId);
      await filterGamesByPublisher(publisherId);
    }

    // Si ya está seleccionado, no poder seleccionarlo otra vez
    if (selectedPublisher?.includes(publisherId)) {
      return;
    }
    // Añado a la lista los que haya seleccionado
    // setSelectedPublisher((prev) => [...prev, publisherId]);
    console.log("🟢 selectedPublisher after filter", selectedPublisher);
  };

  const selectedPublisherChip = () => {
    const chip = publisherOpts.find((opt) => opt.value === selectedPublisher);
    return chip ? chip.label : "";
  };

  const publisherOpts: { label: string; value: string }[] = [
    { label: "Atari", value: "1" },
    { label: "Nintendo", value: "2" },
    { label: "SEGA", value: "3" },
    { label: "Capcom", value: "4" },
    { label: "Konami", value: "5" },
    { label: "Namco", value: "6" },
    { label: "Square", value: "7" },
    { label: "Enix", value: "8" },
    { label: "Sierra On-Line", value: "9" },
    { label: "LucasArts", value: "10" },
    { label: "Taito", value: "11" },
    { label: "Sony Interactive Entertainment", value: "12" },
    { label: "Microsoft Studios", value: "13" },
  ];

  // Aplicaré una función que recorra todos los games, y vaya guardando
  // const ratingOpts: { label: string; value: string }[] = [
  //   { label: "1", value: "1" },
  //   { label: "2", value: "2" },
  //   { label: "3", value: "3" },
  //   { label: "4", value: "4" },
  //   { label: "5", value: "5" },
  //   { label: "6", value: "6" },
  //   { label: "7", value: "7" },
  //   { label: "8", value: "8" },
  //   { label: "9", value: "9" },
  //   { label: "10", value: "10" },
  // ];

  return (
    <>
      <section className={styles["games__filter-wrapper"]}>
        <div className={styles["games__filters"]}>
          <Select
            name="publisher"
            options={publisherOpts}
            placeholder="Filtrar por publisher"
            onChange={handlePublisherChange}
          />
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
        </div>

        {selectedPublisher && (
          <div className={styles["games__filter-chip-wrapper"]}>
            <span className={styles["games__chip"]}>
              {selectedPublisherChip()}
              <ButtonAction
                variant="close-red"
                size="xsmall"
                icon="close-red"
                onClick={handleClearSearch}
                ariaLabel="Limpiar la búsqueda"
              />
            </span>
          </div>
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
              {searchTerm && <strong> "{searchTerm}" </strong>}
              {selectedPublisher && (
                <strong>
                  {/* Para que muestre el label del selectedPublisher lo busco */}
                  {/* " {
                    publisherOpts.find((opt) => opt.value === selectedPublisher)
                      ?.label
                  }" */}
                  "{selectedPublisherChip()}"
                </strong>
              )}
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
