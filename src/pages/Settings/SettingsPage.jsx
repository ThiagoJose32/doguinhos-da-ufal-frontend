import { useNavigate } from "react-router-dom";
import {
  CalendarDays,
  LogOut,
  Mail,
  Phone,
  Shield,
  UserRound,
} from "lucide-react";
import { getCurrentUser, logout } from "../../services/authService";
import styles from "./SettingsPage.module.css";

function formatDate(dateString) {
  if (!dateString) return "Não informado";

  const date = new Date(dateString);

  if (Number.isNaN(date.getTime())) {
    return "Não informado";
  }

  return date.toLocaleDateString("pt-BR");
}

export default function SettingsPage() {
  const navigate = useNavigate();
  const currentUser = getCurrentUser();

  function handleLogout() {
    logout();
    navigate("/login", { replace: true });
  }

  const volunteerData = {
    nome: currentUser?.nome || "Não informado",
    perfil: currentUser?.perfil || "Não informado",
    email: currentUser?.email || "Não informado",
    telefone: currentUser?.telefone || "Não informado",
    ingresso: formatDate(currentUser?.dataIngresso),
    descricao: currentUser?.descricao || "Sem descrição cadastrada.",
    foto: currentUser?.fotoUrl || "",
    curso: currentUser?.curso || "Não informado",
  };

  return (
    <section className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>Configurações</h1>
        <p className={styles.subtitle}>
          Gerencie informações da conta e preferências do sistema.
        </p>
      </div>

      <div className={styles.grid}>
        <article className={styles.card}>
          <div className={styles.cardHeader}>
            <div className={styles.iconBox}>
              <UserRound size={20} />
            </div>

            <div>
              <h2 className={styles.cardTitle}>Conta</h2>
              <p className={styles.cardText}>
                Informações básicas do usuário autenticado.
              </p>
            </div>
          </div>

          <div className={styles.profileBlock}>
            {volunteerData.foto ? (
              <img
                src={volunteerData.foto}
                alt={volunteerData.nome}
                className={styles.profileImage}
              />
            ) : (
              <div className={styles.profileFallback}>
                {volunteerData.nome.charAt(0).toUpperCase()}
              </div>
            )}

            <div className={styles.profileMainInfo}>
              <strong className={styles.profileName}>{volunteerData.nome}</strong>
              <span className={styles.profileRole}>{volunteerData.perfil}</span>
            </div>
          </div>

          <div className={styles.infoList}>
            <div className={styles.infoRow}>
              <span className={styles.infoLabel}>Nome</span>
              <span className={styles.infoValue}>{volunteerData.nome}</span>
            </div>

            <div className={styles.infoRow}>
              <span className={styles.infoLabel}>Perfil</span>
              <span className={styles.infoValue}>{volunteerData.perfil}</span>
            </div>

            <div className={styles.infoRow}>
              <span className={styles.infoLabel}>Curso</span>
              <span className={styles.infoValue}>{volunteerData.curso}</span>
            </div>

            <div className={styles.infoRow}>
              <span className={styles.infoLabel}>E-mail</span>
              <span className={styles.infoValueWithIcon}>
                <Mail size={16} />
                <span>{volunteerData.email}</span>
              </span>
            </div>

            <div className={styles.infoRow}>
              <span className={styles.infoLabel}>Telefone</span>
              <span className={styles.infoValueWithIcon}>
                <Phone size={16} />
                <span>{volunteerData.telefone}</span>
              </span>
            </div>

            <div className={styles.infoRow}>
              <span className={styles.infoLabel}>Ingresso no projeto</span>
              <span className={styles.infoValueWithIcon}>
                <CalendarDays size={16} />
                <span>{volunteerData.ingresso}</span>
              </span>
            </div>
          </div>

          <div className={styles.descriptionBox}>
            <span className={styles.descriptionLabel}>Descrição</span>
            <p className={styles.descriptionText}>{volunteerData.descricao}</p>
          </div>
        </article>

        <article className={styles.card}>
          <div className={styles.cardHeader}>
            <div className={styles.iconBox}>
              <Shield size={20} />
            </div>

            <div>
              <h2 className={styles.cardTitle}>Sessão</h2>
              <p className={styles.cardText}>
                Controle sua sessão atual no sistema.
              </p>
            </div>
          </div>

          <div className={styles.actions}>
            <button
              type="button"
              className={styles.logoutButton}
              onClick={handleLogout}
            >
              <LogOut size={18} />
              <span>Sair da conta</span>
            </button>
          </div>
        </article>
      </div>
    </section>
  );
}