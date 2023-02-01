import {useQuery} from '@tanstack/react-query';
import {getSongs} from '../api/songs';

const QUERY_KEY = 'songs';

export const useSongs = () => {
  return useQuery({queryKey: [QUERY_KEY], queryFn: getSongs});
};

// export const useAddSong = (file: Blob) => {
//   const mutation = useMutation(addSong(file), {
//     onSuccess
//   });
// };
