import { NavLink } from "react-router-dom";
import { Dog, HandCoins, Users, Settings } from "lucide-react";
import styles from "./Sidebar.module.css";

const navItems = [
  {
    label: "Animais",
    path: "/app/animals",
    icon: Dog,
  },
  {
    label: "Verba",
    path: "/app/finance",
    icon: HandCoins,
  },
  {
    label: "Voluntários",
    path: "/app/volunteers",
    icon: Users,
  },
  {
    label: "Configurações",
    path: "/app/settings",
    icon: Settings,
  },
];

export default function Sidebar() {
  return (
    <nav className={styles.container} aria-label="Navegação principal">
      <div className={styles.logoArea}>
        <div className={styles.logoIcon}>
          <img src="src\assets\Logo.svg" alt="UserPhoto"/>
        </div>
        <div className={styles.logoText}>
          <strong>Doguinhos</strong>
          <span>da UFAL</span>
        </div>
      </div>

      <div className={styles.navList}>
        {navItems.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `${styles.navItem} ${isActive ? styles.active : ""}`
              }
            >
              <Icon size={20} />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </div>

      <div className={styles.userArea}>
        <div className={styles.avatar}>
          <img
            src="../../assets/volunteers/vol-joandeson.jpg"
            alt="UserPhoto"
          />
        </div>

        <div className={styles.userInfo}>
          <strong>Joandeson</strong>
          <span>Administrador</span>
        </div>
      </div>
    </nav>
  );
}