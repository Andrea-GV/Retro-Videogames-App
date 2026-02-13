import Link from "next/link";
import styles from "./ButtonArrow.module.scss";

// Este botón es para manejar navegación
type ButtonArrowProps = {
  children: React.ReactNode; // Contenido del botón (texto o JSX)
  href?: string;
  variant?: "back" | "forward" | "link";
  size?: "small" | "medium" | "large";
  className?: string;
};

export default function Button({
  children,
  href,
  variant = "back",
  size = "large",
  className = "",
}: ButtonArrowProps) {
  const buttonClasses = [
    styles.button,
    styles[`button--${variant}`],
    styles[`button--${size}`],
    className,
  ].join(" ");

  // Si tiene href, renderizo como Link
  if (href) {
    return (
      <Link href={href} className={buttonClasses}>
        {children}
      </Link>
    );
  }
}
