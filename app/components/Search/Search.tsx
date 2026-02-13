"use client"; // Next --> interacciones de usuario = Client Component, de lo contrario es un Server
import { useEffect, useState } from "react";
import styles from "./Search.module.scss";

/* PASOS:
  1. Creo estructura para visualizar --> estilado ✅
  2. Recojo el valor del input con un estado (( searchTerm )) --> ✅
  3. Al hacer intro ---> le mando a buscar la info 
    --> hago un fetch al endpoint que definí en el server-controller para searchGameByName
    --> ❗️❌ NO puedo hacer aquí el fetch directamente, porque sino deja de ser un Client Component
      --> Tengo que crear una función que haga esa búsqueda
      ----> Lo que aún no tengo muy claro, es cómo hacer el renderizado en función de la búsqueda
            ❓Este render no tendría que ser en este component .. o si?
            El render debería hacerlo en la pag de games por lo que
            La función debería pasar el resultado por prop al server Comp de Games ? 
            Pero si la query NO sólo es de games... Sino de publishers, o shops (cuando haga su GET)
            El render debería ser una página nueva que muestre el resultado de la búsqueda? En main?
            --> Por lo que debería hacer navigateTo ?
          ✅ Me convence más:
          Hacer este componente reutilizable para mostrarlo en cada página y que reciba por props principalmente la función que ejecute la búsqueda
          Su componente padre ejecutará la función de filtrado para renderizar TODOS los Games o los FilteredGames
  4. Añado un Effect para que escuche si desde su comp padre se hace click en borrar, elimine el contenido del input

  ⚠️ TODO: Cuando finalice que funcione OK Search 
    ---> Creo comp Card para reutilizar en Publishers, shops etc
    ---> Componente Error para reutilizar en los renders
*/

type SearchProps = {
  placeholder?: string;
  onSearch: (searchTerm: string) => Promise<void> | void; // la búsqueda se hará en su pág y es una promise que se resolverá al hacer fetch a la función de búsqueda
  shouldClear?: boolean;
};

export default function Search({
  placeholder = "",
  onSearch,
  shouldClear = false, // Para que se limpie el input al ejecutar función limpiadora
}: SearchProps) {
  const [searchTerm, setSearchTerm] = useState(""); // <-- Recoge valor input
  const [submit, setSubmit] = useState(false); // <-- Para el submit del Form ejecutado desde la pag

  // ⚠️ No puede ir como parte del componente como en otras ocasiones, al ser Client Comp,
  //  necesito que se integre en una función (handleSearch) que se ejecute al hacer submit en el input

  // Este effect es para que escuche si se hace click en Delete y borre el contenido del input
  useEffect(() => {
    if (shouldClear) {
      setSearchTerm("");
    }
  }, [shouldClear]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Si el input tiene valor, es ejecutable el submit
    if (!searchTerm.trim()) return;
    setSubmit(true);

    try {
      await onSearch(searchTerm); // Su comp padre decide qué tiene que hacer
    } catch (error: any) {
      throw new Error(error.message);
    } finally {
      // Le devuelvo el estado a false "para resetear"
      setSubmit(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  return (
    <form onSubmit={handleSubmit} className={styles["search"]}>
      <div className={styles["search__container"]}>
        <input
          type="text"
          value={searchTerm}
          onChange={handleChange}
          placeholder={placeholder}
          className={styles["search__input"]}
          aria-label={placeholder}
        />
        <button
          type="submit"
          className={styles["search__button"]}
          aria-label="Buscar"
        >
          <span className={styles["search__icon"]}></span>
        </button>
      </div>
    </form>
  );
}
