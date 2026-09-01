"use client";

import { FileUpload } from "@/components/ui/file-upload";

interface FileUploaderProps {
  onFileSelect?: (file: File | null) => void;
}

const FileUploader = ({ onFileSelect }: FileUploaderProps) => {
  return (
    <div className="overflow-hidden rounded-xl border border-border bg-background">
      <FileUpload
        accept="application/pdf,.pdf"
        title="Upload resume"
        description="PDF only — drag and drop or click to browse (max 20MB)"
        onChange={(files) => onFileSelect?.(files[0] ?? null)}
      />
    </div>
  );
};

export default FileUploader;
