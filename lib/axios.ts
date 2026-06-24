import type { AxiosInstance } from "axios";
import axios, { create } from "axios";

export const api: AxiosInstance = create({
  baseURL: process.env.EXPO_PUBLIC_API_URL,
  timeout: 10000,
  headers: { "Content-Type": "application/json" },
});
