import dogCoragem from "../assets/animals/dog-coragem.jpg";
import dogCoragemDoente from "../assets/animals/event-coragem-doente.jpg";
import dogCoragemDoente2 from "../assets/animals/event-coragem-doente-2.jpg";
import mockAnimals from "./mockAnimals";

function buildDefaultAnimal(baseAnimal) {
  return {
    ...baseAnimal,
    castrado: baseAnimal.sexo === "Macho" ? "Sim" : "Não informado",
    raca: "SRD",
    nascimento: "05/03/2016",
    responsavel: "Doguinhos da UFAL",
    adoptionLabel:
      baseAnimal.status === "Adotado" ? "Adotado" : "Disponível para adoção",
    descricao:
      "Animal acompanhado pelo projeto Doguinhos da UFAL. Necessita de acompanhamento e registro atualizado de ocorrências, vacinação e histórico geral.",
    gallery: [baseAnimal.imagem],
    history: [
      {
        id: 1,
        date: "07/05/2023",
        title: "Registro inicial",
        description:
          "Entrada inicial no sistema para acompanhamento do animal.",
        status: "Encerrado",
        type: "warning",
      },
      {
        id: 2,
        date: "10/05/2023",
        title: "Avaliação geral",
        description: "Avaliação básica registrada pela equipe responsável.",
        status: "Encerrado",
        type: "success",
      },
    ],
  };
}

const customAnimalDetails = {
  4: {
    castrado: "Sim",
    raca: "SRD",
    nascimento: "05/03/2016",
    responsavel: "Doguinhos da UFAL",
    adoptionLabel: "Disponível para adoção",
    descricao:
      "Um dog bem dócil e medroso, que sempre que possível tá tirando um cochilo. Já passou por poucas e boas na UFAL, precisamos urgentemente de uma adoção pra ele.",
    gallery: [
      dogCoragem,
      dogCoragemDoente,
      dogCoragemDoente2,
    ],
    history: [
      {
        id: 1,
        date: "07/05/2023",
        title: "Mancha suspeita de vômito",
        description:
          "Foi encontrado na UFAL deitado próximo a uma mancha que aparentava ser vômito, suspeitamos de envenenamento. Encerrado por: Joandeson.",
        status: "Encerrado",
        type: "warning",
      },
      {
        id: 2,
        date: "10/05/2023",
        title: "Castração",
        description:
          "Realizado procedimento de castração. Encerrado por: Joandeson.",
        status: "Encerrado",
        type: "success",
      },
    ],
  },
};

export function getAnimalDetailsById(id) {
  const numericId = Number(id);
  const baseAnimal = mockAnimals.find((animal) => animal.id === numericId);

  if (!baseAnimal) {
    return null;
  }

  const defaultAnimal = buildDefaultAnimal(baseAnimal);
  const customData = customAnimalDetails[numericId] || {};

  return {
    ...defaultAnimal,
    ...customData,
    gallery: customData.gallery || defaultAnimal.gallery,
    history: customData.history || defaultAnimal.history,
  };
}