import {
  useEffect,
  useMemo,
  useState,
} from "react";

import { Link } from "react-router-dom";

import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  HeartHandshake,
  LogIn,
  MapPin,
  PawPrint,
  Users,
} from "lucide-react";

import api from "../../services/api";

import {
  createInitialsAvatar,
} from "../../utils/avatar";

import styles from "./HomePage.module.css";

import petLogo from "../../assets/figma/Subtract.png";
import pawIcon from "../../assets/figma/Pets Streamline Outlined-Material-Symbols.png";

import heroImage from "../../assets/figma/image 1.png";
import heroDog1 from "../../assets/figma/dog1.jpg";
import heroDog2 from "../../assets/figma/dog2.jpeg";
import heroDog3 from "../../assets/figma/dog3.jpg";

import partnersLogo from "../../assets/figma/image 5.png";
import visionDog from "../../assets/animals/dog-laika.jpg";

import serviceBanho from "../../assets/figma/Rectangle 18.png";
import serviceTosa from "../../assets/figma/Rectangle 19.png";
import serviceAlimentacao from "../../assets/figma/Rectangle 20.png";
import serviceCastracao from "../../assets/figma/Rectangle 21.png";

/*
 * Estes são os endpoints atuais da aplicação.
 *
 * Antes de liberar GET /api/usuarios publicamente,
 * confirme que a resposta não expõe e-mail, telefone
 * ou outras informações pessoais.
 *
 * O ideal posteriormente é usar:
 * /api/publico/voluntarios
 */
const ANIMALS_ENDPOINT = "/api/animais";
const VOLUNTEERS_ENDPOINT = "/api/usuarios";

const MAX_PUBLIC_ANIMALS = 6;
const MAX_PUBLIC_VOLUNTEERS = 6;

const heroSlides = [
  heroImage,
  heroDog1,
  heroDog2,
  heroDog3,
];

const projectActivities = [
  {
    id: "higiene",
    image: serviceBanho,
    title: "Higiene e bem-estar",
    text:
      "Ações de cuidado ajudam a manter os animais limpos, confortáveis e em melhores condições de saúde.",
  },
  {
    id: "acompanhamento",
    image: serviceTosa,
    title: "Acompanhamento contínuo",
    text:
      "Cada animal pode ter seu histórico registrado, facilitando o acompanhamento das ações realizadas.",
  },
  {
    id: "alimentacao",
    image: serviceAlimentacao,
    title: "Alimentação",
    text:
      "A equipe organiza o fornecimento de alimento e mobiliza a comunidade para apoiar as necessidades do projeto.",
  },
  {
    id: "castracao",
    image: serviceCastracao,
    title: "Castração e saúde",
    text:
      "O acompanhamento veterinário e a castração contribuem para o controle populacional e para a qualidade de vida.",
  },
];

function extractArray(data) {
  if (Array.isArray(data)) {
    return data;
  }

  if (Array.isArray(data?.content)) {
    return data.content;
  }

  return [];
}

function buildAbsoluteUrl(path) {
  if (!path) {
    return "";
  }

  if (
    path.startsWith("http://") ||
    path.startsWith("https://") ||
    path.startsWith("data:") ||
    path.startsWith("blob:")
  ) {
    return path;
  }

  const baseUrl = (
    api.defaults.baseURL || ""
  ).replace(/\/$/, "");

  const normalizedPath =
    path.startsWith("/")
      ? path
      : `/${path}`;

  return `${baseUrl}${normalizedPath}`;
}

function addVersionToUrl(url, version) {
  if (!url || url.startsWith("data:")) {
    return url;
  }

  const separator = url.includes("?")
    ? "&"
    : "?";

  return `${url}${separator}v=${version || "1"}`;
}

