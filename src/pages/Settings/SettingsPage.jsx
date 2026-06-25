import { useNavigate } from "react-router-dom";
import { CalendarDays, LogOut, Mail, Phone, Shield, UserRound } from "lucide-react";
import { logout } from "../../services/authService";
import styles from "./SettingsPage.module.css";

export default function SettingsPage() {
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/login", { replace: true });
  }

  const volunteerData = {
    nome: "Joandeson",
    perfil: "Administrador",
    instituicao: "UFAL",
    email: "joandeson@aluno.ufal.br",
    telefone: "(82) 99999-9999",
    ingresso: "15/03/2024",
    descricao:
      "Voluntário responsável pelo apoio nas ações do projeto, registro de informações dos animais e acompanhamento das ocorrências.",
    foto:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=500&q=80",
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
            <img
              src={volunteerData.foto}
              alt={volunteerData.nome}
              className={styles.profileImage}
            />

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
              <span className={styles.infoLabel}>Instituição</span>
              <span className={styles.infoValue}>{volunteerData.instituicao}</span>
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