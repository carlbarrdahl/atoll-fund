"use client";
import { api } from "~/trpc/react";

export function useUpload() {
  return api.metadata.upload.useMutation();
}
