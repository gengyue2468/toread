/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import { checkHealth, getToReadList, getReadList } from "./api/fetchData";
import {
  deleteToReadItem,
  updateToReadItem,
  markAllRead,
} from "./api/handleData";
import { Tabs } from "radix-ui";
import type { ToReadItem } from "../types/item";
import Hero from "@/components/hero";
import Card from "@/components/card";
import { FileCheckIcon, LoaderIcon } from "@/components/icons";
import { ActionDialog } from "@/components/dialog";
import { useSession } from "next-auth/react";

export default function App() {
  const { data: session } = useSession();
  const [status, setStatus] = useState("");
  const [itemList, setItemList] = useState<ToReadItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [comfirmReadAllOpen, setComfirmReadAllOpen] = useState(false);
  const [accessDeniedOpen, setAccessDeniedOpen] = useState(false);

  useEffect(() => {
    checkHealth().then((data) => setStatus(data.status));

    Promise.all([getToReadList(), getReadList()]).then(([toRead, read]) => {
      const combined = [...toRead.items, ...read.items];
      combined.sort(
        (a, b) =>
          new Date(b.added_at).getTime() - new Date(a.added_at).getTime()
      );
      setItemList(combined);
      setIsLoading(false);
    });
  }, []);

  const handleDelete = async (id: string) => {
    if (!session) {
      setAccessDeniedOpen(true);
      return;
    }
    try {
      await deleteToReadItem(id);
      setItemList((prev) => prev.filter((item) => item.id !== id));
    } catch (err: Error | any) {
      setAccessDeniedOpen(true);
    }
  };

  const handleMarkAsRead = async (item: ToReadItem) => {
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
      await updateToReadItem(item.id, { status: "read" });
    } catch (err: any) {
      setAccessDeniedOpen(true);
    }
  };

  const handleMarkAllRead = async () => {
    if (!session) {
      setAccessDeniedOpen(true);
      return;
    }
    try {
      const now = new Date().toISOString();
      setItemList((prev) =>
        prev.map((i) => ({ ...i, status: "read" as const, read_at: now }))
      );
      await markAllRead();
    } catch (err: any) {
      setAccessDeniedOpen(true);
    }
  };

  const style = {
    tabTrigger:
      "font-medium data-[state=active]:border-b-neutral-900 dark:data-[state=active]:border-b-neutral-100 border-b-2 border-b-transparent py-2",
  };

  return (
    <div className="max-w-prose mx-auto px-8 pt-16 border-x border-stone-200 dark:border-neutral-800 min-h-screen pb-32">
      <Hero status={status} itemList={itemList} />

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

      <Tabs.Root defaultValue="all" className="mt-16 group space-y-0">
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
            open={comfirmReadAllOpen}
            onOpenChange={setComfirmReadAllOpen}
            title="Confirm Read All"
            description="Are you sure you want to mark all items as read? This action cannot be undone."
            confirmText="Yes, Mark All Read"
            onConfirm={handleMarkAllRead}
            isDanger={false}
            trigger={
              <button className="ml-auto text-sm flex flex-row gap-1 px-1.5 md:px-3 py-1.5 rounded-full bg-stone-200 dark:bg-neutral-800 hover:bg-stone-300 dark:hover:bg-neutral-700 transition-all">
                <FileCheckIcon size={18} />{" "}
                <span className="hidden md:inline">Read All</span>
              </button>
            }
          />
        </Tabs.List>
        <Tabs.Content value="all">
          {isLoading ? (
            <LoaderIcon className="mx-auto my-16 animate-spin" />
          ) : (
            itemList.map((item) => {
              const displayUrl = item.url.split("/").slice(0, 3).join("/");
              return (
                <Card
                  key={item.id}
                  item={item}
                  handleDelete={handleDelete}
                  handleMarkAsRead={handleMarkAsRead}
                  displayUrl={displayUrl}
                />
              );
            })
          )}
        </Tabs.Content>
        <Tabs.Content value="unread">
          {itemList
            .filter((item) => item.status === "unread")
            .map((item) => {
              const displayUrl = item.url.split("/").slice(0, 3).join("/");
              return (
                <Card
                  key={item.id}
                  item={item}
                  handleDelete={handleDelete}
                  handleMarkAsRead={handleMarkAsRead}
                  displayUrl={displayUrl}
                />
              );
            })}
        </Tabs.Content>
        <Tabs.Content value="read">
          {itemList
            .filter((item) => item.status === "read")
            .map((item) => {
              const displayUrl = item.url.split("/").slice(0, 3).join("/");
              return (
                <Card
                  key={item.id}
                  item={item}
                  handleDelete={handleDelete}
                  handleMarkAsRead={handleMarkAsRead}
                  displayUrl={displayUrl}
                />
              );
            })}
        </Tabs.Content>
      </Tabs.Root>
    </div>
  );
}
