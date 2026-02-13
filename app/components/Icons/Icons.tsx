import Link from "next/link";
import styles from "./Icons.module.scss";
export default function Icons() {
  const iconItems = [
    {
      id: 1,
      icon: "/icons/home.svg",
      alt: "icon home",
      href: "/",
    },
    {
      id: 2,
      icon: "/icons/user.svg",
      alt: "icon user",
      href: "/user",
    },
  ];
  return (
    <div className={styles["icons__container"]}>
      <ul className={styles["icons__list"]}>
        {iconItems.map((item) => {
          return (
            <li key={item.id} className={styles["icons__item"]}>
              <Link href={item.href}>
                <img
                  src={item.icon}
                  alt={item.alt}
                  className={styles["icons__img"]}
                />
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
