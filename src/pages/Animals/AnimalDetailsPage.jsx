import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, ClipboardList, Pencil, Plus, X } from "lucide-react";
import { getAnimalDetailsById } from "../../data/mockAnimalDetails";
import styles from "./AnimalDetailsPage.module.css";

export default function AnimalDetailsPage() {
  const { id } = useParams();
  const animal = getAnimalDetailsById(id);

  const galleryImages = useMemo(() => {
    if (!animal) return [];
    if (animal.gallery && animal.gallery.length > 0) return animal.gallery;
    if (animal.imagem) return [animal.imagem];
    return [];
  }, [animal]);

  const [selectedImage, setSelectedImage] = useState("");
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);

  useEffect(() => {
    if (galleryImages.length > 0) {
      setSelectedImage(galleryImages[0]);
    }
  }, [galleryImages]);

  if (!animal) {
    return (
      <section className={styles.page}>
        <div className={styles.notFoundBox}>
          <h1 className={styles.notFoundTitle}>Animal não encontrado</h1>
          <Link to="/app/animals" className={styles.backLink}>
            Voltar para animais
          </Link>
        </div>
      </section>
    );
  }

  const visibleThumbnails = galleryImages.slice(0, 3);
  const remainingCount = Math.max(galleryImages.length - 3, 0);

  function handleSelectImage(image) {
    setSelectedImage(image);
  }

  return (
    <section className={styles.page}>
      <div className={styles.topBar}>
        <div className={styles.breadcrumb}>
          <Link to="/app/animals" className={styles.breadcrumbLink}>
            <ArrowLeft size={16} />
            <span>Animais</span>
          </Link>

          <span className={styles.breadcrumbSeparator}>›</span>
          <span className={styles.breadcrumbCurrent}>{animal.nome}</span>
        </div>

        <div className={styles.topActions}>
          <button
            type="button"
            className={styles.secondaryButton}
            onClick={() => alert("Editar animal")}
          >
            <Pencil size={16} />
            <span>Editar</span>
          </button>

          <button
            type="button"
            className={styles.primaryButton}
            onClick={() => alert("Nova ocorrência")}
          >
            <Plus size={18} />
            <span>Nova ocorrência</span>
          </button>
        </div>
      </div>

      <div className={styles.heroSection}>
        <div className={styles.imageColumn}>
          <img
            src={selectedImage || animal.imagem}
            alt={animal.nome}
            className={styles.mainImage}
          />

          <div className={styles.gallery}>
            {visibleThumbnails.map((image, index) => (
              <button
                key={`${animal.id}-thumb-${index}`}
                type="button"
                className={`${styles.thumbnailButton} ${
                  selectedImage === image ? styles.thumbnailActive : ""
                }`}
                onClick={() => handleSelectImage(image)}
              >
                <img
                  src={image}
                  alt={`${animal.nome} miniatura ${index + 1}`}
                  className={styles.galleryImage}
                />
              </button>
            ))}

            {remainingCount > 0 && (
              <button
                type="button"
                className={styles.moreImagesButton}
                onClick={() => setIsGalleryOpen(true)}
              >
                +{remainingCount}
              </button>
            )}
          </div>
        </div>

        <div className={styles.infoColumn}>
          <div className={styles.titleRow}>
            <h1 className={styles.animalName}>{animal.nome}</h1>
            <span className={styles.adoptionBadge}>{animal.adoptionLabel}</span>
          </div>

          <div className={styles.infoGrid}>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>Espécie</span>
              <span className={styles.infoValue}>
                {animal.especie === "dog" ? "Canina" : "Felina"}
              </span>
            </div>

            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>Sexo</span>
              <span className={styles.infoValue}>{animal.sexo}</span>
            </div>

            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>Castrado(a)</span>
              <span className={styles.infoValue}>{animal.castrado}</span>
            </div>

            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>Raça</span>
              <span className={styles.infoValue}>{animal.raca}</span>
            </div>

            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>Idade</span>
              <span className={styles.infoValue}>{animal.idade}</span>
            </div>

            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>Nascimento</span>
              <span className={styles.infoValue}>{animal.nascimento}</span>
            </div>

            <div className={styles.infoItemFull}>
              <span className={styles.infoLabel}>Responsável</span>
              <span className={styles.infoValue}>{animal.responsavel}</span>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.descriptionCard}>
        <h2 className={styles.sectionTitle}>Descrição</h2>
        <p className={styles.descriptionText}>{animal.descricao}</p>
      </div>

      <div className={styles.quickActions}>
        <button
          type="button"
          className={styles.quickActionCard}
          onClick={() => alert("Abrir carteira de vacinação")}
        >
          <div className={styles.quickActionIcon}>
            <ClipboardList size={20} />
          </div>

          <div>
            <strong className={styles.quickActionTitle}>
              Carteira de vacinação
            </strong>
            <p className={styles.quickActionSubtitle}>
              Ver histórico de vacinas
            </p>
          </div>
        </button>

        <button
          type="button"
          className={styles.quickActionCard}
          onClick={() => alert("Abrir histórico de ocorrências")}
        >
          <div className={styles.quickActionIcon}>
            <ClipboardList size={20} />
          </div>

          <div>
            <strong className={styles.quickActionTitle}>
              Histórico de ocorrências
            </strong>
            <p className={styles.quickActionSubtitle}>
              Ver todas as ocorrências
            </p>
          </div>
        </button>
      </div>

      <div className={styles.historyCard}>
        <h2 className={styles.historyTitle}>Histórico de ocorrências</h2>

        <div className={styles.historyList}>
          {animal.history.map((item) => (
            <article
              key={item.id}
              className={`${styles.historyItem} ${
                item.type === "warning"
                  ? styles.historyWarning
                  : styles.historySuccess
              }`}
            >
              <div className={styles.historyDate}>{item.date}</div>

              <div className={styles.historyContent}>
                <strong className={styles.historyItemTitle}>{item.title}</strong>
                <p className={styles.historyDescription}>{item.description}</p>
              </div>

              <span className={styles.historyStatus}>{item.status}</span>
            </article>
          ))}
        </div>

        <button
          type="button"
          className={styles.moreButton}
          onClick={() => alert("Ver todas as ocorrências")}
        >
          Ver todas as ocorrências
        </button>
      </div>

      {isGalleryOpen && (
        <div
          className={styles.galleryModalOverlay}
          onClick={() => setIsGalleryOpen(false)}
        >
          <div
            className={styles.galleryModal}
            onClick={(event) => event.stopPropagation()}
          >
            <div className={styles.galleryModalHeader}>
              <h2 className={styles.galleryModalTitle}>Todas as imagens</h2>

              <button
                type="button"
                className={styles.closeModalButton}
                onClick={() => setIsGalleryOpen(false)}
              >
                <X size={18} />
              </button>
            </div>

            <div className={styles.galleryModalGrid}>
              {galleryImages.map((image, index) => (
                <button
                  key={`${animal.id}-gallery-${index}`}
                  type="button"
                  className={`${styles.modalImageButton} ${
                    selectedImage === image ? styles.modalImageActive : ""
                  }`}
                  onClick={() => {
                    handleSelectImage(image);
                    setIsGalleryOpen(false);
                  }}
                >
                  <img
                    src={image}
                    alt={`${animal.nome} galeria ${index + 1}`}
                    className={styles.modalImage}
                  />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}