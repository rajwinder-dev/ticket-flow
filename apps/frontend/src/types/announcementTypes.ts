export interface CreateAnnouncement {
  title: string;
  description: string;
  type: string;
  target: string;
}
export interface AnnouncementDetails extends CreateAnnouncement {
  srNo?: number;
  id: number;
  createdAt: Date;
  announcedBy: number;
}