function normalizeEnum(value) {
  return String(value || "")
    .trim()
    .toUpperCase()
    .replaceAll(" ", "_")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function isAvailableForAdoption(animal) {
  const status = normalizeEnum(
    animal?.status
  );

  return (
    status === "DISPONIVEL_ADOCAO" ||
    status === "DISPONIVEL_PARA_ADOCAO"
  );
}

function isActiveVolunteer(user) {
  if (user?.ativo === false) {
    return false;
  }

  const status = normalizeEnum(
    user?.status
  );

  return (
    status !== "INATIVO" &&
    status !== "INACTIVE"
  );
}

function formatAnimalSpecies(value) {
  const normalized =
    normalizeEnum(value);

  if (
    normalized === "CACHORRO" ||
    normalized === "DOG"
  ) {
    return "Cachorro";
  }

  if (
    normalized === "GATO" ||
    normalized === "CAT"
  ) {
    return "Gato";
  }

  return "Animal";
}

function formatAnimalSex(value) {
  const normalized =
    normalizeEnum(value);

  if (normalized === "MACHO") {
    return "Macho";
  }

  if (
    normalized === "FEMEA" ||
    normalized === "FÊMEA"
  ) {
    return "Fêmea";
  }

  return "";
}

function calculateAge(dateValue) {
  if (!dateValue) {
    return "Idade não informada";
  }

  const birthDate = new Date(
    `${dateValue}T00:00:00`
  );

  const today = new Date();

  if (
    Number.isNaN(birthDate.getTime()) ||
    birthDate > today
  ) {
    return "Idade não informada";
  }

  let years =
    today.getFullYear() -
    birthDate.getFullYear();

  let months =
    today.getMonth() -
    birthDate.getMonth();

  if (
    today.getDate() <
    birthDate.getDate()
  ) {
    months -= 1;
  }

  if (months < 0) {
    years -= 1;
    months += 12;
  }

  if (years > 0) {
    return years === 1
      ? "1 ano"
      : `${years} anos`;
  }

  if (months > 0) {
    return months === 1
      ? "1 mês"
      : `${months} meses`;
  }

  return "Menos de 1 mês";
}

function normalizeAnimal(animal) {
  const name =
    animal?.nome?.trim() ||
    "Animal sem nome";

  const rawPhoto =
    animal?.fotoPerfilUrl ||
    animal?.fotoUrl ||
    animal?.imagem ||
    "";

  const photoUrl = buildAbsoluteUrl(
    rawPhoto
  );

  return {
    id:
      animal?.id ||
      `${name}-${animal?.dataCriacao || ""}`,

    name,

    photo:
      photoUrl
        ? addVersionToUrl(
            photoUrl,
            animal?.id
          )
        : createInitialsAvatar(
            name,
            "A"
          ),

    species: formatAnimalSpecies(
      animal?.especie
    ),

    sex: formatAnimalSex(
      animal?.sexo
    ),

    age:
      animal?.idade ||
      calculateAge(
        animal?.dataNascimento ||
          animal?.dataEstimadaNascimento
      ),

    description:
      animal?.descricao?.trim() ||
      "Este animal está disponível para adoção responsável e aguarda uma nova família.",
  };
}

function normalizeVolunteer(user) {
  const name =
    user?.nome?.trim() ||
    "Voluntário";

  const rawPhoto =
    user?.fotoUrl ||
    user?.fotoPerfilUrl ||
    user?.imagem ||
    "";

  const photoUrl = buildAbsoluteUrl(
    rawPhoto
  );

  const profile =
    normalizeEnum(user?.perfil);

  const role =
    profile === "ADMIN"
      ? "Administração do projeto"
      : "Voluntário(a)";

  return {
    id:
      user?.id ||
      `${name}-${user?.email || ""}`,

    name,

    photo:
      photoUrl
        ? addVersionToUrl(
            photoUrl,
            user?.id
          )
        : createInitialsAvatar(
            name,
            "U"
          ),

    institution:
      user?.instituicao?.trim() ||
      user?.universidade?.trim() ||
      "",

    course:
      user?.curso?.trim() || "",

    description:
      user?.descricao?.trim() ||
      `${role} do projeto ARA Campus Pets.`,
  };
}

function getVolunteerSubtitle(
  volunteer
) {
  const details = [
    volunteer.institution,
    volunteer.course,
  ].filter(Boolean);

  return details.length > 0
    ? details.join(" — ")
    : "ARA Campus Pets";
}

function ImageWithFallback({
  src,
  alt,
  name,
  fallback = "A",
  className,
}) {
  function handleError(event) {
    event.currentTarget.onerror = null;

    event.currentTarget.src =
      createInitialsAvatar(
        name,
        fallback
      );
  }

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      onError={handleError}
      loading="lazy"
    />
  );
}

