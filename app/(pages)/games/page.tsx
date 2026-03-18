import { Game } from "@/app/models/game";
import baseURL from "@/app/lib/baseURL";
import styles from "./Games.module.scss";
import { GamesList } from "@/app/components/Games/GamesList/GamesList";

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
  } catch (err: any) {
    error = err.message;
  }

  const data = games; // Para pasarla al componente GamesList

  // Función para filtrar los games por nombre en el componente SEARCH

  // 4. Renders
  // 4.1 Render si hay error
  // TODO: CAMBIARLO POR COMPONENTE
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

  /* TODO: Paginación
    - Que se muestre un máx de 12 juegos / pag
      --> Paginación para mostrarlos
      --> Usar btn volver + siguiente 
    - Mejorar sección CREAR JUEGO
  */

  // 4.3 Si todo ok
  return (
    <div className={styles["games__container"]}>
      <h1 className={styles["games__title"]}>Catalogo de Videojuegos</h1>
      <GamesList data={games} />
    </div>
  );
}
