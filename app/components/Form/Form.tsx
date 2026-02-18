"use client";
import { ReactNode } from "react";
import styles from "./Form.module.scss";

// Comp Formulario reutilizable para CRUD / User..

type FormProps = {
  children: ReactNode;
  //   dataForm?: Object; // <---- Debería poder recibir la info del form
  onSubmit: (e: React.FormEvent) => void;
};

// export default function Form({ children, dataForm, onSubmit }: FormProps) {
export default function Form({ children, onSubmit }: FormProps) {
  return (
    <form
      className={styles["form-container"]}
      onSubmit={onSubmit}
      // dataForm={dataForm}
    >
      {children}
    </form>
  );
}
