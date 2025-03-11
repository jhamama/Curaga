import { createSelector } from "@reduxjs/toolkit";
import { LabelPart, LabelWithData } from "../../../labeller.types";
import { RootState } from "../../reducers";

const selectLabeller = (state: RootState) => state.labeller;

export const selectLabels = createSelector(
  [selectLabeller],
  (labeller) => labeller.labels,
);

export const selectTempLabel = createSelector([selectLabels], (labels) => {
  for (let label of Object.values(labels)) {
    if (label.type == "temp") return label;
  }

  return null;
});

export const selectTopics = createSelector(
  [selectLabeller],
  (labeller) => labeller.topics,
);

export const selectSelectedLabelId = createSelector(
  [selectLabeller],
  (labeller) => labeller.selectedLabelId,
);

// Returns all the selected parts with the same parent Id
export const selectSelectedPartIds = createSelector(
  [selectSelectedLabelId, selectLabels],
  (selectedLabelId, labels) => {
    if (!selectedLabelId) return [];
    return labels[selectedLabelId].parts.map((p) => p.id);
  },
);

export const selectLabelPartsForPage = createSelector(
  [selectLabels, (_, pageNumber) => pageNumber],
  (labels, pageNumber) => {
    const parts: LabelPart[] = [];
    for (const label of Object.values(labels)) {
      for (const part of label.parts) {
        if (part.pageNumber == pageNumber) parts.push(part);
      }
    }
    return parts;
  },
);

export const selectSelectedLabel = createSelector(
  [selectSelectedLabelId, selectLabels],
  (selectedLabelId, labels) => {
    if (!selectedLabelId) return null;

    const selectedLabel = labels[selectedLabelId];

    return selectedLabel;
  },
);

const sortFunction = (a: LabelWithData, b: LabelWithData) => {
  const aReg = /(\d+)([a-z]?)/.exec(a.data.questionName);
  const bReg = /(\d+)([a-z]?)/.exec(b.data.questionName);
  if (aReg && bReg) {
    const aNum = Number(aReg[1]);
    const aChar = aReg[2];
    const bNum = Number(bReg[1]);
    const bChar = bReg[2];

    if (aNum > bNum) return 1;
    if (aNum < bNum) return -1;
    if (aChar > bChar) return 1;
    if (aChar < bChar) return -1;
    return 0;
  }
  return 0;
};

export const selectLabelOrderArray = createSelector(
  [selectLabels],
  (labels) => {
    const unorderedLabelArray: LabelWithData[] = [];

    for (const label of Object.values(labels)) {
      if (label.type !== "temp") unorderedLabelArray.push(label);
    }

    const orderedLabelArray = unorderedLabelArray.sort(sortFunction);

    const questionsOrdered = orderedLabelArray.filter(
      (l) => l.type == "question",
    );

    const solutionsOrdered = orderedLabelArray.filter(
      (l) => l.type == "solution",
    );

    return { questionsOrdered, solutionsOrdered };
  },
);

export const selectLabelOrderPosition = createSelector(
  [selectLabels, selectLabelOrderArray, (_, labelId: string) => labelId],
  (labels, { questionsOrdered }, labelId) => {
    const searchFunction = (x: LabelWithData) => x.id == labelId;

    // Search in questions
    const i1 = questionsOrdered.findIndex(searchFunction);
    if (i1 !== -1) return i1;

    // Search in questions
    const solution = labels[labelId];
    if (solution.type == "solution") {
      const qName = solution.data.questionName;
      const i1 = questionsOrdered.findIndex(
        (x) => x.data.questionName == qName,
      );
      return i1;
    }

    // Not found in either
    return -1;
  },
);

export const selectUnlabeledQuestions = createSelector(
  [selectLabelOrderArray],
  ({ questionsOrdered, solutionsOrdered }) => {
    const unlabeledQuestions = questionsOrdered.filter((q) => {
      const qName = q.data.questionName;
      const solutionExists = solutionsOrdered.find(
        (s) => s.data.questionName == qName,
      );
      return !solutionExists;
    });

    return unlabeledQuestions;
  },
);
