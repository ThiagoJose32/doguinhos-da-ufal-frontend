import { useEffect, useMemo, useState } from "react";
import {
  CircleX,
  ExternalLink,
  FileText,
  Pencil,
  Save,
  Trash2,
  Upload,
  X,
} from "lucide-react";

import styles from "./AnimalModal.module.css";

const sexoOptions = [
  "Macho",
  "Fêmea",
];

const especieOptions = [
  {
    value: "dog",
    label: "Canina",
  },
  {
    value: "cat",
    label: "Felina",
  },
];

const castradoOptions = [
  "Sim",
  "Não",
];

const statusOptions = [
  "No campus",
  "Em tratamento",
  "Disponível para adoção",
  "Adotado",
  "Desaparecido",
  "Óbito",
];

const porteOptions = [
  "Pequeno",
  "Médio",
  "Grande",
];

const corPelagemOptions = [
  "Preta",
  "Branca",
  "Caramelo",
  "Marrom",
  "Cinza",
  "Rajada",
  "Preta e branca",
  "Marrom e branca",
  "Tricolor",
  "Outra",
];

const emptyAnimal = {
  id: null,
  nome: "",
  imagem: "",
  fotoArquivo: null,

  sexo: "Macho",
  especie: "dog",
  dataEstimadaNascimento: "",
  descricao: "",
  corPelagem: "Caramelo",
  porte: "Médio",
  castrado: "Não",
  status: "No campus",

  adotanteNome: "",

  termoAdocaoArquivo: null,
  termoAdocaoArquivoNome: "",
  termoAdocaoArquivoUrl: "",
};

function normalizeAnimal(animal) {
  if (!animal) {
    return {
      ...emptyAnimal,
    };
  }

  return {
    ...emptyAnimal,
    ...animal,
    fotoArquivo: null,
    termoAdocaoArquivo: null,
  };
}

function getErrorMessage(error) {
  const responseData = error?.response?.data;

  if (typeof responseData === "string") {
    return responseData;
  }

  return (
    responseData?.message ||
    responseData?.detail ||
    error?.message ||
    "Não foi possível concluir a operação."
  );
}

