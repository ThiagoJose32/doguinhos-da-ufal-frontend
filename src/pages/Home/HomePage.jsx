import {
  useEffect,
  useState,
} from "react";

import { Link } from "react-router-dom";

import {
  ArrowRight,
  Car,
  ChevronLeft,
  ChevronRight,
  HeartHandshake,
  Home,
  LogIn,
  MapPin,
  Package,
  PawPrint,
  Share2,
  Users,
} from "lucide-react";

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

import volMarcelino from "../../assets/volunteers/vol-marcelino.jpg";
import volThiago from "../../assets/volunteers/vol-thiago.jpg";
import volVitor from "../../assets/volunteers/vol-vitor.jpg";
import volDiana from "../../assets/volunteers/vol-diana.jpg";
import volErika from "../../assets/volunteers/vol-erika.jpg";
import volKarlla from "../../assets/volunteers/vol-karlla.jpg";
import volIasmin from "../../assets/volunteers/vol-iasmin.jpg";
import volJoandeson from "../../assets/volunteers/vol-joandeson.jpg";
import volVanessa from "../../assets/volunteers/vol-vanessa.jpg";

import catAmarelinho from "../../assets/animals/cat-amarelinho.jpg";
import catBatman from "../../assets/animals/cat-batman.jpg";
import catCabecao from "../../assets/animals/cat-cabecao.jpg";
import catChico from "../../assets/animals/cat-chico.jpg";
import catCida from "../../assets/animals/cat-cida.jpg";
import dogCacau from "../../assets/animals/dog-cacau.jpg";
import dogAlfonso from "../../assets/animals/dog-alfonso.jpg";

const VOLUNTEER_FORM_URL =
  "https://forms.gle/a4c4W8iu3e7hzq4XA";

const heroSlides = [
  heroImage,
  heroDog1,
  heroDog2,
  heroDog3,
];

const projectStats = [
  {
    id: "adotados",
    value: "+50",
    label: "animais adotados",
  },
  {
    id: "tratados",
    value: "+50",
    label: "animais tratados",
  },
  {
    id: "castrados",
    value: "+40",
    label: "animais castrados",
  },
  {
    id: "vacinados",
    value: "+25",
    label: "animais vacinados",
  },
];

const projectActions = [
  {
    id: "alimentacao",
    title: "Alimentação",
    image: serviceAlimentacao,
    description:
      "Organização do fornecimento de ração e mobilização da comunidade para atender às necessidades dos animais.",
  },
  {
    id: "banho",
    title: "Higiene e bem-estar",
    image: serviceBanho,
    description:
      "Cuidados de higiene que contribuem para o conforto, a saúde e a qualidade de vida dos animais.",
  },
  {
    id: "saude",
    title: "Acompanhamento de saúde",
    image: serviceTosa,
    description:
      "Apoio em consultas, exames, tratamentos, vacinação e demais cuidados veterinários necessários.",
  },
  {
    id: "adocao",
    title: "Adoção responsável",
    image: serviceCastracao,
    description:
      "Divulgação e acompanhamento dos animais preparados para encontrar uma família responsável.",
  },
];

const helpOptions = [
  {
    id: "materiais",
    title: "Doe ração e materiais",
    description:
      "Ração, produtos de higiene e materiais de cuidado ajudam a manter as atividades do projeto.",
    Icon: Package,
  },
  {
    id: "carona",
    title: "Ofereça uma carona",
    description:
      "O transporte é importante para consultas, tratamentos, castrações e encaminhamentos para adoção.",
    Icon: Car,
  },
  {
    id: "lar",
    title: "Disponibilize um lar temporário",
    description:
      "Alguns animais precisam de um local seguro enquanto se recuperam ou aguardam uma adoção definitiva.",
    Icon: Home,
  },
  {
    id: "divulgacao",
    title: "Ajude na divulgação",
    description:
      "Compartilhar animais, campanhas e necessidades do projeto amplia nossa rede de apoio.",
    Icon: Share2,
  },
];

const animals = [
  {
    id: 1,
    name: "Ralf",
    photo: catAmarelinho,
    species: "Gato",
    description:
      "Aguarda uma família responsável, preparada para oferecer proteção, cuidado e carinho.",
  },
  {
    id: 2,
    name: "Belinha",
    photo: catBatman,
    species: "Gato",
    description:
      "Procura um novo lar onde possa receber atenção, segurança e acompanhamento responsável.",
  },
  {
    id: 3,
    name: "Samanta",
    photo: catCabecao,
    species: "Gato",
    description:
      "Está disponível para adoção responsável e pode se tornar uma nova companheira para sua família.",
  },
  {
    id: 4,
    name: "Theodoro",
    photo: catChico,
    species: "Gato",
    description:
      "Aguarda uma oportunidade de viver em um ambiente protegido, acolhedor e cheio de cuidado.",
  },
  {
    id: 5,
    name: "Cidinha",
    photo: catCida,
    species: "Gato",
    description:
      "Está à procura de uma família comprometida com uma adoção consciente e responsável.",
  },
  {
    id: 6,
    name: "Cacau",
    photo: dogCacau,
    species: "Cachorro",
    description:
      "Aguarda uma nova família que possa oferecer carinho, segurança e os cuidados necessários.",
  },
  {
    id: 7,
    name: "Alfonso",
    photo: dogAlfonso,
    species: "Cachorro",
    description:
      "Está disponível para adoção responsável e pronto para receber uma nova oportunidade.",
  },
];

