"use client";

import { useState } from "react";
import { Tabs } from "radix-ui";
import type { ToReadItem } from "../../types/item";
import ItemList from "../item-list";
import { FileCheckIcon, LoaderIcon } from "../icons";
import { ActionDialog } from "../dialog";

interface TabListProps {
  itemList: ToReadItem[];
  isLoading: boolean;
  onMarkAllRead: () => void;
  handleDelete: (id: string) => void;
  handleMarkAsRead: (item: ToReadItem) => void;
  handleMarkAsUnread: (item: ToReadItem) => void;
  onLoadMore: (status: string | undefined, page: number) => Promise<ToReadItem[]>;
  pageSize: number;
}

export default function TabList({
  itemList,
  isLoading,
  onMarkAllRead,
  handleDelete,
  handleMarkAsRead,
  handleMarkAsUnread,
  onLoadMore,
  pageSize,
}: TabListProps) {
  const [confirmReadAllOpen, setConfirmReadAllOpen] = useState(false);

  const style = {
    tabTrigger:
      "font-medium data-[state=active]:border-b-neutral-900 dark:data-[state=active]:border-b-neutral-100 border-b-2 border-b-transparent py-2",
    tabContent: "-mb-16",
  };

  return (
    <Tabs.Root
      defaultValue="all"
      onValueChange={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className="mt-16 group space-y-0"
    >
      <Tabs.List className="sticky top-0 bg-stone-100/50 dark:bg-neutral-900/50 z-10 backdrop-blur-lg flex gap-8 mb-0 border-b border-stone-200 dark:border-neutral-800 items-center -mx-8 w-[calc(100%+4rem-2px)] px-8">
        <Tabs.Trigger className={style.tabTrigger} value="all">
          All
        </Tabs.Trigger>
        <Tabs.Trigger className={style.tabTrigger} value="unread">
          Unread
        </Tabs.Trigger>
        <Tabs.Trigger className={style.tabTrigger} value="read">
          Read
        </Tabs.Trigger>
        <ActionDialog
          open={confirmReadAllOpen}
          onOpenChange={setConfirmReadAllOpen}
          title="Confirm Read All"
          description="Are you sure you want to mark all items as read? This action cannot be undone."
          confirmText="Yes, Mark All Read"
          onConfirm={() => {
            setConfirmReadAllOpen(false);
            onMarkAllRead();
          }}
          isDanger={false}
          trigger={
            <button
              onClick={() => setConfirmReadAllOpen(true)}
              className="ml-auto text-sm flex flex-row gap-1 px-1.5 md:px-3 py-1.5 rounded-full bg-stone-200 dark:bg-neutral-800 hover:bg-stone-300 dark:hover:bg-neutral-700 transition-all"
            >
              <FileCheckIcon size={18} />
              <span className="hidden md:inline">Read All</span>
            </button>
          }
        />
      </Tabs.List>
      <Tabs.Content value="all" className={style.tabContent}>
        {isLoading ? (
          <LoaderIcon className="mx-auto my-16 animate-spin" />
        ) : (
          <ItemList
            initialItems={itemList}
            onLoadMore={(page) => onLoadMore(undefined, page)}
            handleDelete={handleDelete}
            handleMarkAsRead={handleMarkAsRead}
            handleMarkAsUnread={handleMarkAsUnread}
            pageSize={pageSize}
          />
        )}
      </Tabs.Content>
      <Tabs.Content value="unread" className={style.tabContent}>
        <ItemList
          initialItems={[]}
          onLoadMore={(page) => onLoadMore("unread", page)}
          handleDelete={handleDelete}
          handleMarkAsRead={handleMarkAsRead}
          handleMarkAsUnread={handleMarkAsUnread}
          pageSize={pageSize}
          filter={{ status: "unread" }}
        />
      </Tabs.Content>
      <Tabs.Content value="read" className={style.tabContent}>
        <ItemList
          initialItems={[]}
          onLoadMore={(page) => onLoadMore("read", page)}
          handleDelete={handleDelete}
          handleMarkAsRead={handleMarkAsRead}
          handleMarkAsUnread={handleMarkAsUnread}
          pageSize={pageSize}
          filter={{ status: "read" }}
        />
      </Tabs.Content>
    </Tabs.Root>
  );
}
