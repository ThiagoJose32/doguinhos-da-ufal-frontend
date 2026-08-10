import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  CalendarDays,
  CircleX,
  Download,
  FileText,
  Pencil,
  Plus,
  Save,
  Trash2,
  Upload,
  UserRound,
  WalletCards,
  X,
} from "lucide-react";

import OccurrenceModal from "../OccurrenceModal/OccurrenceModal";

import {
  getOccurrenceById,
  getOccurrenceTypeLabel,
  listOccurrencesByAnimal,
} from "../../services/occurrenceService";

import {
  ANIMAL_EDITABLE_STATUS_OPTIONS,
} from "../../services/animalService";

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

  adocaoId: null,
  ocorrenciaAdocaoId: null,
  dataAdocao: "",
  adotanteNome: "",

  entrevistaAdocaoArquivoNome: "",
  entrevistaAdocaoArquivoUrl: "",

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
  };
}

function getErrorMessage(error) {
  const responseData =
    error?.response?.data;

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

function formatOccurrenceDate(value) {
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

function formatCurrency(value) {
  if (
    value === null ||
    value === undefined ||
    value === ""
  ) {
    return "Sem custo informado";
  }

  const numericValue = Number(
    String(value).replace(",", ".")
  );

  if (!Number.isFinite(numericValue)) {
    return "Sem custo informado";
  }

  return numericValue.toLocaleString(
    "pt-BR",
    {
      style: "currency",
      currency: "BRL",
    }
  );
}

function sortOccurrences(items) {
  return [...items].sort(
    (
      firstOccurrence,
      secondOccurrence
    ) => {
      const dateComparison =
        String(
          secondOccurrence.data || ""
        ).localeCompare(
          String(
            firstOccurrence.data || ""
          )
        );

      if (dateComparison !== 0) {
        return dateComparison;
      }

      return String(
        secondOccurrence.dataCriacao ||
          ""
      ).localeCompare(
        String(
          firstOccurrence.dataCriacao ||
            ""
        )
      );
    }
  );
}

export default function AnimalModal({
  isOpen,
  initialMode = "view",
  animal,
  onClose,
  onSave,
  onDelete,
  onRefreshAnimal,
  onOpenAdoptionInterview,
  onOpenAdoptionTerm,
}) {
  const [mode, setMode] =
    useState(initialMode);

  const [draft, setDraft] =
    useState(() =>
      normalizeAnimal(animal)
    );

  const [
    errorMessage,
    setErrorMessage,
  ] = useState("");

  const [isSaving, setIsSaving] =
    useState(false);

  const [activeTab, setActiveTab] =
    useState("information");

  const [
    occurrences,
    setOccurrences,
  ] = useState([]);

  const [
    occurrencesLoading,
    setOccurrencesLoading,
  ] = useState(false);

  const [
    occurrenceError,
    setOccurrenceError,
  ] = useState("");

  const [
    openingAdoptionOccurrence,
    setOpeningAdoptionOccurrence,
  ] = useState(false);

  const [
    occurrenceModalConfig,
    setOccurrenceModalConfig,
  ] = useState({
    isOpen: false,
    initialMode: "view",
    occurrence: null,
  });

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    setMode(initialMode);

    setDraft(
      normalizeAnimal(animal)
    );

    setErrorMessage("");
    setIsSaving(false);
    setActiveTab("information");
    setOccurrences([]);
    setOccurrencesLoading(false);
    setOccurrenceError("");

    setOpeningAdoptionOccurrence(
      false
    );

    setOccurrenceModalConfig({
      isOpen: false,
      initialMode: "view",
      occurrence: null,
    });
  }, [
    isOpen,
    initialMode,
    animal,
  ]);

  const isCreateMode =
    mode === "create";

  const isEditMode =
    mode === "edit" ||
    mode === "create";

  const isViewMode =
    mode === "view";

  const isProtectedStatus =
    draft.status === "Adotado" ||
    draft.status === "Óbito";

  const hasAdoption =
    Boolean(draft.adocaoId);

  const showTabs =
    !isCreateMode &&
    isViewMode;

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

  useEffect(() => {
    if (
      !isOpen ||
      !draft.id ||
      !isViewMode ||
      activeTab !== "occurrences"
    ) {
      return;
    }

    let active = true;

    async function loadOccurrences() {
      setOccurrencesLoading(true);
      setOccurrenceError("");

      try {
        const response =
          await listOccurrencesByAnimal(
            draft.id
          );

        if (active) {
          setOccurrences(
            sortOccurrences(response)
          );
        }
      } catch (error) {
        if (active) {
          setOccurrenceError(
            getErrorMessage(error)
          );
        }
      } finally {
        if (active) {
          setOccurrencesLoading(
            false
          );
        }
      }
    }

    loadOccurrences();

    return () => {
      active = false;
    };
  }, [
    isOpen,
    draft.id,
    isViewMode,
    activeTab,
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

  function handleProfileImageChange(
    event
  ) {
    const file =
      event.target.files?.[0];

    if (!file) {
      return;
    }

    if (
      !file.type.startsWith("image/")
    ) {
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

  function validateForm() {
    if (!draft.nome.trim()) {
      return "Informe o nome do animal.";
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
      const savedAnimal =
        await onSave(
          {
            ...draft,
          },
          mode
        );

      if (savedAnimal) {
        setDraft(
          normalizeAnimal(savedAnimal)
        );
      }

      if (mode === "edit") {
        setMode("view");
        setActiveTab("information");
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

    const confirmed =
      window.confirm(
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
    setActiveTab("information");
    setErrorMessage("");
  }

  function handleNewOccurrence() {
    setOccurrenceModalConfig({
      isOpen: true,
      initialMode: "create",
      occurrence: null,
    });
  }

  function handleOpenOccurrence(
    occurrence
  ) {
    setOccurrenceModalConfig({
      isOpen: true,
      initialMode: "view",
      occurrence,
    });
  }

  function handleCloseOccurrenceModal() {
    setOccurrenceModalConfig({
      isOpen: false,
      initialMode: "view",
      occurrence: null,
    });
  }

  async function refreshAnimal() {
    if (
      !onRefreshAnimal ||
      !draft.id
    ) {
      return null;
    }

    const refreshedAnimal =
      await onRefreshAnimal(draft.id);

    if (refreshedAnimal) {
      setDraft(
        normalizeAnimal(
          refreshedAnimal
        )
      );
    }

    return refreshedAnimal;
  }

  async function handleOccurrenceSaved(
    savedOccurrence
  ) {
    setOccurrences(
      (currentOccurrences) => {
        const alreadyExists =
          currentOccurrences.some(
            (currentOccurrence) =>
              currentOccurrence.id ===
              savedOccurrence.id
          );

        const updatedOccurrences =
          alreadyExists
            ? currentOccurrences.map(
                (
                  currentOccurrence
                ) =>
                  currentOccurrence.id ===
                  savedOccurrence.id
                    ? savedOccurrence
                    : currentOccurrence
              )
            : [
                savedOccurrence,
                ...currentOccurrences,
              ];

        return sortOccurrences(
          updatedOccurrences
        );
      }
    );

    handleCloseOccurrenceModal();
    setOccurrenceError("");

    try {
      await refreshAnimal();
    } catch (error) {
      setOccurrenceError(
        "A ocorrência foi salva, mas não foi possível atualizar os dados do animal. " +
        getErrorMessage(error)
      );
    }
  }

  async function handleOccurrenceDeleted(
    deletedOccurrence
  ) {
    setOccurrences(
      (currentOccurrences) =>
        currentOccurrences.filter(
          (currentOccurrence) =>
            currentOccurrence.id !==
            deletedOccurrence.id
        )
    );

    handleCloseOccurrenceModal();
    setOccurrenceError("");

    try {
      await refreshAnimal();
    } catch (error) {
      setOccurrenceError(
        "A ocorrência foi excluída, mas não foi possível atualizar os dados do animal. " +
        getErrorMessage(error)
      );
    }
  }

  async function handleRetryOccurrences() {
    if (!draft.id) {
      return;
    }

    setOccurrencesLoading(true);
    setOccurrenceError("");

    try {
      const response =
        await listOccurrencesByAnimal(
          draft.id
        );

      setOccurrences(
        sortOccurrences(response)
      );
    } catch (error) {
      setOccurrenceError(
        getErrorMessage(error)
      );
    } finally {
      setOccurrencesLoading(false);
    }
  }

  async function handleOpenAdoptionOccurrence() {
    if (!draft.ocorrenciaAdocaoId) {
      return;
    }

    setOpeningAdoptionOccurrence(
      true
    );

    setErrorMessage("");

    try {
      const occurrence =
        await getOccurrenceById(
          draft.ocorrenciaAdocaoId
        );

      setOccurrenceModalConfig({
        isOpen: true,
        initialMode: "view",
        occurrence,
      });
    } catch (error) {
      setErrorMessage(
        getErrorMessage(error)
      );
    } finally {
      setOpeningAdoptionOccurrence(
        false
      );
    }
  }

  async function handleDownloadInterview() {
    if (!onOpenAdoptionInterview) {
      return;
    }

    try {
      await onOpenAdoptionInterview(
        draft
      );
    } catch (error) {
      setErrorMessage(
        getErrorMessage(error)
      );
    }
  }

  async function handleDownloadTerm() {
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

  const informationContent = (
    <div className={styles.body}>
      <div className={styles.leftColumn}>
        <div className={styles.card}>
          <h3
            className={
              styles.sectionTitle
            }
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
          <div className={styles.formGrid}>
            <div className={styles.field}>
              <label className={styles.label}>
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
              <label className={styles.label}>
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
              <label className={styles.label}>
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
              <label className={styles.label}>
                Data estimada de nascimento
              </label>

              <input
                type="date"
                className={styles.input}
                value={
                  draft.dataEstimadaNascimento
                }
                max={new Date()
                  .toISOString()
                  .split("T")[0]}
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
              <label className={styles.label}>
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
              <label className={styles.label}>
                Pelagem
              </label>

              <select
                className={styles.select}
                value={draft.corPelagem}
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
              <label className={styles.label}>
                Castrado(a)
              </label>

              <input
                type="text"
                className={`${styles.input} ${styles.inputReadOnly}`}
                value={draft.castrado}
                readOnly
              />

              {isEditMode && (
                <span
                  className={
                    styles.helperText
                  }
                >
                  Este campo é atualizado por
                  uma ocorrência de castração.
                </span>
              )}
            </div>

            <div className={styles.field}>
              <label className={styles.label}>
                Status
              </label>

              <select
                className={styles.select}
                value={draft.status}
                onChange={(event) =>
                  handleChange(
                    "status",
                    event.target.value
                  )
                }
                disabled={
                  !isEditMode ||
                  isSaving ||
                  isProtectedStatus
                }
              >
                {isProtectedStatus && (
                  <option
                    value={draft.status}
                  >
                    {draft.status}
                  </option>
                )}

                {!isProtectedStatus &&
                  ANIMAL_EDITABLE_STATUS_OPTIONS.map(
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

              {isEditMode && (
                <span
                  className={
                    styles.helperText
                  }
                >
                  Adoção e óbito devem ser
                  registrados por meio de
                  ocorrências.
                </span>
              )}
            </div>

            <div
              className={
                styles.fieldFull
              }
            >
              <label className={styles.label}>
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
              className={
                styles.errorBox
              }
            >
              {errorMessage}
            </div>
          )}
        </div>

        {hasAdoption && (
          <div
            className={
              styles.adoptionCard
            }
          >
            <div
              className={
                styles.adoptionHeader
              }
            >
              <div>
                <h3
                  className={
                    styles.sectionTitle
                  }
                >
                  Dados da adoção
                </h3>

                <p
                  className={
                    styles.helperText
                  }
                >
                  Documentos vinculados à
                  ocorrência de adoção.
                </p>
              </div>
            </div>

            <div
              className={
                styles.adoptionGrid
              }
            >
              <div
                className={
                  styles.adoptionItem
                }
              >
                <span
                  className={
                    styles.adoptionLabel
                  }
                >
                  Adotante
                </span>

                <strong
                  className={
                    styles.adoptionValue
                  }
                >
                  {draft.adotanteNome ||
                    "Não informado"}
                </strong>
              </div>

              <div
                className={
                  styles.adoptionItem
                }
              >
                <span
                  className={
                    styles.adoptionLabel
                  }
                >
                  Data da adoção
                </span>

                <strong
                  className={
                    styles.adoptionValue
                  }
                >
                  {formatOccurrenceDate(
                    draft.dataAdocao
                  )}
                </strong>
              </div>
            </div>

            <div
              className={
                styles.adoptionActions
              }
            >
              {draft.entrevistaAdocaoArquivoNome && (
                <button
                  type="button"
                  className={
                    styles.documentButton
                  }
                  onClick={
                    handleDownloadInterview
                  }
                >
                  <FileText size={17} />
                  <span>
                    Baixar entrevista
                  </span>
                  <Download size={16} />
                </button>
              )}

              {draft.termoAdocaoArquivoNome && (
                <button
                  type="button"
                  className={
                    styles.documentButton
                  }
                  onClick={
                    handleDownloadTerm
                  }
                >
                  <FileText size={17} />
                  <span>
                    Baixar termo
                  </span>
                  <Download size={16} />
                </button>
              )}

              {draft.ocorrenciaAdocaoId && (
                <button
                  type="button"
                  className={
                    styles.occurrenceLinkButton
                  }
                  onClick={
                    handleOpenAdoptionOccurrence
                  }
                  disabled={
                    openingAdoptionOccurrence
                  }
                >
                  <CalendarDays size={17} />

                  <span>
                    {openingAdoptionOccurrence
                      ? "Abrindo..."
                      : "Ver ocorrência"}
                  </span>
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );

  const occurrencesContent = (
    <div
      className={
        styles.occurrencesBody
      }
    >
      <div
        className={
          styles.occurrencesPanel
        }
      >
        <div
          className={
            styles.occurrencesHeader
          }
        >
          <div
            className={
              styles.occurrencesTitleGroup
            }
          >
            <h3
              className={
                styles.occurrencesTitle
              }
            >
              Histórico de ocorrências
            </h3>

            <p
              className={
                styles.occurrencesSubtitle
              }
            >
              Registre acontecimentos,
              cuidados e procedimentos
              relacionados ao animal.
            </p>
          </div>

          <button
            type="button"
            className={
              styles.newOccurrenceButton
            }
            onClick={
              handleNewOccurrence
            }
          >
            <Plus size={18} />
            <span>Nova ocorrência</span>
          </button>
        </div>

        {occurrencesLoading && (
          <div
            className={
              styles.occurrenceState
            }
          >
            Carregando ocorrências...
          </div>
        )}

        {!occurrencesLoading &&
          occurrenceError && (
            <div
              className={
                styles.occurrenceErrorState
              }
            >
              <span>
                {occurrenceError}
              </span>

              <button
                type="button"
                className={
                  styles.retryOccurrenceButton
                }
                onClick={
                  handleRetryOccurrences
                }
              >
                Tentar novamente
              </button>
            </div>
          )}

        {!occurrencesLoading &&
          !occurrenceError &&
          occurrences.length === 0 && (
            <div
              className={
                styles.occurrenceState
              }
            >
              Nenhuma ocorrência cadastrada
              para este animal.
            </div>
          )}

        {!occurrencesLoading &&
          !occurrenceError &&
          occurrences.length > 0 && (
            <div
              className={
                styles.occurrenceList
              }
            >
              {occurrences.map(
                (occurrenceItem) => (
                  <button
                    key={
                      occurrenceItem.id
                    }
                    type="button"
                    className={
                      styles.occurrenceCard
                    }
                    onClick={() =>
                      handleOpenOccurrence(
                        occurrenceItem
                      )
                    }
                  >
                    <div
                      className={
                        styles.occurrenceCardHeader
                      }
                    >
                      <span
                        className={
                          styles.occurrenceTypeBadge
                        }
                      >
                        {getOccurrenceTypeLabel(
                          occurrenceItem.tipo
                        )}
                      </span>

                      <span
                        className={
                          styles.occurrenceDate
                        }
                      >
                        <CalendarDays
                          size={15}
                        />

                        {formatOccurrenceDate(
                          occurrenceItem.data
                        )}
                      </span>
                    </div>

                    <p
                      className={
                        styles.occurrenceDescription
                      }
                    >
                      {occurrenceItem.descricao ||
                        "Sem descrição cadastrada."}
                    </p>

                    <div
                      className={
                        styles.occurrenceMeta
                      }
                    >
                      <span
                        className={
                          styles.occurrenceMetaItem
                        }
                      >
                        <WalletCards
                          size={15}
                        />

                        {formatCurrency(
                          occurrenceItem.custo
                        )}
                      </span>

                      <span
                        className={
                          styles.occurrenceMetaItem
                        }
                      >
                        <UserRound
                          size={15}
                        />

                        {occurrenceItem.criadoPorNome ||
                          "Usuário não informado"}
                      </span>
                    </div>
                  </button>
                )
              )}
            </div>
          )}
      </div>
    </div>
  );

  return (
    <>
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
            <div
              className={
                styles.headerText
              }
            >
              <span
                className={
                  styles.headerTag
                }
              >
                {isCreateMode
                  ? "Novo animal"
                  : "Animal"}
              </span>

              <h2
                className={styles.title}
              >
                {modalTitle}
              </h2>
            </div>

            <div
              className={
                styles.headerActions
              }
            >
              {!isCreateMode && (
                <span
                  className={
                    styles.statusBadge
                  }
                >
                  {draft.status}
                </span>
              )}

              <button
                type="button"
                className={
                  styles.closeButton
                }
                onClick={onClose}
                disabled={isSaving}
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {showTabs && (
            <div
              className={
                styles.tabsBar
              }
            >
              <button
                type="button"
                className={`${styles.tabButton} ${
                  activeTab ===
                  "information"
                    ? styles.activeTab
                    : ""
                }`}
                onClick={() =>
                  setActiveTab(
                    "information"
                  )
                }
              >
                Informações
              </button>

              <button
                type="button"
                className={`${styles.tabButton} ${
                  activeTab ===
                  "occurrences"
                    ? styles.activeTab
                    : ""
                }`}
                onClick={() =>
                  setActiveTab(
                    "occurrences"
                  )
                }
              >
                Ocorrências
              </button>
            </div>
          )}

          {isViewMode &&
          activeTab === "occurrences"
            ? occurrencesContent
            : informationContent}

          <div className={styles.footer}>
            {isViewMode &&
              activeTab ===
                "information" && (
                <>
                  {onDelete &&
                    draft.id && (
                      <button
                        type="button"
                        className={
                          styles.secondaryActionButton
                        }
                        onClick={
                          handleDelete
                        }
                        disabled={
                          isSaving
                        }
                      >
                        <Trash2
                          size={16}
                        />
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
                    <CircleX
                      size={16}
                    />
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

            {isViewMode &&
              activeTab ===
                "occurrences" && (
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
              )}

            {mode === "edit" && (
              <>
                <button
                  type="button"
                  className={
                    styles.secondaryActionButton
                  }
                  onClick={
                    handleCancelEdit
                  }
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

      <OccurrenceModal
        isOpen={
          occurrenceModalConfig.isOpen
        }
        initialMode={
          occurrenceModalConfig.initialMode
        }
        occurrence={
          occurrenceModalConfig.occurrence
        }
        occurrences={occurrences}
        animalId={draft.id}
        animalCastrado={
          draft.castrado === "Sim"
        }
        onClose={
          handleCloseOccurrenceModal
        }
        onSaved={
          handleOccurrenceSaved
        }
        onDeleted={
          handleOccurrenceDeleted
        }
      />
    </>
  );
}