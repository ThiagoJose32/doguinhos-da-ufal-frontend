import { NavLink } from "react-router-dom";
import { PawPrint, Settings, Users } from "lucide-react";
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
          <div className={styles.avatar}>J</div>

          <div className={styles.userText}>
            <strong className={styles.userName}>Joandeson</strong>
            <span className={styles.userRole}>Administrador</span>
          </div>
        </div>
      </div>
    </aside>
  );
}