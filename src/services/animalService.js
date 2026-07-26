import api from "./api";

export const ANIMAL_STATUS_OPTIONS = [
  "No campus",
  "Disponível para adoção",
  "Adotado",
  "Desaparecido",
  "Óbito",
];

export const ANIMAL_EDITABLE_STATUS_OPTIONS = [
  "No campus",
  "Disponível para adoção",
  "Desaparecido",
];

const SEXO_TO_API = {
  Macho: "MACHO",
  Fêmea: "FEMEA",
};

const SEXO_FROM_API = {
  MACHO: "Macho",
  FEMEA: "Fêmea",
};

const ESPECIE_TO_API = {
  dog: "CACHORRO",
  cat: "GATO",
};

const ESPECIE_FROM_API = {
  CACHORRO: "dog",
  GATO: "cat",
};

const PORTE_TO_API = {
  Pequeno: "PEQUENO",
  Médio: "MEDIO",
  Grande: "GRANDE",
};

const PORTE_FROM_API = {
  PEQUENO: "Pequeno",
  MEDIO: "Médio",
  GRANDE: "Grande",
};

const PELAGEM_TO_API = {
  Preta: "PRETA",
  Branca: "BRANCA",
  Caramelo: "CARAMELO",
  Marrom: "MARROM",
  Cinza: "CINZA",
  Rajada: "RAJADA",
  "Preta e branca": "PRETA_E_BRANCA",
  "Marrom e branca": "MARROM_E_BRANCA",
  Tricolor: "TRICOLOR",
  Outra: "OUTRA",
};

const PELAGEM_FROM_API = {
  PRETA: "Preta",
  BRANCA: "Branca",
  CARAMELO: "Caramelo",
  MARROM: "Marrom",
  CINZA: "Cinza",
  RAJADA: "Rajada",
  PRETA_E_BRANCA: "Preta e branca",
  MARROM_E_BRANCA: "Marrom e branca",
  TRICOLOR: "Tricolor",
  OUTRA: "Outra",
};

const STATUS_TO_API = {
  "No campus": "NO_CAMPUS",
  "Disponível para adoção":
    "DISPONIVEL_ADOCAO",
  Adotado: "ADOTADO",
  Desaparecido: "DESAPARECIDO",
  Óbito: "OBITO",
};

const STATUS_FROM_API = {
  NO_CAMPUS: "No campus",
  DISPONIVEL_ADOCAO:
    "Disponível para adoção",
  ADOTADO: "Adotado",
  DESAPARECIDO: "Desaparecido",
  OBITO: "Óbito",
};

