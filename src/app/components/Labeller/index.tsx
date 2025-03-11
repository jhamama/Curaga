"use client";

import { useEffect } from "react";
import { Provider, useDispatch } from "react-redux";
import styles from "./index.module.scss";
import { LabellerState } from "./labeller.types";
import PDFWrapper from "./pdf-wrapper/pdf-wrapper.component";
import { setInitialState } from "./redux/slices/labeller/labeller.slice";
import { store } from "./redux/store";
import { SideBar } from "./side-bar/side-bar.component";
import { LabellerData, LabellerDataWithImage } from "./utils/export-data";

type ExamLabellerProps = {
  file: File;
  initialState: LabellerState;
  saveCallback: (data: LabellerData) => void;
  completeCallback?: (data: LabellerDataWithImage) => void;
  viewOnlyText?: string;
};

export function ExamLabeller({
  file,
  initialState,
  saveCallback,
  completeCallback,
  viewOnlyText,
}: ExamLabellerProps) {
  const dispatch = useDispatch();

  // Adds  the topics to the store
  useEffect(() => {
    dispatch(setInitialState(initialState));
  }, [initialState, dispatch]);

  return (
    <div id="exam-labeller" className={styles.examLabellerWrapper}>
      <div className={styles.examLabellerHeaderBar}>{file.name}</div>
      <div className={styles.examLabellerBody}>
        <SideBar
          saveCallback={saveCallback}
          completeCallback={completeCallback}
          viewOnlyText={viewOnlyText}
        />
        <PDFWrapper file={file} viewOnly={!!viewOnlyText} />
      </div>
    </div>
  );
}

export default function ExamLabellerWithStore(props: ExamLabellerProps) {
  return (
    <Provider store={store}>
      <ExamLabeller {...props} />
    </Provider>
  );
}
