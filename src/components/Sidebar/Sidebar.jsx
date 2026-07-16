import {
  ChevronUp,
  KeyRound,
  LogOut,
  PawPrint,
  Users,
} from "lucide-react";
import {
  useEffect,
  useRef,
  useState,
} from "react";
import {
  NavLink,
  useNavigate,
} from "react-router-dom";
import ChangePasswordModal from "../ChangePasswordModal/ChangePasswordModal";
import {
  AUTH_USER_UPDATED_EVENT,
  getCurrentUser,
  logout,
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

  return profiles[profile] || profile;
}

export default function Sidebar() {
  const navigate = useNavigate();
  const accountAreaRef = useRef(null);

  const [currentUser, setCurrentUser] =
    useState(() => getCurrentUser());

  const [
    accountMenuOpen,
    setAccountMenuOpen,
  ] = useState(false);

  const [
    passwordModalOpen,
    setPasswordModalOpen,
  ] = useState(false);

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
    function handleOutsideClick(event) {
      if (
        accountAreaRef.current &&
        !accountAreaRef.current.contains(
          event.target
        )
      ) {
        setAccountMenuOpen(false);
      }
    }

    document.addEventListener(
      "mousedown",
      handleOutsideClick
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleOutsideClick
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

  function handleOpenPassword() {
    setAccountMenuOpen(false);
    setPasswordModalOpen(true);
  }

  function handleLogout() {
    setAccountMenuOpen(false);

    logout();

    navigate("/login", {
      replace: true,
    });
  }

  function handlePasswordChanged() {
    setPasswordModalOpen(false);
  }

  return (
    <>
      <aside className={styles.sidebar}>
        <div className={styles.brand}>
          <div className={styles.brandIcon}>
            <PawPrint size={26} />
          </div>

          <div className={styles.brandText}>
            <strong
              className={styles.brandTitle}
            >
              Doguinhos
            </strong>

            <span
              className={styles.brandSubtitle}
            >
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
                    isActive
                      ? styles.active
                      : ""
                  }`
                }
              >
                <Icon size={21} />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        <div
          className={styles.desktopFooter}
          ref={accountAreaRef}
        >
          <div className={styles.accountWrapper}>
            {accountMenuOpen && (
              <div
                className={styles.accountMenu}
                role="menu"
              >
                <div className={styles.menuHeader}>
                  Minha conta
                </div>

                <button
                  type="button"
                  className={styles.menuItem}
                  onClick={handleOpenPassword}
                  role="menuitem"
                >
                  <KeyRound size={18} />
                  <span>Alterar senha</span>
                </button>

                <div
                  className={styles.menuDivider}
                />

                <button
                  type="button"
                  className={`${styles.menuItem} ${styles.logoutMenuItem}`}
                  onClick={handleLogout}
                  role="menuitem"
                >
                  <LogOut size={18} />
                  <span>Sair da conta</span>
                </button>
              </div>
            )}

            <button
              type="button"
              className={styles.accountButton}
              onClick={() =>
                setAccountMenuOpen(
                  (currentValue) =>
                    !currentValue
                )
              }
              aria-haspopup="menu"
              aria-expanded={accountMenuOpen}
            >
              <div className={styles.userBlock}>
                {currentUser?.fotoUrl &&
                !photoError ? (
                  <img
                    src={currentUser.fotoUrl}
                    alt={
                      currentUser.nome ||
                      "Usuário"
                    }
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
                  <strong
                    className={styles.userName}
                  >
                    {currentUser?.nome ||
                      "Usuário"}
                  </strong>

                  <span
                    className={styles.userRole}
                  >
                    {formatProfile(
                      currentUser?.perfil
                    )}
                  </span>
                </div>
              </div>

              <ChevronUp
                size={19}
                className={`${styles.chevron} ${
                  accountMenuOpen
                    ? styles.chevronOpen
                    : ""
                }`}
              />
            </button>
          </div>
        </div>
      </aside>

      <ChangePasswordModal
        open={passwordModalOpen}
        onClose={() =>
          setPasswordModalOpen(false)
        }
        onSuccess={handlePasswordChanged}
      />
    </>
  );
}