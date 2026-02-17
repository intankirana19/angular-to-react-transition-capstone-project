import { useGetUsers } from './api/useGetUsers';
import { UsersTable } from './components/UsersTable';
import { Button } from '@/shared/ui/Button';

export default function UsersPage() {
  const { data: users, error } = useGetUsers();

  if (error) {
    return (
      <div className="rounded-lg bg-danger-50 p-4 text-danger-800">
        <p className="font-medium">Error loading users</p>
        <p className="text-sm mt-1">{error.message}</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-neutral-900">Users</h1>
        <Button>Add User</Button>
      </div>

      <div className="bg-white rounded-lg shadow">
        {users && users.length > 0 ? (
          <UsersTable users={users} />
        ) : (
          <div className="p-8 text-center text-neutral-500">No users found</div>
        )}
      </div>
    </div>
  );
}
