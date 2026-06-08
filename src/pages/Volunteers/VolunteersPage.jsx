import { useMemo, useState } from "react";
import { Funnel } from "lucide-react";
import PageHeader from "../../components/PageHeader/PageHeader";
import EntityCard from "../../components/EntityCard/EntityCard";
import mockVolunteers from "../../data/mockVolunteers";
import styles from "../../styles/GridPage.module.css";

const statusOptions = ["Ativo", "Inativo"];

export default function VolunteersPage() {
  const [volunteerStatus, setVolunteerStatus] = useState("Ativo");
  const [selectedStatuses, setSelectedStatuses] = useState([...statusOptions]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  function handleNewItem() {
    alert("Abrir cadastro de voluntário");
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

  const filteredVolunteers = useMemo(() => {
    return mockVolunteers.filter((volunteer) => {
      const matchesTab = volunteer.status === volunteerStatus;
      const matchesStatus = selectedStatuses.includes(volunteer.status);

      return matchesTab && matchesStatus;
    });
  }, [volunteerStatus, selectedStatuses]);

  const allStatusesSelected = selectedStatuses.length === statusOptions.length;

  return (
    <section className={styles.page}>
      <PageHeader
        title="Voluntários"
        buttonLabel="Novo item"
        onButtonClick={handleNewItem}
      />

      <div className={styles.toolbar}>
        <div className={styles.tabs}>
          <button
            type="button"
            className={`${styles.tabButton} ${
              volunteerStatus === "Ativo" ? styles.activeTab : ""
            }`}
            onClick={() => setVolunteerStatus("Ativo")}
          >
            Ativos
          </button>

          <button
            type="button"
            className={`${styles.tabButton} ${
              volunteerStatus === "Inativo" ? styles.activeTab : ""
            }`}
            onClick={() => setVolunteerStatus("Inativo")}
          >
            Inativos
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
          {filteredVolunteers.map((volunteer) => (
            <EntityCard
              key={volunteer.id}
              image={volunteer.imagem}
              title={volunteer.nome}
              subtitle={`${volunteer.universidade} - ${volunteer.curso}`}
              status={volunteer.status}
            />
          ))}
        </div>
      </div>
    </section>
  );
}