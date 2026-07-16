import api from "./api";
import {
  getCurrentUser,
  normalizeUser,
  updateStoredUser,
} from "./authService";

export const USER_PROFILE_OPTIONS = [
  {
    value: "VOLUNTARIO",
    label: "Voluntário",
  },
  {
    value: "ADMIN",
    label: "Administrador",
  },
];

function toApiDateTime(value) {
  if (!value) {
    return null;
  }

  if (String(value).includes("T")) {
    return value;
  }

  return `${value}T00:00:00`;
}

function mapUserFromApi(user) {
  return normalizeUser(user, {
    cacheBust: true,
  });
}

function buildCreatePayload(user) {
  return {
    nome: user.nome.trim(),
    email: user.email.trim(),
    senha: user.senha,
    perfil: user.perfil,
    descricao: user.descricao?.trim() || null,
    telefone: user.telefone?.trim() || null,
    dataIngresso: toApiDateTime(user.dataIngresso),
    curso: user.curso?.trim() || null,
  };
}

function buildUpdatePayload(user) {
  const payload = {
    nome: user.nome?.trim() || null,
    email: user.email?.trim() || null,
    perfil: user.perfil || null,
    ativo:
      typeof user.ativo === "boolean"
        ? user.ativo
        : null,
    descricao: user.descricao?.trim() || null,
    telefone: user.telefone?.trim() || null,
    dataIngresso: toApiDateTime(user.dataIngresso),
    curso: user.curso?.trim() || null,
  };

  /*
   * A senha só é enviada quando o administrador
   * informou uma nova senha no formulário.
   *
   * Se ficar vazia, o campo não será enviado e
   * a senha atual do usuário será mantida.
   */
  if (user.senha?.trim()) {
    payload.senha = user.senha;
  }

  return payload;
}

function buildOwnProfilePayload(user) {
  return {
    nome: user.nome?.trim() || "",
    descricao: user.descricao?.trim() || null,
    telefone: user.telefone?.trim() || null,
    dataIngresso: toApiDateTime(user.dataIngresso),
    curso: user.curso?.trim() || null,
  };
}

function buildFormData(
  payload,
  fotoArquivo = null
) {
  const formData = new FormData();

  const dadosBlob = new Blob(
    [JSON.stringify(payload)],
    {
      type: "application/json",
    }
  );

  formData.append("dados", dadosBlob);

  if (fotoArquivo instanceof File) {
    formData.append("foto", fotoArquivo);
  }

  return formData;
}

function synchronizeAuthenticatedUser(updatedUser) {
  const currentUser = getCurrentUser();

  if (
    currentUser?.id &&
    updatedUser?.id &&
    String(currentUser.id) ===
      String(updatedUser.id)
  ) {
    updateStoredUser(updatedUser);
  }
}

export async function getAuthenticatedUser() {
  const response = await api.get(
    "/api/usuarios/me"
  );

  const user = mapUserFromApi(
    response.data
  );

  updateStoredUser(user);

  return user;
}

export async function listUsers() {
  const response = await api.get(
    "/api/usuarios"
  );

  return response.data
    .map(mapUserFromApi)
    .sort((firstUser, secondUser) =>
      (firstUser.nome || "").localeCompare(
        secondUser.nome || "",
        "pt-BR"
      )
    );
}

export async function getUserById(id) {
  const response = await api.get(
    `/api/usuarios/${id}`
  );

  return mapUserFromApi(
    response.data
  );
}

export async function createUser(
  user,
  fotoArquivo = null
) {
  const payload =
    buildCreatePayload(user);

  const formData = buildFormData(
    payload,
    fotoArquivo
  );

  const response = await api.post(
    "/api/usuarios",
    formData
  );

  return mapUserFromApi(
    response.data
  );
}

export async function updateUser(
  id,
  user,
  fotoArquivo = null
) {
  const payload =
    buildUpdatePayload(user);

  const formData = buildFormData(
    payload,
    fotoArquivo
  );

  const response = await api.put(
    `/api/usuarios/${id}`,
    formData
  );

  const updatedUser = mapUserFromApi(
    response.data
  );

  synchronizeAuthenticatedUser(
    updatedUser
  );

  return updatedUser;
}

export async function updateAuthenticatedUser(
  user,
  fotoArquivo = null
) {
  const payload =
    buildOwnProfilePayload(user);

  const formData = buildFormData(
    payload,
    fotoArquivo
  );

  const response = await api.put(
    "/api/usuarios/me",
    formData
  );

  const updatedUser = mapUserFromApi(
    response.data
  );

  updateStoredUser(updatedUser);

  return updatedUser;
}

export async function updateAuthenticatedPassword(
  senhaAtual,
  novaSenha
) {
  await api.put(
    "/api/usuarios/me/senha",
    {
      senhaAtual,
      novaSenha,
    }
  );
}

export async function deleteUser(id) {
  await api.delete(
    `/api/usuarios/${id}`
  );
}