import { TeamTable } from './components/TeamTable';
import { getMockTeamMembers } from './utils/mockData';
import { type TeamMember } from './types';
import { Button } from '@/shared/ui/Button';
import { Download, Upload } from 'lucide-react';

export default function TeamPage() {
  const mockTeamMembers = getMockTeamMembers();

  const handleEdit = (member: TeamMember) => {
    console.log('Edit member:', member);
  };

  const handleDelete = (member: TeamMember) => {
    console.log('Delete member:', member);
  };

  const handleAddMember = () => {
    console.log('Add new member');
  };

  return (
    <div>
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Team Member</h1>
          <p className="mt-1 text-sm text-neutral-600">
            These companies have purchased in the last 12 months.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            className="border-neutral-200 text-neutral-700 hover:bg-neutral-50 active:bg-neutral-100"
            onClick={() => console.log('Download all')}
          >
            <Download className="w-4 h-4" />
            Download all
          </Button>
          <Button variant="primary" onClick={handleAddMember}>
            <Upload className="w-4 h-4" />
            Upload
          </Button>
        </div>
      </div>

      <TeamTable data={mockTeamMembers} onEdit={handleEdit} onDelete={handleDelete} />
    </div>
  );
}
