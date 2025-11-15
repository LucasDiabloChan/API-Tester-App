import axios from 'axios';

export interface SongRegisterDTO {
  // campos esperados para cadastro, ex:
  nome: string;
  artista: string;
  album: string;
}

export interface RegisteredSongResponse {
  // campos retornados após cadastro
  id: number;
  nome: string;
  artista: string;
  album: string;
}

export const postSong = async (song: SongRegisterDTO): Promise<RegisteredSongResponse> => {
  const response = await axios.post('https://harppia-endpoints.onrender.com/v1/song/register', song);
  return response.data;
};