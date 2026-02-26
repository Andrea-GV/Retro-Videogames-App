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
import { start } from "repl";

type GameListProps = {
  data: Game[];
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

const ratingOpts: { label: string; value: string }[] = [
  { label: "1 ⭐️", value: "7" },
  // { label: "2 ⭐️⭐️", value: "2" },
  // { label: "3 ⭐️⭐️⭐️", value: "3" },
  // { label: "4 ⭐️⭐️⭐️⭐️", value: "4" },
  // { label: "5 ⭐️⭐️⭐️⭐️⭐️", value: "5" },
  // { label: "6", value: "6" },
  // { label: "7", value: "7" },
  // { label: "8", value: "8" },
  // { label: "9", value: "9" },
  // { label: "10", value: "10" },
];

export const GamesList = ({ data }: GameListProps) => {
  const [filteredGames, setFilteredGames] = useState<Game[]>([]);
  const [clicked, setClicked] = useState(false); // <-- Render condicional por búsqueda
  const [shouldClear, setShouldClear] = useState(false); // <-- Borrará contenido input
  const [searchTerm, setSearchTerm] = useState(""); // <-- Para traer el valor del input
  const [selectedPublisher, setSelectedPublisher] = useState<string[]>([]); // Lo cambio de string a string[]  y quito null para poder seleccionar varios publisher
  const [selectedRating, setSelectedRating] = useState<string | null>(null); // Filtro por rating

  // Prueba para ver el tipo de rating en game --> Viene como string
  // console.log(typeof data[2].rating);

  // ❓ USar un useEffect para escuchar searchTerm y que renderice filteredGames según typing
  // Ahora DISPARA la función de filtrado en función de si cambia alguna de sus dependencias a vigilar
  useEffect(() => {
    console.log(
      "cambio registrado",
      searchTerm,
      selectedPublisher,
      selectedRating,
    );
    filterGames();
  }, [searchTerm, selectedPublisher, selectedRating]);

  // Voy a realizar 1 única función para filtrar tanto x name Y publisher (y resto de opciones a futuro)
  const filterGames = () => {
    // Recojo todos los juegos y luego aplicaré filtros
    let results = data;
    console.log(results);
    // Publisher (si hay seleccionado)
    if (selectedPublisher.length > 0) {
      results = results.filter((game) => {
        // console.log("🟢 selectedPublisher", selectedPublisher);
        return selectedPublisher.includes(game.id_publisher?.toString() || ""); // <-- varios
        // return game.id_publisher?.toString() === selectedPublisher; // <-- un publisher
      });
    }

    // Rating
    /* Qué necesito hacer para poder comparar los rating:
      0. Que sean formato Num selectedRating y game.rating
    1. Creo un array para ir llenándolo con los juegos que tengan rating q coincida (se llene en el bucle)
    2. Si se selecciona el filtro de Rating:
    3. Que empiece a recorrer todos los juegos q traiga results
    - Si son null, que pasen al siguiente
    - Si son formato string --> que convierta y almacene su rating a Number 
    4. Compara su rating con el seleccionado del Select 
      --> POR RANGO 7-7.9 >= 7
      - Si son iguales, que guarde el juego en el array
      - Devuelva
     */
    let gamesWithRating: Game[] = []; // 1.
    if (selectedRating !== null) {
      // 2.
      const numbSelectedRating = Number(selectedRating); // 0. transformo a Numb
      console.log("⭐️ numbSelectedRating", numbSelectedRating);

      results = results.filter((game) => {
        // 3.
        if (game.rating === null) {
          // 3.1
          console.log("❌ No hay rating, next game", game);
          return false;
        }

        const numbRatingData =
          typeof game.rating === "string" ? Number(game.rating) : game.rating; // 0. Transformo
        console.log("Rating CONVERTIDO", numbRatingData, typeof numbRatingData);

        // 4. Comparo valores POR RANGO
        // >= q el selected y < que el sig numero al selected
        const matchesRating =
          numbRatingData >= numbSelectedRating &&
          numbRatingData < numbSelectedRating + 1;

        console.log(
          "🚩 Comparación",
          matchesRating,
          numbRatingData,
          numbSelectedRating,
        );
        if (matchesRating) {
          gamesWithRating.push(game);
        }
        console.log("➡️ Añadido juego", gamesWithRating);

        return matchesRating;
      });
    }

    // Name
    if (searchTerm.trim() !== "") {
      results = results.filter((game) => {
        return game.name.toLowerCase().includes(searchTerm.toLowerCase());
      });
    }

    setFilteredGames(results);
    // setClicked(true); <---- culpable de RENDER inicial aparezca botón basura (y aparezca siempre)
    // setClicked(searchTerm.trim() !== "" || selectedPublisher !== null); // <--- Un P
    // setClicked(searchTerm.trim() !== "" || selectedPublisher.length > 0); // 1+ P
    setClicked(
      searchTerm.trim() !== "" ||
        selectedPublisher.length > 0 ||
        selectedRating !== null,
    );

    setShouldClear(false);
  };

  // BORRADO
  // Borra el Publisher
  const handleClearPublisher = (publisherId: string) => {
    // setSelectedPublisher(null); // <-- un P
    const deleteId = selectedPublisher.filter((id) => id !== publisherId);
    setSelectedPublisher((prev) => prev.filter((id) => id !== publisherId));
  };

  // Borra el input
  const handleClearSearch = () => {
    setSearchTerm("");
    setShouldClear(true);
  };

  // Borra TODO
  const handleClearAllFilters = () => {
    // setSelectedPublisher(null); // <---- SELECT al placeholder después de borrar
    setSelectedPublisher([]); // <-- Varios P
    setSearchTerm(""); // NEcesito resetearlo. Sino, aunque pulse, se queda 1 vez
    setShouldClear(true);
  };

  // CAMBIOS
  // Cambio en Search (name)
  const handleGamesByName = async (name: string) => {
    setSearchTerm(name);
  };

  // Cambio Select de publisher
  const handlePublisherChange = async (value: string | number) => {
    console.log("Publisher seleccionado:", value);
    const publisherId = value as string;
    console.log("publisherId", publisherId);
    // ⚠️ Cuando solo podía seleccionar UN publisher tenía ⬇️
    // setSelectedPublisher(publisherId);

    // VARIOS: Si ya está seleccionado, no poder seleccionarlo otra vez
    if (selectedPublisher?.includes(publisherId)) {
      return;
    }
    // VARIOS: Añado a la lista. Creo copia y añado el selected por su id
    setSelectedPublisher((prev) => [...prev, publisherId]);
    console.log("🟢 selectedPublisher after filter", selectedPublisher);
  };

  // Cambio Select rating
  const handleRatingChange = async (value: string | number) => {
    // ⚠️ El rating de un game viene como string
    setSelectedRating(value as string);
    console.log("selectedRating", selectedRating);
  };

  // Los chips de publisher
  const selectedPublisherChip = (publisherId: string) => {
    const chip = publisherOpts.find((opt) => opt.value === publisherId); // <-- un P
    return chip ? chip.label : "";
  };

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
          <Select
            name="rating"
            options={ratingOpts}
            placeholder="Filtrar por rating"
            onChange={handleRatingChange}
          />
          <Search
            placeholder="Buscar juegos"
            onSearch={handleGamesByName}
            shouldClear={shouldClear}
          />
          {clicked && (
            <ButtonAction
              variant="delete"
              size="small"
              icon="delete"
              onClick={handleClearAllFilters}
              ariaLabel="Limpiar todos los filtros aplicados"
            />
          )}
        </div>

        <div className={styles["games__filter-chip-wrapper"]}>
          {/* Chips Publishers */}
          {selectedPublisher.map((publisherId) => (
            // {selectedPublisher && ( // <-- UN P
            <span key={publisherId} className={styles["games__chip"]}>
              {/* {selectedPublisherChip()} <--- UN P */}
              {selectedPublisherChip(publisherId)}
              <ButtonAction
                variant="close-red"
                size="xsmall"
                icon="close-red"
                // onClick={handleClearPublisher} // <-- UN P
                onClick={() => handleClearPublisher(publisherId)}
                ariaLabel="Elimina filtro de publisher"
              />
            </span>
          ))}
          {/* Chips término */}
          {searchTerm && (
            <span className={styles["games__chip"]}>
              "{searchTerm}"
              <ButtonAction
                variant="close-red"
                size="xsmall"
                icon="close-red"
                onClick={handleClearSearch}
                ariaLabel="Eliminar filtro de búsqueda"
              />
            </span>
          )}
        </div>
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
              {selectedPublisher.map((publisherId) => (
                <strong> "{selectedPublisherChip(publisherId)}"</strong>
              ))}
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
