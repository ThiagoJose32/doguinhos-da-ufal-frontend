import { Link } from "react-router-dom";
import styles from "./EntityCard.module.css";

function getStatusClass(status) {
  switch (status) {
    case "No campus":
      return styles.statusNoCampus;
    case "Adotado":
      return styles.statusAdotado;
    case "Desaparecido":
      return styles.statusDesaparecido;
    case "Óbito":
      return styles.statusObito;
    case "Ativo":
      return styles.statusAtivo;
    case "Inativo":
      return styles.statusInativo;
    default:
      return "";
  }
}

export default function EntityCard({ image, title, subtitle, status, to }) {
  const className = `${styles.card} ${getStatusClass(status)}`;

  const content = (
    <>
      <img src={image} alt={title} className={styles.cardImage} />

      <div className={styles.overlay}>
        <h3 className={styles.cardTitle}>{title}</h3>

        {subtitle && <p className={styles.cardSubtitle}>{subtitle}</p>}

        {status && <span className={styles.statusBadge}>{status}</span>}
      </div>
    </>
  );

  if (to) {
    return (
      <Link to={to} className={className}>
        {content}
      </Link>
    );
  }

  return <article className={className}>{content}</article>;
}