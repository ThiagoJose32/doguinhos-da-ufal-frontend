import {
  Eye,
  EyeOff,
  KeyRound,
  Save,
  X,
} from "lucide-react";
import {
  useEffect,
  useState,
} from "react";
import { updateAuthenticatedPassword } from "../../services/userService";
import styles from "./ChangePasswordModal.module.css";

function getErrorMessage(error) {
  const responseData = error.response?.data;

  if (typeof responseData === "string") {
    return responseData;
  }

  if (responseData?.detail) {
    return responseData.detail;
  }

  if (responseData?.message) {
    return responseData.message;
  }

  if (error.response?.status === 400) {
    return "Não foi possível alterar a senha. Verifique a senha atual.";
  }

  return "Não foi possível alterar a senha. Tente novamente.";
}

export default function ChangePasswordModal({
  open,
  onClose,
  onSuccess,
}) {
  const [senhaAtual, setSenhaAtual] =
    useState("");
  const [novaSenha, setNovaSenha] =
    useState("");
  const [
    confirmarNovaSenha,
    setConfirmarNovaSenha,
  ] = useState("");

  const [
    mostrarSenhaAtual,
    setMostrarSenhaAtual,
  ] = useState(false);
  const [
    mostrarNovaSenha,
    setMostrarNovaSenha,
  ] = useState(false);
  const [
    mostrarConfirmacao,
    setMostrarConfirmacao,
  ] = useState(false);

  const [saving, setSaving] =
    useState(false);
  const [error, setError] =
    useState("");

  useEffect(() => {
    if (!open) {
      return;
    }

    setSenhaAtual("");
    setNovaSenha("");
    setConfirmarNovaSenha("");

    setMostrarSenhaAtual(false);
    setMostrarNovaSenha(false);
    setMostrarConfirmacao(false);

    setSaving(false);
    setError("");
  }, [open]);

  useEffect(() => {
    if (!open) {
      return undefined;
    }

    const previousOverflow =
      document.body.style.overflow;

    document.body.style.overflow = "hidden";

    function handleEscape(event) {
      if (
        event.key === "Escape" &&
        !saving
      ) {
        onClose();
      }
    }

    document.addEventListener(
      "keydown",
      handleEscape
    );

    return () => {
      document.body.style.overflow =
        previousOverflow;

      document.removeEventListener(
        "keydown",
        handleEscape
      );
    };
  }, [open, saving, onClose]);

  if (!open) {
    return null;
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    if (!senhaAtual) {
      setError("Informe a senha atual.");
      return;
    }

    if (!novaSenha) {
      setError("Informe a nova senha.");
      return;
    }

    if (novaSenha.length < 6) {
      setError(
        "A nova senha deve possuir pelo menos 6 caracteres."
      );

      return;
    }

    if (novaSenha !== confirmarNovaSenha) {
      setError(
        "A nova senha e a confirmação não coincidem."
      );

      return;
    }

    if (senhaAtual === novaSenha) {
      setError(
        "A nova senha deve ser diferente da senha atual."
      );

      return;
    }

    setSaving(true);

    try {
      await updateAuthenticatedPassword(
        senhaAtual,
        novaSenha
      );

      onSuccess?.();
    } catch (submitError) {
      console.error(
        "Erro ao alterar senha:",
        submitError
      );

      setError(
        getErrorMessage(submitError)
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <div
      className={styles.backdrop}
      onMouseDown={(event) => {
        if (
          event.target === event.currentTarget &&
          !saving
        ) {
          onClose();
        }
      }}
    >
      <section
        className={styles.modal}
        role="dialog"
        aria-modal="true"
        aria-labelledby="change-password-title"
      >
        <div className={styles.header}>
          <div className={styles.headerContent}>
            <div className={styles.headerIcon}>
              <KeyRound size={22} />
            </div>

            <div>
              <h2
                id="change-password-title"
                className={styles.title}
              >
                Alterar senha
              </h2>

              <p className={styles.subtitle}>
                Confirme sua senha atual e defina
                uma nova senha de acesso.
              </p>
            </div>
          </div>

          <button
            type="button"
            className={styles.closeButton}
            onClick={onClose}
            disabled={saving}
            aria-label="Fechar modal"
          >
            <X size={21} />
          </button>
        </div>

        <form
          className={styles.form}
          onSubmit={handleSubmit}
        >
          <div className={styles.content}>
            <div className={styles.field}>
              <label
                htmlFor="current-password"
                className={styles.label}
              >
                Senha atual
              </label>

              <div className={styles.passwordField}>
                <input
                  id="current-password"
                  type={
                    mostrarSenhaAtual
                      ? "text"
                      : "password"
                  }
                  className={styles.input}
                  value={senhaAtual}
                  onChange={(event) =>
                    setSenhaAtual(
                      event.target.value
                    )
                  }
                  maxLength={255}
                  autoComplete="current-password"
                  disabled={saving}
                  required
                  autoFocus
                />

                <button
                  type="button"
                  className={styles.visibilityButton}
                  onClick={() =>
                    setMostrarSenhaAtual(
                      (currentValue) =>
                        !currentValue
                    )
                  }
                  disabled={saving}
                  aria-label={
                    mostrarSenhaAtual
                      ? "Ocultar senha atual"
                      : "Mostrar senha atual"
                  }
                >
                  {mostrarSenhaAtual ? (
                    <EyeOff size={19} />
                  ) : (
                    <Eye size={19} />
                  )}
                </button>
              </div>
            </div>

            <div className={styles.field}>
              <label
                htmlFor="new-password"
                className={styles.label}
              >
                Nova senha
              </label>

              <div className={styles.passwordField}>
                <input
                  id="new-password"
                  type={
                    mostrarNovaSenha
                      ? "text"
                      : "password"
                  }
                  className={styles.input}
                  value={novaSenha}
                  onChange={(event) =>
                    setNovaSenha(
                      event.target.value
                    )
                  }
                  minLength={6}
                  maxLength={255}
                  autoComplete="new-password"
                  disabled={saving}
                  required
                />

                <button
                  type="button"
                  className={styles.visibilityButton}
                  onClick={() =>
                    setMostrarNovaSenha(
                      (currentValue) =>
                        !currentValue
                    )
                  }
                  disabled={saving}
                  aria-label={
                    mostrarNovaSenha
                      ? "Ocultar nova senha"
                      : "Mostrar nova senha"
                  }
                >
                  {mostrarNovaSenha ? (
                    <EyeOff size={19} />
                  ) : (
                    <Eye size={19} />
                  )}
                </button>
              </div>
            </div>

            <div className={styles.field}>
              <label
                htmlFor="confirm-new-password"
                className={styles.label}
              >
                Confirmar nova senha
              </label>

              <div className={styles.passwordField}>
                <input
                  id="confirm-new-password"
                  type={
                    mostrarConfirmacao
                      ? "text"
                      : "password"
                  }
                  className={styles.input}
                  value={confirmarNovaSenha}
                  onChange={(event) =>
                    setConfirmarNovaSenha(
                      event.target.value
                    )
                  }
                  minLength={6}
                  maxLength={255}
                  autoComplete="new-password"
                  disabled={saving}
                  required
                />

                <button
                  type="button"
                  className={styles.visibilityButton}
                  onClick={() =>
                    setMostrarConfirmacao(
                      (currentValue) =>
                        !currentValue
                    )
                  }
                  disabled={saving}
                  aria-label={
                    mostrarConfirmacao
                      ? "Ocultar confirmação"
                      : "Mostrar confirmação"
                  }
                >
                  {mostrarConfirmacao ? (
                    <EyeOff size={19} />
                  ) : (
                    <Eye size={19} />
                  )}
                </button>
              </div>
            </div>

            <p className={styles.hint}>
              A nova senha deve possuir pelo menos
              6 caracteres.
            </p>

            {error && (
              <div
                className={styles.errorMessage}
                role="alert"
              >
                {error}
              </div>
            )}
          </div>

          <div className={styles.footer}>
            <button
              type="button"
              className={styles.cancelButton}
              onClick={onClose}
              disabled={saving}
            >
              Cancelar
            </button>

            <button
              type="submit"
              className={styles.saveButton}
              disabled={saving}
            >
              <Save size={18} />

              <span>
                {saving
                  ? "Alterando..."
                  : "Alterar senha"}
              </span>
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}