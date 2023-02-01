import axios from 'axios';
// import {API_BASE_URL} from '@env';

interface Song {
  id: string;
  url: string;
  artwork?: string;
  title?: string;
  artist: string;
}

interface GetSongsResponse {
  songs: Song[];
  baseStorageUrl: string;
  sasUri: string;
}

export const getSongs = async (): Promise<GetSongsResponse> => {
  const {data} = await axios.get(
    'https://shamisenfunctions.azurewebsites.net/api/songs',
  );
  return data;
};

export const addSong = async (): Promise<Song> => {
  const {data} = await axios.post(
    'https://shamisenfunctions.azurewebsites.net/api/songs',
  );
  return data;
};
