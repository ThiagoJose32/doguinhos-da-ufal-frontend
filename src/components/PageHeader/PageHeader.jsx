import styles from "./PageHeader.module.css";

export default function PageHeader({ title, buttonLabel, onButtonClick }) {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>{title}</h1>

      {buttonLabel && (
        <button
          type="button"
          className={styles.button}
          onClick={onButtonClick}
        >
          {buttonLabel}
        </button>
      )}
    </div>
  );
}