import { NavLink } from "react-router-dom";
import { PawPrint, Settings, Users } from "lucide-react";
import { getCurrentUser } from "../../services/authService";
import styles from "./Sidebar.module.css";

const menuItems = [
  {
    to: "/app/animals",
    label: "Animais",
    icon: PawPrint,
  },
  {
    to: "/app/volunteers",
    label: "Voluntários",
    icon: Users,
  },
  {
    to: "/app/settings",
    label: "Configurações",
    icon: Settings,
  },
];

export default function Sidebar() {
  const currentUser = getCurrentUser();

  const initial =
    currentUser?.nome?.trim()?.charAt(0)?.toUpperCase() || "U";

  return (
    <aside className={styles.sidebar}>
      <div className={styles.brand}>
        <div className={styles.brandIcon}>
          <PawPrint size={26} />
        </div>

        <div className={styles.brandText}>
          <strong className={styles.brandTitle}>Doguinhos</strong>
          <span className={styles.brandSubtitle}>da UFAL</span>
        </div>
      </div>

      <nav className={styles.nav}>
        {menuItems.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `${styles.link} ${isActive ? styles.active : ""}`
              }
            >
              <Icon size={20} />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </nav>

      <div className={styles.desktopFooter}>
        <div className={styles.userBlock}>
          {currentUser?.fotoUrl ? (
            <img
              src={currentUser.fotoUrl}
              alt={currentUser.nome}
              className={styles.avatarImage}
            />
          ) : (
            <div className={styles.avatar}>{initial}</div>
          )}

          <div className={styles.userText}>
            <strong className={styles.userName}>
              {currentUser?.nome || "Usuário"}
            </strong>
            <span className={styles.userRole}>
              {currentUser?.perfil || "Sem perfil"}
            </span>
          </div>
        </div>
      </div>
    </aside>
  );
}