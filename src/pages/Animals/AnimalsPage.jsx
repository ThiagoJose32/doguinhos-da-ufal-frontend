import { useEffect, useMemo, useState } from "react";
import { Funnel } from "lucide-react";

import PageHeader from "../../components/PageHeader/PageHeader";
import EntityCard from "../../components/EntityCard/EntityCard";
import AnimalModal from "../../components/AnimalModal/AnimalModal";

import {
  ANIMAL_STATUS_OPTIONS,
  createAnimal,
  deleteAnimal,
  downloadAdoptionTerm,
  getAnimalById,
  listAnimals,
  updateAnimal,
} from "../../services/animalService";

import styles from "../../styles/GridPage.module.css";

function getErrorMessage(error) {
  const responseData = error?.response?.data;

  if (typeof responseData === "string") {
    return responseData;
  }

  return (
    responseData?.message ||
    responseData?.detail ||
    error?.message ||
    "Não foi possível concluir a operação."
  );
}

export default function AnimalsPage() {
  const [animals, setAnimals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openingAnimalId, setOpeningAnimalId] = useState(null);
  const [pageError, setPageError] = useState("");

  const [animalType, setAnimalType] = useState("dog");

  const [selectedStatuses, setSelectedStatuses] = useState([
    ...ANIMAL_STATUS_OPTIONS,
  ]);

  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const [modalConfig, setModalConfig] = useState({
    isOpen: false,
    mode: "view",
    animal: null,
  });

  useEffect(() => {
    let active = true;

    async function loadAnimals() {
      setLoading(true);
      setPageError("");

      try {
        const animalsFromApi = await listAnimals();

        if (active) {
          setAnimals(animalsFromApi);
        }
      } catch (error) {
        if (active) {
          setPageError(getErrorMessage(error));
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadAnimals();

    return () => {
      active = false;
    };
  }, []);

  function handleNewItem() {
    setModalConfig({
      isOpen: true,
      mode: "create",
      animal: null,
    });
  }

  async function handleOpenAnimal(animal) {
    if (!animal?.id || openingAnimalId) {
      return;
    }

    setOpeningAnimalId(animal.id);
    setPageError("");

    try {
      const detailedAnimal = await getAnimalById(animal.id);

      setModalConfig({
        isOpen: true,
        mode: "view",
        animal: detailedAnimal,
      });
    } catch (error) {
      setPageError(
        `Não foi possível abrir o animal. ${getErrorMessage(error)}`
      );
    } finally {
      setOpeningAnimalId(null);
    }
  }

  function handleCloseModal() {
    setModalConfig({
      isOpen: false,
      mode: "view",
      animal: null,
    });
  }

  async function handleSaveAnimal(payload, mode) {
    if (mode === "create") {
      const createdAnimal = await createAnimal(payload);

      setAnimals((currentAnimals) => [
        createdAnimal,
        ...currentAnimals,
      ]);

      handleCloseModal();

      return createdAnimal;
    }

    if (mode === "edit") {
      const updatedAnimal = await updateAnimal(
        payload.id,
        payload
      );

      setAnimals((currentAnimals) =>
        currentAnimals.map((animal) =>
          animal.id === updatedAnimal.id
            ? updatedAnimal
            : animal
        )
      );

      setModalConfig({
        isOpen: true,
        mode: "view",
        animal: updatedAnimal,
      });

      return updatedAnimal;
    }

    return payload;
  }

  async function handleDeleteAnimal(animal) {
    await deleteAnimal(animal.id);

    setAnimals((currentAnimals) =>
      currentAnimals.filter(
        (currentAnimal) =>
          currentAnimal.id !== animal.id
      )
    );

    handleCloseModal();
  }

  async function handleOpenAdoptionTerm(animal) {
    await downloadAdoptionTerm(animal);
  }

  function toggleStatus(status) {
    setSelectedStatuses((currentStatuses) =>
      currentStatuses.includes(status)
        ? currentStatuses.filter(
            (currentStatus) =>
              currentStatus !== status
          )
        : [...currentStatuses, status]
    );
  }

  function toggleAllStatuses() {
    const allSelected =
      selectedStatuses.length ===
      ANIMAL_STATUS_OPTIONS.length;

    setSelectedStatuses(
      allSelected
        ? []
        : [...ANIMAL_STATUS_OPTIONS]
    );
  }

  const filteredAnimals = useMemo(() => {
    return animals.filter((animal) => {
      const matchesType =
        animal.especie === animalType;

      const matchesStatus =
        selectedStatuses.includes(animal.status);

      return matchesType && matchesStatus;
    });
  }, [animals, animalType, selectedStatuses]);

  const allStatusesSelected =
    selectedStatuses.length ===
    ANIMAL_STATUS_OPTIONS.length;

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
                animalType === "dog"
                  ? styles.activeTab
                  : ""
              }`}
              onClick={() => setAnimalType("dog")}
            >
              Dogs
            </button>

            <button
              type="button"
              className={`${styles.tabButton} ${
                animalType === "cat"
                  ? styles.activeTab
                  : ""
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
              onClick={() =>
                setIsFilterOpen((current) => !current)
              }
            >
              <Funnel size={18} />

              <span className={styles.filterButtonText}>
                Filtros
              </span>
            </button>

            {isFilterOpen && (
              <div className={styles.filterPanel}>
                <button
                  type="button"
                  className={styles.filterOption}
                  onClick={toggleAllStatuses}
                >
                  <input
                    type="checkbox"
                    checked={allStatusesSelected}
                    readOnly
                  />

                  <span>Todos</span>
                </button>

                {ANIMAL_STATUS_OPTIONS.map(
                  (status) => (
                    <button
                      key={status}
                      type="button"
                      className={styles.filterOption}
                      onClick={() =>
                        toggleStatus(status)
                      }
                    >
                      <input
                        type="checkbox"
                        checked={selectedStatuses.includes(
                          status
                        )}
                        readOnly
                      />

                      <span>{status}</span>
                    </button>
                  )
                )}
              </div>
            )}
          </div>
        </div>

        <div className={styles.content}>
          {loading && (
            <p>Carregando animais...</p>
          )}

          {!loading && pageError && (
            <p>{pageError}</p>
          )}

          {!loading &&
            !pageError &&
            filteredAnimals.length === 0 && (
              <p>
                Nenhum animal encontrado para os
                filtros selecionados.
              </p>
            )}

          {!loading &&
            filteredAnimals.length > 0 && (
              <div className={styles.cardsArea}>
                {filteredAnimals.map((animal) => (
                  <EntityCard
                    key={animal.id}
                    image={animal.imagem}
                    title={animal.nome}
                    subtitle={
                      openingAnimalId === animal.id
                        ? "Carregando informações..."
                        : `${animal.sexo} - ${animal.idade}`
                    }
                    status={animal.status}
                    onClick={() =>
                      handleOpenAnimal(animal)
                    }
                  />
                ))}
              </div>
            )}
        </div>
      </section>

      <AnimalModal
        isOpen={modalConfig.isOpen}
        initialMode={modalConfig.mode}
        animal={modalConfig.animal}
        onClose={handleCloseModal}
        onSave={handleSaveAnimal}
        onDelete={handleDeleteAnimal}
        onOpenAdoptionTerm={
          handleOpenAdoptionTerm
        }
      />
    </>
  );
}