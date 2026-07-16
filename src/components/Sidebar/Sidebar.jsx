import {
  PawPrint,
  Settings,
  Users,
} from "lucide-react";
import {
  useEffect,
  useState,
} from "react";
import { NavLink } from "react-router-dom";
import {
  AUTH_USER_UPDATED_EVENT,
  getCurrentUser,
} from "../../services/authService";
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

function formatProfile(profile) {
  const profiles = {
    ADMIN: "Administrador",
    ADMINISTRADOR: "Administrador",
    VOLUNTARIO: "Voluntário",
    USUARIO: "Usuário",
  };

  if (!profile) {
    return "Sem perfil";
  }

  if (profiles[profile]) {
    return profiles[profile];
  }

  return profile
    .toLowerCase()
    .replaceAll("_", " ")
    .replace(/(^|\s)\S/g, (letter) =>
      letter.toUpperCase()
    );
}

export default function Sidebar() {
  const [currentUser, setCurrentUser] =
    useState(() => getCurrentUser());

  const [photoError, setPhotoError] =
    useState(false);

  useEffect(() => {
    function handleUserUpdated(event) {
      setCurrentUser(
        event.detail || getCurrentUser()
      );
      setPhotoError(false);
    }

    function handleStorageChange(event) {
      if (
        event.key === "auth_user" ||
        event.key === "auth_token"
      ) {
        setCurrentUser(getCurrentUser());
        setPhotoError(false);
      }
    }

    window.addEventListener(
      AUTH_USER_UPDATED_EVENT,
      handleUserUpdated
    );

    window.addEventListener(
      "storage",
      handleStorageChange
    );

    return () => {
      window.removeEventListener(
        AUTH_USER_UPDATED_EVENT,
        handleUserUpdated
      );

      window.removeEventListener(
        "storage",
        handleStorageChange
      );
    };
  }, []);

  useEffect(() => {
    setPhotoError(false);
  }, [currentUser?.fotoUrl]);

  const initial =
    currentUser?.nome
      ?.trim()
      ?.charAt(0)
      ?.toUpperCase() || "U";

  return (
    <aside className={styles.sidebar}>
      <div className={styles.brand}>
        <div className={styles.brandIcon}>
          <PawPrint size={26} />
        </div>

        <div className={styles.brandText}>
          <strong className={styles.brandTitle}>
            Doguinhos
          </strong>

          <span className={styles.brandSubtitle}>
            da UFAL
          </span>
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
                `${styles.link} ${
                  isActive ? styles.active : ""
                }`
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
          {currentUser?.fotoUrl && !photoError ? (
            <img
              src={currentUser.fotoUrl}
              alt={currentUser.nome || "Usuário"}
              className={styles.avatarImage}
              onError={() =>
                setPhotoError(true)
              }
            />
          ) : (
            <div className={styles.avatar}>
              {initial}
            </div>
          )}

          <div className={styles.userText}>
            <strong className={styles.userName}>
              {currentUser?.nome || "Usuário"}
            </strong>

            <span className={styles.userRole}>
              {formatProfile(
                currentUser?.perfil
              )}
            </span>
          </div>
        </div>
      </div>
    </aside>
  );
}