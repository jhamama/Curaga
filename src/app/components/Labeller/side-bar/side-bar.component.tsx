import { MouseEvent } from "react";
import { useDispatch, useSelector } from "react-redux";
import { LabelForm } from "../label-form/label-form.component";
import {
  Label,
  QuestionData,
  type QuestionLabel,
  SolutionLabel,
} from "../labeller.types";
import {
  selectLabelOrderArray,
  selectSelectedLabel,
  selectSelectedLabelId,
} from "../redux/slices/labeller/labeller.selectors";
import { setSelectedLabel } from "../redux/slices/labeller/labeller.slice";
import { exportDataRaw, exportDataWithImage } from "../utils/export-data";
import styles from "./side-bar.styles.module.scss";

const getColor = (index: number) => {
  const colors = [
    "#ff7676dd",
    "#ff983edd",
    "#ffe18fdd",
    "#7fd692dd",
    "#77c8eedd",
    "#cba8ecdd",
    "#f7a1c9dd",
  ];

  if (index == -1) return "#22222222";

  return colors[index % colors.length];
};

type QuestionLabelProps = {
  question: QuestionLabel;
  solution: SolutionLabel | null;
  colorNumber: number;
};

const QuestionLabel = ({
  question,
  solution,
  colorNumber,
}: QuestionLabelProps) => {
  const dispatch = useDispatch();

  const scrollToLabel = (label: Label, e: MouseEvent) => {
    const partId0 = label.parts[0];
    const labelPartDiv = document.getElementById(partId0.id);
    labelPartDiv?.scrollIntoView();
    dispatch(setSelectedLabel(label.id));
    e.stopPropagation();
  };

  const color = getColor(colorNumber);

  return (
    <div
      className={styles.questionLabel}
      onClick={(e) => scrollToLabel(question, e)}
    >
      <div
        style={{ background: color }}
        className={styles.questionLabelCircle}
      ></div>
      <div>Question {question.data.questionName.toLocaleUpperCase()}</div>
      {solution && (
        <div
          className={styles.solutionButton}
          onClick={(e) => scrollToLabel(solution, e)}
        >
          solution
        </div>
      )}
    </div>
  );
};

type SideBarProps = {
  saveCallback: (data: any) => void;
  completeCallback?: (data: any) => void;
  viewOnlyText?: string;
};

export const SideBar = ({
  saveCallback,
  completeCallback,
  viewOnlyText,
}: SideBarProps) => {
  const selectedLabelId = useSelector(selectSelectedLabelId);
  const selectedLabel = useSelector(selectSelectedLabel);
  const { questionsOrdered, solutionsOrdered } = useSelector(
    selectLabelOrderArray,
  );

  const getConnectedSolution = (questionName: string) => {
    const connectedSolution = solutionsOrdered.find(
      (s) => s.data.questionName == questionName,
    );
    return connectedSolution;
  };

  return (
    <div className={styles.sideBar}>
      <div className={styles.sideBarSeparator}>Label Information</div>

      <div className={styles.sideBarFormWrapper}>
        <div className={styles.sideBarContent}>
          <LabelForm key={selectedLabelId} initialState={selectedLabel} />
          {!selectedLabelId && (
            <div className={styles.labelInfoBlur}>
              <div>no label is currently selected</div>
            </div>
          )}
        </div>
      </div>
      <div className={styles.sideBarSeparator}>Question Labels</div>

      <div className={styles.sideBarLabelsWrapper}>
        <div className={styles.sideBarContent}>
          <div className={styles.labelList}>
            {questionsOrdered.map((q, i) => {
              const data = q.data as QuestionData;
              const connectedSolution = getConnectedSolution(data.questionName);
              return (
                <QuestionLabel
                  key={q.id}
                  colorNumber={i}
                  question={q as QuestionLabel}
                  solution={connectedSolution as SolutionLabel}
                />
              );
            })}
          </div>
        </div>
      </div>

      <div className={styles.sideBarSeparator}>Exam Summary</div>
      <div className={styles.sideBarSummaryWrapper}>
        <div className={styles.sideBarContent}>
          <div className={styles.summaryInfoWrapper}>
            <div>
              <div>{questionsOrdered.length} Questions</div>
              <div>{solutionsOrdered.length} Solutions</div>
            </div>

            {viewOnlyText ? (
              <div>{viewOnlyText}</div>
            ) : (
              <div className="flex flex-col gap-1">
                <div
                  className={styles.completeButton}
                  onClick={async () => {
                    await saveCallback(exportDataRaw());
                  }}
                >
                  Save
                </div>

                {completeCallback && (
                  <div
                    className={styles.completeButton}
                    onClick={async () => {
                      await saveCallback(exportDataRaw());
                      await completeCallback(exportDataWithImage());
                    }}
                  >
                    Complete
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
