import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import styles from "./HomePage.module.css";

import petLogo from "../../assets/figma/Subtract.png";
import pawIcon from "../../assets/figma/Pets Streamline Outlined-Material-Symbols.png";
import heroImage from "../../assets/figma/image 1.png";
import heroDog1 from "../../assets/figma/dog1.jpg";
import heroDog2 from "../../assets/figma/dog2.jpeg";
import heroDog3 from "../../assets/figma/dog3.jpg";
import volunteerButton from "../../assets/figma/Frame 1.png";
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
import volLucas from "../../assets/volunteers/vol-lucas.jpg";
import volVanessa from "../../assets/volunteers/vol-vanessa.jpg";

import catAmarelinho from "../../assets/animals/cat-amarelinho.jpg";
import catBatman from "../../assets/animals/cat-batman.jpg";
import catCabecao from "../../assets/animals/cat-cabecao.jpg";
import catChico from "../../assets/animals/cat-chico.jpg";
import catCida from "../../assets/animals/cat-cida.jpg";
import dogCacau from "../../assets/animals/dog-cacau.jpg";
import dogAlfonso from "../../assets/animals/dog-alfonso.jpg";


const teamText =
  "is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.";

const team = [
  { id: 1, name: "Marcelino Ferreira", photo: volMarcelino, text: teamText },
  { id: 2, name: "Thiago Almeida", photo: volThiago, text: teamText },
  { id: 3, name: "Vitor Santos", photo: volVitor, text: teamText },
  { id: 4, name: "Diana Oliveira", photo: volDiana, text: teamText },
  { id: 5, name: "Érika Lima", photo: volErika, text: teamText },
  { id: 6, name: "Karlla Souza", photo: volKarlla, text: teamText },
  { id: 7, name: "Iasmin Rocha", photo: volIasmin, text: teamText },
  { id: 8, name: "Joandeson Silva", photo: volJoandeson, text: teamText },
  { id: 9, name: "Lucas Armando da Silva", photo: volLucas, text: teamText },
  { id: 10, name: "Vanessa Costa", photo: volVanessa, text: teamText },
];

const animals = [
  { id: 1, name: "Ralf", photo: catAmarelinho },
  { id: 2, name: "Belinha", photo: catBatman },
  { id: 3, name: "Samanta", photo: catCabecao },
  { id: 4, name: "Theodoro", photo: catChico },
  { id: 5, name: "Cidinha", photo: catCida },
  { id: 6, name: "Cacau", photo: dogCacau },
  { id: 7, name: "Alfonso", photo: dogAlfonso },
];

const services = [
  { image: serviceBanho, name: "Banho" },
  { image: serviceTosa, name: "Tosa" },
  { image: serviceAlimentacao, name: "Alimentação" },
  { image: serviceCastracao, name: "Castração" },
];

