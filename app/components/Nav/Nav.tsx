"use client"; // Para hacerlo interactuable

import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import styles from "./Nav.module.scss";

// Definir las navegaciones disponibles
// de momento dejo estas de ejemplo para poder ver algo
const navigationItems = [
  {
    label: "Catalogo",
    href: "/games",
    id: "catalog",
  },
  {
    label: "Publicadores",
    href: "/publishers",
    id: "publishers",
  },
  {
    label: "Favoritos",
    href: "/favorites",
    id: "favorites",
  },
  {
    label: "Tiendas",
    href: "/shops",
    id: "shops",
  },
];

export default function Nav() {
  const param = useParams(); // ❌ NO USARLO. Eliminar
  const pathname = usePathname(); // ✅ IMPORTANTE para que pueda cambiar en función de dónde esté, lee la ruta actual
  // Recuerda que aunque esté en pág hija (games/id) se puede quedar "isActive" a su categoría padre
  return (
    <nav className={`${styles.nav}`}>
      <ul className={styles["nav__list"]}>
        {navigationItems.map((item) => {
          // console.log("qué es?", item); // ---> Retorna el obj con label href id

          // Necesito comprobar que al estar en games/N el cursor esté activo en su categoría
          // console.log("param", param); // Param es id:2 por lo que este no me sirve ❌
          // console.log("pathname", pathname); // Pathname es /games ---> ESTE OK ✅
          const isActive = pathname.startsWith(item.href); // Ahora reconoce que games/N sigue perteneciendo a games

          return (
            <li key={item.id} className={styles["nav__item"]}>
              <Link
                href={item.href}
                className={`${styles["nav__link"]} 
                ${isActive ? styles["nav__link--active"] : ""}`}
              >
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
