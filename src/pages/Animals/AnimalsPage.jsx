import { useMemo, useState } from "react";
import { Funnel } from "lucide-react";
import PageHeader from "../../components/PageHeader/PageHeader";
import EntityCard from "../../components/EntityCard/EntityCard";
import mockAnimals from "../../data/mockAnimals";
import styles from "../../styles/GridPage.module.css";

const statusOptions = ["No campus", "Adotado", "Desaparecido", "Óbito"];

export default function AnimalsPage() {
  const [animalType, setAnimalType] = useState("dog");
  const [selectedStatuses, setSelectedStatuses] = useState([...statusOptions]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  function handleNewItem() {
    alert("Abrir cadastro de animal");
  }

  function toggleStatus(status) {
    setSelectedStatuses((prev) =>
      prev.includes(status)
        ? prev.filter((item) => item !== status)
        : [...prev, status]
    );
  }

  function toggleAllStatuses() {
    const allSelected = selectedStatuses.length === statusOptions.length;
    setSelectedStatuses(allSelected ? [] : [...statusOptions]);
  }

  const filteredAnimals = useMemo(() => {
    return mockAnimals.filter((animal) => {
      const matchesType = animal.especie === animalType;
      const matchesStatus = selectedStatuses.includes(animal.status);

      return matchesType && matchesStatus;
    });
  }, [animalType, selectedStatuses]);

  const allStatusesSelected = selectedStatuses.length === statusOptions.length;

  return (
    <section className={styles.page}>
      <PageHeader
        title="Animais"
        buttonLabel="Novo item"
        onButtonClick={handleNewItem}
      />

      <div className={styles.toolbar}>
        <div className={styles.tabs}>
          <button
            type="button"
            className={`${styles.tabButton} ${
              animalType === "dog" ? styles.activeTab : ""
            }`}
            onClick={() => setAnimalType("dog")}
          >
            Dogs
          </button>

          <button
            type="button"
            className={`${styles.tabButton} ${
              animalType === "cat" ? styles.activeTab : ""
            }`}
            onClick={() => setAnimalType("cat")}
          >
            Cats
          </button>
        </div>

        <div className={styles.toolbarRight}>
          <button
            type="button"
            className={styles.filterButton}
            onClick={() => setIsFilterOpen((prev) => !prev)}
          >
            <Funnel size={18} />
            <span className={styles.filterButtonText}>Filtros</span>
          </button>

          {isFilterOpen && (
            <div className={styles.filterPanel}>
              <button
                type="button"
                className={styles.filterOption}
                onClick={toggleAllStatuses}
              >
                <input type="checkbox" checked={allStatusesSelected} readOnly />
                <span>Todos</span>
              </button>

              {statusOptions.map((status) => (
                <button
                  key={status}
                  type="button"
                  className={styles.filterOption}
                  onClick={() => toggleStatus(status)}
                >
                  <input
                    type="checkbox"
                    checked={selectedStatuses.includes(status)}
                    readOnly
                  />
                  <span>{status}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className={styles.content}>
        <div className={styles.cardsArea}>
          {filteredAnimals.map((animal) => (
            <EntityCard
              key={animal.id}
              image={animal.imagem}
              title={animal.nome}
              subtitle={`${animal.sexo} - ${animal.idade}`}
              status={animal.status}
              to={`/app/animals/${animal.id}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}