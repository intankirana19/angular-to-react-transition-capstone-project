import { useSuspenseQuery } from '@tanstack/react-query';
import { apiClient } from '@/shared/lib/axios';
import { userListSchema, type User } from '../types';

export function useGetUsers() {
  return useSuspenseQuery({  // ganti dr useQuery jadi pakai useSuspenseQuery biar state loading dihandle di <Suspense fallback> di MainLayout
    queryKey: ['users'],
    queryFn: async (): Promise<User[]> => {
      const response = await apiClient.get('https://jsonplaceholder.typicode.com/users');
      return userListSchema.parse(response.data);
    },
  });
}
