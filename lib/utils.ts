import type { ToReadItem } from "@/types/item";

export function sortItemsByDate(items: ToReadItem[]): ToReadItem[] {
  return [...items].sort(
    (a, b) =>
      new Date(b.added_at).getTime() - new Date(a.added_at).getTime()
  );
}

export function getDisplayUrl(url: string): string {
  return url.split("/").slice(0, 3).join("/");
}
