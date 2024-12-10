import { toast } from "sonner";

import { api } from "@/lib/rpc";
import { useMutation } from "@tanstack/react-query";

type PresignedUrlResponse = {
  url: string;
  fields: Record<string, string>;
};

export const useUploadToS3 = () => {
  const mutation = useMutation<string, Error, File>({
    mutationFn: async (file) => {
      if (!file) {
        throw new Error("No file selected");
      }

      const response = await api.generatePresignedUrl["$post"]({
        json: { fileName: file.name, fileType: file.type },
      });

      if (!response.ok) {
        throw new Error("Failed to get pre-signed URL");
      }

      const data: PresignedUrlResponse = await response.json();

      if (!data.url || !data.fields || !data.fields["key"]) {
        throw new Error("Invalid pre-signed URL response or missing key");
      }

      const formData = new FormData();
      Object.entries(data.fields).forEach(([key, value]) => {
        formData.append(key, value);
      });
      formData.append("file", file);

      const uploadResponse = await fetch(data.url, {
        method: "POST",
        body: formData,
      });

      if (!uploadResponse.ok) {
        throw new Error("File upload failed");
      }

      const uploadedUrl = `${data.url}/${data.fields["key"]}`;
      return uploadedUrl;
    },
    onError: (error) => {
      toast.error(`File upload failed: ${error.message}`);
    },
  });

  return mutation;
};
