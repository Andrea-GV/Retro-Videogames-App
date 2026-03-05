"use client";

// import { useState } from "react"; // --> Loading? --> Ya lo hago con isSubmitting
import { useForm, FormProvider } from "react-hook-form";
import { useRouter } from "next/navigation";
import baseURL from "@/app/lib/baseURL";
import { Game, UpdateGame } from "@/app/models/game";
import Form from "@/app/components/Form/Form";
import { FormInputText } from "@/app/components/FormInputText/FormInputText";
import { FormInputSelect } from "@/app/components/FormInputSelect/FormInputSelect";
import ButtonAction from "@/app/components/ButtonAction/ButtonAction";
import styles from "./UpateGameForm.module.scss";

/*      INFORMACIÓN RELEVANTE
El ** fetch a la api ** debería hacerlo este componente al hacer onSubmit
    - ⚠️ Después del fetch, debería redirigir a la lista de tods los games?
    - click en CANCELAR -> redirigir a lista de games
        --> ⚠️ Por lo que hace falta useRouter de next
*/
type UpdateGameFormProps = {
  game: Game; // <-- Recibe el juego con sus datos
};

export default function UpdateGameForm({ game }: UpdateGameFormProps) {
  const router = useRouter();
  const methods = useForm<UpdateGame>({
    // ℹ️ Traigo los datos que sí tiene rellenos del Game
    defaultValues: {
      name: game.name,
      release_date: game.release_date || "",
      players_num: game.players_num || undefined,
      cover_url: game.cover_url || "",
      rating: game.rating || undefined,
      id_publisher: game.id_publisher || undefined,
    },
    mode: "onChange", // valida al typing
  });

  // PARA EL SELECT DE PUBLISHERS --> De momento manual por array de opciones
  // Lo suyo es que hiciese fetch a la lista de publishers cuando esté OK
  // TODO:  ❗️⚠️ El selectOptions debería ser FETCH a GetAllPublishers que aún no existe
  const selectOptions: { label: string; value: string }[] = [
    { label: "Atari", value: "1" },
    { label: "Nintendo", value: "2" },
    { label: "SEGA", value: "3" },
    { label: "Capcom", value: "4" },
    { label: "Konami", value: "5" },
    { label: "Namco", value: "6" },
    { label: "Square", value: "7" },
    { label: "Enix", value: "8" },
    { label: "Sierra On-Line", value: "9" },
    { label: "LucasArts", value: "10" },
    { label: "Taito", value: "11" },
    { label: "Sony Interactive Entertainment", value: "12" },
    { label: "Microsoft Studios", value: "13" },
  ];

  // ** FUNCIONES **
  // console.log("Methods:", methods);
  //   Methods me interesa:
  //      handleSubmit --> f
  //        ->tiene onValid /invalid
  //      formState con sus propiedade: isSubmitting & errors ¿?
  //   Algo más?
  //    --> ℹ️ Control tiene el disable para el botón

  // ⚠️🚩 2-MARZO ---> Lo dejo por aquí, la info viene precargada la data del Game
  // Al querer actualizar un campo ME EXIGE que toque todos, me ha ido dando diferentes errores si no le metía date, etc
  //  ********** REVISAR DESDE AQUÍ:**************
  const {
    handleSubmit,
    formState: { isSubmitting, errors },
  } = methods;

  //   Debería enviar la data de UpdateGame al back
  const onSubmit = async (data: UpdateGame) => {
    console.log("🟢 Guardando?", data);
    // Hará el FETCH aquí
    try {
      console.log("URL DEL FETCH", `${baseURL}/games/${game.id_game}`);
      const response = await fetch(`${baseURL}/games/${game.id_game}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      console.log("QUÉ RECOGE?", response);
      console.log("DATA EN EL FETCH", data);

      if (!response.ok) {
        const errorData = await response.json();
        console.log("ERROR DATA", errorData);
        throw new Error(
          (errorData.error && errorData.message) ||
            "Error al actualizar el juego.",
        );
      }

      // Guardo el resultado
      const updatedGame = await response.json();
      console.log("EDITED GAME", updatedGame);
      // Ahora que está ok, puedo redirigir a la pag de games o ... a la del juego creado
      router.push(`/games/${game.id_game}`);
    } catch (err: any) {
      console.error("Error:", err);
      // TODO: Debería manejar los diferentes errores que puede dar?
      return (
        <div>
          <h1>Ups, ha habido un error</h1>
          <p>{err}</p>
        </div>
      );
    }
  };

  const handleCancel = async () => {
    // confirm(); // que el user confirme
    // Si le doy a cancelar - cancelar igualmente redirije asi que... condicional?
    if (confirm("Seguro que quieres cancelar? Se perderá el progreso")) {
      router.push("/games"); // le redirijo a pág genérica
    }
  };

  return (
    <FormProvider {...methods}>
      <Form onSubmit={handleSubmit(onSubmit)}>
        {/* Body con los inputs */}
        <div className={styles["form__body"]}>
          <FormInputText
            name="name"
            label="Titulo *"
            type="text"
            className="titulo"
            rules={{
              required: "El titulo del juego es campo obligatorio",
              minLength: {
                value: 2,
                message: "Debe tener al menos 2 caracteres",
              },
              maxLength: {
                value: 200,
                message: "Demasiados caracteres, max 200",
              },
            }}
          />
          <FormInputText
            name="cover_url"
            label="Imagen de portada"
            type="url"
            placeholder="http://www.tufoto.com"
            className="cover"
            rules={{
              maxLength: {
                value: 300,
                message: "La url es demasiado larga, max 300",
              },
            }}
          />
          <FormInputText
            name="players_num"
            label="Num jugadores"
            type="number"
            placeholder="p. ej 2"
            className="players"
          />
          <FormInputText
            name="release_date"
            label="Fecha de lanzamiento"
            type="date"
            placeholder="DD/MM/YYYY"
            className="release"
          />
          <FormInputSelect
            name="id_publisher"
            label="Publishers"
            options={selectOptions}
            placeholder="Select the publisher"
          />
          <FormInputText
            name="rating"
            label="Valora el juego"
            type="text"
            placeholder="p. ej 8.5"
            className="rating"
            inputMode="decimal"
            rules={{
              pattern: {
                value: /^(\d+\.?\d*)?$/,
                message: "El rating debe ser un número decimal válido",
              },
              validate: {
                isValidRange: (value: string) => {
                  if (!value) return true;
                  const num = parseFloat(value);
                  if (isNaN(num)) return "Debe ser un número";
                  if (num < 0 || num > 10)
                    return "El rating debe estar entre 0 y 10";
                  return true;
                },
              },
            }}
          />
        </div>

        {/* Footer para botones: Cancelar / Submit */}
        <div className={styles["form__btns"]}>
          <ButtonAction
            text="Cancelar"
            variant="cancel"
            size="medium"
            ariaLabel="Botón cancelar edición del videojuego"
            onClick={handleCancel}
            disabled={isSubmitting}
          />
          <ButtonAction
            text={isSubmitting ? "Guardando" : "Guardar"}
            variant="submit"
            size="medium"
            ariaLabel="Botón guardar videojuego"
            disabled={isSubmitting}
          />
        </div>
      </Form>
    </FormProvider>
  );
}
