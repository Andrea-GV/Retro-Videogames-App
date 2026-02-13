import Link from "next/link";
import Nav from "@/app/components/Nav/Nav";
// import Search from "@/app/components/Search/Search";
import Icons from "@/app/components/Icons/Icons";

import styles from "./Header.module.scss";

interface HeaderProps {
  page?: string; // para navegar y añadir clases dinámicas (page--${Page.XXX}) ---> Añadir un model de Pages
  navigation?: NavProps;
  slug?: string;
}
type NavProps = [
  {
    title: string;
    to: string;
  },
];

const Header: React.FC<HeaderProps> = ({ page = "home" }) => {
  return (
    <header className={styles.header}>
      <div className={styles["header__container"]}>
        {/* Logo */}
        <div className={styles["header__logo-wrapper"]}>
          <Link href="/" className={styles["header__logo-link"]}>
            <img
              src="/retro-arcade-cut.png"
              alt="Retro Games Logo"
              className={styles["header__logo-img"]}
            />
          </Link>
        </div>

        {/* Menú Nav */}
        <div className={styles["header__nav-wrapper"]}>
          {/* <Nav className={styles["header__nav"]} /> */}
          <Nav />
        </div>

        {/* Search PASA A CADA PAG*/}
        {/* <div className={styles["header__search-wrapper"]}>
          <Search />
        </div> */}

        {/* icons */}
        <div>
          <Icons />
        </div>
      </div>
    </header>
  );
};

export default Header;
