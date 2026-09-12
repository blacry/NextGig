import { NextResponse } from "next/server";
import {
  extractText,
  getDocumentProxy,
  renderPageAsImage,
} from "unpdf";
import { createWorker } from "tesseract.js";

export const runtime = "nodejs";

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB
const MAX_PAGES = 5;

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json(
        { error: "No PDF file provided" },
        { status: 400 }
      );
    }

    if (file.type !== "application/pdf") {
      return NextResponse.json(
        { error: "Only PDF files are supported" },
        { status: 400 }
      );
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: "PDF must be smaller than 10 MB" },
        { status: 400 }
      );
    }

    const buffer = await file.arrayBuffer();
    const pdfData = new Uint8Array(buffer);

    const pdf = await getDocumentProxy(pdfData);

    if (pdf.numPages > MAX_PAGES) {
      return NextResponse.json(
        {
          error: `PDF must contain no more than ${MAX_PAGES} pages.`,
        },
        { status: 400 }
      );
    }

    const result = await extractText(pdf, {
      mergePages: true,
    });

    const text = result.text.trim();

    if (text.length >= 20) {
      console.log("PDF text extracted normally.");

      return NextResponse.json({
        text,
        pages: pdf.numPages,
        method: "text",
      });
    }

    console.log("No usable PDF text found. Starting OCR...");

    const worker = await createWorker("eng");

    let ocrText = "";

    try {
    for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber++) {
        console.log(
        `OCR processing page ${pageNumber}/${pdf.numPages}...`
        );

        const image = await renderPageAsImage(pdf, pageNumber, {
        scale: 3,
        canvasImport: () => import("@napi-rs/canvas"),
        });

        const { data } = await worker.recognize(
        Buffer.from(image as ArrayBuffer)
        );

        ocrText += data.text + "\n\n";
    }
    } finally {
    await worker.terminate();
    }

    ocrText = ocrText.trim();

    if (ocrText.length < 20) {
      return NextResponse.json(
        {
          error:
            "Could not extract readable text from this PDF. Please upload a clearer PDF or paste your resume text.",
        },
        { status: 422 }
      );
    }

    console.log("OCR extraction successful.");

    return NextResponse.json({
      text: ocrText,
      pages: pdf.numPages,
      method: "ocr",
    });
  } catch (error) {
    console.error("PDF extraction error:", error);

    return NextResponse.json(
      {
        error: "Failed to process PDF.",
      },
      { status: 500 }
    );
  }
}