function HeroSlider() {
  const [index, setIndex] =
    useState(0);

  useEffect(() => {
    const intervalId = window.setInterval(
      () => {
        setIndex(
          (currentIndex) =>
            (currentIndex + 1) %
            heroSlides.length
        );
      },
      5000
    );

    return () => {
      window.clearInterval(intervalId);
    };
  }, []);

  function showPreviousSlide() {
    setIndex(
      (currentIndex) =>
        currentIndex === 0
          ? heroSlides.length - 1
          : currentIndex - 1
    );
  }

  function showNextSlide() {
    setIndex(
      (currentIndex) =>
        (currentIndex + 1) %
        heroSlides.length
    );
  }

  return (
    <div className={styles.heroSlider}>
      {heroSlides.map(
        (source, slideIndex) => (
          <img
            key={source}
            src={source}
            alt=""
            className={`${styles.heroSlide} ${
              slideIndex === index
                ? styles.heroSlideActive
                : ""
            }`}
            aria-hidden={
              slideIndex !== index
            }
          />
        )
      )}

      <div className={styles.heroOverlay} />

      <div className={styles.heroContent}>
        <span className={styles.heroTag}>
          ARA Campus Pets
        </span>

        <h1 className={styles.heroTitle}>
          Cuidado, informação e novas
          oportunidades para os animais
          do Campus Arapiraca
        </h1>

        <p className={styles.heroText}>
          Conheça o projeto, acompanhe os
          animais disponíveis para adoção
          e descubra como a comunidade pode
          contribuir.
        </p>

        <div className={styles.heroActions}>
          <a
            href="#adocao"
            className={
              styles.primaryButton
            }
          >
            <PawPrint size={19} />
            Conheça os animais
          </a>

          <a
            href="#projeto"
            className={
              styles.secondaryButton
            }
          >
            Saiba mais
            <ArrowRight size={18} />
          </a>
        </div>
      </div>

      <button
        type="button"
        className={`${styles.heroArrow} ${styles.heroArrowLeft}`}
        onClick={showPreviousSlide}
        aria-label="Imagem anterior"
      >
        <ChevronLeft size={24} />
      </button>

      <button
        type="button"
        className={`${styles.heroArrow} ${styles.heroArrowRight}`}
        onClick={showNextSlide}
        aria-label="Próxima imagem"
      >
        <ChevronRight size={24} />
      </button>

      <div className={styles.heroDots}>
        {heroSlides.map(
          (_, slideIndex) => (
            <button
              key={slideIndex}
              type="button"
              className={`${styles.heroDot} ${
                slideIndex === index
                  ? styles.heroDotActive
                  : ""
              }`}
              onClick={() =>
                setIndex(slideIndex)
              }
              aria-label={`Exibir imagem ${
                slideIndex + 1
              }`}
            />
          )
        )}
      </div>
    </div>
  );
}

function SectionTitle({
  eyebrow,
  children,
  description,
}) {
  return (
    <div className={styles.sectionHeading}>
      {eyebrow && (
        <span
          className={
            styles.sectionEyebrow
          }
        >
          {eyebrow}
        </span>
      )}

      <h2 className={styles.sectionTitle}>
        <span>{children}</span>

        <img
          src={pawIcon}
          alt=""
          className={
            styles.sectionTitlePaw
          }
        />
      </h2>

      {description && (
        <p
          className={
            styles.sectionDescription
          }
        >
          {description}
        </p>
      )}
    </div>
  );
}

