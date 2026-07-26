import {
  CalendarDays,
  CircleX,
  Download,
  FileText,
  Pencil,
  Save,
  Trash2,
  Upload,
  X,
} from "lucide-react";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  createOccurrence,
  deleteOccurrence,
  downloadOccurrenceDocument,
  getOccurrenceTypeLabel,
  isProtectedOccurrence,
  isTerminalOccurrence,
  OCCURRENCE_TYPE_OPTIONS,
  updateOccurrence,
} from "../../services/occurrenceService";

import styles from "./OccurrenceModal.module.css";

const EMPTY_ADOPTION = {
  adocaoId: null,

  nome: "",
  cpfRg: "",
  telefone: "",
  email: "",
  endereco: "",
  observacoes: "",

  dataAdocao: "",

  entrevistaNome: "",
  entrevistaUrl: "",
  entrevistaArquivo: null,

  termoNome: "",
  termoUrl: "",
  termoArquivo: null,
};

const EMPTY_OCCURRENCE = {
  id: null,
  tipo: "SAUDE",
  data: "",
  descricao: "",
  custo: "",
  animalId: null,

  criadoPorId: null,
  criadoPorNome: "",

  modificadoPorId: null,
  modificadoPorNome: "",

  dataCriacao: null,
  dataModificacao: null,

  adocao: null,
};

function normalizeAdoption(adoption) {
  return {
    ...EMPTY_ADOPTION,
    ...(adoption || {}),
    entrevistaArquivo: null,
    termoArquivo: null,
  };
}

function normalizeOccurrence(
  occurrence,
  animalId
) {
  if (!occurrence) {
    return {
      ...EMPTY_OCCURRENCE,
      animalId,
      adocao: normalizeAdoption(null),
    };
  }

  return {
    ...EMPTY_OCCURRENCE,
    ...occurrence,

    animalId:
      occurrence.animalId ||
      animalId,

    custo:
      occurrence.custo === null ||
      occurrence.custo === undefined
        ? ""
        : String(occurrence.custo),

    adocao: normalizeAdoption(
      occurrence.adocao
    ),
  };
}

function formatDate(value) {
  if (!value) {
    return "Data não informada";
  }

  const date = new Date(
    `${value}T00:00:00`
  );

  if (Number.isNaN(date.getTime())) {
    return "Data não informada";
  }

  return date.toLocaleDateString(
    "pt-BR"
  );
}

function formatDateTime(value) {
  if (!value) {
    return "Não informado";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Não informado";
  }

  return date.toLocaleString(
    "pt-BR"
  );
}

function getErrorMessage(error) {
  const responseData =
    error?.response?.data;

  if (typeof responseData === "string") {
    return responseData;
  }

  if (responseData?.detail) {
    return responseData.detail;
  }

  if (responseData?.message) {
    return responseData.message;
  }

  if (
    responseData &&
    typeof responseData === "object"
  ) {
    const messages = Object.values(
      responseData
    ).filter(
      (value) =>
        typeof value === "string"
    );

    if (messages.length > 0) {
      return messages.join(" ");
    }
  }

  return (
    error?.message ||
    "Não foi possível concluir a operação."
  );
}

function validateCost(value) {
  if (
    value === null ||
    value === undefined ||
    value === ""
  ) {
    return "";
  }

  const normalizedValue = String(value)
    .trim()
    .replace(",", ".");

  if (
    !/^\d+(\.\d{1,2})?$/.test(
      normalizedValue
    )
  ) {
    return "Informe um custo válido com no máximo duas casas decimais.";
  }

  const numericValue =
    Number(normalizedValue);

  if (
    !Number.isFinite(numericValue) ||
    numericValue < 0
  ) {
    return "O custo não pode ser negativo.";
  }

  return "";
}

function validateEmail(email) {
  if (!email) {
    return true;
  }

  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
    email
  );
}

function getLatestOccurrenceDate(
  occurrences,
  ignoredOccurrenceId
) {
  return occurrences
    .filter(
      (item) =>
        item.id !== ignoredOccurrenceId &&
        Boolean(item.data)
    )
    .reduce(
      (latestDate, item) => {
        if (
          !latestDate ||
          item.data > latestDate
        ) {
          return item.data;
        }

        return latestDate;
      },
      ""
    );
}

