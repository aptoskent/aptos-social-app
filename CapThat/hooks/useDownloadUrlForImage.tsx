import { useQuery } from '@tanstack/react-query';
import storage from '@react-native-firebase/storage';

export function useDownloadUrlForImage(imgUrl?: string) {
  const query = useQuery({
    enabled: !!imgUrl,
    queryKey: ['imageUrl', imgUrl],
    queryFn: () => storage().ref(imgUrl).getDownloadURL(),
    // we assume that the download url for a given img_url is immutable, therefore the result of this query is never stale
    staleTime: Infinity,
    cacheTime: 1000 * 60 * 60, // 1 hour, this is just to garbage collect unused cache items to free up memory
  });
  return {
    downloadUrl: query.data,
    isLoading: query.isLoading,
    error: query.error,
  };
}
