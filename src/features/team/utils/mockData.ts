import { type TeamMember } from '../types';

interface MockMemberConfig {
  name: string;
  username: string;
}

const mockMembers: MockMemberConfig[] = [
  { name: 'Olivia Rhye', username: 'olivia' },
  { name: 'Phoenix Baker', username: 'phoenix' },
  { name: 'Lana Steiner', username: 'lana' },
  { name: 'Demi Wilkinson', username: 'demi' },
  { name: 'Candice Wu', username: 'candice' },
  { name: 'Natali Craig', username: 'natali' },
  { name: 'Drew Cano', username: 'drew' },
  { name: 'Orlando Diggs', username: 'orlando' },
  { name: 'Andi Lane', username: 'andi' },
  { name: 'Kate Morrison', username: 'kate' },
];

function generateTeamMember(
  id: string,
  config: MockMemberConfig,
  overrides?: Partial<TeamMember>
): TeamMember {
  return {
    id,
    name: config.name,
    username: config.username,
    email: `${config.username}@akarinti.tech`,
    role: 'Product Designer',
    status: 'active',
    labels: ['Label', 'Label', 'Label'],
    ...overrides,
  };
}

export function getMockTeamMembers(): TeamMember[] {
  return mockMembers.map((member, index) => generateTeamMember(String(index + 1), member));
}

export function generateMockMember(overrides?: Partial<TeamMember>): TeamMember {
  const randomMember = mockMembers[Math.floor(Math.random() * mockMembers.length)];
  return generateTeamMember(String(Date.now()), randomMember, overrides);
}