export default function OccurrenceModal({
  isOpen,
  initialMode = "view",
  occurrence,
  occurrences = [],
  animalId,
  animalCastrado = false,
  onClose,
  onSaved,
  onDeleted,
}) {
  const [mode, setMode] =
    useState(initialMode);

  const [draft, setDraft] =
    useState(() =>
      normalizeOccurrence(
        occurrence,
        animalId
      )
    );

  const [
    errorMessage,
    setErrorMessage,
  ] = useState("");

  const [isSaving, setIsSaving] =
    useState(false);

  const isCreateMode =
    mode === "create";

  const isEditMode =
    mode === "edit";

  const isViewMode =
    mode === "view";

  const fieldsEnabled =
    isCreateMode || isEditMode;

  const isAdoption =
    draft.tipo === "ADOCAO";

  const protectedOccurrence =
    isProtectedOccurrence(
      draft.tipo
    );

  const terminalOccurrence =
    useMemo(
      () =>
        occurrences.find((item) =>
          isTerminalOccurrence(item.tipo)
        ) || null,
      [occurrences]
    );

  const terminalOtherThanCurrent =
    terminalOccurrence &&
    terminalOccurrence.id !== draft.id
      ? terminalOccurrence
      : null;

  const hasExistingCastration =
    useMemo(
      () =>
        occurrences.some(
          (item) =>
            item.tipo === "CASTRACAO" &&
            item.id !== draft.id
        ),
      [
        occurrences,
        draft.id,
      ]
    );

  const latestOtherOccurrenceDate =
    useMemo(
      () =>
        getLatestOccurrenceDate(
          occurrences,
          draft.id
        ),
      [
        occurrences,
        draft.id,
      ]
    );

  const minimumDate =
    isTerminalOccurrence(draft.tipo)
      ? latestOtherOccurrenceDate ||
        undefined
      : undefined;

  const maximumDate =
    !isTerminalOccurrence(draft.tipo) &&
    terminalOtherThanCurrent?.data
      ? terminalOtherThanCurrent.data
      : undefined;

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    setMode(initialMode);

    setDraft(
      normalizeOccurrence(
        occurrence,
        animalId
      )
    );

    setErrorMessage("");
    setIsSaving(false);
  }, [
    isOpen,
    initialMode,
    occurrence,
    animalId,
  ]);

  useEffect(() => {
    if (!isOpen) {
      return undefined;
    }

    const previousOverflow =
      document.body.style.overflow;

    document.body.style.overflow =
      "hidden";

    function handleEscape(event) {
      if (
        event.key === "Escape" &&
        !isSaving
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
  }, [
    isOpen,
    isSaving,
    onClose,
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

  function handleTypeChange(value) {
    setDraft((currentDraft) => ({
      ...currentDraft,
      tipo: value,

      adocao:
        value === "ADOCAO"
          ? normalizeAdoption(
              currentDraft.adocao
            )
          : normalizeAdoption(null),
    }));

    setErrorMessage("");
  }

  function handleAdoptionChange(
    field,
    value
  ) {
    setDraft((currentDraft) => ({
      ...currentDraft,

      adocao: {
        ...normalizeAdoption(
          currentDraft.adocao
        ),

        [field]: value,
      },
    }));

    setErrorMessage("");
  }

  function handleAdoptionFileChange(
    field,
    event
  ) {
    const file =
      event.target.files?.[0];

    if (!file) {
      return;
    }

    if (
      file.type !== "application/pdf"
    ) {
      setErrorMessage(
        "Os documentos da adoção devem estar no formato PDF."
      );

      event.target.value = "";
      return;
    }

    handleAdoptionChange(field, file);
  }

  function isTypeOptionDisabled(type) {
    if (!isCreateMode) {
      return false;
    }

    if (
      isTerminalOccurrence(type) &&
      terminalOccurrence
    ) {
      return true;
    }

    if (
      type === "CASTRACAO" &&
      (
        animalCastrado ||
        hasExistingCastration
      )
    ) {
      return true;
    }

    return false;
  }

  function validateForm() {
    if (!draft.tipo) {
      return "Selecione o tipo da ocorrência.";
    }

    if (!draft.data) {
      return "Informe a data da ocorrência.";
    }

    const costError =
      validateCost(draft.custo);

    if (costError) {
      return costError;
    }

    if (
      isTerminalOccurrence(draft.tipo) &&
      terminalOtherThanCurrent
    ) {
      return (
        `O animal já possui uma ocorrência de ` +
        `${getOccurrenceTypeLabel(
          terminalOtherThanCurrent.tipo
        )} em ${formatDate(
          terminalOtherThanCurrent.data
        )}.`
      );
    }

    if (
      !isTerminalOccurrence(draft.tipo) &&
      terminalOtherThanCurrent?.data &&
      draft.data >
        terminalOtherThanCurrent.data
    ) {
      return (
        "A data da ocorrência deve ser igual ou anterior a " +
        `${formatDate(
          terminalOtherThanCurrent.data
        )}, data da ocorrência de ` +
        `${getOccurrenceTypeLabel(
          terminalOtherThanCurrent.tipo
        )}.`
      );
    }

    if (
      isTerminalOccurrence(draft.tipo) &&
      latestOtherOccurrenceDate &&
      draft.data <
        latestOtherOccurrenceDate
    ) {
      return (
        "A data deve ser igual ou posterior à ocorrência mais recente, " +
        `registrada em ${formatDate(
          latestOtherOccurrenceDate
        )}.`
      );
    }

    if (
      isCreateMode &&
      draft.tipo === "CASTRACAO" &&
      (
        animalCastrado ||
        hasExistingCastration
      )
    ) {
      return "O animal já possui castração registrada.";
    }

    if (!isAdoption) {
      return "";
    }

    const adoption =
      normalizeAdoption(draft.adocao);

    if (!adoption.nome.trim()) {
      return "Informe o nome do adotante.";
    }

    if (
      adoption.email &&
      !validateEmail(adoption.email)
    ) {
      return "Informe um e-mail válido para o adotante.";
    }

    const hasInterview =
      adoption.entrevistaArquivo instanceof
        File ||
      Boolean(adoption.entrevistaNome);

    const hasTerm =
      adoption.termoArquivo instanceof
        File ||
      Boolean(adoption.termoNome);

    if (!hasInterview) {
      return "Anexe a entrevista de adoção em PDF.";
    }

    if (!hasTerm) {
      return "Anexe o termo de adoção em PDF.";
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

    setIsSaving(true);
    setErrorMessage("");

    try {
      const payload = {
        ...draft,
        animalId,
      };

      const savedOccurrence =
        isCreateMode
          ? await createOccurrence(
              payload
            )
          : await updateOccurrence(
              draft.id,
              payload
            );

      await onSaved?.(
        savedOccurrence,
        mode
      );
    } catch (error) {
      setErrorMessage(
        getErrorMessage(error)
      );
    } finally {
      setIsSaving(false);
    }
  }

  async function handleDelete() {
    if (
      !draft.id ||
      protectedOccurrence
    ) {
      return;
    }

    const confirmationMessage =
      draft.tipo === "ADOCAO"
        ? (
          "Deseja realmente excluir esta adoção? " +
          "A ocorrência, os dados da adoção, a entrevista e o termo serão removidos. " +
          "O animal voltará para o status Disponível para adoção."
        )
        : (
          `Deseja realmente excluir a ocorrência ` +
          `"${getOccurrenceTypeLabel(
            draft.tipo
          )}"?`
        );

    const confirmed =
      window.confirm(
        confirmationMessage
      );

    if (!confirmed) {
      return;
    }

    setIsSaving(true);
    setErrorMessage("");

    try {
      await deleteOccurrence(draft.id);
      await onDeleted?.(draft);
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
      normalizeOccurrence(
        occurrence,
        animalId
      )
    );

    setMode("view");
    setErrorMessage("");
  }

  async function handleDownload(
    url,
    filename
  ) {
    try {
      await downloadOccurrenceDocument(
        url,
        filename
      );
    } catch (error) {
      setErrorMessage(
        getErrorMessage(error)
      );
    }
  }

  const modalTitle = isCreateMode
    ? "Nova ocorrência"
    : isEditMode
      ? "Editar ocorrência"
      : "Detalhes da ocorrência";

  const modalSubtitle = isCreateMode
    ? "Registre um acontecimento relacionado ao animal."
    : isEditMode
      ? "Atualize as informações da ocorrência."
      : "Consulte as informações registradas.";

  const adoption =
    normalizeAdoption(draft.adocao);

  return (
    <div
      className={styles.backdrop}
      onMouseDown={(event) => {
        if (
          event.target ===
            event.currentTarget &&
          !isSaving
        ) {
          onClose();
        }
      }}
    >
      <section
        className={styles.modal}
        role="dialog"
        aria-modal="true"
        aria-labelledby="occurrence-modal-title"
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
              <CalendarDays size={22} />
            </div>

            <div>
              <h2
                id="occurrence-modal-title"
                className={styles.title}
              >
                {modalTitle}
              </h2>

              <p
                className={styles.subtitle}
              >
                {modalSubtitle}
              </p>
            </div>
          </div>

          <button
            type="button"
            className={styles.closeButton}
            onClick={onClose}
            disabled={isSaving}
            aria-label="Fechar modal"
          >
            <X size={21} />
          </button>
        </div>

        <div className={styles.content}>
          {terminalOtherThanCurrent && (
            <div
              className={
                styles.lockedNotice
              }
            >
              O animal possui uma ocorrência de{" "}
              <strong>
                {getOccurrenceTypeLabel(
                  terminalOtherThanCurrent.tipo
                )}
              </strong>{" "}
              em{" "}
              <strong>
                {formatDate(
                  terminalOtherThanCurrent.data
                )}
              </strong>
              . Novas ocorrências devem ter data
              igual ou anterior.
            </div>
          )}

          <div className={styles.fieldsGrid}>
            <div className={styles.field}>
              <label
                htmlFor="occurrence-type"
                className={styles.label}
              >
                Tipo
              </label>

              <select
                id="occurrence-type"
                className={styles.input}
                value={draft.tipo}
                onChange={(event) =>
                  handleTypeChange(
                    event.target.value
                  )
                }
                disabled={
                  isViewMode ||
                  isEditMode ||
                  isSaving
                }
                required
              >
                {OCCURRENCE_TYPE_OPTIONS.map(
                  (option) => (
                    <option
                      key={option.value}
                      value={option.value}
                      disabled={isTypeOptionDisabled(
                        option.value
                      )}
                    >
                      {option.label}
                    </option>
                  )
                )}
              </select>

              {isEditMode && (
                <span
                  className={
                    styles.fieldHint
                  }
                >
                  O tipo não pode ser
                  alterado depois que a
                  ocorrência foi criada.
                </span>
              )}
            </div>

            <div className={styles.field}>
              <label
                htmlFor="occurrence-date"
                className={styles.label}
              >
                Data
              </label>

              <input
                id="occurrence-date"
                type="date"
                className={styles.input}
                value={draft.data}
                min={minimumDate}
                max={maximumDate}
                onChange={(event) =>
                  handleChange(
                    "data",
                    event.target.value
                  )
                }
                disabled={
                  !fieldsEnabled ||
                  isSaving
                }
                required
              />

              {minimumDate && (
                <span
                  className={
                    styles.fieldHint
                  }
                >
                  A data deve ser igual ou
                  posterior a{" "}
                  {formatDate(minimumDate)},
                  pois já existem ocorrências
                  anteriores cadastradas.
                </span>
              )}

              {maximumDate && (
                <span
                  className={
                    styles.fieldHint
                  }
                >
                  A data deve ser igual ou
                  anterior a{" "}
                  {formatDate(maximumDate)}.
                </span>
              )}
            </div>

            <div className={styles.field}>
              <label
                htmlFor="occurrence-cost"
                className={styles.label}
              >
                Custo
              </label>

              <div
                className={
                  styles.costInputWrapper
                }
              >
                <span
                  className={
                    styles.currencyPrefix
                  }
                >
                  R$
                </span>

                <input
                  id="occurrence-cost"
                  type="number"
                  min="0"
                  step="0.01"
                  inputMode="decimal"
                  className={`${styles.input} ${styles.costInput}`}
                  value={draft.custo}
                  onChange={(event) =>
                    handleChange(
                      "custo",
                      event.target.value
                    )
                  }
                  disabled={
                    !fieldsEnabled ||
                    isSaving
                  }
                  placeholder="0,00"
                />
              </div>

              <span
                className={
                  styles.fieldHint
                }
              >
                Campo opcional.
              </span>
            </div>

            {isViewMode && (
              <div className={styles.field}>
                <label
                  className={styles.label}
                >
                  Criado por
                </label>

                <input
                  type="text"
                  className={`${styles.input} ${styles.readOnlyInput}`}
                  value={
                    draft.criadoPorNome ||
                    "Não informado"
                  }
                  readOnly
                />
              </div>
            )}

            <div
              className={`${styles.field} ${styles.fullWidth}`}
            >
              <label
                htmlFor="occurrence-description"
                className={styles.label}
              >
                Descrição
              </label>

              <textarea
                id="occurrence-description"
                className={styles.textarea}
                value={draft.descricao}
                onChange={(event) =>
                  handleChange(
                    "descricao",
                    event.target.value
                  )
                }
                disabled={
                  !fieldsEnabled ||
                  isSaving
                }
                maxLength={5000}
                rows={5}
                placeholder="Descreva as informações relevantes sobre a ocorrência."
              />

              <span
                className={
                  styles.fieldHint
                }
              >
                Campo opcional.
              </span>
            </div>
          </div>

          {isAdoption && (
            <section
              className={
                styles.adoptionSection
              }
            >
              <div
                className={
                  styles.sectionHeader
                }
              >
                <h3
                  className={
                    styles.sectionTitle
                  }
                >
                  Dados da adoção
                </h3>

                <p
                  className={
                    styles.sectionText
                  }
                >
                  Informe os dados do adotante
                  e os documentos obrigatórios.
                </p>
              </div>

              <div
                className={
                  styles.fieldsGrid
                }
              >
                <div className={styles.field}>
                  <label
                    className={
                      styles.label
                    }
                  >
                    Nome do adotante
                  </label>

                  <input
                    type="text"
                    className={styles.input}
                    value={adoption.nome}
                    onChange={(event) =>
                      handleAdoptionChange(
                        "nome",
                        event.target.value
                      )
                    }
                    disabled={
                      !fieldsEnabled ||
                      isSaving
                    }
                    maxLength={120}
                    required
                  />
                </div>

                <div className={styles.field}>
                  <label
                    className={
                      styles.label
                    }
                  >
                    CPF ou RG
                  </label>

                  <input
                    type="text"
                    className={styles.input}
                    value={adoption.cpfRg}
                    onChange={(event) =>
                      handleAdoptionChange(
                        "cpfRg",
                        event.target.value
                      )
                    }
                    disabled={
                      !fieldsEnabled ||
                      isSaving
                    }
                    maxLength={20}
                  />
                </div>

                <div className={styles.field}>
                  <label
                    className={
                      styles.label
                    }
                  >
                    Telefone
                  </label>

                  <input
                    type="tel"
                    className={styles.input}
                    value={adoption.telefone}
                    onChange={(event) =>
                      handleAdoptionChange(
                        "telefone",
                        event.target.value
                      )
                    }
                    disabled={
                      !fieldsEnabled ||
                      isSaving
                    }
                    maxLength={20}
                  />
                </div>

                <div className={styles.field}>
                  <label
                    className={
                      styles.label
                    }
                  >
                    E-mail
                  </label>

                  <input
                    type="email"
                    className={styles.input}
                    value={adoption.email}
                    onChange={(event) =>
                      handleAdoptionChange(
                        "email",
                        event.target.value
                      )
                    }
                    disabled={
                      !fieldsEnabled ||
                      isSaving
                    }
                    maxLength={150}
                  />
                </div>

                <div
                  className={`${styles.field} ${styles.fullWidth}`}
                >
                  <label
                    className={
                      styles.label
                    }
                  >
                    Endereço
                  </label>

                  <textarea
                    className={
                      styles.textarea
                    }
                    value={adoption.endereco}
                    onChange={(event) =>
                      handleAdoptionChange(
                        "endereco",
                        event.target.value
                      )
                    }
                    disabled={
                      !fieldsEnabled ||
                      isSaving
                    }
                    rows={3}
                  />
                </div>

                <div
                  className={`${styles.field} ${styles.fullWidth}`}
                >
                  <label
                    className={
                      styles.label
                    }
                  >
                    Observações
                  </label>

                  <textarea
                    className={
                      styles.textarea
                    }
                    value={
                      adoption.observacoes
                    }
                    onChange={(event) =>
                      handleAdoptionChange(
                        "observacoes",
                        event.target.value
                      )
                    }
                    disabled={
                      !fieldsEnabled ||
                      isSaving
                    }
                    rows={3}
                  />
                </div>
              </div>

              <div
                className={
                  styles.documentGrid
                }
              >
                <div
                  className={
                    styles.documentField
                  }
                >
                  <span
                    className={
                      styles.label
                    }
                  >
                    Entrevista de adoção
                  </span>

                  <div
                    className={
                      styles.documentBox
                    }
                  >
                    <FileText size={22} />

                    <span
                      className={
                        styles.documentName
                      }
                    >
                      {adoption
                        .entrevistaArquivo
                        ?.name ||
                        adoption.entrevistaNome ||
                        "Nenhum arquivo selecionado"}
                    </span>
                  </div>

                  <div
                    className={
                      styles.documentActions
                    }
                  >
                    {fieldsEnabled && (
                      <label
                        className={
                          styles.uploadButton
                        }
                      >
                        <Upload size={17} />

                        <span>
                          {adoption.entrevistaNome
                            ? "Substituir PDF"
                            : "Selecionar PDF"}
                        </span>

                        <input
                          type="file"
                          accept="application/pdf"
                          className={
                            styles.hiddenInput
                          }
                          onChange={(event) =>
                            handleAdoptionFileChange(
                              "entrevistaArquivo",
                              event
                            )
                          }
                          disabled={isSaving}
                        />
                      </label>
                    )}

                    {adoption.entrevistaUrl && (
                      <button
                        type="button"
                        className={
                          styles.downloadButton
                        }
                        onClick={() =>
                          handleDownload(
                            adoption.entrevistaUrl,
                            adoption.entrevistaNome
                          )
                        }
                        disabled={isSaving}
                      >
                        <Download size={17} />
                        <span>Baixar</span>
                      </button>
                    )}
                  </div>
                </div>

                <div
                  className={
                    styles.documentField
                  }
                >
                  <span
                    className={
                      styles.label
                    }
                  >
                    Termo de adoção
                  </span>

                  <div
                    className={
                      styles.documentBox
                    }
                  >
                    <FileText size={22} />

                    <span
                      className={
                        styles.documentName
                      }
                    >
                      {adoption.termoArquivo
                        ?.name ||
                        adoption.termoNome ||
                        "Nenhum arquivo selecionado"}
                    </span>
                  </div>

                  <div
                    className={
                      styles.documentActions
                    }
                  >
                    {fieldsEnabled && (
                      <label
                        className={
                          styles.uploadButton
                        }
                      >
                        <Upload size={17} />

                        <span>
                          {adoption.termoNome
                            ? "Substituir PDF"
                            : "Selecionar PDF"}
                        </span>

                        <input
                          type="file"
                          accept="application/pdf"
                          className={
                            styles.hiddenInput
                          }
                          onChange={(event) =>
                            handleAdoptionFileChange(
                              "termoArquivo",
                              event
                            )
                          }
                          disabled={isSaving}
                        />
                      </label>
                    )}

                    {adoption.termoUrl && (
                      <button
                        type="button"
                        className={
                          styles.downloadButton
                        }
                        onClick={() =>
                          handleDownload(
                            adoption.termoUrl,
                            adoption.termoNome
                          )
                        }
                        disabled={isSaving}
                      >
                        <Download size={17} />
                        <span>Baixar</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </section>
          )}

          {isViewMode && (
            <div
              className={
                styles.auditSection
              }
            >
              <div
                className={
                  styles.auditItem
                }
              >
                <span
                  className={
                    styles.auditLabel
                  }
                >
                  Criada em
                </span>

                <strong
                  className={
                    styles.auditValue
                  }
                >
                  {formatDateTime(
                    draft.dataCriacao
                  )}
                </strong>
              </div>

              <div
                className={
                  styles.auditItem
                }
              >
                <span
                  className={
                    styles.auditLabel
                  }
                >
                  Última modificação
                </span>

                <strong
                  className={
                    styles.auditValue
                  }
                >
                  {draft.dataModificacao
                    ? `${formatDateTime(
                        draft.dataModificacao
                      )}${
                        draft.modificadoPorNome
                          ? ` por ${draft.modificadoPorNome}`
                          : ""
                      }`
                    : "Ainda não modificada"}
                </strong>
              </div>
            </div>
          )}

          {protectedOccurrence &&
            isViewMode && (
              <div
                className={
                  styles.lockedNotice
                }
              >
                Esta ocorrência altera
                informações permanentes do
                animal e não pode ser excluída
                diretamente.
              </div>
            )}

          {draft.tipo === "ADOCAO" &&
            isViewMode && (
              <div
                className={
                  styles.lockedNotice
                }
              >
                Ao excluir esta ocorrência, os
                dados da adoção, a entrevista e
                o termo também serão removidos.
                O animal voltará para o status
                Disponível para adoção.
              </div>
            )}

          {errorMessage && (
            <div
              className={
                styles.errorMessage
              }
              role="alert"
            >
              {errorMessage}
            </div>
          )}
        </div>

        <div className={styles.footer}>
          {isViewMode && (
            <>
              {!protectedOccurrence && (
                <button
                  type="button"
                  className={
                    styles.deleteButton
                  }
                  onClick={handleDelete}
                  disabled={isSaving}
                >
                  <Trash2 size={18} />
                  <span>Excluir</span>
                </button>
              )}

              <div
                className={
                  styles.footerRight
                }
              >
                <button
                  type="button"
                  className={
                    styles.cancelButton
                  }
                  onClick={onClose}
                  disabled={isSaving}
                >
                  <CircleX size={18} />
                  <span>Fechar</span>
                </button>

                <button
                  type="button"
                  className={
                    styles.saveButton
                  }
                  onClick={() =>
                    setMode("edit")
                  }
                  disabled={isSaving}
                >
                  <Pencil size={18} />
                  <span>Editar</span>
                </button>
              </div>
            </>
          )}

          {isEditMode && (
            <div
              className={
                styles.footerRight
              }
            >
              <button
                type="button"
                className={
                  styles.cancelButton
                }
                onClick={
                  handleCancelEdit
                }
                disabled={isSaving}
              >
                <CircleX size={18} />
                <span>Cancelar</span>
              </button>

              <button
                type="button"
                className={
                  styles.saveButton
                }
                onClick={handleSave}
                disabled={isSaving}
              >
                <Save size={18} />

                <span>
                  {isSaving
                    ? "Salvando..."
                    : "Salvar alterações"}
                </span>
              </button>
            </div>
          )}

          {isCreateMode && (
            <div
              className={
                styles.footerRight
              }
            >
              <button
                type="button"
                className={
                  styles.cancelButton
                }
                onClick={onClose}
                disabled={isSaving}
              >
                <CircleX size={18} />
                <span>Cancelar</span>
              </button>

              <button
                type="button"
                className={
                  styles.saveButton
                }
                onClick={handleSave}
                disabled={isSaving}
              >
                <Save size={18} />

                <span>
                  {isSaving
                    ? "Salvando..."
                    : "Salvar ocorrência"}
                </span>
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}