const team = [
  {
    id: 1,
    name: "Marcelino Ferreira",
    photo: volMarcelino,
    role: "Voluntário",
  },
  {
    id: 2,
    name: "Thiago Almeida",
    photo: volThiago,
    role: "Voluntário",
  },
  {
    id: 3,
    name: "Vitor Santos",
    photo: volVitor,
    role: "Voluntário",
  },
  {
    id: 4,
    name: "Diana Oliveira",
    photo: volDiana,
    role: "Voluntária",
  },
  {
    id: 5,
    name: "Érika Lima",
    photo: volErika,
    role: "Voluntária",
  },
  {
    id: 6,
    name: "Karlla Souza",
    photo: volKarlla,
    role: "Voluntária",
  },
  {
    id: 7,
    name: "Iasmin Rocha",
    photo: volIasmin,
    role: "Voluntária",
  },
  {
    id: 8,
    name: "Joandeson Silva",
    photo: volJoandeson,
    role: "Voluntário",
  },
  {
    id: 9,
    name: "Vanessa Costa",
    photo: volVanessa,
    role: "Voluntária",
  },
];

const partners = [
  {
    id: "gustavo-rocha",
    name: "Centro Veterinário Gustavo Rocha",
    description:
      "Parceiro nas ações relacionadas ao atendimento e aos cuidados veterinários.",
  },
  {
    id: "grupequi",
    name: "GRUPEQUI",
    description:
      "Grupo de Pesquisa e Extensão em Equídeos e Saúde Integrativa da UFAL.",
  },
  {
    id: "andre-pepes",
    name: "André Pepes",
    description:
      "Apoiador e colaborador na divulgação das ações desenvolvidas pelo projeto.",
  },
];

function ImageWithFallback({
  src,
  alt,
  name,
  fallback = "A",
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
      onError={handleError}
      loading="lazy"
    />
  );
}

