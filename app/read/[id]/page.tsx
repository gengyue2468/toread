"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import utc from "dayjs/plugin/utc";
import {
  BookmarkIcon,
  FolderClockIcon,
  LinkIcon,
  ArrowLeftIcon,
  EyeIcon,
  DeleteIcon,
} from "@/components/icons";
import type { ToReadItem } from "@/types/item";
import { LoaderIcon } from "@/components/icons";
import { getToReadListById } from "@/app/api/fetchData";
import { deleteToReadItem, updateToReadItem } from "@/app/api/handleData";
import { ActionDialog } from "@/components/dialog";
import { useSession } from "next-auth/react";
import { getDisplayUrl } from "@/lib/utils";

dayjs.extend(relativeTime);
dayjs.extend(utc);

export default function ReadPage() {
  const { data: session } = useSession();
  const params = useParams();
  const router = useRouter();
  const [item, setItem] = useState<ToReadItem | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [accessDeniedOpen, setAccessDeniedOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  useEffect(() => {
    const id = Array.isArray(params.id) ? params.id[0] : params.id;
    if (!id) return;
    getToReadListById(id)
      .then((data) => {
        setItem(data.item);
      })
      .finally(() => setIsLoading(false));
  }, [params.id]);

  const handleDelete = async () => {
    if (!item) return;
    try {
      await deleteToReadItem(item.id);
      router.push("/");
    } catch {
      setAccessDeniedOpen(true);
    }
  };

  const handleMarkAsRead = async () => {
    if (!item) return;
    try {
      await updateToReadItem(item.id, { status: "read" });
      setItem((prev) =>
        prev
          ? {
              ...prev,
              status: "read" as const,
              read_at: new Date().toISOString(),
            }
          : null
      );
    } catch {
      setAccessDeniedOpen(true);
    }
  };

  const handleMarkAsUnread = async () => {
    if (!item) return;
    try {
      await updateToReadItem(item.id, { status: "unread" });
      setItem((prev) =>
        prev
          ? {
              ...prev,
              status: "unread" as const,
              read_at: null,
            }
          : null
      );
    } catch {
      setAccessDeniedOpen(true);
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-prose mx-auto px-8 pt-16 border-x border-stone-200 dark:border-neutral-800 min-h-screen pb-32">
        <LoaderIcon className="mx-auto my-16 animate-spin" />
      </div>
    );
  }

  if (!item) {
    return (
      <div className="max-w-prose mx-auto px-8 pt-16 border-x border-stone-200 dark:border-neutral-800 min-h-screen pb-32">
        <div className="text-center py-16">
          <h1 className="text-2xl font-medium mb-4">Not found</h1>
          <Link
            href="/"
            className="text-stone-500 hover:text-stone-700 dark:hover:text-stone-300"
          >
            ← Back to toread list
          </Link>
        </div>
      </div>
    );
  }

  const isUnread = item.status === "unread";

  return (
    <div className="max-w-prose mx-auto px-8 pt-16 border-x border-stone-200 dark:border-neutral-800 min-h-screen pb-32">
      <ActionDialog
        open={accessDeniedOpen}
        onOpenChange={setAccessDeniedOpen}
        title="Access Denied"
        description="You need to sign in to modify the toread list."
        confirmText="OK"
        onConfirm={() => setAccessDeniedOpen(false)}
        isDanger
        trigger={null}
      />

      <ActionDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title="Delete Item"
        description="Are you sure you want to delete this item? This action cannot be undone."
        confirmText="Delete"
        onConfirm={handleDelete}
        isDanger
        trigger={null}
      />

      <Link
        href="/"
        className="inline-flex items-center gap-1 text-sm text-stone-500 hover:text-stone-700 dark:hover:text-stone-300 mb-8 transition-colors"
      >
        <ArrowLeftIcon size={14} />
        <span>Back</span>
      </Link>

      <div className="flex justify-between items-center mb-4">
        <Link href={item.url} target="_blank" rel="noopener noreferrer">
          <div className="rounded-full bg-stone-200 dark:bg-neutral-800 p-1.5 md:p-2 gap-1 inline-flex items-center text-xs truncate">
            <LinkIcon size={12} />
            <span className="hidden md:block">{getDisplayUrl(item.url)}</span>
          </div>
        </Link>
        <div className="flex flex-col!">
          <div className="text-xs md:text-sm flex gap-1.5 items-center opacity-75">
            <FolderClockIcon size={16} className="hidden md:block" />
            <span>Indexed on</span>
            <span
              title={dayjs
                .utc(item.added_at)
                .utcOffset(8)
                .format("YYYY-MM-DD HH:mm:ss")}
            >
              {dayjs.utc(item.added_at).utcOffset(8).fromNow()}
            </span>
          </div>
          {item.read_at && !isUnread && (
            <div className="text-xs md:text-sm flex gap-1.5 items-center opacity-75">
              <FolderClockIcon size={16} className="hidden md:block" />
              <span>Read on</span>
              <span
                title={dayjs
                  .utc(item.read_at)
                  .utcOffset(8)
                  .format("YYYY-MM-DD HH:mm:ss")}
              >
                {dayjs.utc(item.read_at).utcOffset(8).fromNow()}
              </span>
            </div>
          )}
        </div>
      </div>

      <h1 className="font-serif text-3xl font-medium tracking-wide text-balance mb-4">
        {item.title}
      </h1>

      <p className="my-6 leading-relaxed text-lg">{item.description}</p>

      <div className="my-6 gap-2 flex flex-wrap items-center opacity-75">
        <BookmarkIcon size={16} />
        {item.tags
          .split(" ")
          .filter((tag) => tag.trim())
          .map((tag, idx) => (
            <span key={idx} className="text-sm">
              #{tag}
            </span>
          ))}
      </div>

      <div className="mt-8 pt-8 -translate-x-8 w-[calc(100%+4rem)] px-8 border-t border-stone-200 dark:border-neutral-800 flex gap-4 flex-wrap">
        <Link
          href={item.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-4 py-2 bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 rounded-full hover:bg-stone-700 dark:hover:bg-stone-200 transition-all"
        >
          <LinkIcon size={14} />
          <span>Read The Original Post</span>
        </Link>

        {isUnread && (
          <button
            onClick={handleMarkAsRead}
            className="inline-flex items-center gap-2 px-4 py-2 bg-stone-200 dark:bg-neutral-800 hover:bg-stone-300 dark:hover:bg-neutral-700 rounded-full transition-all"
          >
            <EyeIcon size={14} />
            <span>Mark as Read</span>
          </button>
        )}

        {!isUnread && (
          <button
            onClick={handleMarkAsUnread}
            className="inline-flex items-center gap-2 px-4 py-2 bg-stone-200 dark:bg-neutral-800 hover:bg-stone-300 dark:hover:bg-neutral-700 rounded-full transition-all"
          >
            <EyeIcon size={14} />
            <span>Mark as Unread</span>
          </button>
        )}

        <button
          onClick={() => setDeleteOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2 bg-stone-200 dark:bg-neutral-800 hover:bg-red-100 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400 rounded-full transition-all"
        >
          <DeleteIcon size={14} />
          <span>Delete</span>
        </button>
      </div>
    </div>
  );
}
