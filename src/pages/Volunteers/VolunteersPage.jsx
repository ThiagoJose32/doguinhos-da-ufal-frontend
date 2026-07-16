import { Funnel } from "lucide-react";
import {
  useEffect,
  useMemo,
  useState,
} from "react";
import EntityCard from "../../components/EntityCard/EntityCard";
import PageHeader from "../../components/PageHeader/PageHeader";
import UserModal from "../../components/UserModal/UserModal";
import {
  getCurrentUser,
} from "../../services/authService";
import {
  getUserById,
  listUsers,
} from "../../services/userService";
import styles from "../../styles/GridPage.module.css";

const statusOptions = ["Ativo", "Inativo"];

function getUserStatus(user) {
  return user.ativo ? "Ativo" : "Inativo";
}

function isAdministrator(user) {
  const profile = String(
    user?.perfil || ""
  ).toUpperCase();

  return [
    "ADMIN",
    "ADMINISTRADOR",
  ].includes(profile);
}

function formatProfile(profile) {
  const profiles = {
    ADMIN: "Administrador",
    ADMINISTRADOR: "Administrador",
    VOLUNTARIO: "Voluntário",
    USUARIO: "Usuário",
  };

  return (
    profiles[profile] ||
    profile ||
    "Usuário"
  );
}

function getUserSubtitle(user) {
  const profile = formatProfile(
    user.perfil
  );

  if (user.curso) {
    return `${profile} - ${user.curso}`;
  }

  return profile;
}

function getErrorMessage(error) {
  if (error.response?.status === 403) {
    return "Você não possui permissão para realizar esta operação.";
  }

  if (error.response?.data?.message) {
    return error.response.data.message;
  }

  if (error.response?.data?.detail) {
    return error.response.data.detail;
  }

  return "Não foi possível carregar os voluntários.";
}

