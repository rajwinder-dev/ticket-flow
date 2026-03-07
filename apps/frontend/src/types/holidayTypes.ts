export interface CreateHoliday {
  name: string;
  description: string;
  data: Date;
}
export interface HolidayDetails extends CreateHoliday {
  srNo?: number;
  createdAt: Date;
  id: number;
}
export interface HolidaySummary {
  holidaysThisYear: number;
  upcomingHoliday: {
    id: number;
    name: string;
    date: Date;
    description: string;
  };
}
