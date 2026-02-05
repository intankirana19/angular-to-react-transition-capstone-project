export interface DailyLog {
  id: string;
  date: Date;
  title: string;
  category: 'work' | 'personal' | 'meeting' | 'development' | 'other';
  priority: 'low' | 'medium' | 'high';
  description: string;
  status: 'pending' | 'in-progress' | 'completed';
  createdAt: Date;
  updatedAt: Date;
}

export type CreateDailyLogInput = Omit<DailyLog, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateDailyLogInput = Partial<CreateDailyLogInput>;

export interface DailyLogFilters {
  category?: DailyLog['category'];
  priority?: DailyLog['priority'];
  status?: DailyLog['status'];
  searchQuery?: string;
}
