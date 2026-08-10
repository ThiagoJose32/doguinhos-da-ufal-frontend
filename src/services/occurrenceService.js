import api from "./api";

export const OCCURRENCE_TYPE_OPTIONS = [
  {
    value: "SAUDE",
    label: "Saúde",
  },
  {
    value: "ADOCAO",
    label: "Adoção",
  },
  {
    value: "CASTRACAO",
    label: "Castração",
  },
  {
    value: "BANHO",
    label: "Banho",
  },
  {
    value: "VACINACAO",
    label: "Vacinação",
  },
  {
    value: "VERMIFUGACAO",
    label: "Vermifugação",
  },
  {
    value: "OBITO",
    label: "Óbito",
  },
];

export function getOccurrenceTypeLabel(
  type
) {
  const option =
    OCCURRENCE_TYPE_OPTIONS.find(
      (item) =>
        item.value === type
    );

  return (
    option?.label ||
    type ||
    "Não informado"
  );
}

function normalizeCost(value) {
  if (
    value === null ||
    value === undefined ||
    value === ""
  ) {
    return null;
  }

  const normalizedValue =
    String(value)
      .trim()
      .replace(",", ".");

  const numericValue =
    Number(normalizedValue);

  if (
    !Number.isFinite(
      numericValue
    )
  ) {
    return null;
  }

  return Number(
    numericValue.toFixed(2)
  );
}

function mapAdoptionFromApi(
  adoption
) {
  if (!adoption) {
    return null;
  }

  return {
    adocaoId:
      adoption.adocaoId ||
      null,

    nome:
      adoption.nome || "",

    cpfRg:
      adoption.cpfRg || "",

    telefone:
      adoption.telefone || "",

    email:
      adoption.email || "",

    endereco:
      adoption.endereco || "",

    observacoes:
      adoption.observacoes || "",

    dataAdocao:
      adoption.dataAdocao || "",

    entrevistaNome:
      adoption.entrevistaNome ||
      "",

    entrevistaUrl:
      adoption.entrevistaUrl ||
      "",

    termoNome:
      adoption.termoNome ||
      "",

    termoUrl:
      adoption.termoUrl ||
      "",

    entrevistaArquivo:
      null,

    termoArquivo:
      null,
  };
}

function mapOccurrenceFromApi(
  occurrence
) {
  return {
    id:
      occurrence.id,

    tipo:
      occurrence.tipo ||
      "SAUDE",

    data:
      occurrence.data ||
      "",

    descricao:
      occurrence.descricao ||
      "",

    custo:
      occurrence.custo === null ||
      occurrence.custo === undefined
        ? ""
        : String(
            occurrence.custo
          ),

    animalId:
      occurrence.animalId ||
      null,

    criadoPorId:
      occurrence.criadoPorId ||
      null,

    criadoPorNome:
      occurrence.criadoPorNome ||
      "Usuário não informado",

    modificadoPorId:
      occurrence.modificadoPorId ||
      null,

    modificadoPorNome:
      occurrence.modificadoPorNome ||
      "",

    dataCriacao:
      occurrence.dataCriacao ||
      null,

    dataModificacao:
      occurrence.dataModificacao ||
      null,

    adocao:
      mapAdoptionFromApi(
        occurrence.adocao
      ),
  };
}

function mapAdoptionToApi(
  adoption
) {
  if (!adoption) {
    return null;
  }

  return {
    nome:
      adoption.nome?.trim() ||
      "",

    cpfRg:
      adoption.cpfRg?.trim() ||
      null,

    telefone:
      adoption.telefone?.trim() ||
      null,

    email:
      adoption.email?.trim() ||
      null,

    endereco:
      adoption.endereco?.trim() ||
      null,

    observacoes:
      adoption.observacoes?.trim() ||
      null,
  };
}

function mapOccurrenceToApi(
  occurrence
) {
  return {
    tipo:
      occurrence.tipo,

    data:
      occurrence.data,

    descricao:
      occurrence.descricao
        ?.trim() ||
      null,

    custo:
      normalizeCost(
        occurrence.custo
      ),

    dadosAdocao:
      occurrence.tipo ===
      "ADOCAO"
        ? mapAdoptionToApi(
            occurrence.adocao
          )
        : null,
  };
}

function mapCreateOccurrenceToApi(
  occurrence
) {
  return {
    ...mapOccurrenceToApi(
      occurrence
    ),

    animalId:
      occurrence.animalId,
  };
}

function buildOccurrenceFormData(
  payload,
  adoption
) {
  const formData =
    new FormData();

  const jsonBlob =
    new Blob(
      [
        JSON.stringify(
          payload
        ),
      ],
      {
        type:
          "application/json",
      }
    );

  formData.append(
    "dados",
    jsonBlob
  );

  if (
    adoption
      ?.entrevistaArquivo instanceof
    File
  ) {
    formData.append(
      "entrevistaAdocao",
      adoption
        .entrevistaArquivo
    );
  }

  if (
    adoption
      ?.termoArquivo instanceof
    File
  ) {
    formData.append(
      "termoAdocao",
      adoption.termoArquivo
    );
  }

  return formData;
}

export async function listOccurrencesByAnimal(
  animalId
) {
  const response =
    await api.get(
      `/api/ocorrencias/animal/${animalId}`
    );

  return response.data.map(
    mapOccurrenceFromApi
  );
}

export async function getOccurrenceById(
  id
) {
  const response =
    await api.get(
      `/api/ocorrencias/${id}`
    );

  return mapOccurrenceFromApi(
    response.data
  );
}

export async function createOccurrence(
  occurrence
) {
  const payload =
    mapCreateOccurrenceToApi(
      occurrence
    );

  if (
    occurrence.tipo ===
    "ADOCAO"
  ) {
    const formData =
      buildOccurrenceFormData(
        payload,
        occurrence.adocao
      );

    const response =
      await api.post(
        "/api/ocorrencias",
        formData
      );

    return mapOccurrenceFromApi(
      response.data
    );
  }

  const response =
    await api.post(
      "/api/ocorrencias",
      payload
    );

  return mapOccurrenceFromApi(
    response.data
  );
}

export async function updateOccurrence(
  id,
  occurrence
) {
  const payload =
    mapOccurrenceToApi(
      occurrence
    );

  if (
    occurrence.tipo ===
    "ADOCAO"
  ) {
    const formData =
      buildOccurrenceFormData(
        payload,
        occurrence.adocao
      );

    const response =
      await api.put(
        `/api/ocorrencias/${id}`,
        formData
      );

    return mapOccurrenceFromApi(
      response.data
    );
  }

  const response =
    await api.put(
      `/api/ocorrencias/${id}`,
      payload
    );

  return mapOccurrenceFromApi(
    response.data
  );
}

export async function deleteOccurrence(
  id
) {
  await api.delete(
    `/api/ocorrencias/${id}`
  );
}

export async function downloadOccurrenceDocument(
  url,
  filename
) {
  if (!url) {
    throw new Error(
      "Documento não disponível."
    );
  }

  const response =
    await api.get(
      url,
      {
        responseType: "blob",
      }
    );

  const blobUrl =
    URL.createObjectURL(
      response.data
    );

  const link =
    document.createElement(
      "a"
    );

  link.href =
    blobUrl;

  link.download =
    filename ||
    "documento.pdf";

  document.body.appendChild(
    link
  );

  link.click();
  link.remove();

  window.setTimeout(() => {
    URL.revokeObjectURL(
      blobUrl
    );
  }, 1000);
}