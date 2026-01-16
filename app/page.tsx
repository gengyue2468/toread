/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState, useCallback } from "react";
import {
  checkHealth,
  getToReadList,
  getToReadListByStatus,
  getStats,
} from "./api/fetchData";
import type { ToReadItem } from "../types/item";
import Hero from "@/components/hero";
import TabList from "@/components/tab-list";
import { ActionDialog } from "@/components/dialog";
import { useItemActions } from "@/components/item-list/use-item-actions";

const PAGE_SIZE = 15;

export default function App() {
  const [status, setStatus] = useState("");
  const [stats, setStats] = useState<{ unread: number; read: number }>({
    unread: 0,
    read: 0,
  });
  const [itemList, setItemList] = useState<ToReadItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const {
    accessDeniedOpen,
    setAccessDeniedOpen,
    handleDelete,
    handleMarkAsRead,
    handleMarkAsUnread,
    handleMarkAllRead,
  } = useItemActions({ itemList, setItemList, stats, setStats });

  // Load more items for all/unread/read tabs
  const loadMore = useCallback(
    async (status: string | undefined, page: number) => {
      const data = await getToReadListByStatus(status || "", page, PAGE_SIZE);
      return data.items;
    },
    []
  );

  useEffect(() => {
    checkHealth().then((data) => setStatus(data.status));
    getStats().then((data) =>
      setStats({ unread: data.unread, read: data.read })
    );

    getToReadList(1, PAGE_SIZE).then((data) => {
      setItemList(data.items);
      setIsLoading(false);
    });
  }, []);

  return (
    <div className="max-w-prose mx-auto px-8 pt-16 border-x border-stone-200 dark:border-neutral-800 min-h-screen">
      <Hero status={status} stats={stats} />

      <ActionDialog
        open={accessDeniedOpen}
        onOpenChange={setAccessDeniedOpen}
        title="Access Denied"
        description="You need to sign in to modify the toread list."
        confirmText="OK"
        onConfirm={() => setAccessDeniedOpen(false)}
        isDanger={true}
        trigger={null}
      />

      <TabList
        itemList={itemList}
        isLoading={isLoading}
        onMarkAllRead={handleMarkAllRead}
        handleDelete={handleDelete}
        handleMarkAsRead={handleMarkAsRead}
        handleMarkAsUnread={handleMarkAsUnread}
        onLoadMore={loadMore}
        pageSize={PAGE_SIZE}
      />
    </div>
  );
}
