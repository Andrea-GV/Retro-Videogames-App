import Link from "next/link";
import styles from "./ButtonArrow.module.scss";

// Este botón es para manejar navegación
type ButtonArrowProps = {
  children?: React.ReactNode; // Contenido del botón (texto o JSX)
  href?: string;
  variant?: "back" | "forward" | "link" | "edit";
  size?: "small" | "medium" | "large";
  className?: string;
  icon?: "edit";
};

export default function Button({
  children,
  href,
  variant = "back",
  size = "large",
  className = "",
  icon,
}: ButtonArrowProps) {
  const buttonClasses = [
    styles.button,
    styles[`button--${variant}`],
    styles[`button--${size}`],
    icon && styles[`button--${icon}`], // <- qué icon
    !children && icon && styles[`button--icon-only`], // <- sólo icon
    className,
  ].join(" ");

  // Si tiene href, renderizo como Link
  if (href) {
    return (
      <Link href={href} className={buttonClasses}>
        {children}
        {icon && (
          <span className={styles["button--icon"]} aria-hidden="true">
            {icon}
          </span>
        )}
      </Link>
    );
  }
}