export default function VolunteersPage() {
  const authenticatedUser =
    getCurrentUser();

  const administrator =
    isAdministrator(authenticatedUser);

  const [users, setUsers] = useState([]);

  const [
    volunteerStatus,
    setVolunteerStatus,
  ] = useState("Ativo");

  const [
    selectedStatuses,
    setSelectedStatuses,
  ] = useState([...statusOptions]);

  const [
    isFilterOpen,
    setIsFilterOpen,
  ] = useState(false);

  const [loading, setLoading] =
    useState(true);

  const [
    loadingDetails,
    setLoadingDetails,
  ] = useState(false);

  const [error, setError] =
    useState("");

  const [
    successMessage,
    setSuccessMessage,
  ] = useState("");

  const [
    modalOpen,
    setModalOpen,
  ] = useState(false);

  const [
    modalMode,
    setModalMode,
  ] = useState("view");

  const [
    selectedUser,
    setSelectedUser,
  ] = useState(null);

  useEffect(() => {
    loadUsers();
  }, []);

  async function loadUsers() {
    setLoading(true);
    setError("");

    try {
      const loadedUsers =
        await listUsers();

      setUsers(loadedUsers);
    } catch (loadError) {
      console.error(
        "Erro ao carregar usuários:",
        loadError
      );

      setError(
        getErrorMessage(loadError)
      );
    } finally {
      setLoading(false);
    }
  }

  function showSuccessMessage(message) {
    setSuccessMessage(message);

    window.setTimeout(() => {
      setSuccessMessage("");
    }, 4000);
  }

  function handleNewItem() {
    if (!administrator) {
      setError(
        "Apenas administradores podem cadastrar voluntários."
      );

      return;
    }

    setSelectedUser(null);
    setModalMode("create");
    setModalOpen(true);
    setError("");
  }

  async function handleOpenUser(user) {
    setLoadingDetails(true);
    setError("");

    try {
      const detailedUser =
        await getUserById(user.id);

      setSelectedUser(detailedUser);
      setModalMode("view");
      setModalOpen(true);
    } catch (detailsError) {
      console.error(
        "Erro ao carregar detalhes do usuário:",
        detailsError
      );

      setError(
        getErrorMessage(detailsError)
      );
    } finally {
      setLoadingDetails(false);
    }
  }

  function handleCloseModal() {
    setModalOpen(false);
    setSelectedUser(null);
    setModalMode("view");
  }

  function handleEditUser() {
    if (!administrator) {
      setError(
        "Apenas administradores podem editar voluntários."
      );

      handleCloseModal();
      return;
    }

    setModalMode("edit");
  }

  function handleUserSaved(
    savedUser,
    savedMode
  ) {
    if (!administrator) {
      handleCloseModal();
      return;
    }

    setUsers((currentUsers) => {
      const alreadyExists =
        currentUsers.some(
          (user) =>
            user.id === savedUser.id
        );

      const updatedUsers =
        alreadyExists
          ? currentUsers.map((user) =>
              user.id === savedUser.id
                ? savedUser
                : user
            )
          : [
              ...currentUsers,
              savedUser,
            ];

      return updatedUsers.sort(
        (
          firstUser,
          secondUser
        ) =>
          (
            firstUser.nome || ""
          ).localeCompare(
            secondUser.nome || "",
            "pt-BR"
          )
      );
    });

    handleCloseModal();

    showSuccessMessage(
      savedMode === "create"
        ? "Voluntário cadastrado com sucesso."
        : "Voluntário atualizado com sucesso."
    );
  }

  function handleUserDeleted(
    deletedUser
  ) {
    if (!administrator) {
      handleCloseModal();
      return;
    }

    setUsers((currentUsers) =>
      currentUsers.filter(
        (user) =>
          user.id !== deletedUser.id
      )
    );

    handleCloseModal();

    showSuccessMessage(
      "Voluntário excluído com sucesso."
    );
  }

  function toggleStatus(status) {
    setSelectedStatuses(
      (currentStatuses) =>
        currentStatuses.includes(status)
          ? currentStatuses.filter(
              (item) =>
                item !== status
            )
          : [
              ...currentStatuses,
              status,
            ]
    );
  }

  function toggleAllStatuses() {
    const allSelected =
      selectedStatuses.length ===
      statusOptions.length;

    setSelectedStatuses(
      allSelected
        ? []
        : [...statusOptions]
    );
  }

  const filteredVolunteers =
    useMemo(() => {
      return users.filter((user) => {
        const status =
          getUserStatus(user);

        const matchesTab =
          status === volunteerStatus;

        const matchesStatus =
          selectedStatuses.includes(
            status
          );

        return (
          matchesTab &&
          matchesStatus
        );
      });
    }, [
      users,
      volunteerStatus,
      selectedStatuses,
    ]);

  const allStatusesSelected =
    selectedStatuses.length ===
    statusOptions.length;

  const isAuthenticatedUser =
    selectedUser?.id &&
    String(selectedUser.id) ===
      String(authenticatedUser?.id);

  const canDeleteSelectedUser =
    administrator &&
    selectedUser?.id &&
    !isAuthenticatedUser;

  return (
    <section className={styles.page}>
      {administrator ? (
        <PageHeader
          title="Voluntários"
          buttonLabel="Novo voluntário"
          onButtonClick={
            handleNewItem
          }
        />
      ) : (
        <PageHeader
          title="Voluntários"
        />
      )}

      {successMessage && (
        <div
          className={
            styles.successMessage
          }
          role="status"
        >
          {successMessage}
        </div>
      )}

      {error && (
        <div
          className={
            styles.errorState
          }
          role="alert"
        >
          <span>{error}</span>

          <button
            type="button"
            className={
              styles.retryButton
            }
            onClick={loadUsers}
          >
            Tentar novamente
          </button>
        </div>
      )}

      <div className={styles.toolbar}>
        <div className={styles.tabs}>
          <button
            type="button"
            className={`${
              styles.tabButton
            } ${
              volunteerStatus ===
              "Ativo"
                ? styles.activeTab
                : ""
            }`}
            onClick={() =>
              setVolunteerStatus(
                "Ativo"
              )
            }
          >
            Ativos
          </button>

          <button
            type="button"
            className={`${
              styles.tabButton
            } ${
              volunteerStatus ===
              "Inativo"
                ? styles.activeTab
                : ""
            }`}
            onClick={() =>
              setVolunteerStatus(
                "Inativo"
              )
            }
          >
            Inativos
          </button>
        </div>

        <div
          className={
            styles.toolbarRight
          }
        >
          <button
            type="button"
            className={
              styles.filterButton
            }
            onClick={() =>
              setIsFilterOpen(
                (currentValue) =>
                  !currentValue
              )
            }
            aria-expanded={
              isFilterOpen
            }
          >
            <Funnel size={18} />

            <span
              className={
                styles.filterButtonText
              }
            >
              Filtros
            </span>
          </button>

          {isFilterOpen && (
            <div
              className={
                styles.filterPanel
              }
            >
              <button
                type="button"
                className={
                  styles.filterOption
                }
                onClick={
                  toggleAllStatuses
                }
              >
                <input
                  type="checkbox"
                  checked={
                    allStatusesSelected
                  }
                  readOnly
                />

                <span>Todos</span>
              </button>

              {statusOptions.map(
                (status) => (
                  <button
                    key={status}
                    type="button"
                    className={
                      styles.filterOption
                    }
                    onClick={() =>
                      toggleStatus(
                        status
                      )
                    }
                  >
                    <input
                      type="checkbox"
                      checked={selectedStatuses.includes(
                        status
                      )}
                      readOnly
                    />

                    <span>
                      {status}
                    </span>
                  </button>
                )
              )}
            </div>
          )}
        </div>
      </div>

      <div className={styles.content}>
        {loading ? (
          <div
            className={
              styles.loadingState
            }
          >
            Carregando voluntários...
          </div>
        ) : loadingDetails ? (
          <div
            className={
              styles.loadingState
            }
          >
            Carregando detalhes do
            voluntário...
          </div>
        ) : filteredVolunteers.length ===
          0 ? (
          <div
            className={
              styles.emptyState
            }
          >
            Nenhum voluntário
            encontrado para os
            filtros selecionados.
          </div>
        ) : (
          <div
            className={
              styles.cardsArea
            }
          >
            {filteredVolunteers.map(
              (volunteer) => (
                <EntityCard
                  key={volunteer.id}
                  image={
                    volunteer.fotoUrl
                  }
                  title={
                    volunteer.nome
                  }
                  subtitle={getUserSubtitle(
                    volunteer
                  )}
                  status={getUserStatus(
                    volunteer
                  )}
                  onClick={() =>
                    handleOpenUser(
                      volunteer
                    )
                  }
                />
              )
            )}
          </div>
        )}
      </div>

      <UserModal
        open={modalOpen}
        mode={
          administrator
            ? modalMode
            : "view"
        }
        user={selectedUser}
        canDelete={Boolean(
          canDeleteSelectedUser
        )}
        onClose={
          handleCloseModal
        }
        onEdit={
          administrator
            ? handleEditUser
            : undefined
        }
        onSaved={
          administrator
            ? handleUserSaved
            : undefined
        }
        onDeleted={
          administrator
            ? handleUserDeleted
            : undefined
        }
      />
    </section>
  );
}