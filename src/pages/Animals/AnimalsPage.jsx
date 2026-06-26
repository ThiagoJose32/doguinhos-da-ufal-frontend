import { useMemo, useState } from "react";
import { Funnel } from "lucide-react";
import PageHeader from "../../components/PageHeader/PageHeader";
import EntityCard from "../../components/EntityCard/EntityCard";
import AnimalModal from "../../components/AnimalModal/AnimalModal";
import mockAnimals from "../../data/mockAnimals";
import styles from "../../styles/GridPage.module.css";

const statusOptions = ["No campus", "Adotado", "Desaparecido", "Óbito"];

function buildAnimalWithExtraData(animal) {
  return {
    ...animal,
    dataEstimadaNascimento: "",
    descricao: "",
    corPelagem: "Caramelo",
    porte: "Médio",
    castrado: "Não",
    adotanteNome: "",
    termoAdocaoArquivoNome: "",
    termoAdocaoArquivoUrl: "",
  };
}

export default function AnimalsPage() {
  const [animals, setAnimals] = useState(
    mockAnimals.map((animal) => buildAnimalWithExtraData(animal))
  );

  const [animalType, setAnimalType] = useState("dog");
  const [selectedStatuses, setSelectedStatuses] = useState([...statusOptions]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const [modalConfig, setModalConfig] = useState({
    isOpen: false,
    mode: "view",
    animal: null,
  });

  function handleNewItem() {
    setModalConfig({
      isOpen: true,
      mode: "create",
      animal: null,
    });
  }

  function handleOpenAnimal(animal) {
    setModalConfig({
      isOpen: true,
      mode: "view",
      animal,
    });
  }

  function handleCloseModal() {
    setModalConfig({
      isOpen: false,
      mode: "view",
      animal: null,
    });
  }

  function handleSaveAnimal(payload, mode) {
    if (mode === "create") {
      const newAnimal = {
        ...payload,
        id: Date.now(),
      };

      setAnimals((prev) => [newAnimal, ...prev]);
      handleCloseModal();
      return;
    }

    if (mode === "edit") {
      setAnimals((prev) =>
        prev.map((animal) => (animal.id === payload.id ? payload : animal))
      );

      setModalConfig((prev) => ({
        ...prev,
        animal: payload,
      }));
    }
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
    return animals.filter((animal) => {
      const matchesType = animal.especie === animalType;
      const matchesStatus = selectedStatuses.includes(animal.status);

      return matchesType && matchesStatus;
    });
  }, [animals, animalType, selectedStatuses]);

  const allStatusesSelected = selectedStatuses.length === statusOptions.length;

  return (
    <>
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
                subtitle={`${animal.sexo} - ${animal.status}`}
                status={animal.status}
                onClick={() => handleOpenAnimal(animal)}
              />
            ))}
          </div>
        </div>
      </section>

      <AnimalModal
        isOpen={modalConfig.isOpen}
        initialMode={modalConfig.mode}
        animal={modalConfig.animal}
        onClose={handleCloseModal}
        onSave={handleSaveAnimal}
      />
    </>
  );
}