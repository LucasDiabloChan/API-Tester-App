import axios from 'axios';

export interface Song {
  id: number;
  nome: string;
  artista: string;
  album: string;
}

export interface ApiResponseSongs {
  listInfBscMusRVO: Song[];
}

export const getSongs = async (): Promise<Song[]> => {
  const response = await axios.get<ApiResponseSongs>('https://seu-dominio.com/v1/song/find');
  return response.data.listInfBscMusRVO;
};