export default function AnimalModal({
  isOpen,
  initialMode = "view",
  animal,
  onClose,
  onSave,
  onDelete,
  onOpenAdoptionTerm,
}) {
  const [mode, setMode] =
    useState(initialMode);

  const [draft, setDraft] = useState(
    normalizeAnimal(animal)
  );

  const [errorMessage, setErrorMessage] =
    useState("");

  const [isSaving, setIsSaving] =
    useState(false);

  useEffect(() => {
    if (isOpen) {
      setMode(initialMode);
      setDraft(normalizeAnimal(animal));
      setErrorMessage("");
      setIsSaving(false);
    }
  }, [
    isOpen,
    initialMode,
    animal,
  ]);

  const isCreateMode = mode === "create";

  const isEditMode =
    mode === "edit" ||
    mode === "create";

  const isViewMode = mode === "view";

  const isAdopted =
    draft.status === "Adotado";

  const hasTerm =
    Boolean(
      draft.termoAdocaoArquivoNome ||
      draft.termoAdocaoArquivoUrl
    );

  const hasLocalTerm =
    draft.termoAdocaoArquivo instanceof File &&
    Boolean(draft.termoAdocaoArquivoUrl);

  const modalTitle = useMemo(() => {
    if (isCreateMode) {
      return "Cadastrar animal";
    }

    return (
      draft.nome ||
      "Detalhes do animal"
    );
  }, [
    isCreateMode,
    draft.nome,
  ]);

  if (!isOpen) {
    return null;
  }

  function handleChange(field, value) {
    setDraft((currentDraft) => ({
      ...currentDraft,
      [field]: value,
    }));

    setErrorMessage("");
  }

  function handleStatusChange(value) {
    if (value !== "Adotado") {
      setDraft((currentDraft) => ({
        ...currentDraft,
        status: value,
        adotanteNome: "",
        termoAdocaoArquivo: null,
        termoAdocaoArquivoNome: "",
        termoAdocaoArquivoUrl: "",
      }));
    } else {
      setDraft((currentDraft) => ({
        ...currentDraft,
        status: value,
      }));
    }

    setErrorMessage("");
  }

  function handleProfileImageChange(event) {
    const file =
      event.target.files?.[0];

    if (!file) {
      return;
    }

    if (!file.type.startsWith("image/")) {
      setErrorMessage(
        "Selecione um arquivo de imagem."
      );

      return;
    }

    const previewUrl =
      URL.createObjectURL(file);

    setDraft((currentDraft) => ({
      ...currentDraft,
      imagem: previewUrl,
      fotoArquivo: file,
    }));

    setErrorMessage("");
  }

  function handleAdoptionTermChange(event) {
    const file =
      event.target.files?.[0];

    if (!file) {
      return;
    }

    if (file.type !== "application/pdf") {
      setErrorMessage(
        "O termo de adoção deve ser um arquivo PDF."
      );

      return;
    }

    const previewUrl =
      URL.createObjectURL(file);

    setDraft((currentDraft) => ({
      ...currentDraft,
      termoAdocaoArquivo: file,
      termoAdocaoArquivoNome: file.name,
      termoAdocaoArquivoUrl: previewUrl,
    }));

    setErrorMessage("");
  }

  function validateForm() {
    if (!draft.nome.trim()) {
      return "Informe o nome do animal.";
    }

    if (!draft.dataEstimadaNascimento) {
      return "Informe a data estimada de nascimento.";
    }

    if (!draft.descricao.trim()) {
      return "Informe a descrição do animal.";
    }

    if (draft.status === "Adotado") {
      if (!draft.adotanteNome.trim()) {
        return (
          "Para marcar como adotado, " +
          "informe o nome do adotante."
        );
      }

      if (
        !draft.termoAdocaoArquivo &&
        !draft.termoAdocaoArquivoNome
      ) {
        return (
          "Para marcar como adotado, " +
          "anexe o termo de adoção em PDF."
        );
      }
    }

    return "";
  }

  async function handleSave() {
    const validationError =
      validateForm();

    if (validationError) {
      setErrorMessage(validationError);
      return;
    }

    const payload = {
      ...draft,

      adotanteNome:
        draft.status === "Adotado"
          ? draft.adotanteNome
          : "",

      termoAdocaoArquivo:
        draft.status === "Adotado"
          ? draft.termoAdocaoArquivo
          : null,

      termoAdocaoArquivoNome:
        draft.status === "Adotado"
          ? draft.termoAdocaoArquivoNome
          : "",

      termoAdocaoArquivoUrl:
        draft.status === "Adotado"
          ? draft.termoAdocaoArquivoUrl
          : "",
    };

    setIsSaving(true);
    setErrorMessage("");

    try {
      const savedAnimal =
        await onSave(payload, mode);

      if (savedAnimal) {
        setDraft(
          normalizeAnimal(savedAnimal)
        );
      }

      if (mode === "edit") {
        setMode("view");
      }
    } catch (error) {
      setErrorMessage(
        getErrorMessage(error)
      );
    } finally {
      setIsSaving(false);
    }
  }

  async function handleDelete() {
    if (!onDelete || !draft.id) {
      return;
    }

    const confirmed = window.confirm(
      `Deseja realmente excluir o animal "${draft.nome}"?`
    );

    if (!confirmed) {
      return;
    }

    setIsSaving(true);
    setErrorMessage("");

    try {
      await onDelete(draft);
    } catch (error) {
      setErrorMessage(
        getErrorMessage(error)
      );
    } finally {
      setIsSaving(false);
    }
  }

  function handleCancelEdit() {
    setDraft(
      normalizeAnimal(animal)
    );

    setMode("view");
    setErrorMessage("");
  }

  async function handleOpenTerm(event) {
    if (hasLocalTerm) {
      return;
    }

    event.preventDefault();

    if (!onOpenAdoptionTerm) {
      return;
    }

    try {
      await onOpenAdoptionTerm(draft);
    } catch (error) {
      setErrorMessage(
        getErrorMessage(error)
      );
    }
  }

  return (
    <div
      className={styles.overlay}
      onClick={() => {
        if (!isSaving) {
          onClose();
        }
      }}
    >
      <div
        className={styles.modal}
        onClick={(event) =>
          event.stopPropagation()
        }
      >
        <div className={styles.header}>
          <div className={styles.headerText}>
            <span className={styles.headerTag}>
              {isCreateMode
                ? "Novo animal"
                : "Animal"}
            </span>

            <h2 className={styles.title}>
              {modalTitle}
            </h2>
          </div>

          <div className={styles.headerActions}>
            {!isCreateMode && (
              <span
                className={styles.statusBadge}
              >
                {draft.status}
              </span>
            )}

            <button
              type="button"
              className={styles.closeButton}
              onClick={onClose}
              disabled={isSaving}
            >
              <X size={18} />
            </button>
          </div>
        </div>

        <div className={styles.body}>
          <div className={styles.leftColumn}>
            <div className={styles.card}>
              <h3
                className={styles.sectionTitle}
              >
                Foto de perfil
              </h3>

              {draft.imagem ? (
                <img
                  src={draft.imagem}
                  alt={
                    draft.nome ||
                    "Animal"
                  }
                  className={
                    styles.profileImage
                  }
                />
              ) : (
                <div
                  className={
                    styles.emptyImage
                  }
                >
                  Sem foto cadastrada
                </div>
              )}

              {isEditMode && (
                <label
                  className={
                    styles.uploadButton
                  }
                >
                  <Upload size={16} />

                  <span>
                    Selecionar foto
                  </span>

                  <input
                    type="file"
                    accept="image/jpeg,image/png"
                    className={
                      styles.hiddenInput
                    }
                    onChange={
                      handleProfileImageChange
                    }
                    disabled={isSaving}
                  />
                </label>
              )}
            </div>
          </div>

          <div className={styles.rightColumn}>
            <div className={styles.card}>
              <div
                className={styles.formGrid}
              >
                <div className={styles.field}>
                  <label
                    className={styles.label}
                  >
                    Nome
                  </label>

                  <input
                    type="text"
                    className={styles.input}
                    value={draft.nome}
                    onChange={(event) =>
                      handleChange(
                        "nome",
                        event.target.value
                      )
                    }
                    disabled={
                      !isEditMode ||
                      isSaving
                    }
                  />
                </div>

                <div className={styles.field}>
                  <label
                    className={styles.label}
                  >
                    Sexo
                  </label>

                  <select
                    className={styles.select}
                    value={draft.sexo}
                    onChange={(event) =>
                      handleChange(
                        "sexo",
                        event.target.value
                      )
                    }
                    disabled={
                      !isEditMode ||
                      isSaving
                    }
                  >
                    {sexoOptions.map(
                      (option) => (
                        <option
                          key={option}
                          value={option}
                        >
                          {option}
                        </option>
                      )
                    )}
                  </select>
                </div>

                <div className={styles.field}>
                  <label
                    className={styles.label}
                  >
                    Espécie
                  </label>

                  <select
                    className={styles.select}
                    value={draft.especie}
                    onChange={(event) =>
                      handleChange(
                        "especie",
                        event.target.value
                      )
                    }
                    disabled={
                      !isEditMode ||
                      isSaving
                    }
                  >
                    {especieOptions.map(
                      (option) => (
                        <option
                          key={option.value}
                          value={option.value}
                        >
                          {option.label}
                        </option>
                      )
                    )}
                  </select>
                </div>

                <div className={styles.field}>
                  <label
                    className={styles.label}
                  >
                    Data estimada de nascimento
                  </label>

                  <input
                    type="date"
                    className={styles.input}
                    value={
                      draft.dataEstimadaNascimento
                    }
                    max={
                      new Date()
                        .toISOString()
                        .split("T")[0]
                    }
                    onChange={(event) =>
                      handleChange(
                        "dataEstimadaNascimento",
                        event.target.value
                      )
                    }
                    disabled={
                      !isEditMode ||
                      isSaving
                    }
                  />
                </div>

                <div className={styles.field}>
                  <label
                    className={styles.label}
                  >
                    Porte
                  </label>

                  <select
                    className={styles.select}
                    value={draft.porte}
                    onChange={(event) =>
                      handleChange(
                        "porte",
                        event.target.value
                      )
                    }
                    disabled={
                      !isEditMode ||
                      isSaving
                    }
                  >
                    {porteOptions.map(
                      (option) => (
                        <option
                          key={option}
                          value={option}
                        >
                          {option}
                        </option>
                      )
                    )}
                  </select>
                </div>

                <div className={styles.field}>
                  <label
                    className={styles.label}
                  >
                    Pelagem
                  </label>

                  <select
                    className={styles.select}
                    value={
                      draft.corPelagem
                    }
                    onChange={(event) =>
                      handleChange(
                        "corPelagem",
                        event.target.value
                      )
                    }
                    disabled={
                      !isEditMode ||
                      isSaving
                    }
                  >
                    {corPelagemOptions.map(
                      (option) => (
                        <option
                          key={option}
                          value={option}
                        >
                          {option}
                        </option>
                      )
                    )}
                  </select>
                </div>

                <div className={styles.field}>
                  <label
                    className={styles.label}
                  >
                    Castrado(a)
                  </label>

                  <select
                    className={styles.select}
                    value={draft.castrado}
                    onChange={(event) =>
                      handleChange(
                        "castrado",
                        event.target.value
                      )
                    }
                    disabled={
                      !isEditMode ||
                      isSaving
                    }
                  >
                    {castradoOptions.map(
                      (option) => (
                        <option
                          key={option}
                          value={option}
                        >
                          {option}
                        </option>
                      )
                    )}
                  </select>
                </div>

                <div className={styles.field}>
                  <label
                    className={styles.label}
                  >
                    Status
                  </label>

                  <select
                    className={styles.select}
                    value={draft.status}
                    onChange={(event) =>
                      handleStatusChange(
                        event.target.value
                      )
                    }
                    disabled={
                      !isEditMode ||
                      isSaving
                    }
                  >
                    {statusOptions.map(
                      (option) => (
                        <option
                          key={option}
                          value={option}
                        >
                          {option}
                        </option>
                      )
                    )}
                  </select>
                </div>

                <div
                  className={styles.fieldFull}
                >
                  <label
                    className={styles.label}
                  >
                    Adotante
                  </label>

                  <input
                    type="text"
                    className={styles.input}
                    value={
                      draft.adotanteNome
                    }
                    onChange={(event) =>
                      handleChange(
                        "adotanteNome",
                        event.target.value
                      )
                    }
                    disabled={
                      !isEditMode ||
                      !isAdopted ||
                      isSaving
                    }
                    placeholder={
                      isAdopted
                        ? "Informe o nome do adotante"
                        : "Disponível apenas quando o status for Adotado"
                    }
                  />
                </div>

                <div
                  className={styles.fieldFull}
                >
                  <label
                    className={styles.label}
                  >
                    Termo de adoção (PDF)
                  </label>

                  {isViewMode ? (
                    hasTerm ? (
                      <a
                        href={
                          hasLocalTerm
                            ? draft.termoAdocaoArquivoUrl
                            : "#"
                        }
                        target={
                          hasLocalTerm
                            ? "_blank"
                            : undefined
                        }
                        rel="noreferrer"
                        className={
                          styles.fileLink
                        }
                        onClick={
                          handleOpenTerm
                        }
                      >
                        <FileText size={16} />

                        <span>
                          {
                            draft.termoAdocaoArquivoNome
                          }
                        </span>

                        <ExternalLink
                          size={16}
                        />
                      </a>
                    ) : (
                      <div
                        className={
                          styles.filePlaceholder
                        }
                      >
                        Nenhum termo anexado
                      </div>
                    )
                  ) : (
                    <div
                      className={
                        styles.fileInputWrapper
                      }
                    >
                      <label
                        className={`${
                          styles.uploadButton
                        } ${
                          !isAdopted
                            ? styles.uploadButtonDisabled
                            : ""
                        }`}
                      >
                        <Upload size={16} />

                        <span>
                          {draft.termoAdocaoArquivoNome ||
                            "Selecionar PDF"}
                        </span>

                        <input
                          type="file"
                          accept="application/pdf"
                          className={
                            styles.hiddenInput
                          }
                          onChange={
                            handleAdoptionTermChange
                          }
                          disabled={
                            !isAdopted ||
                            isSaving
                          }
                        />
                      </label>

                      {!isAdopted && (
                        <span
                          className={
                            styles.helperText
                          }
                        >
                          O termo é obrigatório
                          apenas quando o status
                          for Adotado.
                        </span>
                      )}
                    </div>
                  )}
                </div>

                <div
                  className={styles.fieldFull}
                >
                  <label
                    className={styles.label}
                  >
                    Descrição
                  </label>

                  <textarea
                    className={styles.textarea}
                    value={draft.descricao}
                    onChange={(event) =>
                      handleChange(
                        "descricao",
                        event.target.value
                      )
                    }
                    disabled={
                      !isEditMode ||
                      isSaving
                    }
                  />
                </div>
              </div>

              {errorMessage && (
                <div
                  className={styles.errorBox}
                >
                  {errorMessage}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className={styles.footer}>
          {isViewMode && (
            <>
              {onDelete && draft.id && (
                <button
                  type="button"
                  className={
                    styles.secondaryActionButton
                  }
                  onClick={handleDelete}
                  disabled={isSaving}
                >
                  <Trash2 size={16} />
                  <span>Excluir</span>
                </button>
              )}

              <button
                type="button"
                className={
                  styles.secondaryActionButton
                }
                onClick={onClose}
                disabled={isSaving}
              >
                <CircleX size={16} />
                <span>Fechar</span>
              </button>

              <button
                type="button"
                className={
                  styles.primaryActionButton
                }
                onClick={() =>
                  setMode("edit")
                }
                disabled={isSaving}
              >
                <Pencil size={16} />
                <span>Editar</span>
              </button>
            </>
          )}

          {mode === "edit" && (
            <>
              <button
                type="button"
                className={
                  styles.secondaryActionButton
                }
                onClick={handleCancelEdit}
                disabled={isSaving}
              >
                <CircleX size={16} />
                <span>Cancelar</span>
              </button>

              <button
                type="button"
                className={
                  styles.primaryActionButton
                }
                onClick={handleSave}
                disabled={isSaving}
              >
                <Save size={16} />

                <span>
                  {isSaving
                    ? "Salvando..."
                    : "Salvar alterações"}
                </span>
              </button>
            </>
          )}

          {mode === "create" && (
            <>
              <button
                type="button"
                className={
                  styles.secondaryActionButton
                }
                onClick={onClose}
                disabled={isSaving}
              >
                <CircleX size={16} />
                <span>Cancelar</span>
              </button>

              <button
                type="button"
                className={
                  styles.primaryActionButton
                }
                onClick={handleSave}
                disabled={isSaving}
              >
                <Save size={16} />

                <span>
                  {isSaving
                    ? "Salvando..."
                    : "Salvar animal"}
                </span>
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}