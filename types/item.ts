export interface ToReadItem {
  added_at: string;
  description: string;
  id: string;
  read_at: string | null;
  status: "unread" | "reading" | "read" | string;
  tags: string;
  title: string;
  url: string;
}