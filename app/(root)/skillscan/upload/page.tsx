"use client";

import { type FormEvent, useState } from "react";
import Navbar from "@/components/skillscan/Navbar";
import FileUploader from "@/components/skillscan/FileUploader";
import LoadingScan from "@/components/skillscan/LoadingScan";
import { usePuterStore } from "@/lib/skillscan/puter";
import { useRouter } from "next/navigation";
import { convertPdfToImage, extractPdfText } from "@/lib/skillscan/pdf2img";
import { generateUUID } from "@/lib/skillscan/utils";
import { prepareInstructions } from "@/constants/skillscan";
import { formatError } from "@/lib/format-error";

export default function SkillScanUploadPage() {
  const { fs, ai, kv } = usePuterStore();
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);
  const [statusText, setStatusText] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const parseAiJson = (raw: string) => {
    const cleaned = raw.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/i, "").trim();
    const start = cleaned.indexOf("{");
    const end = cleaned.lastIndexOf("}");
    if (start === -1 || end === -1) throw new Error("No JSON in AI response");
    return JSON.parse(cleaned.slice(start, end + 1));
  };

  const handleAnalyze = async ({
    companyName,
    jobTitle,
    jobDescription,
    file,
  }: {
    companyName: string;
    jobTitle: string;
    jobDescription: string;
    file: File;
  }) => {
    setIsProcessing(true);
    setStatusText("Uploading resume...");
    try {
      const uploadedFile = await fs.upload([file]);
      if (!uploadedFile) return setStatusText("Error: Failed to upload file");

      setStatusText("Reading resume and analyzing...");
      const resumeText = await extractPdfText(file);
      const instructions = prepareInstructions({ jobTitle, jobDescription });

      const analyzePromise =
        resumeText.trim().length > 80
          ? ai.feedbackFromText(resumeText, instructions)
          : ai.feedback(uploadedFile.path, instructions);

      const previewPromise = (async () => {
        try {
          const imageFile = await convertPdfToImage(file);
          if (!imageFile.file) return undefined;
          return fs.upload([imageFile.file]);
        } catch {
          return undefined;
        }
      })();

      const [feedback, uploadedImage] = await Promise.all([
        analyzePromise,
        previewPromise,
      ]);

      if (!feedback) return setStatusText("Error: Failed to analyze resume");

      const content = feedback.message?.content;
      const feedbackText =
        typeof content === "string"
          ? content
          : Array.isArray(content)
            ? content[0]?.text
            : "";
      if (!feedbackText) {
        return setStatusText("Error: Could not read AI feedback");
      }

      const uuid = generateUUID();
      const data = {
        id: uuid,
        resumePath: uploadedFile.path,
        imagePath: uploadedImage?.path || "",
        companyName,
        jobTitle,
        jobDescription,
        feedback: parseAiJson(feedbackText),
      };
      await kv.set(`resume:${uuid}`, JSON.stringify(data));
      setStatusText("Analysis complete, redirecting...");
      router.push(`/skillscan/resume/${uuid}`);
    } catch (error) {
      setIsProcessing(false);
      setStatusText(`Error: ${formatError(error)}`);
    }
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const companyName = formData.get("company-name") as string;
    const jobTitle = formData.get("job-title") as string;
    const jobDescription = formData.get("job-description") as string;
    if (!file) return;
    handleAnalyze({ companyName, jobTitle, jobDescription, file });
  };

  return (
    <div className="mx-auto max-w-2xl">
      <Navbar />
      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-8">
        <h2 className="text-2xl font-semibold">Smart feedback for your dream job</h2>
        {isProcessing ? (
          <LoadingScan label={statusText} />
        ) : (
          <p className="mt-2 text-muted-foreground">
            Drop your resume for an ATS score and improvement tips.
          </p>
        )}

        {!isProcessing && (
          <form onSubmit={handleSubmit} className="mt-8 flex w-full flex-col gap-5">
            <div className="flex w-full flex-col gap-2">
              <label htmlFor="company-name" className="text-sm font-medium">Company Name</label>
              <input
                className="w-full rounded-xl border border-border bg-background px-4 py-3 text-foreground outline-none focus:ring-2 focus:ring-[#fe5933]/30"
                type="text"
                name="company-name"
                placeholder="Company Name"
                id="company-name"
              />
            </div>
            <div className="flex w-full flex-col gap-2">
              <label htmlFor="job-title" className="text-sm font-medium">Job Title</label>
              <input
                className="w-full rounded-xl border border-border bg-background px-4 py-3 text-foreground outline-none focus:ring-2 focus:ring-[#fe5933]/30"
                type="text"
                name="job-title"
                placeholder="Job Title"
                id="job-title"
              />
            </div>
            <div className="flex w-full flex-col gap-2">
              <label htmlFor="job-description" className="text-sm font-medium">Job Description</label>
              <textarea
                className="w-full rounded-xl border border-border bg-background px-4 py-3 text-foreground outline-none focus:ring-2 focus:ring-[#fe5933]/30"
                rows={5}
                name="job-description"
                placeholder="Job Description"
                id="job-description"
              />
            </div>
            <div className="flex w-full flex-col gap-2">
              <label className="text-sm font-medium">Upload Resume</label>
              <FileUploader onFileSelect={setFile} />
            </div>
            <button className="btn-primary w-full justify-center" type="submit">
              Analyze Resume
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
