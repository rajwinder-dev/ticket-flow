export interface Organization {
  name: string;
  isOwner: boolean;
  logo?: string;
  id: string;
  role: string;
}
export interface InviteDetails {
  organization: string;
  role: string;
  invitedTo: string;
  invitedBy: string;
  expiresAt: string;
}
