export type AnnouncementPriority = "low" | "medium" | "high";

export interface Announcement {
  id: string;
  title: string;
  content: string;
  priority: AnnouncementPriority;
  createdBy: string;
  createdAt: string;
}


export interface CreateAnnouncementInput {
  title: string;
  content: string;
  priority: AnnouncementPriority;
  createdBy: string;
}


export interface UpdateAnnouncementInput {
  priority?: AnnouncementPriority;
}