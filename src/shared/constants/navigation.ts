import {
  LayoutGrid,
  Users,
  UsersRound,
  Package,
  // Home,
  // Type,
  // ChevronDown,
  // ListFilter,
  // Calendar,
  // FileText,
  // MessageSquare,
  // File,
  // BookOpen,
  // Palette,
  type LucideIcon,
} from 'lucide-react';

export interface NavItem {
  label: string;
  icon: LucideIcon;
  href?: string;
  end?: boolean;
  children?: NavItem[];
}

export const navigation: NavItem[] = [
  // {
  //   label: 'Home',
  //   href: '/',
  //   icon: Home,
  //   end: true,
  // },
  {
    label: 'Management',
    icon: LayoutGrid,
    children: [
      {
        label: 'Users',
        href: '/users',
        icon: Users,
      },
      {
        label: 'Products',
        href: '/products',
        icon: Package,
      },
      {
        label: 'Team',
        href: '/team',
        icon: UsersRound,
      },
    ],
  },
  // {
  //   label: 'UI',
  //   icon: Package,
  //   children: [
  //     {
  //       label: 'Typography',
  //       href: '/typography',
  //       icon: Type,
  //     },
  //     {
  //       label: 'Colors',
  //       href: '/colors',
  //       icon: Palette,
  //     },
  //     {
  //       label: 'Accordion',
  //       href: '/accordion',
  //       icon: ChevronDown,
  //     },
  //     {
  //       label: 'Select',
  //       href: '/select',
  //       icon: ListFilter,
  //     },
  //     {
  //       label: 'Date Picker',
  //       href: '/datepicker',
  //       icon: Calendar,
  //     },
  //     {
  //       label: 'Textarea',
  //       href: '/textarea',
  //       icon: FileText,
  //     },
  //     {
  //       label: 'Dialog',
  //       href: '/dialog',
  //       icon: MessageSquare,
  //     },
  //   ],
  // },
  // {
  //   label: 'Pages',
  //   icon: File,
  //   children: [
  //     {
  //       label: 'Daily Logs',
  //       href: '/daily-logs',
  //       icon: BookOpen,
  //     },
  //   ],
  // },
];
