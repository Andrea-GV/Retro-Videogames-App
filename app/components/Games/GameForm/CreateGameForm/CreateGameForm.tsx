// Este componente es específico para Game --> De momento para CREAR
"use client";

// import { useState } from "react"; // --> Loading? --> Ya lo hago con isSubmitting
import { useForm, FormProvider } from "react-hook-form";
import { useRouter } from "next/navigation";
import baseURL from "@/app/lib/baseURL";
import { CreateGame } from "@/app/models/game";
import Form from "@/app/components/Form/Form";
import { FormInputText } from "@/app/components/FormInputText/FormInputText";
import { FormInputSelect } from "@/app/components/FormInputSelect/FormInputSelect";
import ButtonAction from "@/app/components/ButtonAction/ButtonAction";

import styles from "./CreateGameForm.module.scss";

// Su model -- Inputs que necesito
//  ✅ name: string; // ⚠️ El único campo not null --> Por lo que debería tener un rules required
//   release_date?: string; --> Input tipo date
//  ✅ players_num?: number;
//  ✅ cover_url?: string;
//   rating?: number; --> Radio con ⭐️ ?
//   id_publisher?: number; --> Selector para poder elegirlos?

/*      INFORMACIÓN RELEVANTE
Este componente es Client se encarga de ** recoger la info ** (estado de cada campo, validaciones, etc)
Envuelvo el Form completo en un FormProvider para que los hijos puedan recoger la info
     --> El FormProvider sería más en el Comp Form, que en este ..?
        Creo que no, porque quien sabe qué info le hace falta (siguiendo el model de CreateGame) es el comp CreateGameForm
        El Form es genérico y no sabe qué datos recogerá
        --> Lo pruebo aquí y apunto deducciones

El ** fetch a la api ** debería hacerlo este componente al hacer onSubmit
    - ⚠️ Después del fetch, debería redirigir a la lista de tods los games?
    - click en CANCELAR -> redirigir a lista de games
        --> ⚠️ Por lo que hace falta useRouter de next
*/

export default function CreateGameForm() {
  //   const [formValues, setFormValues] = useState<CreateGame>({ <---  ❌ Lo cambio por el useForm
  //     name: "",     // ℹ️ Inicializo en vacío todo
  //     release_date: "",
  //     players_num: undefined,
  //     cover_url: "",
  //     rating: undefined,
  //     id_publisher: undefined,
  //   });
  const router = useRouter();
  const methods = useForm<CreateGame>({
    // Necesita saber qué tipo de datos usando su model
    // ℹ️ Inicializo en vacío todo
    defaultValues: {
      name: "",
      release_date: "",
      players_num: undefined,
      cover_url: "",
      rating: undefined,
      id_publisher: undefined,
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
  /* con useForm mode:onchange --> handleChange ya no hace falta
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        console.log("typing");
    ⚠️ DE MOMENTO REGISTRA TODS Los inputs A LA VEZ
    setInputValue(e.target.value);
    console.log(inputValue);
      };
    */

  console.log("Methods:", methods);
  //   Methods me interesa:
  //      handleSubmit --> f
  //        ->tiene onValid /invalid
  //      formState con sus propiedade: isSubmitting & errors ¿?
  //   Algo más?
  //    --> ℹ️ Control tiene el disable para el botón
  const {
    handleSubmit,
    formState: { isSubmitting, errors },
  } = methods;

  //   Debería enviar la data de CreateGame al back
  const onSubmit = async (data: CreateGame) => {
    console.log("🟢 Guardando?", data);
    // Hará el FETCH aquí
    try {
      const response = await fetch(`${baseURL}/games`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      console.log("QUÉ RECOGE?", response);
      console.log("DATA EN EL FETCH", data);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          (errorData.error && errorData.message) || "Error creando el juego.",
        );
      }

      // Guardo el resultado
      const newGame = await response.json();
      console.log("NEW GAME", newGame);
      // Ahora que está ok, puedo redirigir a la pag de games o ... a la del juego creado
      router.push(`/games/${newGame.id_game}`);
    } catch (err: any) {
      console.error("Error al cargar el juego:", err);
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
    console.log("🟡 Borrando");
    // confirm(); // que el user confirme
    // Si le doy a cancelar - cancelar igualmente redirije asi que... condicional?
    if (confirm("Seguro que quieres cancelar? Se perderá el progreso")) {
      router.push("/games"); // le redirijo
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
          />
        </div>

        {/* Footer para botones: Cancelar / Submit */}
        <div className={styles["form__btns"]}>
          <ButtonAction
            text="Cancelar"
            variant="cancel"
            size="medium"
            ariaLabel="Botón cancelar crear videojuego"
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
