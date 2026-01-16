"use server";

import axios from "axios";

const baseUrl = process.env.TOREAD_API_URL || "http://localhost:3000";

export async function checkHealth() {
  const res = await axios.get(`${baseUrl}/health`);
  return res.data;
}

export async function getStats() {
  const res = await axios.get(`${baseUrl}/api/toread/stats`);
  return res.data;
}

export async function getToReadList(page = 1, limit = 20) {
  const res = await axios.get(`${baseUrl}/api/toread`, {
    params: { page, limit },
  });
  return res.data;
}

export async function getToReadListById(id: string) {
  const res = await axios.get(`${baseUrl}/api/toread/${id}`);
  return res.data;
}

export async function getToReadListByStatus(
  status: string,
  page = 1,
  limit = 20
) {
  const params: Record<string, unknown> = { page, limit };
  if (status) {
    params.status = status;
  }
  const res = await axios.get(`${baseUrl}/api/toread`, { params });
  return res.data;
}
