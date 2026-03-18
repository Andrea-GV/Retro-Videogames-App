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
            <p>Published by </p>
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
        {rating && (
          <div className={styles["card__rating"]}>
            <Stars rating={rating} max={5} />
            <p>({rating})</p>
          </div>
        )}
      </div>

      <div className={styles["card__btn-wrapper"]}>
        {/* TODO: Este botón debería llvar al formulario para editar el juego*/}
        <ButtonArrow
          variant="edit"
          size="small"
          href={`/games/edit-game/${id}`}
        />
        <ButtonArrow
          children="Ver mas"
          href={`/games/${id}`}
          variant="forward"
          size="small"
          className={btnStyles["button--forward"]}
        />
      </div>
    </div>
  );
};

// TODO: Cuando haga publishers, shops etc, crearé sus componentes PublisherCard
// ⚠️ GameCard recibe el obj game de su mapeo en GameList y le pasa a Card los datos que quiere mostrar como props
export function GameCard({ data }: { data: Game }) {
  console.log(data);

  return (
    <Card
      id={data.id_game}
      image={data.cover_url}
      title={data.name}
      // publisher={data.publisher_name}
      publisher={data.publisher?.name}
      rating={data.rating}
    />
  );
}

type StarsProps = {
  rating: number | null;
  max?: number; // máximo de estrellas a mostrar (default 5)
};
export function Stars({ rating, max = 5 }: StarsProps) {
  if (rating === null) return null;
  // Olvidar el decimal del rating
  const roundRate = Math.floor(rating);
  // Convertir rating en estrellas (10 pts = 5 stars; par = full; impar = half; empty hasta completar max)
  const isEven = roundRate % 2 === 0;

  let fullStars: number;
  let hasHalfStar: boolean;

  if (isEven) {
    fullStars = roundRate / 2;
    hasHalfStar = false;
  } else {
    fullStars = Math.floor(roundRate / 2);
    hasHalfStar = true;
  }

  return (
    <div className={styles.stars}>
      {/* Par --> Mapeo Array y asigno img a cada elem. "_", irrelevante su valor del index )  */}
      {Array.from({ length: fullStars }).map((_, i) => (
        <img key={`full-${i}`} src="/icons/star-full.svg" alt="star" />
      ))}

      {/* Impar */}
      {hasHalfStar && (
        <>
          <img
            src="/icons/star-half-left.png"
            alt="half star"
            className={styles["stars__half-star"]}
          />
          <img
            src="/icons/star-half-right.png"
            alt="half star"
            className={styles["stars__half-star"]}
          />
        </>
      )}

      {/* Vacío */}
      {Array.from({ length: max - fullStars - (hasHalfStar ? 1 : 0) }).map(
        (_, i) => (
          <img
            key={`empty-${i}`}
            src="/icons/star-empty.svg"
            alt="empty star"
          />
        ),
      )}
    </div>
  );
}
