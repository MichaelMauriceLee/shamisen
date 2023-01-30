import axios from 'axios';
// import {API_BASE_URL} from '@env';

interface GetSongResponse {
  songs: string[];
  baseStorageUrl: string;
  sasUri: string;
}

export const getSongs = async (): Promise<GetSongResponse> => {
  const {data} = await axios.get(
    'https://shamisenfunctions.azurewebsites.net/api/songs',
  );
  return data;
};
