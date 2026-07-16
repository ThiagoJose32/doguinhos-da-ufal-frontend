import {
  Camera,
  KeyRound,
  Pencil,
  Save,
  Trash2,
  UserRound,
  X,
} from "lucide-react";
import {
  useEffect,
  useId,
  useRef,
  useState,
} from "react";
import {
  createUser,
  deleteUser,
  updateUser,
  USER_PROFILE_OPTIONS,
} from "../../services/userService";
import styles from "./UserModal.module.css";

const EMPTY_FORM = {
  nome: "",
  email: "",
  perfil: "VOLUNTARIO",
  ativo: true,
  descricao: "",
  telefone: "",
  dataIngresso: "",
  curso: "",
  senha: "",
  confirmarSenha: "",
  dataCriacao: "",
};

function toDateInputValue(value) {
  if (!value) {
    return "";
  }

  const match = String(value).match(
    /^(\d{4})-(\d{2})-(\d{2})/
  );

  if (!match) {
    return "";
  }

  return `${match[1]}-${match[2]}-${match[3]}`;
}

function formatDateTime(value) {
  if (!value) {
    return "Não informado";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Não informado";
  }

  return date.toLocaleString("pt-BR");
}

function formatProfile(profile) {
  const profileOption =
    USER_PROFILE_OPTIONS.find(
      (option) => option.value === profile
    );

  if (profileOption) {
    return profileOption.label;
  }

  if (!profile) {
    return "Não informado";
  }

  return profile
    .toLowerCase()
    .replaceAll("_", " ")
    .replace(/(^|\s)\S/g, (letter) =>
      letter.toUpperCase()
    );
}

function getInitialForm(user, mode) {
  if (mode === "create") {
    return {
      ...EMPTY_FORM,
    };
  }

  return {
    nome: user?.nome || "",
    email: user?.email || "",
    perfil: user?.perfil || "VOLUNTARIO",
    ativo:
      typeof user?.ativo === "boolean"
        ? user.ativo
        : true,
    descricao: user?.descricao || "",
    telefone: user?.telefone || "",
    dataIngresso: toDateInputValue(
      user?.dataIngresso
    ),
    curso: user?.curso || "",
    senha: "",
    confirmarSenha: "",
    dataCriacao: user?.dataCriacao || "",
  };
}

function getErrorMessage(error) {
  const responseData = error.response?.data;

  if (error.response?.status === 403) {
    return "Você não possui permissão para realizar esta operação.";
  }

  if (error.response?.status === 409) {
    return "Já existe um usuário cadastrado com esse e-mail.";
  }

  if (typeof responseData === "string") {
    return responseData;
  }

  if (responseData?.message) {
    return responseData.message;
  }

  if (responseData?.detail) {
    return responseData.detail;
  }

  if (Array.isArray(responseData?.errors)) {
    return responseData.errors
      .map(
        (item) =>
          item.defaultMessage ||
          item.message
      )
      .filter(Boolean)
      .join(" ");
  }

  if (
    responseData &&
    typeof responseData === "object"
  ) {
    const fieldMessages = Object.values(
      responseData
    ).filter(
      (value) => typeof value === "string"
    );

    if (fieldMessages.length > 0) {
      return fieldMessages.join(" ");
    }
  }

  return "Não foi possível concluir a operação. Tente novamente.";
}

function getModalContent(mode) {
  if (mode === "create") {
    return {
      title: "Novo voluntário",
      subtitle:
        "Cadastre um novo usuário para acessar o sistema.",
      saveLabel: "Cadastrar voluntário",
      savingLabel: "Cadastrando...",
    };
  }

  if (mode === "edit") {
    return {
      title: "Editar voluntário",
      subtitle:
        "Atualize as informações do usuário.",
      saveLabel: "Salvar alterações",
      savingLabel: "Salvando...",
    };
  }

  return {
    title: "Detalhes do voluntário",
    subtitle:
      "Consulte as informações cadastradas para este usuário.",
    saveLabel: "",
    savingLabel: "",
  };
}

