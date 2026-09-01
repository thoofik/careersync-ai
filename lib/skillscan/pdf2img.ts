export interface PdfConversionResult {
    imageUrl: string;
    file: File | null;
    error?: string;
}

let pdfjsLib: any = null;
let isLoading = false;
let loadPromise: Promise<any> | null = null;

async function loadPdfJs(): Promise<any> {
    if (pdfjsLib) return pdfjsLib;
    if (loadPromise) return loadPromise;

    isLoading = true;
    // @ts-expect-error - pdfjs-dist/build/pdf.mjs is not a module
    loadPromise = import("pdfjs-dist").then((lib) => {
        lib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${lib.version}/build/pdf.worker.min.mjs`;
        pdfjsLib = lib;
        isLoading = false;
        return lib;
    });

    return loadPromise;
}

export async function extractPdfText(file: File, maxPages = 3): Promise<string> {
    const lib = await loadPdfJs();
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await lib.getDocument({ data: arrayBuffer }).promise;
    const pageCount = Math.min(pdf.numPages, maxPages);
    const pages: string[] = [];

    for (let i = 1; i <= pageCount; i++) {
        const page = await pdf.getPage(i);
        const content = await page.getTextContent();
        const line = content.items
            .map((item: { str?: string }) => item.str || "")
            .join(" ")
            .replace(/\s+/g, " ")
            .trim();
        if (line) pages.push(line);
    }

    return pages.join("\n\n");
}

export async function convertPdfToImage(
    file: File
): Promise<PdfConversionResult> {
    try {
        const lib = await loadPdfJs();

        const arrayBuffer = await file.arrayBuffer();
        const pdf = await lib.getDocument({ data: arrayBuffer }).promise;
        const page = await pdf.getPage(1);

        const viewport = page.getViewport({ scale: 1.2 });
        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d", { alpha: false });

        canvas.width = viewport.width;
        canvas.height = viewport.height;

        if (context) {
            context.imageSmoothingEnabled = true;
            context.imageSmoothingQuality = "medium";
        }

        await page.render({ canvasContext: context!, viewport }).promise;

        return new Promise((resolve) => {
            canvas.toBlob(
                (blob) => {
                    if (blob) {
                        const originalName = file.name.replace(/\.pdf$/i, "");
                        const imageFile = new File([blob], `${originalName}.jpg`, {
                            type: "image/jpeg",
                        });

                        resolve({
                            imageUrl: URL.createObjectURL(blob),
                            file: imageFile,
                        });
                    } else {
                        resolve({
                            imageUrl: "",
                            file: null,
                            error: "Failed to create image blob",
                        });
                    }
                },
                "image/jpeg",
                0.82
            );
        });
    } catch (err) {
        return {
            imageUrl: "",
            file: null,
            error: `Failed to convert PDF: ${err}`,
        };
    }
}
