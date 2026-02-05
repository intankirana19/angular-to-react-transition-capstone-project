import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/axios';
import { userListSchema, type User } from '../types';

export function useGetUsers() {
  return useQuery({
    queryKey: ['users'],
    queryFn: async (): Promise<User[]> => {
      const response = await apiClient.get('https://jsonplaceholder.typicode.com/users');
      return userListSchema.parse(response.data);
    },
  });
}
