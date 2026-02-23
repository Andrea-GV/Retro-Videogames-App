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
  value?: string | number | null;
  className?: string;
};

export const FormInputSelect = (props: FormInputSelectProps) => {
  const { name, label, placeholder, options, rules, value, className } = props;

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
        // value={value ?? "default"}
        {...register(name, rules)} // Le vendrán heredadas
      >
        {placeholder && (
          <option value="default" disabled selected>
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
      {error && <span className={styles.error}>{error.message as string}</span>}
    </div>
  );
};
