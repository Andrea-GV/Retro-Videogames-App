import styles from "./ButtonAction.module.scss";

// Este botón es para aplicar funcionalidad
// Se puede indicar si: sólo texto, texto + icono, sólo icono
// Su icon se agrega por css precargadas las urls al inicio del archivo

type IconType = "search" | "delete" | "edit" | "icon";
interface ButtonActionProps {
  text?: string; // <--- para ver si text / text + icon
  variant?: "search" | "delete" | "edit" | "icon" | "submit" | "cancel";
  icon?: IconType;
  size?: "small" | "medium" | "large";
  onClick?: () => void;
  className?: string;
  // disabled?: boolean; <--- para los forms
  ariaLabel?: string;
}
export default function ButtonAction({
  text,
  variant = "submit",
  icon,
  size = "medium",
  onClick,
  className,
  // disabled = false,
  ariaLabel,
}: ButtonActionProps) {
  const btnClasses = [
    styles.btn,
    styles[`btn--${variant}`],
    styles[`btn--${size}`],
    // styles[`btn__icon`],
    icon && styles[`btn--icon--${icon}`], // <- qué icon
    !text && icon && styles[`btn--icon-only`], // <- sólo icon
    className,
  ]
    // .filter(Boolean)   <-- Si activo el disabled es necesario
    .join(" ");

  return (
    <button
      onClick={onClick}
      className={btnClasses}
      // disabled={disabled}
      aria-label={ariaLabel}
    >
      {text && <span className={styles.btn__text}>{text}</span>}
      {/* Probar a comentar el span del icon  */}
      {icon && <span className={styles.btn__icon} aria-hidden="true" />}
    </button>
  );
}
