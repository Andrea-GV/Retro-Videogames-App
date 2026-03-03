import { useFormContext } from "react-hook-form";
import styles from "./FormInputText.module.scss";

// Aquí debería hacer uso de useFormContext para register y formState
// Para recoger la info del input

type FormControlInputTextType =
  | "text"
  | "number"
  | "url"
  | "date" // Para el campo release_date en formato Date
  | "email" // TODO:para cuando auth x user
  | "password"; // idem

type FormInputTextPops = {
  name: string;
  label?: string;
  placeholder?: string;
  type?: FormControlInputTextType;
  rules?: object; //   Para usar rules (required, max-min length...)
  className?: string;
  step?: string;
};
export const FormInputText = (props: FormInputTextPops) => {
  const { name, label, placeholder, type, rules, className, step } = props;

  //   Accedo al contexto del form y a sus errores
  const {
    register,
    formState: { errors },
  } = useFormContext();
  // Çpara mostrar el error, lo guardo
  const error = errors[name];
  //   console.log("ERRORS en input", errors);
  return (
    <div className={styles["input-wrapper"]}>
      {/* Label podría ser condicional, ya que es opcional */}
      {label && (
        <label htmlFor={name} className={styles.label}>
          {label}
        </label>
      )}
      <input
        id={name}
        type={type}
        placeholder={placeholder}
        className={styles.input}
        {...register(name, rules)} // Al register le paso el campo y sus rules
      />
      {/* Si hay error porque falte un campo whatever */}
      {error && <span className={styles.error}>{error.message as string}</span>}
    </div>
  );
};
