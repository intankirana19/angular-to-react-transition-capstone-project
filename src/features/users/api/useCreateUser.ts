import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/shared/lib/axios';
import { userSchema, type CreateUserInput, type User } from '../types';

export function useCreateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: CreateUserInput): Promise<User> => {
      const response = await apiClient.post('/users', input);
      return userSchema.parse(response.data);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
}
