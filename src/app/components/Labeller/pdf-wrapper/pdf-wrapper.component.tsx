"use client";

import { useState } from "react";
import { Document, pdfjs } from "react-pdf";
import { PageWrapper } from "../page-wrapper/page-wrapper.component";
import { PDFDocumentProxy } from "pdfjs-dist/types/src/display/api";
import styles from "./pdf-wrapper.styles.module.scss";

// const { default: pdfWorkerSrc } =
//   process.env.NODE_ENV === "production"
//     ? require("pdfjs-dist/build/pdf.worker.min.js")
//     : require("pdfjs-dist/build/pdf.worker.js");

// pdfjs.GlobalWorkerOptions.workerSrc = pdfWorkerSrc;

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

export type PDFWrapperProps = {
  file: File;
  viewOnly?: boolean;
};

const PDFWrapper = ({ file, viewOnly }: PDFWrapperProps) => {
  const [numPages, setNumPages] = useState<number | null>(null);
  const [pageWidth, setPageWidth] = useState<number>(80);

  function onDocumentLoadSuccess({ numPages }: PDFDocumentProxy) {
    setNumPages(numPages);
  }

  const changePageWidth = (increment: number) => {
    setPageWidth(Math.min(Math.max(30, pageWidth + increment), 100));
  };

  return (
    <div className={styles.pdfWrapperContainer}>
      <div className={styles.pdfWrapper}>
        <Document
          file={file}
          onLoadSuccess={onDocumentLoadSuccess}
          onLoadError={(e) => console.error("ERROR LOADING PDF", e)}
        >
          {numPages &&
            Array.from({ length: numPages }, (_, i) => (
              <div
                style={viewOnly ? { pointerEvents: "none" } : {}}
                key={`page_${i + 1}`}
              >
                <PageWrapper pageNumber={i + 1} pageWidth={pageWidth} />
              </div>
            ))}
        </Document>
      </div>
      <div className={styles.pdfWrapperOverlay}>
        <div className={styles.zoomButtonWrapper}>
          <div
            className={styles.zoomButton}
            onClick={() => changePageWidth(-5)}
          >
            -
          </div>
          <div className={styles.zoomButton} onClick={() => changePageWidth(5)}>
            +
          </div>
        </div>
      </div>
    </div>
  );
};

export default PDFWrapper;
