"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import axios from "axios";

const baseUrl = process.env.TOREAD_API_URL || "http://localhost:3000";
const apiToken = process.env.API_TOKEN;

const authHeader = {
  Authorization: `Bearer ${apiToken}`,
};

async function checkAuth() {
  const session = await getServerSession(authOptions);
  if (!session) {
    throw new Error("Unauthorized: You must be signed in to modify the list");
  }
}

export async function deleteToReadItem(id: string | string[]) {
  await checkAuth();
  const normalizedId = Array.isArray(id) ? id[0] : id;
  const res = await axios.delete(`${baseUrl}/api/toread/${normalizedId}`, {
    headers: authHeader,
  });
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
  await checkAuth();
  const res = await axios.post(`${baseUrl}/api/toread/${id}`, data, {
    headers: authHeader,
  });
  return res.data;
}

export async function markAllRead() {
  await checkAuth();
  const res = await axios.post(`${baseUrl}/api/toread/read-all`, undefined, {
    headers: authHeader,
  });
  return res.data;
}
