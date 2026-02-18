"use client";
import { useFormContext } from "react-hook-form";
import styles from "./FormInputSelect.module.scss";

type Option = {
  value: string | number;
  label: string;
};

type FormInputSelectProps = {
  name: string;
  label?: string;
  placeholder?: string;
  options: Option[]; // <--- le uqiero pasar las opciones por prop dependiendo del Form donde lo use
  rules?: object; //   Para usar rules (required, max-min length...)
  className?: string;
};

export const FormInputSelect = (props: FormInputSelectProps) => {
  const { name, label, placeholder, options, rules, className } = props;

  const {
    register,
    formState: { errors },
  } = useFormContext();
  const error = errors[name];

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
        {...register(name, rules)} // Le vendrán heredadas
      >
        {/* <option value="">Opción1</option> 
            Las opciones debería mapearlas  */}
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
