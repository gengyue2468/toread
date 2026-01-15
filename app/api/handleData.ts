"use server";

import axios from "axios";
import type { ToReadItem } from "@/types/item";

const baseUrl = process.env.TOREAD_API_URL || "http://localhost:3000";

export async function deleteToReadItem(id: string) {
  const res = await axios.delete(`${baseUrl}/api/toread/${id}`);
  return res.data;
}

export async function updateToReadItem(
  id: string,
  data: Partial<{
    title: string;
    description: string;
    tags: string;
    status: "unread" | "reading" | "read";
    url: string;
  }>
) {
  const res = await axios.post(`${baseUrl}/api/toread/${id}`, data);
  return res.data;
}

export async function markAllRead() {
  const res = await axios.post(`${baseUrl}/api/toread/read-all`);
  return res.data;
}