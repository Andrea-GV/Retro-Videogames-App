"use client";
import styles from "./Select.module.scss";

type Option = {
  value: string | number;
  label: string;
};

type SelectProps = {
  name: string;
  label?: string;
  placeholder?: string;
  options: Option[]; // <--- le uqiero pasar las opciones por prop dependiendo del Form donde lo use
  rules?: object; //   Para usar rules (required, max-min length...)
  className?: string;
  value?: string | number | null; // Le añado el value para poder controlar qué valor he seleccionado
  onChange?: (value: string | number) => void; // Registra el valor seleccionado
};

export const Select = (props: SelectProps) => {
  const {
    name,
    label,
    placeholder,
    options,
    rules,
    className,
    value,
    onChange,
  } = props;

  // Registro el cambio de selección
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedValue = e.target.value;

    if (selectedValue === "default") return; // <-- Esto es para que muestre como value el placeholder

    if (onChange) {
      console.log("selectedValue", selectedValue);
      onChange(selectedValue);
    }
  };

  return (
    <div className={styles["select-wrapper"]}>
      {label && (
        <label htmlFor={name} className={styles.label}>
          {label}
        </label>
      )}
      <select
        id={name}
        className={styles.select}
        // defaultValue={"default"} // <--- No me dejaba actualizar value si l odejo
        value={value ?? "default"} // qué valor registro --< si es null que muestre por defecto el placeholder
        onChange={handleChange} // Manejo el cambio
      >
        {placeholder && (
          <option value="default" disabled>
            {placeholder}
          </option>
        )}
        {options.map((option) => (
          <option
            key={option.value}
            value={option.value}
            className={styles.option}
          >
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};
