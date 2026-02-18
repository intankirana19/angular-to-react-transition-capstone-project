import { type User } from '../types';

interface UsersTableProps {
  users: User[];
}

export function UsersTable({ users }: UsersTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-neutral-300">
        <thead className="bg-neutral-200/70">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-semibold text-neutral-700 uppercase tracking-wider">
              Name
            </th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-neutral-700 uppercase tracking-wider">
              Email
            </th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-neutral-700 uppercase tracking-wider">
              Website
            </th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-neutral-700 uppercase tracking-wider">
              Company
            </th>
          </tr>
        </thead>
        <tbody className="bg-neutral-100 divide-y divide-neutral-300">
          {users.map((user) => (
            <tr key={user.id} className="transition-colors hover:bg-neutral-200/70">
              <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-neutral-900">
                {user.name}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-800">{user.email}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-primary-700">{user.website}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-800">
                {user.company.name}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