function buildAbsoluteUrl(path) {
  if (!path) {
    return "";
  }

  if (
    path.startsWith("http://") ||
    path.startsWith("https://")
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

function calculateAge(dataNascimento) {
  if (!dataNascimento) {
    return "Idade não informada";
  }

  const birthDate = new Date(
    `${dataNascimento}T00:00:00`
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

  let days =
    today.getDate() -
    birthDate.getDate();

  if (days < 0) {
    months -= 1;

    const daysInPreviousMonth =
      new Date(
        today.getFullYear(),
        today.getMonth(),
        0
      ).getDate();

    days += daysInPreviousMonth;
  }

  if (months < 0) {
    years -= 1;
    months += 12;
  }

  if (years > 0) {
    const yearsText =
      years === 1
        ? "1 ano"
        : `${years} anos`;

    if (months > 0) {
      const monthsText =
        months === 1
          ? "1 mês"
          : `${months} meses`;

      return `${yearsText} e ${monthsText}`;
    }

    return yearsText;
  }

  if (months > 0) {
    return months === 1
      ? "1 mês"
      : `${months} meses`;
  }

  if (days > 0) {
    return days === 1
      ? "1 dia"
      : `${days} dias`;
  }

  return "Recém-nascido";
}

function mapAnimalFromApi(animal) {
  const fotoUrl = buildAbsoluteUrl(
    animal.fotoPerfilUrl
  );

  return {
    id: animal.id,
    nome: animal.nome || "",

    imagem: fotoUrl
      ? `${fotoUrl}?v=${Date.now()}`
      : "",

    fotoPerfilUrl:
      animal.fotoPerfilUrl || "",

    fotoArquivo: null,

    sexo:
      SEXO_FROM_API[animal.sexo] ||
      "Macho",

    especie:
      ESPECIE_FROM_API[animal.especie] ||
      "dog",

    dataEstimadaNascimento:
      animal.dataNascimento || "",

    idade: calculateAge(
      animal.dataNascimento
    ),

    descricao: animal.descricao || "",

    corPelagem:
      PELAGEM_FROM_API[animal.pelagem] ||
      "Outra",

    porte:
      PORTE_FROM_API[animal.porte] ||
      "Médio",

    castrado: animal.castrado
      ? "Sim"
      : "Não",

    status:
      STATUS_FROM_API[animal.status] ||
      "No campus",

    raca: animal.raca || "",

    adocaoId: animal.adocaoId || null,

    ocorrenciaAdocaoId:
      animal.ocorrenciaAdocaoId || null,

    dataAdocao:
      animal.dataAdocao || "",

    adotanteNome:
      animal.adotanteNome || "",

    entrevistaAdocaoArquivoNome:
      animal.entrevistaAdocaoNome || "",

    entrevistaAdocaoArquivoUrl:
      animal.entrevistaAdocaoUrl || "",

    termoAdocaoArquivoNome:
      animal.termoAdocaoNome || "",

    termoAdocaoArquivoUrl:
      animal.termoAdocaoUrl || "",

    criadoPorId:
      animal.criadoPorId || null,

    dataCriacao:
      animal.dataCriacao || null,
  };
}

function mapAnimalToApi(animal) {
  return {
    nome: animal.nome.trim(),

    sexo:
      SEXO_TO_API[animal.sexo] ||
      "MACHO",

    especie:
      ESPECIE_TO_API[animal.especie] ||
      "CACHORRO",

    raca:
      animal.raca?.trim() || null,

    dataNascimento:
      animal.dataEstimadaNascimento ||
      null,

    descricao:
      animal.descricao?.trim() || null,

    porte:
      PORTE_TO_API[animal.porte] ||
      "MEDIO",

    pelagem:
      PELAGEM_TO_API[
        animal.corPelagem
      ] || "OUTRA",

    status:
      STATUS_TO_API[animal.status] ||
      "NO_CAMPUS",
  };
}

function buildFormData(animal) {
  const formData = new FormData();

  const animalData =
    mapAnimalToApi(animal);

  const jsonBlob = new Blob(
    [JSON.stringify(animalData)],
    {
      type: "application/json",
    }
  );

  formData.append("dados", jsonBlob);

  if (
    animal.fotoArquivo instanceof File
  ) {
    formData.append(
      "foto",
      animal.fotoArquivo
    );
  }

  return formData;
}

async function downloadAnimalDocument(
  endpoint,
  filename
) {
  const response = await api.get(
    endpoint,
    {
      responseType: "blob",
    }
  );

  const blobUrl = URL.createObjectURL(
    response.data
  );

  const link =
    document.createElement("a");

  link.href = blobUrl;
  link.download =
    filename || "documento.pdf";

  document.body.appendChild(link);
  link.click();
  link.remove();

  window.setTimeout(() => {
    URL.revokeObjectURL(blobUrl);
  }, 1000);
}

export async function listAnimals() {
  const response = await api.get(
    "/api/animais"
  );

  return response.data.map(
    mapAnimalFromApi
  );
}

export async function getAnimalById(id) {
  const response = await api.get(
    `/api/animais/${id}`
  );

  return mapAnimalFromApi(
    response.data
  );
}

export async function createAnimal(animal) {
  const formData =
    buildFormData(animal);

  const response = await api.post(
    "/api/animais",
    formData
  );

  return mapAnimalFromApi(
    response.data
  );
}

export async function updateAnimal(
  id,
  animal
) {
  const formData =
    buildFormData(animal);

  const response = await api.put(
    `/api/animais/${id}`,
    formData
  );

  return mapAnimalFromApi(
    response.data
  );
}

export async function deleteAnimal(id) {
  await api.delete(
    `/api/animais/${id}`
  );
}

export async function downloadAdoptionInterview(
  animal
) {
  await downloadAnimalDocument(
    `/api/animais/${animal.id}/entrevista-adocao`,
    animal.entrevistaAdocaoArquivoNome ||
      `entrevista-adocao-${animal.nome}.pdf`
  );
}

export async function downloadAdoptionTerm(
  animal
) {
  await downloadAnimalDocument(
    `/api/animais/${animal.id}/termo-adocao`,
    animal.termoAdocaoArquivoNome ||
      `termo-adocao-${animal.nome}.pdf`
  );
}