"use client";

import { useState, useEffect, useRef } from "react";
import type { ToReadItem } from "../../types/item";
import Card from "../card";
import { LoaderIcon } from "../icons";
import { getDisplayUrl } from "../../lib/utils";

interface ItemListProps {
  initialItems: ToReadItem[];
  onLoadMore: (page: number) => Promise<ToReadItem[]>;
  handleDelete: (id: string) => void;
  handleMarkAsRead: (item: ToReadItem) => void;
  handleMarkAsUnread: (item: ToReadItem) => void;
  pageSize: number;
  filter?: { status: "unread" | "read" };
}

export default function ItemList({
  initialItems,
  onLoadMore,
  handleDelete,
  handleMarkAsRead,
  handleMarkAsUnread,
  pageSize,
  filter,
}: ItemListProps) {
  const [items, setItems] = useState<ToReadItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const loadMoreRef = useRef<HTMLDivElement>(null);
  const pageRef = useRef(0);
  const isLoadingRef = useRef(false);
  const initializedRef = useRef(false);

  // 加载更多数据
  const fetchMore = async () => {
    if (isLoadingRef.current || !hasMore) return;

    isLoadingRef.current = true;
    setIsLoading(true);

    try {
      const nextPage = pageRef.current + 1;
      const newItems = await onLoadMore(nextPage);

      if (newItems.length === 0) {
        setHasMore(false);
      } else {
        setItems((prev) => [...prev, ...newItems]);
        pageRef.current = nextPage;
        setHasMore(newItems.length >= pageSize);
      }
    } catch (error) {
      console.error("Failed to load more items:", error);
    } finally {
      isLoadingRef.current = false;
      setIsLoading(false);
    }
  };

  // 同步初始数据
  useEffect(() => {
    if (initialItems.length > 0) {
      setItems(initialItems);
      setIsLoading(false);
    }
  }, [initialItems]);

  // 初始化
  useEffect(() => {
    if (initializedRef.current) return;
    initializedRef.current = true;

    if (initialItems.length > 0) {
      setItems(initialItems);
      pageRef.current = Math.ceil(initialItems.length / pageSize);
      setHasMore(initialItems.length >= pageSize);
      setIsLoading(false);
    } else {
      setIsLoading(true);
      fetchMore();
    }
  }, [initialItems, pageSize]);

  // 滚动监听
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoadingRef.current) {
          fetchMore();
        }
      },
      { rootMargin: "200px" }
    );

    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current);
    }

    return () => observer.disconnect();
  }, [hasMore]);

  if (items.length === 0 && !isLoading) {
    return (
      <p className="text-center text-stone-500 dark:text-neutral-400 my-16">
        {filter?.status === "unread"
          ? "No unread items"
          : filter?.status === "read"
          ? "No read items"
          : "All caught up! No items to display."}
      </p>
    );
  }

  return (
    <>
      {items.map((item) => (
        <Card
          key={item.id}
          item={item}
          handleDelete={handleDelete}
          handleMarkAsRead={handleMarkAsRead}
          handleMarkAsUnread={handleMarkAsUnread}
          displayUrl={getDisplayUrl(item.url)}
        />
      ))}
      <div ref={loadMoreRef} className="h-8 flex items-center justify-center my-16">
        {isLoading && <LoaderIcon className="animate-spin mb-8" />}
      </div>
    </>
  );
}
