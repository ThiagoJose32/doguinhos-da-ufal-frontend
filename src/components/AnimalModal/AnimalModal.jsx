import { useEffect, useMemo, useState } from "react";
import {
  CircleX,
  Pencil,
  Save,
  Upload,
  X,
  FileText,
  ExternalLink,
} from "lucide-react";
import styles from "./AnimalModal.module.css";

const sexoOptions = ["Macho", "Fêmea"];

const especieOptions = [
  { value: "dog", label: "Canina" },
  { value: "cat", label: "Felina" },
];

const castradoOptions = ["Sim", "Não"];

const statusOptions = ["No campus", "Adotado", "Desaparecido", "Óbito"];

const porteOptions = ["Pequeno", "Médio", "Grande"];

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
  sexo: "Macho",
  especie: "dog",
  dataEstimadaNascimento: "",
  descricao: "",
  corPelagem: "Caramelo",
  porte: "Médio",
  castrado: "Não",
  status: "No campus",
  adotanteNome: "",
  termoAdocaoArquivoNome: "",
  termoAdocaoArquivoUrl: "",
};

function normalizeAnimal(animal) {
  if (!animal) return emptyAnimal;

  return {
    ...emptyAnimal,
    ...animal,
  };
}

export default function AnimalModal({
  isOpen,
  initialMode = "view",
  animal,
  onClose,
  onSave,
}) {
  const [mode, setMode] = useState(initialMode);
  const [draft, setDraft] = useState(normalizeAnimal(animal));
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (isOpen) {
      setMode(initialMode);
      setDraft(normalizeAnimal(animal));
      setErrorMessage("");
    }
  }, [isOpen, initialMode, animal]);

  const isCreateMode = mode === "create";
  const isEditMode = mode === "edit" || mode === "create";
  const isViewMode = mode === "view";
  const isAdopted = draft.status === "Adotado";

  const modalTitle = useMemo(() => {
    if (isCreateMode) return "Cadastrar animal";
    return draft.nome || "Detalhes do animal";
  }, [isCreateMode, draft.nome]);

  if (!isOpen) return null;

  function handleChange(field, value) {
    setDraft((prev) => ({
      ...prev,
      [field]: value,
    }));

    setErrorMessage("");
  }

  function handleStatusChange(value) {
    if (value !== "Adotado") {
      setDraft((prev) => ({
        ...prev,
        status: value,
        adotanteNome: "",
        termoAdocaoArquivoNome: "",
        termoAdocaoArquivoUrl: "",
      }));
    } else {
      setDraft((prev) => ({
        ...prev,
        status: value,
      }));
    }

    setErrorMessage("");
  }

  function handleProfileImageChange(event) {
    const file = event.target.files?.[0];

    if (!file) return;

    const previewUrl = URL.createObjectURL(file);

    setDraft((prev) => ({
      ...prev,
      imagem: previewUrl,
    }));

    setErrorMessage("");
  }

  function handleAdoptionTermChange(event) {
    const file = event.target.files?.[0];

    if (!file) return;

    const fileUrl = URL.createObjectURL(file);

    setDraft((prev) => ({
      ...prev,
      termoAdocaoArquivoNome: file.name,
      termoAdocaoArquivoUrl: fileUrl,
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
        return "Para marcar como adotado, informe o nome do adotante.";
      }

      if (!draft.termoAdocaoArquivoNome || !draft.termoAdocaoArquivoUrl) {
        return "Para marcar como adotado, anexe o termo de adoção em PDF.";
      }
    }

    return "";
  }

  function handleSave() {
    const validationError = validateForm();

    if (validationError) {
      setErrorMessage(validationError);
      return;
    }

    const payload = {
      ...draft,
      adotanteNome: draft.status === "Adotado" ? draft.adotanteNome : "",
      termoAdocaoArquivoNome:
        draft.status === "Adotado" ? draft.termoAdocaoArquivoNome : "",
      termoAdocaoArquivoUrl:
        draft.status === "Adotado" ? draft.termoAdocaoArquivoUrl : "",
    };

    onSave(payload, mode);

    if (mode === "edit") {
      setMode("view");
    }
  }

  function handleCancelEdit() {
    setDraft(normalizeAnimal(animal));
    setMode("view");
    setErrorMessage("");
  }

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(event) => event.stopPropagation()}>
        <div className={styles.header}>
          <div className={styles.headerText}>
            <span className={styles.headerTag}>
              {isCreateMode ? "Novo animal" : "Animal"}
            </span>

            <h2 className={styles.title}>{modalTitle}</h2>
          </div>

          <div className={styles.headerActions}>
            {!isCreateMode && (
              <span className={styles.statusBadge}>{draft.status}</span>
            )}

            <button type="button" className={styles.closeButton} onClick={onClose}>
              <X size={18} />
            </button>
          </div>
        </div>

        <div className={styles.body}>
          <div className={styles.leftColumn}>
            <div className={styles.card}>
              <h3 className={styles.sectionTitle}>Foto de perfil</h3>

              {draft.imagem ? (
                <img
                  src={draft.imagem}
                  alt={draft.nome || "Animal"}
                  className={styles.profileImage}
                />
              ) : (
                <div className={styles.emptyImage}>Sem foto cadastrada</div>
              )}

              {isEditMode && (
                <label className={styles.uploadButton}>
                  <Upload size={16} />
                  <span>Selecionar foto</span>
                  <input
                    type="file"
                    accept="image/*"
                    className={styles.hiddenInput}
                    onChange={handleProfileImageChange}
                  />
                </label>
              )}
            </div>
          </div>

          <div className={styles.rightColumn}>
            <div className={styles.card}>
              <div className={styles.formGrid}>
                <div className={styles.field}>
                  <label className={styles.label}>Nome</label>
                  <input
                    type="text"
                    className={styles.input}
                    value={draft.nome}
                    onChange={(event) => handleChange("nome", event.target.value)}
                    disabled={!isEditMode}
                  />
                </div>

                <div className={styles.field}>
                  <label className={styles.label}>Sexo</label>
                  <select
                    className={styles.select}
                    value={draft.sexo}
                    onChange={(event) => handleChange("sexo", event.target.value)}
                    disabled={!isEditMode}
                  >
                    {sexoOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>

                <div className={styles.field}>
                  <label className={styles.label}>Espécie</label>
                  <select
                    className={styles.select}
                    value={draft.especie}
                    onChange={(event) => handleChange("especie", event.target.value)}
                    disabled={!isEditMode}
                  >
                    {especieOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className={styles.field}>
                  <label className={styles.label}>Data estimada de nascimento</label>
                  <input
                    type="date"
                    className={styles.input}
                    value={draft.dataEstimadaNascimento}
                    onChange={(event) =>
                      handleChange("dataEstimadaNascimento", event.target.value)
                    }
                    disabled={!isEditMode}
                  />
                </div>

                <div className={styles.field}>
                  <label className={styles.label}>Porte</label>
                  <select
                    className={styles.select}
                    value={draft.porte}
                    onChange={(event) => handleChange("porte", event.target.value)}
                    disabled={!isEditMode}
                  >
                    {porteOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>

                <div className={styles.field}>
                  <label className={styles.label}>Cor da pelagem</label>
                  <select
                    className={styles.select}
                    value={draft.corPelagem}
                    onChange={(event) =>
                      handleChange("corPelagem", event.target.value)
                    }
                    disabled={!isEditMode}
                  >
                    {corPelagemOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>

                <div className={styles.field}>
                  <label className={styles.label}>Castrado(a)</label>
                  <select
                    className={styles.select}
                    value={draft.castrado}
                    onChange={(event) =>
                      handleChange("castrado", event.target.value)
                    }
                    disabled={!isEditMode}
                  >
                    {castradoOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>

                <div className={styles.field}>
                  <label className={styles.label}>Status</label>
                  <select
                    className={styles.select}
                    value={draft.status}
                    onChange={(event) => handleStatusChange(event.target.value)}
                    disabled={!isEditMode}
                  >
                    {statusOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>

                <div className={styles.fieldFull}>
                  <label className={styles.label}>Adotante</label>
                  <input
                    type="text"
                    className={styles.input}
                    value={draft.adotanteNome}
                    onChange={(event) =>
                      handleChange("adotanteNome", event.target.value)
                    }
                    disabled={!isEditMode || !isAdopted}
                    placeholder={
                      isAdopted
                        ? "Informe o nome do adotante"
                        : "Disponível apenas quando o status for Adotado"
                    }
                  />
                </div>

                <div className={styles.fieldFull}>
                  <label className={styles.label}>Termo de adoção (PDF)</label>

                  {isViewMode ? (
                    draft.termoAdocaoArquivoUrl ? (
                      <a
                        href={draft.termoAdocaoArquivoUrl}
                        target="_blank"
                        rel="noreferrer"
                        className={styles.fileLink}
                      >
                        <FileText size={16} />
                        <span>{draft.termoAdocaoArquivoNome}</span>
                        <ExternalLink size={16} />
                      </a>
                    ) : (
                      <div className={styles.filePlaceholder}>
                        Nenhum termo anexado
                      </div>
                    )
                  ) : (
                    <div className={styles.fileInputWrapper}>
                      <label
                        className={`${styles.uploadButton} ${
                          !isAdopted ? styles.uploadButtonDisabled : ""
                        }`}
                      >
                        <Upload size={16} />
                        <span>
                          {draft.termoAdocaoArquivoNome || "Selecionar PDF"}
                        </span>

                        <input
                          type="file"
                          accept="application/pdf"
                          className={styles.hiddenInput}
                          onChange={handleAdoptionTermChange}
                          disabled={!isAdopted}
                        />
                      </label>

                      {!isAdopted && (
                        <span className={styles.helperText}>
                          O termo é obrigatório apenas quando o status for Adotado.
                        </span>
                      )}
                    </div>
                  )}
                </div>

                <div className={styles.fieldFull}>
                  <label className={styles.label}>Descrição</label>
                  <textarea
                    className={styles.textarea}
                    value={draft.descricao}
                    onChange={(event) =>
                      handleChange("descricao", event.target.value)
                    }
                    disabled={!isEditMode}
                  />
                </div>
              </div>

              {errorMessage && (
                <div className={styles.errorBox}>{errorMessage}</div>
              )}
            </div>
          </div>
        </div>

        <div className={styles.footer}>
          {isViewMode && (
            <>
              <button
                type="button"
                className={styles.secondaryActionButton}
                onClick={onClose}
              >
                <CircleX size={16} />
                <span>Fechar</span>
              </button>

              <button
                type="button"
                className={styles.primaryActionButton}
                onClick={() => setMode("edit")}
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
                className={styles.secondaryActionButton}
                onClick={handleCancelEdit}
              >
                <CircleX size={16} />
                <span>Cancelar</span>
              </button>

              <button
                type="button"
                className={styles.primaryActionButton}
                onClick={handleSave}
              >
                <Save size={16} />
                <span>Salvar alterações</span>
              </button>
            </>
          )}

          {mode === "create" && (
            <>
              <button
                type="button"
                className={styles.secondaryActionButton}
                onClick={onClose}
              >
                <CircleX size={16} />
                <span>Cancelar</span>
              </button>

              <button
                type="button"
                className={styles.primaryActionButton}
                onClick={handleSave}
              >
                <Save size={16} />
                <span>Salvar animal</span>
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}