import {
  selectLabelOrderArray,
  selectLabels,
  selectTopics,
} from "../redux/slices/labeller/labeller.selectors";
import { store } from "../redux/store";
import { extractImageFromCanvas } from "./image";

export const exportDataWithImage = () => {
  const state = store.getState();
  const { questionsOrdered, solutionsOrdered } = selectLabelOrderArray(state);

  const labelledExamData = [];
  for (const question of questionsOrdered) {
    const data = question.data;
    const solution = solutionsOrdered.find(
      (s) => s.data.questionName == data.questionName,
    );
    if (!solution) continue;
    const questionImage = extractImageFromCanvas(question, 1000);
    const solutionImage = extractImageFromCanvas(solution, 1000);
    const finishedLabelData = { data, solutionImage, questionImage };
    labelledExamData.push(finishedLabelData);
  }

  return labelledExamData;
};

export const exportDataRaw = () => {
  const state = store.getState();
  return { labels: selectLabels(state), topics: selectTopics(state) };
};

export type LabellerDataWithImage = ReturnType<typeof exportDataWithImage>;
export type LabellerData = ReturnType<typeof exportDataRaw>;