function ServicesCarousel() {
  const itemsPerView = 3;
  // Repete os serviços para ter slides suficientes no carrossel
  const slides = [...services, ...services];
  const maxIndex = slides.length - itemsPerView;
  const [index, setIndex] = useState(0);

  const prev = () => setIndex((i) => (i <= 0 ? maxIndex : i - 1));
  const next = () => setIndex((i) => (i >= maxIndex ? 0 : i + 1));

  useEffect(() => {
    const id = setInterval(() => {
      setIndex((i) => (i >= maxIndex ? 0 : i + 1));
    }, 4000);
    return () => clearInterval(id);
  }, [maxIndex]);

  return (
    <div className={styles.carousel}>
      <div className={styles.carouselRow}>
        <button
          type="button"
          className={styles.carouselArrow}
          onClick={prev}
          aria-label="Serviço anterior"
        >
          ‹
        </button>

        <div className={styles.carouselViewport}>
          <div
            className={styles.carouselTrack}
            style={{ transform: `translateX(-${index * (100 / itemsPerView)}%)` }}
          >
            {slides.map((service, i) => (
              <div key={i} className={styles.carouselItem}>
                <div className={styles.serviceCard}>
                  <img src={service.image} alt={service.name} />
                  <span className={styles.serviceLabel}>{service.name}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <button
          type="button"
          className={styles.carouselArrow}
          onClick={next}
          aria-label="Próximo serviço"
        >
          ›
        </button>
      </div>

      <div className={styles.carouselDots}>
        {Array.from({ length: maxIndex + 1 }).map((_, i) => (
          <button
            key={i}
            type="button"
            className={`${styles.carouselDot} ${
              i === index ? styles.carouselDotActive : ""
            }`}
            onClick={() => setIndex(i)}
            aria-label={`Ir para o grupo ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}

const chartData = [
  { label: "2021", value: 18 },
  { label: "2022", value: 27 },
  { label: "2023", value: 35 },
  { label: "2024", value: 42 },
  { label: "2025", value: 51 },
];

function VolunteerChart() {
  const width = 320;
  const height = 200;
  const padding = { top: 24, right: 12, bottom: 28, left: 32 };
  const plotW = width - padding.left - padding.right;
  const plotH = height - padding.top - padding.bottom;
  const maxValue = 60;
  const baselineY = padding.top + plotH;
  const barSlot = plotW / chartData.length;
  const barWidth = barSlot * 0.56;
  const yTicks = [0, 20, 40, 60];

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className={styles.chart}
      role="img"
      aria-label="Animais resgatados por ano: 2021 (18), 2022 (27), 2023 (35), 2024 (42), 2025 (51)"
    >
      {/* Linhas de grade + eixo Y */}
      {yTicks.map((tick) => {
        const y = baselineY - (tick / maxValue) * plotH;
        return (
          <g key={tick}>
            <line
              x1={padding.left}
              y1={y}
              x2={width - padding.right}
              y2={y}
              stroke="#e5e7eb"
              strokeWidth="1"
            />
            <text
              x={padding.left - 6}
              y={y + 3}
              textAnchor="end"
              fontSize="9"
              fill="#6b7280"
            >
              {tick}
            </text>
          </g>
        );
      })}

      {/* Barras com valores e rótulos */}
      {chartData.map((d, i) => {
        const barH = (d.value / maxValue) * plotH;
        const x = padding.left + i * barSlot + (barSlot - barWidth) / 2;
        const y = baselineY - barH;
        const cx = padding.left + i * barSlot + barSlot / 2;
        return (
          <g key={d.label}>
            <rect x={x} y={y} width={barWidth} height={barH} rx="3" fill="#2563eb" />
            <text
              x={cx}
              y={y - 5}
              textAnchor="middle"
              fontSize="9"
              fontWeight="700"
              fill="#111827"
            >
              {d.value}
            </text>
            <text
              x={cx}
              y={baselineY + 14}
              textAnchor="middle"
              fontSize="9"
              fill="#374151"
            >
              {d.label}
            </text>
          </g>
        );
      })}

      {/* Eixo X */}
      <line
        x1={padding.left}
        y1={baselineY}
        x2={width - padding.right}
        y2={baselineY}
        stroke="#9ca3af"
        strokeWidth="1"
      />
    </svg>
  );
}

const contacts = [
  {
    id: "instagram",
    label: "Instagram",
    href: "https://instagram.com",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M12 2.16c3.2 0 3.58.01 4.85.07 1.17.05 1.8.25 2.23.41.56.22.96.48 1.38.9.42.42.68.82.9 1.38.16.42.36 1.06.41 2.23.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.05 1.17-.25 1.8-.41 2.23-.22.56-.48.96-.9 1.38-.42.42-.82.68-1.38.9-.42.16-1.06.36-2.23.41-1.27.06-1.65.07-4.85.07s-3.58-.01-4.85-.07c-1.17-.05-1.8-.25-2.23-.41-.56-.22-.96-.48-1.38-.9-.42-.42-.68-.82-.9-1.38-.16-.42-.36-1.06-.41-2.23-.06-1.27-.07-1.65-.07-4.85s.01-3.58.07-4.85c.05-1.17.25-1.8.41-2.23.22-.56.48-.96.9-1.38.42-.42.82-.68 1.38-.9.42-.16 1.06-.36 2.23-.41 1.27-.06 1.65-.07 4.85-.07M12 0C8.74 0 8.33.01 7.05.07 5.78.13 4.9.33 4.14.63c-.79.31-1.46.72-2.13 1.38C1.35 2.68.94 3.35.63 4.14.33 4.9.13 5.78.07 7.05.01 8.33 0 8.74 0 12s.01 3.67.07 4.95c.06 1.27.26 2.15.56 2.91.31.79.72 1.46 1.38 2.13.67.66 1.34 1.07 2.13 1.38.76.3 1.64.5 2.91.56C8.33 23.99 8.74 24 12 24s3.67-.01 4.95-.07c1.27-.06 2.15-.26 2.91-.56.79-.31 1.46-.72 2.13-1.38.66-.67 1.07-1.34 1.38-2.13.3-.76.5-1.64.56-2.91.06-1.28.07-1.69.07-4.95s-.01-3.67-.07-4.95c-.06-1.27-.26-2.15-.56-2.91-.31-.79-.72-1.46-1.38-2.13C21.32 1.35 20.65.94 19.86.63 19.1.33 18.22.13 16.95.07 15.67.01 15.26 0 12 0zm0 5.84a6.16 6.16 0 100 12.32 6.16 6.16 0 000-12.32zM12 16a4 4 0 110-8 4 4 0 010 8zm6.41-10.85a1.44 1.44 0 100 2.88 1.44 1.44 0 000-2.88z" />
      </svg>
    ),
  },
  {
    id: "whatsapp",
    label: "WhatsApp",
    href: "https://wa.me/",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M17.47 14.38c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.48-.89-.79-1.49-1.77-1.66-2.07-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.07-.15-.67-1.61-.92-2.21-.24-.58-.49-.5-.67-.51l-.57-.01c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48s1.06 2.88 1.21 3.08c.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.69.63.71.23 1.36.19 1.87.12.57-.09 1.76-.72 2.01-1.41.25-.7.25-1.29.17-1.41-.07-.13-.27-.2-.57-.35zM12.05 21.5h-.01a9.5 9.5 0 01-4.84-1.33l-.35-.2-3.6.94.96-3.51-.23-.36a9.53 9.53 0 01-1.46-5.06c0-5.26 4.28-9.53 9.54-9.53a9.48 9.48 0 016.74 2.8 9.46 9.46 0 012.79 6.74c0 5.26-4.28 9.51-9.54 9.51zM20.52 3.48A11.85 11.85 0 0012.05 0C5.5 0 .16 5.33.16 11.89c0 2.09.55 4.14 1.59 5.94L.06 24l6.33-1.66a11.9 11.9 0 005.66 1.44h.01c6.55 0 11.89-5.33 11.89-11.89a11.8 11.8 0 00-3.43-8.41z" />
      </svg>
    ),
  },
  {
    id: "facebook",
    label: "Facebook",
    href: "https://facebook.com",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M24 12.07C24 5.4 18.63 0 12 0S0 5.4 0 12.07C0 18.1 4.39 23.1 10.13 24v-8.44H7.08v-3.49h3.05V9.41c0-3.02 1.79-4.68 4.53-4.68 1.31 0 2.68.24 2.68.24v2.97h-1.51c-1.49 0-1.96.93-1.96 1.89v2.24h3.33l-.53 3.49h-2.8V24C19.61 23.1 24 18.1 24 12.07z" />
      </svg>
    ),
  },
  {
    id: "x",
    label: "X",
    href: "https://x.com",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M18.9 1.15h3.68l-8.04 9.19L24 22.85h-7.41l-5.8-7.58-6.64 7.58H.47l8.6-9.83L0 1.15h7.59l5.24 6.93 6.07-6.93zm-1.29 19.5h2.04L6.48 3.24H4.3L17.61 20.65z" />
      </svg>
    ),
  },
];

const heroSlides = [heroImage, heroDog1, heroDog2, heroDog3];

function HeroSlider() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % heroSlides.length);
    }, 4000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className={styles.heroSlider}>
      {heroSlides.map((src, i) => (
        <img
          key={i}
          src={src}
          alt="Cachorro do projeto Doguinhos da UFAL"
          className={`${styles.heroSlide} ${
            i === index ? styles.heroSlideActive : ""
          }`}
          aria-hidden={i === index ? undefined : true}
        />
      ))}
    </div>
  );
}

function SectionTitle({ children }) {
  return (
    <h2 className={styles.sectionTitle}>
      {children}
      <img src={pawIcon} alt="" className={styles.sectionTitlePaw} />
    </h2>
  );
}

export default function HomePage() {
  return (
    <div className={styles.page}>
      {/* Cabeçalho / navegação */}
      <header className={styles.header}>
        <div className={styles.headerInner}>
          <Link to="/" className={styles.brand}>
            <img src={petLogo} alt="PET FEAL" />
          </Link>

          <nav className={styles.nav}>
            <a href="#inicio">Início</a>
            <a href="#projeto">Ipsum</a>
            <Link to="/app/animals">Nossos animais</Link>
          </nav>
        </div>
      </header>

      {/* Imagem principal */}
      <section id="inicio" className={styles.hero}>
        <HeroSlider />
      </section>

      {/* Visão do projeto */}
      <section id="projeto" className={styles.section}>
        <SectionTitle>VISÃO DO NOSSO PROJETO</SectionTitle>

        <div className={styles.visionGrid}>
          <div className={styles.visionImage}>
            <img src={visionDog} alt="Cachorro resgatado" />
          </div>

          <p className={styles.visionText}>
            Lorem Ipsum is simply dummy text of the printing and typesetting
            industry. Lorem Ipsum has been the industry's standard dummy text
            ever since the 1500s, when an unknown printer took a galley of type
            and scrambled it to make a type specimen book. It has survived not
            only five centuries, but also the leap into electronic typesetting,
            remaining essentially unchanged. It was popularised in the 1960s with
            the release of Letraset sheets containing Lorem Ipsum passages, and
            more recently with desktop publishing software like Aldus PageMaker
            including versions of Lorem Ipsum.
          </p>
        </div>
      </section>

      {/* Torne-se um voluntário */}
      <section className={styles.volunteerSection}>
        <SectionTitle>TORNE-SE UM VOLUNTÁRIO</SectionTitle>

        <div className={styles.volunteerGrid}>
          <div className={styles.volunteerCard}>
            <h3 className={styles.volunteerCardTitle}>
              POR QUE SE TORNAR UM VOLUNTÁRIO?
            </h3>
            <ul className={styles.volunteerList}>
              <li>
                Lorem Ipsum is simply dummy text of the printing and typesetting
                industry. Lorem Ipsum has been the industry's standard dummy text
                ever since the 1500s, when an unknown printer took a galley of
                type and scrambled it to make a type specimen book.
              </li>
              <li>
                It has survived not only five centuries, but also the leap into
                electronic typesetting, remaining essentially unchanged. It was
                popularised in the 1960s with the release of
              </li>
              <li>
                Letraset sheets containing Lorem Ipsum passages, and more recently
                with desktop publishing software like Aldus PageMaker including
                versions of Lorem Ipsum.
              </li>
            </ul>
          </div>

          <div className={styles.chartCard}>
            <h4 className={styles.chartTitle}>Animais resgatados por ano</h4>
            <VolunteerChart />
          </div>
        </div>

        <div className={styles.volunteerButtonWrapper}>
          <Link to="/login" className={styles.volunteerButton}>
            <img src={volunteerButton} alt="Voluntariar-se" />
          </Link>
        </div>
      </section>

      {/* Adote nossos animais */}
      <section className={styles.section}>
        <SectionTitle>ADOTE NOSSOS ANIMAIS</SectionTitle>
        
        <div className={styles.animalGrid}>
          {animals.map((animal) => (
            <article key={animal.id} className={styles.animalCard}>
              <div className={styles.animalPhoto}>
                <img src={animal.photo} alt={animal.name} />
              </div>
              <h3 className={styles.animalName}>{animal.name}</h3>
            </article>
          ))}
        </div>
      </section>

      {/* Nossa equipe */}
      <section className={styles.section}>
        <SectionTitle>NOSSA EQUIPE</SectionTitle>

        <div className={styles.teamGrid}>
          {team.map((member) => (
            <article key={member.id} className={styles.teamCard}>
              <div className={styles.teamPhoto}>
                <img src={member.photo} alt={member.name} />
              </div>
              <h3 className={styles.teamName}>{member.name}</h3>
              <p className={styles.teamText}>{member.text}</p>
            </article>
          ))}
        </div>
      </section>

      {/* Nossos serviços */}
      <section className={styles.section}>
        <SectionTitle>NOSSOS SERVIÇOS</SectionTitle>
        <ServicesCarousel />
      </section>

      {/* Rodapé */}
      <footer className={styles.footer}>
        <div className={styles.footerInner}>
          <div className={styles.footerLogo}>
            <img src={petLogo} alt="PET IFAL" />
          </div>

          <div className={styles.footerContent}>
            <nav className={styles.footerNav}>
              <a href="#inicio">Início</a>
              <a href="#termos">Termos</a>
              <a href="#ajuda">Ajuda</a>
              <a href="#privacidade">Política de Privacidade</a>
            </nav>

            <div className={styles.footerBottom}>
              <div className={styles.footerContact}>
                <span className={styles.footerLabel}>CONTATO</span>
                <div className={styles.contactIcons}>
                  {contacts.map((contact) => (
                    <a
                      key={contact.id}
                      href={contact.href}
                      className={styles.contactIcon}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={contact.label}
                    >
                      {contact.icon}
                    </a>
                  ))}
                </div>
              </div>

              <div className={styles.footerPartners}>
                <span className={styles.footerLabel}>PARCEIROS</span>
                <div className={styles.partnersLogo}>
                  <img src={partnersLogo} alt="IFAL" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
