import {
  CalendarDays,
  LogOut,
  Mail,
  Pencil,
  Phone,
  Shield,
  UserRound,
} from "lucide-react";
import {
  useEffect,
  useState,
} from "react";
import { useNavigate } from "react-router-dom";
import UserModal from "../../components/UserModal/UserModal";
import {
  getCurrentUser,
  logout,
} from "../../services/authService";
import {
  getAuthenticatedUser,
} from "../../services/userService";
import styles from "./SettingsPage.module.css";

function formatDate(dateString) {
  if (!dateString) {
    return "Não informado";
  }

  const match = String(dateString).match(
    /^(\d{4})-(\d{2})-(\d{2})/
  );

  if (!match) {
    return "Não informado";
  }

  return `${match[3]}/${match[2]}/${match[1]}`;
}

function formatProfile(profile) {
  const profiles = {
    ADMIN: "Administrador",
    VOLUNTARIO: "Voluntário",
  };

  if (!profile) {
    return "Não informado";
  }

  return profiles[profile] || profile;
}

function getErrorMessage(error) {
  if (error.response?.status === 403) {
    return "Você não possui permissão para consultar essas informações.";
  }

  if (error.response?.data?.message) {
    return error.response.data.message;
  }

  if (error.response?.data?.detail) {
    return error.response.data.detail;
  }

  return "Não foi possível carregar os dados atualizados do usuário.";
}