export default function UserModal({
  open,
  mode = "view",
  user = null,
  lockAccessFields = false,
  canDelete = true,
  canManagePassword = false,
  titleOverride,
  subtitleOverride,
  saveAction,
  onClose,
  onSaved,
  onDeleted,
  onEdit,
}) {
  const fileInputId = useId();
  const objectUrlRef = useRef("");

  const [form, setForm] =
    useState(EMPTY_FORM);

  const [
    fotoArquivo,
    setFotoArquivo,
  ] = useState(null);

  const [
    fotoPreview,
    setFotoPreview,
  ] = useState("");

  const [
    previewError,
    setPreviewError,
  ] = useState(false);

  const [saving, setSaving] =
    useState(false);

  const [deleting, setDeleting] =
    useState(false);

  const [error, setError] =
    useState("");

  const isViewMode = mode === "view";
  const isCreateMode = mode === "create";
  const isEditMode = mode === "edit";
  const isBusy = saving || deleting;

  const showPasswordFields =
    isCreateMode ||
    (isEditMode && canManagePassword);

  const modalContent =
    getModalContent(mode);

  const modalTitle =
    titleOverride ||
    modalContent.title;

  const modalSubtitle =
    subtitleOverride ||
    modalContent.subtitle;

  useEffect(() => {
    if (!open) {
      return;
    }

    if (objectUrlRef.current) {
      URL.revokeObjectURL(
        objectUrlRef.current
      );

      objectUrlRef.current = "";
    }

    setForm(
      getInitialForm(user, mode)
    );

    setFotoArquivo(null);
    setFotoPreview(
      user?.fotoUrl || ""
    );
    setPreviewError(false);
    setSaving(false);
    setDeleting(false);
    setError("");
  }, [open, user, mode]);

  useEffect(() => {
    if (!open) {
      return undefined;
    }

    const previousOverflow =
      document.body.style.overflow;

    document.body.style.overflow =
      "hidden";

    function handleEscape(event) {
      if (
        event.key === "Escape" &&
        !isBusy
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
  }, [open, isBusy, onClose]);

  useEffect(() => {
    return () => {
      if (objectUrlRef.current) {
        URL.revokeObjectURL(
          objectUrlRef.current
        );
      }
    };
  }, []);

  if (!open) {
    return null;
  }

  if (!isCreateMode && !user) {
    return null;
  }

  const initial =
    form.nome
      .trim()
      .charAt(0)
      .toUpperCase() || "U";

  function handleFieldChange(event) {
    const {
      name,
      value,
      type,
      checked,
    } = event.target;

    setForm((currentForm) => ({
      ...currentForm,
      [name]:
        type === "checkbox"
          ? checked
          : value,
    }));
  }

  function handlePhotoChange(event) {
    const file =
      event.target.files?.[0];

    if (!file) {
      return;
    }

    if (
      !file.type.startsWith("image/")
    ) {
      setError(
        "Selecione um arquivo de imagem válido."
      );

      event.target.value = "";
      return;
    }

    if (objectUrlRef.current) {
      URL.revokeObjectURL(
        objectUrlRef.current
      );
    }

    const objectUrl =
      URL.createObjectURL(file);

    objectUrlRef.current =
      objectUrl;

    setFotoArquivo(file);
    setFotoPreview(objectUrl);
    setPreviewError(false);
    setError("");
  }

  function cancelNewPhoto() {
    if (objectUrlRef.current) {
      URL.revokeObjectURL(
        objectUrlRef.current
      );

      objectUrlRef.current = "";
    }

    setFotoArquivo(null);

    setFotoPreview(
      user?.fotoUrl || ""
    );

    setPreviewError(false);
  }

  function validateForm() {
    if (!form.nome.trim()) {
      return "Informe o nome do usuário.";
    }

    if (!form.email.trim()) {
      return "Informe o e-mail do usuário.";
    }

    if (!form.perfil) {
      return "Selecione o perfil do usuário.";
    }

    if (
      isCreateMode &&
      !form.senha
    ) {
      return "Informe uma senha para o novo usuário.";
    }

    if (
      showPasswordFields &&
      form.senha &&
      form.senha.length < 6
    ) {
      return "A senha deve possuir pelo menos 6 caracteres.";
    }

    if (
      showPasswordFields &&
      form.senha !==
        form.confirmarSenha
    ) {
      return "A senha e a confirmação não coincidem.";
    }

    return "";
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    const validationError =
      validateForm();

    if (validationError) {
      setError(validationError);
      return;
    }

    setSaving(true);

    try {
      const userPayload = {
        nome: form.nome,
        email: form.email,
        perfil: form.perfil,
        ativo: form.ativo,
        descricao: form.descricao,
        telefone: form.telefone,
        dataIngresso:
          form.dataIngresso,
        curso: form.curso,
        senha: showPasswordFields
          ? form.senha
          : "",
      };

      let savedUser;

      if (saveAction) {
        savedUser =
          await saveAction(
            userPayload,
            fotoArquivo,
            {
              mode,
              user,
            }
          );
      } else if (isCreateMode) {
        savedUser =
          await createUser(
            userPayload,
            fotoArquivo
          );
      } else {
        savedUser =
          await updateUser(
            user.id,
            userPayload,
            fotoArquivo
          );
      }

      onSaved?.(
        savedUser,
        mode
      );
    } catch (submitError) {
      console.error(
        "Erro ao salvar usuário:",
        submitError
      );

      setError(
        getErrorMessage(
          submitError
        )
      );
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (
      !user?.id ||
      !canDelete
    ) {
      return;
    }

    const confirmed =
      window.confirm(
        `Deseja realmente excluir o usuário "${user.nome}"? Esta ação não poderá ser desfeita.`
      );

    if (!confirmed) {
      return;
    }

    setDeleting(true);
    setError("");

    try {
      await deleteUser(user.id);

      onDeleted?.(user);
    } catch (deleteError) {
      console.error(
        "Erro ao excluir usuário:",
        deleteError
      );

      setError(
        getErrorMessage(
          deleteError
        )
      );
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div
      className={styles.backdrop}
      onMouseDown={(event) => {
        if (
          event.target ===
            event.currentTarget &&
          !isBusy
        ) {
          onClose();
        }
      }}
    >
      <section
        className={styles.modal}
        role="dialog"
        aria-modal="true"
        aria-labelledby="user-modal-title"
      >
        <div className={styles.header}>
          <div
            className={
              styles.headerContent
            }
          >
            <div
              className={
                styles.headerIcon
              }
            >
              <UserRound size={22} />
            </div>

            <div>
              <h2
                id="user-modal-title"
                className={
                  styles.title
                }
              >
                {modalTitle}
              </h2>

              <p
                className={
                  styles.subtitle
                }
              >
                {modalSubtitle}
              </p>
            </div>
          </div>

          <button
            type="button"
            className={
              styles.closeButton
            }
            onClick={onClose}
            disabled={isBusy}
            aria-label="Fechar modal"
          >
            <X size={21} />
          </button>
        </div>

        <form
          className={styles.form}
          onSubmit={handleSubmit}
        >
          <div
            className={
              styles.scrollArea
            }
          >
            <div
              className={
                styles.photoSection
              }
            >
              <div
                className={
                  styles.photoPreview
                }
              >
                {fotoPreview &&
                !previewError ? (
                  <img
                    src={fotoPreview}
                    alt={
                      form.nome ||
                      "Usuário"
                    }
                    className={
                      styles.photoImage
                    }
                    onError={() =>
                      setPreviewError(
                        true
                      )
                    }
                  />
                ) : (
                  <div
                    className={
                      styles.photoFallback
                    }
                  >
                    {initial}
                  </div>
                )}
              </div>

              <div
                className={
                  styles.photoActions
                }
              >
                <strong
                  className={
                    styles.photoName
                  }
                >
                  {form.nome ||
                    "Novo voluntário"}
                </strong>

                <span
                  className={
                    styles.photoProfile
                  }
                >
                  {formatProfile(
                    form.perfil
                  )}
                </span>

                {!isViewMode && (
                  <>
                    <label
                      htmlFor={
                        fileInputId
                      }
                      className={
                        styles.photoButton
                      }
                    >
                      <Camera size={17} />

                      <span>
                        Selecionar foto
                      </span>
                    </label>

                    <input
                      id={fileInputId}
                      type="file"
                      accept="image/*"
                      className={
                        styles.fileInput
                      }
                      onChange={
                        handlePhotoChange
                      }
                      disabled={isBusy}
                    />

                    {fotoArquivo && (
                      <button
                        type="button"
                        className={
                          styles.cancelPhotoButton
                        }
                        onClick={
                          cancelNewPhoto
                        }
                        disabled={isBusy}
                      >
                        Cancelar nova foto
                      </button>
                    )}

                    <span
                      className={
                        styles.photoHint
                      }
                    >
                      Selecione uma imagem
                      JPG, PNG ou outro
                      formato de imagem.
                    </span>
                  </>
                )}
              </div>
            </div>

            <div
              className={
                styles.fieldsGrid
              }
            >
              <div className={styles.field}>
                <label
                  htmlFor="user-name"
                  className={styles.label}
                >
                  Nome
                </label>

                <input
                  id="user-name"
                  name="nome"
                  type="text"
                  className={styles.input}
                  value={form.nome}
                  onChange={
                    handleFieldChange
                  }
                  maxLength={120}
                  required
                  disabled={
                    isViewMode ||
                    isBusy
                  }
                />
              </div>

              <div className={styles.field}>
                <label
                  htmlFor="user-email"
                  className={styles.label}
                >
                  E-mail
                </label>

                <input
                  id="user-email"
                  name="email"
                  type="email"
                  className={`${styles.input} ${
                    isViewMode ||
                    lockAccessFields
                      ? styles.readOnlyInput
                      : ""
                  }`}
                  value={form.email}
                  onChange={
                    handleFieldChange
                  }
                  maxLength={150}
                  required
                  readOnly={
                    isViewMode ||
                    lockAccessFields
                  }
                  disabled={isBusy}
                />

                {lockAccessFields &&
                  !isViewMode && (
                    <span
                      className={
                        styles.fieldHint
                      }
                    >
                      O e-mail não pode ser
                      alterado nesta tela.
                    </span>
                  )}
              </div>

              <div className={styles.field}>
                <label
                  htmlFor="user-profile"
                  className={styles.label}
                >
                  Perfil
                </label>

                <select
                  id="user-profile"
                  name="perfil"
                  className={`${styles.input} ${
                    isViewMode ||
                    lockAccessFields
                      ? styles.readOnlyInput
                      : ""
                  }`}
                  value={form.perfil}
                  onChange={
                    handleFieldChange
                  }
                  disabled={
                    isViewMode ||
                    lockAccessFields ||
                    isBusy
                  }
                  required
                >
                  {USER_PROFILE_OPTIONS.map(
                    (option) => (
                      <option
                        key={
                          option.value
                        }
                        value={
                          option.value
                        }
                      >
                        {option.label}
                      </option>
                    )
                  )}
                </select>
              </div>

              {!isCreateMode && (
                <div
                  className={styles.field}
                >
                  <label
                    htmlFor="user-status"
                    className={styles.label}
                  >
                    Status
                  </label>

                  <select
                    id="user-status"
                    name="ativo"
                    className={`${styles.input} ${
                      isViewMode ||
                      lockAccessFields
                        ? styles.readOnlyInput
                        : ""
                    }`}
                    value={
                      form.ativo
                        ? "true"
                        : "false"
                    }
                    onChange={(event) => {
                      setForm(
                        (currentForm) => ({
                          ...currentForm,
                          ativo:
                            event.target
                              .value ===
                            "true",
                        })
                      );
                    }}
                    disabled={
                      isViewMode ||
                      lockAccessFields ||
                      isBusy
                    }
                  >
                    <option value="true">
                      Ativo
                    </option>

                    <option value="false">
                      Inativo
                    </option>
                  </select>
                </div>
              )}

              <div className={styles.field}>
                <label
                  htmlFor="user-course"
                  className={styles.label}
                >
                  Curso
                </label>

                <input
                  id="user-course"
                  name="curso"
                  type="text"
                  className={styles.input}
                  value={form.curso}
                  onChange={
                    handleFieldChange
                  }
                  maxLength={120}
                  placeholder="Ex.: Administração"
                  disabled={
                    isViewMode ||
                    isBusy
                  }
                />
              </div>

              <div className={styles.field}>
                <label
                  htmlFor="user-phone"
                  className={styles.label}
                >
                  Telefone
                </label>

                <input
                  id="user-phone"
                  name="telefone"
                  type="tel"
                  className={styles.input}
                  value={form.telefone}
                  onChange={
                    handleFieldChange
                  }
                  maxLength={20}
                  placeholder="(82) 99999-9999"
                  disabled={
                    isViewMode ||
                    isBusy
                  }
                />
              </div>

              <div className={styles.field}>
                <label
                  htmlFor="user-entry-date"
                  className={styles.label}
                >
                  Ingresso no projeto
                </label>

                <input
                  id="user-entry-date"
                  name="dataIngresso"
                  type="date"
                  className={styles.input}
                  value={
                    form.dataIngresso
                  }
                  onChange={
                    handleFieldChange
                  }
                  disabled={
                    isViewMode ||
                    isBusy
                  }
                />
              </div>

              {isViewMode && (
                <div
                  className={styles.field}
                >
                  <label
                    className={styles.label}
                  >
                    Data de criação
                  </label>

                  <input
                    type="text"
                    className={`${styles.input} ${styles.readOnlyInput}`}
                    value={formatDateTime(
                      form.dataCriacao
                    )}
                    readOnly
                  />
                </div>
              )}

              <div
                className={`${styles.field} ${styles.fullWidth}`}
              >
                <label
                  htmlFor="user-description"
                  className={styles.label}
                >
                  Descrição
                </label>

                <textarea
                  id="user-description"
                  name="descricao"
                  className={styles.textarea}
                  value={form.descricao}
                  onChange={
                    handleFieldChange
                  }
                  placeholder="Escreva uma breve descrição sobre o voluntário."
                  rows={4}
                  disabled={
                    isViewMode ||
                    isBusy
                  }
                />
              </div>
            </div>

            {showPasswordFields && (
              <div
                className={
                  styles.passwordSection
                }
              >
                <div
                  className={
                    styles.sectionTitle
                  }
                >
                  <KeyRound size={18} />

                  <span>
                    {isCreateMode
                      ? "Senha de acesso"
                      : "Alterar senha do usuário"}
                  </span>
                </div>

                <p
                  className={
                    styles.sectionText
                  }
                >
                  {isCreateMode
                    ? "A senha será utilizada pelo voluntário para acessar o sistema."
                    : "Deixe os campos vazios para manter a senha atual do usuário."}
                </p>

                <div
                  className={
                    styles.fieldsGrid
                  }
                >
                  <div
                    className={styles.field}
                  >
                    <label
                      htmlFor="user-password"
                      className={
                        styles.label
                      }
                    >
                      {isCreateMode
                        ? "Senha"
                        : "Nova senha"}
                    </label>

                    <input
                      id="user-password"
                      name="senha"
                      type="password"
                      className={
                        styles.input
                      }
                      value={form.senha}
                      onChange={
                        handleFieldChange
                      }
                      minLength={6}
                      maxLength={255}
                      required={isCreateMode}
                      autoComplete="new-password"
                      disabled={isBusy}
                    />
                  </div>

                  <div
                    className={styles.field}
                  >
                    <label
                      htmlFor="user-password-confirmation"
                      className={
                        styles.label
                      }
                    >
                      Confirmar senha
                    </label>

                    <input
                      id="user-password-confirmation"
                      name="confirmarSenha"
                      type="password"
                      className={
                        styles.input
                      }
                      value={
                        form.confirmarSenha
                      }
                      onChange={
                        handleFieldChange
                      }
                      minLength={6}
                      maxLength={255}
                      required={isCreateMode}
                      autoComplete="new-password"
                      disabled={isBusy}
                    />
                  </div>
                </div>
              </div>
            )}

            {error && (
              <div
                className={
                  styles.errorMessage
                }
                role="alert"
              >
                {error}
              </div>
            )}
          </div>

          {isViewMode ? (
            <div
              className={
                styles.viewFooter
              }
            >
              <div
                className={
                  styles.viewFooterLeft
                }
              >
                {onDeleted &&
                  canDelete && (
                    <button
                      type="button"
                      className={
                        styles.deleteButton
                      }
                      onClick={
                        handleDelete
                      }
                      disabled={isBusy}
                    >
                      <Trash2 size={18} />

                      <span>
                        {deleting
                          ? "Excluindo..."
                          : "Excluir"}
                      </span>
                    </button>
                  )}
              </div>

              <div
                className={
                  styles.viewFooterRight
                }
              >
                <button
                  type="button"
                  className={
                    styles.cancelButton
                  }
                  onClick={onClose}
                  disabled={isBusy}
                >
                  Fechar
                </button>

                {onEdit && (
                  <button
                    type="button"
                    className={
                      styles.editButton
                    }
                    onClick={onEdit}
                    disabled={isBusy}
                  >
                    <Pencil size={18} />
                    <span>Editar</span>
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className={styles.footer}>
              <button
                type="button"
                className={
                  styles.cancelButton
                }
                onClick={onClose}
                disabled={isBusy}
              >
                Cancelar
              </button>

              <button
                type="submit"
                className={styles.saveButton}
                disabled={isBusy}
              >
                <Save size={18} />

                <span>
                  {saving
                    ? modalContent.savingLabel
                    : modalContent.saveLabel}
                </span>
              </button>
            </div>
          )}
        </form>
      </section>
    </div>
  );
}