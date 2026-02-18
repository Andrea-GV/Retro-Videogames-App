import CreateGameForm from "@/app/components/Games/GameForm/CreateGameForm/CreateGameForm";
import styles from "./CreateGame.module.scss";

// El fetch a la API lo va a hacer su componente CreateGameForm al hacer onSubmit
// Por lo que la pág sólo hace render del Form

export default async function CreateGamePage() {
  return (
    <div className={styles["game__container"]}>
      <h1 className={styles["game__title"]}>Crea un videojuego</h1>
      <CreateGameForm />
    </div>
  );
}
