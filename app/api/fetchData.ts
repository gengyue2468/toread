"use server";

import axios from "axios";

const baseUrl = process.env.TOREAD_API_URL || "http://localhost:3000";

export async function checkHealth() {
  const res = await axios.get(`${baseUrl}/health`);
  return res.data;
}

export async function getToReadList() {
  const res = await axios.get(`${baseUrl}/api/toread`);
  return res.data;
}

export async function getReadList() {
  const res = await axios.get(`${baseUrl}/api/toread?status=read`);
  return res.data;
}