export default function SettingsPage() {
  const navigate = useNavigate();

  const [user, setUser] = useState(
    getCurrentUser()
  );
  const [loading, setLoading] =
    useState(true);
  const [loadError, setLoadError] =
    useState("");
  const [
    successMessage,
    setSuccessMessage,
  ] = useState("");
  const [modalOpen, setModalOpen] =
    useState(false);
  const [photoError, setPhotoError] =
    useState(false);

  useEffect(() => {
    let cancelled = false;

    async function loadUser() {
      setLoading(true);
      setLoadError("");

      try {
        const authenticatedUser =
          await getAuthenticatedUser();

        if (!cancelled) {
          setUser(authenticatedUser);
          setPhotoError(false);
        }
      } catch (error) {
        console.error(
          "Erro ao carregar usuário:",
          error
        );

        if (!cancelled) {
          setLoadError(
            getErrorMessage(error)
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadUser();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    setPhotoError(false);
  }, [user?.fotoUrl]);

  function handleLogout() {
    logout();

    navigate("/login", {
      replace: true,
    });
  }

  function handleUserSaved(updatedUser) {
    setUser(updatedUser);
    setPhotoError(false);
    setModalOpen(false);

    setSuccessMessage(
      "Informações atualizadas com sucesso."
    );

    window.setTimeout(() => {
      setSuccessMessage("");
    }, 4000);
  }

  const volunteerData = {
    nome: user?.nome || "Não informado",
    perfil: formatProfile(user?.perfil),
    email: user?.email || "Não informado",
    telefone:
      user?.telefone || "Não informado",
    ingresso: formatDate(
      user?.dataIngresso
    ),
    descricao:
      user?.descricao ||
      "Sem descrição cadastrada.",
    foto: user?.fotoUrl || "",
    curso: user?.curso || "Não informado",
  };

  const initial =
    volunteerData.nome
      .trim()
      .charAt(0)
      .toUpperCase() || "U";

  return (
    <section className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>
          Configurações
        </h1>

        <p className={styles.subtitle}>
          Gerencie informações da conta e
          preferências do sistema.
        </p>
      </div>

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

      {loadError && (
        <div
          className={styles.errorMessage}
          role="alert"
        >
          {loadError}
        </div>
      )}

      {loading && !user ? (
        <article className={styles.card}>
          <div
            className={styles.loadingBlock}
          >
            Carregando informações do
            usuário...
          </div>
        </article>
      ) : (
        <div className={styles.grid}>
          <article className={styles.card}>
            <div
              className={styles.cardTopRow}
            >
              <div
                className={
                  styles.cardHeader
                }
              >
                <div
                  className={
                    styles.iconBox
                  }
                >
                  <UserRound size={20} />
                </div>

                <div>
                  <h2
                    className={
                      styles.cardTitle
                    }
                  >
                    Conta
                  </h2>

                  <p
                    className={
                      styles.cardText
                    }
                  >
                    Informações básicas do
                    usuário autenticado.
                  </p>
                </div>
              </div>

              <button
                type="button"
                className={
                  styles.editButton
                }
                onClick={() =>
                  setModalOpen(true)
                }
                disabled={!user}
              >
                <Pencil size={17} />
                <span>
                  Editar informações
                </span>
              </button>
            </div>

            <div
              className={
                styles.profileBlock
              }
            >
              {volunteerData.foto &&
              !photoError ? (
                <img
                  src={
                    volunteerData.foto
                  }
                  alt={
                    volunteerData.nome
                  }
                  className={
                    styles.profileImage
                  }
                  onError={() =>
                    setPhotoError(true)
                  }
                />
              ) : (
                <div
                  className={
                    styles.profileFallback
                  }
                >
                  {initial}
                </div>
              )}

              <div
                className={
                  styles.profileMainInfo
                }
              >
                <strong
                  className={
                    styles.profileName
                  }
                >
                  {volunteerData.nome}
                </strong>

                <span
                  className={
                    styles.profileRole
                  }
                >
                  {volunteerData.perfil}
                </span>
              </div>
            </div>

            <div className={styles.infoList}>
              <div className={styles.infoRow}>
                <span
                  className={
                    styles.infoLabel
                  }
                >
                  Nome
                </span>

                <span
                  className={
                    styles.infoValue
                  }
                >
                  {volunteerData.nome}
                </span>
              </div>

              <div className={styles.infoRow}>
                <span
                  className={
                    styles.infoLabel
                  }
                >
                  Perfil
                </span>

                <span
                  className={
                    styles.infoValue
                  }
                >
                  {volunteerData.perfil}
                </span>
              </div>

              <div className={styles.infoRow}>
                <span
                  className={
                    styles.infoLabel
                  }
                >
                  Curso
                </span>

                <span
                  className={
                    styles.infoValue
                  }
                >
                  {volunteerData.curso}
                </span>
              </div>

              <div className={styles.infoRow}>
                <span
                  className={
                    styles.infoLabel
                  }
                >
                  E-mail
                </span>

                <span
                  className={
                    styles.infoValueWithIcon
                  }
                >
                  <Mail size={16} />

                  <span>
                    {volunteerData.email}
                  </span>
                </span>
              </div>

              <div className={styles.infoRow}>
                <span
                  className={
                    styles.infoLabel
                  }
                >
                  Telefone
                </span>

                <span
                  className={
                    styles.infoValueWithIcon
                  }
                >
                  <Phone size={16} />

                  <span>
                    {
                      volunteerData.telefone
                    }
                  </span>
                </span>
              </div>

              <div className={styles.infoRow}>
                <span
                  className={
                    styles.infoLabel
                  }
                >
                  Ingresso no projeto
                </span>

                <span
                  className={
                    styles.infoValueWithIcon
                  }
                >
                  <CalendarDays
                    size={16}
                  />

                  <span>
                    {
                      volunteerData.ingresso
                    }
                  </span>
                </span>
              </div>
            </div>

            <div
              className={
                styles.descriptionBox
              }
            >
              <span
                className={
                  styles.descriptionLabel
                }
              >
                Descrição
              </span>

              <p
                className={
                  styles.descriptionText
                }
              >
                {volunteerData.descricao}
              </p>
            </div>
          </article>

          <article className={styles.card}>
            <div
              className={styles.cardHeader}
            >
              <div
                className={styles.iconBox}
              >
                <Shield size={20} />
              </div>

              <div>
                <h2
                  className={
                    styles.cardTitle
                  }
                >
                  Sessão
                </h2>

                <p
                  className={
                    styles.cardText
                  }
                >
                  Controle sua sessão atual
                  no sistema.
                </p>
              </div>
            </div>

            <div className={styles.actions}>
              <button
                type="button"
                className={
                  styles.logoutButton
                }
                onClick={handleLogout}
              >
                <LogOut size={18} />
                <span>Sair da conta</span>
              </button>
            </div>
          </article>
        </div>
      )}

      <UserModal
        open={modalOpen}
        mode="edit"
        user={user}
        lockAccessFields
        canDelete={false}
        onClose={() =>
          setModalOpen(false)
        }
        onSaved={handleUserSaved}
      />
    </section>
  );
}