function LoadingCards({
  count = 3,
}) {
  return (
    <div className={styles.loadingGrid}>
      {Array.from({
        length: count,
      }).map((_, index) => (
        <div
          key={index}
          className={styles.loadingCard}
        >
          <div
            className={
              styles.loadingImage
            }
          />

          <div
            className={
              styles.loadingContent
            }
          >
            <div
              className={
                styles.loadingLineLarge
              }
            />

            <div
              className={
                styles.loadingLine
              }
            />

            <div
              className={
                styles.loadingLineSmall
              }
            />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function HomePage() {
  const [animals, setAnimals] =
    useState([]);

  const [volunteers, setVolunteers] =
    useState([]);

  const [
    animalsLoading,
    setAnimalsLoading,
  ] = useState(true);

  const [
    volunteersLoading,
    setVolunteersLoading,
  ] = useState(true);

  const [
    animalsError,
    setAnimalsError,
  ] = useState("");

  const [
    volunteersError,
    setVolunteersError,
  ] = useState("");

  useEffect(() => {
    let active = true;

    async function loadPublicData() {
      const [
        animalsResult,
        volunteersResult,
      ] = await Promise.allSettled([
        api.get(ANIMALS_ENDPOINT),
        api.get(VOLUNTEERS_ENDPOINT),
      ]);

      if (!active) {
        return;
      }

      if (
        animalsResult.status ===
        "fulfilled"
      ) {
        const availableAnimals =
          extractArray(
            animalsResult.value.data
          )
            .filter(
              isAvailableForAdoption
            )
            .map(normalizeAnimal)
            .sort((first, second) =>
              first.name.localeCompare(
                second.name,
                "pt-BR"
              )
            );

        setAnimals(availableAnimals);
      } else {
        setAnimalsError(
          "Não foi possível carregar os animais disponíveis neste momento."
        );
      }

      setAnimalsLoading(false);

      if (
        volunteersResult.status ===
        "fulfilled"
      ) {
        const activeVolunteers =
          extractArray(
            volunteersResult.value.data
          )
            .filter(isActiveVolunteer)
            .map(normalizeVolunteer)
            .sort((first, second) =>
              first.name.localeCompare(
                second.name,
                "pt-BR"
              )
            );

        setVolunteers(
          activeVolunteers
        );
      } else {
        setVolunteersError(
          "Não foi possível carregar a equipe do projeto neste momento."
        );
      }

      setVolunteersLoading(false);
    }

    loadPublicData();

    return () => {
      active = false;
    };
  }, []);

  const visibleAnimals =
    useMemo(
      () =>
        animals.slice(
          0,
          MAX_PUBLIC_ANIMALS
        ),
      [animals]
    );

  const visibleVolunteers =
    useMemo(
      () =>
        volunteers.slice(
          0,
          MAX_PUBLIC_VOLUNTEERS
        ),
      [volunteers]
    );

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div className={styles.headerInner}>
          <a
            href="#inicio"
            className={styles.brand}
            aria-label="Ir para o início"
          >
            <img
              src={petLogo}
              alt="ARA Campus Pets"
            />

            <div
              className={
                styles.brandText
              }
            >
              <strong>
                ARA Campus Pets
              </strong>

              <span>
                Campus Arapiraca
              </span>
            </div>
          </a>

          <nav
            className={styles.nav}
            aria-label="Navegação principal"
          >
            <a href="#projeto">
              O projeto
            </a>

            <a href="#adocao">
              Adoção
            </a>

            <a href="#equipe">
              Equipe
            </a>

            <Link
              to="/login"
              className={styles.loginLink}
            >
              <LogIn size={17} />
              Área do voluntário
            </Link>
          </nav>
        </div>
      </header>

      <main>
        <section
          id="inicio"
          className={styles.hero}
        >
          <HeroSlider />
        </section>

        <section
          id="projeto"
          className={styles.section}
        >
          <SectionTitle
            eyebrow="Sobre o projeto"
            description="Uma iniciativa dedicada ao cuidado, ao acompanhamento e à busca por soluções responsáveis para os animais que vivem no Campus Arapiraca e em seu entorno."
          >
            Nossa visão
          </SectionTitle>

          <div className={styles.visionGrid}>
            <div
              className={
                styles.visionImageWrapper
              }
            >
              <div
                className={
                  styles.visionImage
                }
              >
                <img
                  src={visionDog}
                  alt="Animal acompanhado pelo projeto"
                />
              </div>

              <div
                className={
                  styles.visionBadge
                }
              >
                <HeartHandshake
                  size={21}
                />

                <span>
                  Cuidado coletivo
                </span>
              </div>
            </div>

            <div
              className={
                styles.visionContent
              }
            >
              <h3>
                Informação que fortalece o
                cuidado
              </h3>

              <p>
                O ARA Campus Pets reúne
                voluntários e apoiadores em
                ações de alimentação, manejo,
                acompanhamento da saúde,
                castração e adoção responsável
                de animais que circulam pelo
                Campus Arapiraca.
              </p>

              <p>
                A plataforma foi criada para
                centralizar o histórico dos
                animais, registrar as ações
                realizadas e facilitar o acesso
                da comunidade às informações
                sobre aqueles que estão
                disponíveis para adoção.
              </p>

              <p>
                Com registros organizados, a
                equipe consegue preservar a
                memória do projeto, acompanhar
                cada animal e tomar decisões
                com mais segurança.
              </p>
            </div>
          </div>
        </section>

        <section
          className={
            styles.communitySection
          }
        >
          <div
            className={
              styles.communityInner
            }
          >
            <SectionTitle
              eyebrow="Participe"
              description="A participação da comunidade amplia a capacidade do projeto de cuidar dos animais e encontrar famílias responsáveis."
            >
              Faça parte dessa rede
            </SectionTitle>

            <div
              className={
                styles.communityGrid
              }
            >
              <div
                className={
                  styles.communityContent
                }
              >
                <h3>
                  Por que apoiar o projeto?
                </h3>

                <ul
                  className={
                    styles.volunteerList
                  }
                >
                  <li>
                    Contribuir com o bem-estar
                    dos animais que vivem no
                    campus e em seu entorno.
                  </li>

                  <li>
                    Apoiar campanhas de
                    alimentação, castração,
                    cuidados de saúde e adoção.
                  </li>

                  <li>
                    Ajudar na divulgação dos
                    animais que aguardam uma
                    família.
                  </li>

                  <li>
                    Participar de uma iniciativa
                    coletiva que aproxima
                    estudantes, servidores e
                    comunidade externa.
                  </li>
                </ul>

                <a
                  href="#equipe"
                  className={
                    styles.outlineButton
                  }
                >
                  Conheça os voluntários
                  <ArrowRight size={18} />
                </a>
              </div>

              <div className={styles.statsGrid}>
                <article
                  className={styles.statCard}
                >
                  <div
                    className={
                      styles.statIcon
                    }
                  >
                    <PawPrint size={25} />
                  </div>

                  <strong>
                    {animalsLoading
                      ? "—"
                      : animals.length}
                  </strong>

                  <span>
                    {animals.length === 1
                      ? "animal disponível para adoção"
                      : "animais disponíveis para adoção"}
                  </span>
                </article>

                <article
                  className={styles.statCard}
                >
                  <div
                    className={
                      styles.statIcon
                    }
                  >
                    <Users size={25} />
                  </div>

                  <strong>
                    {volunteersLoading
                      ? "—"
                      : volunteers.length}
                  </strong>

                  <span>
                    {volunteers.length === 1
                      ? "voluntário ativo"
                      : "voluntários ativos"}
                  </span>
                </article>
              </div>
            </div>
          </div>
        </section>

        <section
          id="adocao"
          className={styles.section}
        >
          <SectionTitle
            eyebrow="Adoção responsável"
            description="Conheça alguns dos animais que estão aguardando uma oportunidade de receber cuidado, proteção e um novo lar."
          >
            Animais disponíveis
          </SectionTitle>

          {animalsLoading && (
            <LoadingCards count={3} />
          )}

          {!animalsLoading &&
            animalsError && (
              <div
                className={
                  styles.feedbackBox
                }
                role="alert"
              >
                {animalsError}
              </div>
            )}

          {!animalsLoading &&
            !animalsError &&
            visibleAnimals.length ===
              0 && (
              <div
                className={
                  styles.emptyState
                }
              >
                <PawPrint size={34} />

                <h3>
                  Nenhum animal disponível
                  neste momento
                </h3>

                <p>
                  Novos animais aparecerão aqui
                  quando estiverem disponíveis
                  para adoção.
                </p>
              </div>
            )}

          {!animalsLoading &&
            !animalsError &&
            visibleAnimals.length >
              0 && (
              <>
                <div
                  className={
                    styles.animalGrid
                  }
                >
                  {visibleAnimals.map(
                    (animal) => (
                      <article
                        key={animal.id}
                        className={
                          styles.animalCard
                        }
                      >
                        <div
                          className={
                            styles.animalPhoto
                          }
                        >
                          <ImageWithFallback
                            src={animal.photo}
                            alt={`Foto de ${animal.name}`}
                            name={animal.name}
                            fallback="A"
                          />

                          <span
                            className={
                              styles.availableBadge
                            }
                          >
                            Disponível para
                            adoção
                          </span>
                        </div>

                        <div
                          className={
                            styles.animalContent
                          }
                        >
                          <h3
                            className={
                              styles.animalName
                            }
                          >
                            {animal.name}
                          </h3>

                          <p
                            className={
                              styles.animalMeta
                            }
                          >
                            {[
                              animal.species,
                              animal.sex,
                              animal.age,
                            ]
                              .filter(Boolean)
                              .join(" • ")}
                          </p>

                          <p
                            className={
                              styles.animalDescription
                            }
                          >
                            {animal.description}
                          </p>
                        </div>
                      </article>
                    )
                  )}
                </div>

                {animals.length >
                  MAX_PUBLIC_ANIMALS && (
                  <p
                    className={
                      styles.sectionFootnote
                    }
                  >
                    Exibindo{" "}
                    {MAX_PUBLIC_ANIMALS} de{" "}
                    {animals.length} animais
                    disponíveis.
                  </p>
                )}
              </>
            )}
        </section>

        <section
          id="equipe"
          className={
            styles.teamSection
          }
        >
          <div
            className={
              styles.teamSectionInner
            }
          >
            <SectionTitle
              eyebrow="Pessoas que fazem acontecer"
              description="O projeto é construído diariamente por pessoas que compartilham responsabilidades, conhecimento e cuidado."
            >
              Nossa equipe
            </SectionTitle>

            {volunteersLoading && (
              <LoadingCards count={3} />
            )}

            {!volunteersLoading &&
              volunteersError && (
                <div
                  className={
                    styles.feedbackBox
                  }
                  role="alert"
                >
                  {volunteersError}
                </div>
              )}

            {!volunteersLoading &&
              !volunteersError &&
              visibleVolunteers.length ===
                0 && (
                <div
                  className={
                    styles.emptyState
                  }
                >
                  <Users size={34} />

                  <h3>
                    Equipe ainda não
                    cadastrada
                  </h3>

                  <p>
                    Os voluntários ativos serão
                    apresentados nesta seção.
                  </p>
                </div>
              )}

            {!volunteersLoading &&
              !volunteersError &&
              visibleVolunteers.length >
                0 && (
                <>
                  <div
                    className={
                      styles.teamGrid
                    }
                  >
                    {visibleVolunteers.map(
                      (member) => (
                        <article
                          key={member.id}
                          className={
                            styles.teamCard
                          }
                        >
                          <div
                            className={
                              styles.teamPhoto
                            }
                          >
                            <ImageWithFallback
                              src={member.photo}
                              alt={`Foto de ${member.name}`}
                              name={member.name}
                              fallback="U"
                            />
                          </div>

                          <div
                            className={
                              styles.teamContent
                            }
                          >
                            <h3
                              className={
                                styles.teamName
                              }
                            >
                              {member.name}
                            </h3>

                            <span
                              className={
                                styles.teamRole
                              }
                            >
                              {getVolunteerSubtitle(
                                member
                              )}
                            </span>

                            <p
                              className={
                                styles.teamText
                              }
                            >
                              {member.description}
                            </p>
                          </div>
                        </article>
                      )
                    )}
                  </div>

                  {volunteers.length >
                    MAX_PUBLIC_VOLUNTEERS && (
                    <p
                      className={
                        styles.sectionFootnote
                      }
                    >
                      Exibindo{" "}
                      {MAX_PUBLIC_VOLUNTEERS} de{" "}
                      {volunteers.length}{" "}
                      voluntários ativos.
                    </p>
                  )}
                </>
              )}
          </div>
        </section>

        <section
          className={styles.section}
        >
          <SectionTitle
            eyebrow="Atuação"
            description="O trabalho do projeto envolve diferentes frentes que se complementam para oferecer um acompanhamento mais responsável."
          >
            O que fazemos
          </SectionTitle>

          <div
            className={
              styles.activityGrid
            }
          >
            {projectActivities.map(
              (activity) => (
                <article
                  key={activity.id}
                  className={
                    styles.activityCard
                  }
                >
                  <div
                    className={
                      styles.activityImage
                    }
                  >
                    <img
                      src={activity.image}
                      alt=""
                      loading="lazy"
                    />
                  </div>

                  <div
                    className={
                      styles.activityContent
                    }
                  >
                    <h3>
                      {activity.title}
                    </h3>

                    <p>{activity.text}</p>
                  </div>
                </article>
              )
            )}
          </div>
        </section>

        <section
          className={styles.finalCta}
        >
          <div
            className={
              styles.finalCtaInner
            }
          >
            <div>
              <span
                className={
                  styles.finalCtaTag
                }
              >
                Área interna
              </span>

              <h2>
                Já faz parte da equipe?
              </h2>

              <p>
                Acesse a plataforma para
                cadastrar animais, registrar
                ocorrências e consultar o
                histórico do projeto.
              </p>
            </div>

            <Link
              to="/login"
              className={
                styles.finalCtaButton
              }
            >
              <LogIn size={19} />
              Entrar na plataforma
            </Link>
          </div>
        </section>
      </main>

      <footer
        id="contato"
        className={styles.footer}
      >
        <div className={styles.footerInner}>
          <div
            className={
              styles.footerBrand
            }
          >
            <div
              className={
                styles.footerLogo
              }
            >
              <img
                src={petLogo}
                alt="ARA Campus Pets"
              />
            </div>

            <div>
              <strong>
                ARA Campus Pets
              </strong>

              <p>
                Ações de manejo e
                acompanhamento dos animais
                errantes do Campus Arapiraca e
                entorno.
              </p>
            </div>
          </div>

          <div
            className={
              styles.footerNavigation
            }
          >
            <strong>Navegação</strong>

            <nav
              className={styles.footerNav}
            >
              <a href="#projeto">
                O projeto
              </a>

              <a href="#adocao">
                Adoção
              </a>

              <a href="#equipe">
                Equipe
              </a>

              <Link to="/login">
                Área do voluntário
              </Link>
            </nav>
          </div>

          <div
            className={
              styles.footerLocation
            }
          >
            <strong>Localização</strong>

            <p>
              <MapPin size={18} />

              <span>
                UFAL — Campus Arapiraca
                <br />
                Arapiraca, Alagoas
              </span>
            </p>

            <div
              className={
                styles.partnersLogo
              }
            >
              <img
                src={partnersLogo}
                alt="Instituições parceiras"
              />
            </div>
          </div>
        </div>

        <div
          className={
            styles.footerCopyright
          }
        >
          <span>
            © {new Date().getFullYear()} ARA
            Campus Pets
          </span>

          <span>
            Plataforma desenvolvida como
            projeto de extensão.
          </span>
        </div>
      </footer>
    </div>
  );
}