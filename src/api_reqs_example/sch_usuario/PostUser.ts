import axios from 'axios';

export interface EnderecoCadastroDTO {
  cep: string;
  uf: string;
  cidade: string;
  bairro: string;
  logradouro: string;
  numero: string;
  complemento?: string;
}

export interface UsuarioCadastroDTO {
  cpf: string;
  nomeCompleto: string;
  nomeSocialCompleto?: string;
  sexo: string; // Usando string pois Character em Java pode vir como string simples
  dataNascimento: string; // ISO date string, ex: '1990-01-01'
  email: string;
  telefone: string;
  senha: string;
  endereco: EnderecoCadastroDTO;
}

// Função para converter base64 em Blob
function base64ToBlob(dataUri: string): Blob {
  const [prefix, base64] = dataUri.split(',');
  const mimeMatch = prefix.match(/:(.*?);/);
  const mime = mimeMatch ? mimeMatch[1] : 'application/octet-stream';
  const byteCharacters = atob(base64);
  const byteNumbers = new Array(byteCharacters.length);
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }
  const byteArray = new Uint8Array(byteNumbers);
  return new Blob([byteArray], { type: mime });
}

/**
 * Faz o POST para cadastro do usuário.
 * @param userData Dados do usuário a cadastrar
 * @param profilePhoto Opcional, arquivo da foto do perfil { uri, type, name }
 * @returns Dados do usuário cadastrado (conforme seu DTO de resposta)
 */
export const postUsuario = async (
  userData: UsuarioCadastroDTO,
  profilePhoto?: { uri: string; type: string; name: string }
): Promise<any> => {
  const formData = new FormData();

  // Adiciona o JSON como Blob para backend desserializar
  const jsonBlob = new Blob([JSON.stringify(userData)], { type: 'application/json' });
  formData.append('user_data', jsonBlob);

  if (profilePhoto) {
    // Detecta se uri é base64 (data URI)
    if (profilePhoto.uri.startsWith('data:')) {
      const blob = base64ToBlob(profilePhoto.uri);
      formData.append('profile_photo', blob, profilePhoto.name);
    } else { 
      // URI local normal, repassa direto
      formData.append('profile_photo', {
        uri: profilePhoto.uri,
        type: profilePhoto.type,
        name: profilePhoto.name,
      } as any);
    }
  }

  // Importante: NÃO definir manualmente 'Content-Type', deixe axios cuidar disso

  const response = await axios.post(
    'https://harppia-endpoints.onrender.com/v1/users/register',
    formData,
  );

  return response.data;
};
