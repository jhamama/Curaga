import { useEffect, useRef, useState } from "react";
import { Page } from "react-pdf";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../redux/reducers";
import { selectLabelPartsForPage } from "../redux/slices/labeller/labeller.selectors";
import { addLabelPart } from "../redux/slices/labeller/labeller.slice";
import { LabelBox } from "../label-box/label-box.component";
import styles from "./page-wrapper.styles.module.scss";

type PageWrapperProps = {
  pageNumber: number;
  pageWidth: number;
};

export const PageWrapper = ({ pageNumber, pageWidth }: PageWrapperProps) => {
  const dispatch = useDispatch();
  const [pageReady, setPageReady] = useState(false);
  const pageRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const labelParts = useSelector((state: RootState) =>
    selectLabelPartsForPage(state, pageNumber)
  );

  const pageReadyCallback = () => {
    if (canvasRef.current) {
      canvasRef.current.style.width = "100%";
      canvasRef.current.style.height = "auto";
      setPageReady(true);
    }
  };

  // Drag on page add label callback
  const callback = (e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation();

    const x = 0;
    const rect = e.currentTarget.getBoundingClientRect();
    const y = ((e.clientY - rect.top) / e.currentTarget.clientHeight) * 100;
    const h = 0;
    const w = 100;

    dispatch(
      addLabelPart({
        pageNumber,
        location: { x, y, w, h },
      })
    );
  };

  return (
    <div
      id={`page_${pageNumber}`}
      ref={pageRef}
      onMouseDown={(e) => callback(e)}
      className={styles.pageWrapper}
      style={{
        width: `${pageWidth}%`,
        display: pageReady ? "block" : "none",
      }}>
      <>
        <Page
          key={`page_${pageNumber}`}
          pageNumber={pageNumber}
          renderAnnotationLayer={false}
          renderTextLayer={false}
          onRenderSuccess={() => pageReadyCallback()}
          width={1000}
          canvasRef={canvasRef}
        />
        {labelParts.map((labelPart) => {
          return (
            <LabelBox
              key={labelPart.id}
              labelPart={labelPart}
              pageRef={pageRef}
            />
          );
        })}
      </>
    </div>
  );
};
