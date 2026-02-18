import { Game } from "@/app/models/game";
import ButtonArrow from "../ButtonArrow/ButtonArrow";
import btnStyles from "../ButtonArrow/ButtonArrow.module.scss";
import styles from "./Card.module.scss";

export type CardDataType = Game; // TODO: Cuando tenga los publishers etc añadir

type CardProps = {
  id?: number | null;
  children?: React.ReactNode;
  image?: string | null;
  title?: string | null;
  publisher?: string | null;
  releaseDate?: string | null;
  rating?: number | null;
};
// ⚠️ Card: Es genérica y reutilizable (para cuando haga publishers etc.)
// Recibe los datos que quiere mostrar:
//    --> En este caso de GameCard

export const Card = ({
  id,
  children,
  image,
  title,
  publisher,
  releaseDate,
  rating,
}: CardProps) => {
  //   console.log("DATOS EN CARD", id);

  return (
    <div className={styles["card"]}>
      {image ? (
        <img
          src={image}
          alt={`${image} cover image`}
          className={styles["card__cover"]}
        />
      ) : (
        <div className={styles["card__cover"]} />
      )}
      <div className={styles["card__info-wrapper"]}>
        {title && <h2 className={styles["card__title"]}>{title}</h2>}
        {publisher && (
          <div className={styles["card__publisher"]}>
            <p>Plubished by </p>
            {publisher === "Atari" ? (
              <h4
                className={
                  styles[`card__publisher--${publisher.toLowerCase()}`]
                }
              >
                {publisher}
              </h4>
            ) : publisher === "SEGA" ? (
              <h4
                className={
                  styles[`card__publisher--${publisher.toLowerCase()}`]
                }
              >
                {publisher}
              </h4>
            ) : (
              <h4 className={styles["card__publisher--name"]}>{publisher}</h4>
            )}
          </div>
        )}
        {rating && <p className={styles["card__rating"]}>{rating}</p>}
      </div>

      <div className={styles["card__btn-wrapper"]}>
        <ButtonArrow
          children="Ver mas"
          href={`/games/${id}`}
          variant="forward"
          size="small"
          className={btnStyles["button--forward"]}
        ></ButtonArrow>
      </div>
    </div>
  );
};

// ⚠️ GameCard recibe el obj game de su mapeo en GameList y le pasa a Card los datos que quiere mostrar como props
export function GameCard({ data }: { data: Game }) {
  //   console.log("DATOS EN CARD", data);
  return (
    <Card
      id={data.id_game}
      image={data.cover_url}
      title={data.name}
      publisher={data.publisher_name}
      rating={data.rating}
    />
  );
}

// TODO: Cuando haga publishers, shops etc, crearé sus componentes PublisherCard
