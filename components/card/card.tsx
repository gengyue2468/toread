"use client";

import { useState } from "react";
import classNames from "classnames";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import utc from "dayjs/plugin/utc";
import {
  BookmarkIcon,
  DeleteIcon,
  EyeIcon,
  FolderClockIcon,
  LinkIcon,
} from "../icons";
import { ActionDialog } from "../dialog";
import Link from "next/link";
import type { ToReadItem } from "@/types/item";
import { useRouter } from "next/navigation";

dayjs.extend(relativeTime);
dayjs.extend(utc);

interface CardProps {
  item: ToReadItem;
  handleDelete: (id: string) => void;
  handleMarkAsRead: (item: ToReadItem) => void;
  handleMarkAsUnread: (item: ToReadItem) => void;
  displayUrl: string;
}

export default function Card({
  item,
  handleDelete,
  handleMarkAsRead,
  handleMarkAsUnread,
  displayUrl,
}: CardProps) {
  const router = useRouter();
  const [toggleOpen, setToggleOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const isUnread = item.status === "unread";
  const dateToShow = isUnread ? item.added_at : item.read_at || item.added_at;

  return (
    <div
      onClick={() => router.push(`/read/${item.id}`)}
      key={item.id}
      className={classNames(
        "cursor-pointer block hover:bg-stone-200/50 dark:hover:bg-neutral-800/50 p-8 -translate-x-8 w-[calc(100%+4rem)] transition-all border-y border-stone-200 dark:border-neutral-800",
        !isUnread
          ? "opacity-30 hover:opacity-100"
          : "opacity-100"
      )}
    >
      <div className="flex justify-between items-center mb-4">
        <Link href={item.url} target="_blank" rel="noopener noreferrer">
          <div className="rounded-full bg-stone-200 dark:bg-neutral-800 p-1.5 md:p-2 gap-1 size-6 md:size-auto inline-flex items-center text-xs truncate">
            <LinkIcon size={12} />
            <span className="hidden md:inline">{displayUrl}</span>
          </div>
        </Link>
        <div className="flex gap-1.5 items-center opacity-75 text-sm w-full md:w-1/2 justify-end">
          <FolderClockIcon size={16} />
          <span className="hidden md:inline">
            {isUnread ? "Indexed " : "Read "}
          </span>
          <span
            title={dayjs
              .utc(dateToShow)
              .utcOffset(8)
              .format("YYYY-MM-DD HH:mm:ss")}
          >
            {dayjs.utc(dateToShow).utcOffset(8).fromNow()}
          </span>
        </div>
      </div>

      <h1 className="font-serif text-xl font-medium tracking-wide text-balance">
        {item.title}
      </h1>
      <p className="my-4 leading-relaxed">{item.description}</p>

      <div className="my-4 gap-1.5 flex flex-wrap items-center opacity-75">
        <BookmarkIcon size={16} />
        {item.tags
          .split(" ")
          .filter((tag) => tag.trim())
          .map((tag, idx) => (
            <span key={idx}>#{tag}</span>
          ))}
      </div>

      <div className="mt-4 flex gap-4 -translate-x-2">
        <ActionDialog
          open={toggleOpen}
          onOpenChange={setToggleOpen}
          title={isUnread ? "Mark as Read" : "Mark as Unread"}
          description={
            isUnread
              ? "Mark this item as read?"
              : "Are you sure to unread this item?"
          }
          confirmText={isUnread ? "Mark as Read" : "Mark as Unread"}
          onConfirm={() =>
            isUnread ? handleMarkAsRead(item) : handleMarkAsUnread(item)
          }
          isDanger={!isUnread}
          trigger={
            <button
              onClick={(e) => e.stopPropagation()}
              className={classNames(
                "h-8 px-2 flex items-center hover:bg-stone-200 dark:hover:bg-neutral-800 rounded-full transition-colors cursor-pointer",
                isUnread
                  ? "text-yellow-500 dark:text-yellow-200"
                  : "text-blue-600 dark:text-blue-400"
              )}
            >
              <EyeIcon size={16} />
              <span className="ml-1 text-sm">
                {isUnread ? "Mark as UnRead" : "Read ( •̀ ω •́ )y"}
              </span>
            </button>
          }
        />

        <ActionDialog
          open={deleteOpen}
          onOpenChange={setDeleteOpen}
          title="Delete Item"
          description="Are you sure you want to delete this item? This action cannot be undone."
          confirmText="Delete"
          onConfirm={() => handleDelete(item.id)}
          isDanger
          trigger={
            <button
              onClick={(e) => e.stopPropagation()}
              className="size-8 hover:text-red-500 rounded-full transition-colors cursor-pointer hover:bg-stone-200 dark:hover:bg-neutral-800 flex items-center justify-center"
            >
              <DeleteIcon size={16} />
            </button>
          }
        />
      </div>
    </div>
  );
}
