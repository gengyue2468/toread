/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useCallback } from "react";
import { useSession } from "next-auth/react";
import type { ToReadItem } from "../../types/item";
import {
  deleteToReadItem,
  updateToReadItem,
  markAllRead,
} from "../../app/api/handleData";

interface Stats {
  unread: number;
  read: number;
}

interface UseItemActionsOptions {
  itemList: ToReadItem[];
  setItemList: React.Dispatch<React.SetStateAction<ToReadItem[]>>;
  stats: Stats;
  setStats: React.Dispatch<React.SetStateAction<Stats>>;
}

interface UseItemActionsReturn {
  accessDeniedOpen: boolean;
  setAccessDeniedOpen: (open: boolean) => void;
  handleDelete: (id: string) => Promise<void>;
  handleMarkAsRead: (item: ToReadItem) => Promise<void>;
  handleMarkAsUnread: (item: ToReadItem) => Promise<void>;
  handleMarkAllRead: () => Promise<void>;
}

export function useItemActions({
  itemList,
  setItemList,
  stats,
  setStats,
}: UseItemActionsOptions): UseItemActionsReturn {
  const { data: session } = useSession();
  const [accessDeniedOpen, setAccessDeniedOpen] = useState(false);

  const handleDelete = useCallback(
    async (id: string) => {
      if (!session) {
        setAccessDeniedOpen(true);
        return;
      }
      try {
        const item = itemList.find((i) => i.id === id);
        await deleteToReadItem(id);
        setItemList((prev) => prev.filter((item) => item.id !== id));

        // Update stats
        if (item) {
          setStats((prev) => ({
            ...prev,
            [item.status === "unread" ? "unread" : "read"]:
              Math.max(0, prev[item.status === "unread" ? "unread" : "read"] - 1),
          }));
        }
      } catch (err: Error | any) {
        setAccessDeniedOpen(true);
      }
    },
    [session, itemList, setItemList, setStats]
  );

  const handleMarkAsRead = useCallback(
    async (item: ToReadItem) => {
      if (!session) {
        setAccessDeniedOpen(true);
        return;
      }
      try {
        const now = new Date().toISOString();
        setItemList((prev) =>
          prev.map((i) =>
            i.id === item.id ? { ...i, status: "read" as const, read_at: now } : i
          )
        );

        // Update stats
        if (item.status === "unread") {
          setStats((prev) => ({
            unread: Math.max(0, prev.unread - 1),
            read: prev.read + 1,
          }));
        }

        await updateToReadItem(item.id, { status: "read" });
      } catch (err: any) {
        setAccessDeniedOpen(true);
      }
    },
    [session, setItemList, setStats]
  );

  const handleMarkAsUnread = useCallback(
    async (item: ToReadItem) => {
      if (!session) {
        setAccessDeniedOpen(true);
        return;
      }
      try {
        setItemList((prev) =>
          prev.map((i) =>
            i.id === item.id
              ? { ...i, status: "unread" as const, read_at: null }
              : i
          )
        );

        // Update stats
        if (item.status === "read") {
          setStats((prev) => ({
            unread: prev.unread + 1,
            read: Math.max(0, prev.read - 1),
          }));
        }

        await updateToReadItem(item.id, { status: "unread" });
      } catch (err: any) {
        setAccessDeniedOpen(true);
      }
    },
    [session, setItemList, setStats]
  );

  const handleMarkAllRead = useCallback(async () => {
    if (!session) {
      setAccessDeniedOpen(true);
      return;
    }
    try {
      const now = new Date().toISOString();
      const unreadCount = itemList.filter((i) => i.status === "unread").length;

      setItemList((prev) =>
        prev.map((i) => ({ ...i, status: "read" as const, read_at: now }))
      );

      // Update stats
      setStats((prev) => ({
        unread: 0,
        read: prev.read + unreadCount,
      }));

      await markAllRead();
    } catch (err: any) {
      setAccessDeniedOpen(true);
    }
  }, [session, itemList, setItemList, setStats]);

  return {
    accessDeniedOpen,
    setAccessDeniedOpen,
    handleDelete,
    handleMarkAsRead,
    handleMarkAsUnread,
    handleMarkAllRead,
  };
}