function HeroSlider() {
  const [index, setIndex] =
    useState(0);

  useEffect(() => {
    const intervalId =
      window.setInterval(() => {
        setIndex(
          (currentIndex) =>
            (currentIndex + 1) %
            heroSlides.length
        );
      }, 5000);

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
          Transformando vidas, uma pata
          de cada vez
        </h1>

        <p className={styles.heroText}>
          Cuidado, acompanhamento e novas
          oportunidades para os animais
          do Campus Arapiraca e de seu
          entorno.
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
            href="#ajude"
            className={
              styles.secondaryButton
            }
          >
            Saiba como ajudar
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

export default function HomePage() {
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

            <div className={styles.brandText}>
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

            <a href="#acoes">
              Ações
            </a>

            <a href="#ajude">
              Como ajudar
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

              <span>
                Área do voluntário
              </span>
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
            description="Uma iniciativa dedicada ao bem-estar e ao acompanhamento dos animais comunitários do Campus Arapiraca e de seu entorno."
          >
            Visão geral e missão
          </SectionTitle>

          <div className={styles.aboutGrid}>
            <div
              className={
                styles.aboutImageWrapper
              }
            >
              <div
                className={
                  styles.aboutImage
                }
              >
                <img
                  src={visionDog}
                  alt="Animal acompanhado pelo projeto"
                />
              </div>

              <div
                className={
                  styles.aboutBadge
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

            <div className={styles.aboutContent}>
              <h3>
                Cuidar, conscientizar e
                encontrar novos lares
              </h3>

              <p>
                O ARA Campus Pets reúne
                voluntários, apoiadores e
                membros da comunidade em
                ações de alimentação,
                cuidados básicos,
                acompanhamento de saúde,
                castração e adoção
                responsável.
              </p>

              <p>
                O projeto também busca
                conscientizar a comunidade
                sobre abandono, bem-estar
                animal e convivência
                responsável entre pessoas e
                animais.
              </p>

              <div className={styles.missionCard}>
                <strong>Nossa missão</strong>

                <p>
                  Promover dignidade e
                  qualidade de vida aos
                  animais, reduzir situações
                  de abandono e ampliar as
                  oportunidades de adoção
                  responsável.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className={styles.statsSection}>
          <div className={styles.statsInner}>
            <div className={styles.statsGrid}>
              {projectStats.map((stat) => (
                <article
                  key={stat.id}
                  className={styles.statCard}
                >
                  <strong
                    className={
                      styles.statValue
                    }
                  >
                    {stat.value}
                  </strong>

                  <span
                    className={
                      styles.statLabel
                    }
                  >
                    {stat.label}
                  </span>
                </article>
              ))}
            </div>

            <p className={styles.statsNote}>
              Dados históricos divulgados
              pelo projeto. As informações
              serão atualizadas futuramente
              na nova plataforma.
            </p>
          </div>
        </section>

        <section
          id="acoes"
          className={styles.section}
        >
          <SectionTitle
            eyebrow="Nossa atuação"
            description="As ações do projeto se complementam para oferecer um acompanhamento mais responsável aos animais."
          >
            Principais ações
          </SectionTitle>

          <div className={styles.actionsGrid}>
            {projectActions.map(
              (action) => (
                <article
                  key={action.id}
                  className={
                    styles.actionCard
                  }
                >
                  <div
                    className={
                      styles.actionImage
                    }
                  >
                    <img
                      src={action.image}
                      alt=""
                      loading="lazy"
                    />
                  </div>

                  <div
                    className={
                      styles.actionContent
                    }
                  >
                    <h3>{action.title}</h3>

                    <p>
                      {action.description}
                    </p>
                  </div>
                </article>
              )
            )}
          </div>
        </section>

        <section
          id="ajude"
          className={styles.helpSection}
        >
          <div className={styles.helpInner}>
            <SectionTitle
              eyebrow="Participe"
              description="Existem diferentes maneiras de contribuir com o cuidado e o acompanhamento dos animais."
            >
              Como você pode ajudar
            </SectionTitle>

            <div className={styles.helpGrid}>
              {helpOptions.map((option) => {
                const Icon = option.Icon;

                return (
                  <article
                    key={option.id}
                    className={styles.helpCard}
                  >
                    <div
                      className={
                        styles.helpIcon
                      }
                    >
                      <Icon size={25} />
                    </div>

                    <h3>{option.title}</h3>

                    <p>
                      {option.description}
                    </p>
                  </article>
                );
              })}
            </div>

            <div
              className={
                styles.volunteerPanel
              }
            >
              <div
                className={
                  styles.volunteerPanelIcon
                }
              >
                <Users size={32} />
              </div>

              <div
                className={
                  styles.volunteerPanelContent
                }
              >
                <span>
                  Seja voluntário
                </span>

                <h3>
                  Dedique um pouco do seu
                  tempo e faça a diferença
                </h3>

                <p>
                  Os voluntários ajudam nos
                  cuidados básicos, na
                  divulgação, na organização
                  de recursos e no
                  acompanhamento das
                  atividades do projeto.
                </p>
              </div>

              <a
                href={VOLUNTEER_FORM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className={
                  styles.volunteerButton
                }
              >
                Quero ser voluntário
                <ArrowRight size={18} />
              </a>
            </div>
          </div>
        </section>

        <section
          id="adocao"
          className={styles.section}
        >
          <SectionTitle
            eyebrow="Adoção responsável"
            description="Conheça alguns dos animais que aguardam uma oportunidade de receber cuidado, proteção e um novo lar."
          >
            Adote nossos animais
          </SectionTitle>

          <div className={styles.animalGrid}>
            {animals.map((animal) => (
              <article
                key={animal.id}
                className={styles.animalCard}
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
                    Disponível para adoção
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

                  <span
                    className={
                      styles.animalSpecies
                    }
                  >
                    {animal.species}
                  </span>

                  <p
                    className={
                      styles.animalDescription
                    }
                  >
                    {animal.description}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section
          id="equipe"
          className={styles.teamSection}
        >
          <div className={styles.teamInner}>
            <SectionTitle
              eyebrow="Pessoas que fazem acontecer"
              description="O projeto é construído por pessoas que compartilham responsabilidades, conhecimento e cuidado."
            >
              Nossa equipe
            </SectionTitle>

            <div className={styles.teamGrid}>
              {team.map((member) => (
                <article
                  key={member.id}
                  className={styles.teamCard}
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
                    <h3>{member.name}</h3>

                    <span>
                      {member.role}
                    </span>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section
          id="parceiros"
          className={styles.section}
        >
          <SectionTitle
            eyebrow="Rede de apoio"
            description="O trabalho do projeto é fortalecido pela colaboração de instituições, profissionais e apoiadores."
          >
            Parceiros e apoiadores
          </SectionTitle>

          <div className={styles.partnersGrid}>
            {partners.map((partner) => (
              <article
                key={partner.id}
                className={styles.partnerCard}
              >
                <div
                  className={
                    styles.partnerIcon
                  }
                >
                  <HeartHandshake
                    size={27}
                  />
                </div>

                <h3>{partner.name}</h3>

                <p>
                  {partner.description}
                </p>
              </article>
            ))}
          </div>
        </section>

        <section className={styles.finalCta}>
          <div className={styles.finalCtaInner}>
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
                histórico das atividades.
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

      <footer className={styles.footer}>
        <div className={styles.footerInner}>
          <div className={styles.footerBrand}>
            <div className={styles.footerLogo}>
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
                comunitários do Campus
                Arapiraca e entorno.
              </p>
            </div>
          </div>

          <div
            className={
              styles.footerNavigation
            }
          >
            <strong>Navegação</strong>

            <nav className={styles.footerNav}>
              <a href="#projeto">
                O projeto
              </a>

              <a href="#acoes">
                Principais ações
              </a>

              <a href="#ajude">
                Como ajudar
              </a>

              <a href="#adocao">
                Adoção
              </a>

              <a href="#equipe">
                Equipe
              </a>
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