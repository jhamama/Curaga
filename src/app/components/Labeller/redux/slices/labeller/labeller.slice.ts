import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  isQuestionData,
  LabelBoxLocation,
  LabellerState,
  LabelPart,
  LabelPartInfo,
  QuestionData,
  SolutionData,
} from "../../../labeller.types";

import uniqid from "uniqid";

const initialState: LabellerState & { selectedLabelId: string | null } = {
  labels: {},
  topics: [],
  selectedLabelId: null,
};

type LabelId = string;

const labellerSlice = createSlice({
  name: "labeller",
  initialState,
  reducers: {
    addLabelPart(state, action: PayloadAction<LabelPartInfo>) {
      const labels = state.labels;
      let tempLabel = null;

      // If part is already selected set it as tempLabel
      for (let label of Object.values(labels)) {
        if (state.selectedLabelId) {
          if (label.id === state.selectedLabelId) tempLabel = label;
        } else {
          if (label.type == "temp") tempLabel = label;
        }
      }

      // Creates the temp label if it doesn't exist
      if (!tempLabel) {
        var labelId = uniqid();
        labels[labelId] = { type: "temp", id: labelId, parts: [] };
        tempLabel = labels[labelId];
      }

      const partId = uniqid();
      const partInfo = action.payload;
      tempLabel.parts.push({
        ...partInfo,
        parentId: tempLabel.id,
        id: partId,
      });

      state.selectedLabelId = tempLabel.id;
    },
    completeLabel(state, action: PayloadAction<QuestionData | SolutionData>) {
      const selectedLabelId = state.selectedLabelId;
      const labels = state.labels;

      // Checks if the selected label exists
      if (!selectedLabelId) return;
      const selectedLabel = labels[selectedLabelId];
      if (!selectedLabel) return;

      const data = action.payload;
      if (isQuestionData(data)) {
        labels[selectedLabelId] = { ...selectedLabel, data, type: "question" };
      } else {
        labels[selectedLabelId] = { ...selectedLabel, data, type: "solution" };
      }

      state.selectedLabelId = "";
    },
    removeLabelPart(state, action: PayloadAction<LabelPart>) {
      const { id, parentId } = action.payload;
      const labels = state.labels;
      const parentLabel = labels[parentId];
      if (!parentLabel) return;

      parentLabel.parts = parentLabel.parts.filter((p) => p.id !== id);
      if (parentLabel.parts.length == 0) delete labels[parentLabel.id];

      state.selectedLabelId = null;
    },
    changeLabelPartDimensions(
      state,
      action: PayloadAction<{
        location: LabelBoxLocation;
        labelPart: LabelPart;
      }>,
    ) {
      const { location, labelPart } = action.payload;
      const labels = state.labels;
      const parentLabel = labels[labelPart.parentId];
      if (!parentLabel) return;
      const part = parentLabel.parts.find((p) => p.id == labelPart.id);
      if (part) part.location = location;
    },
    setSelectedLabel(state, action: PayloadAction<LabelId | null>) {
      const labelId = action.payload;
      if (!labelId) return { ...state, selectedLabelId: null };
      const label = state.labels[labelId];
      if (!label) return;
      state.selectedLabelId = label.id;
    },
    setInitialState(state, action: PayloadAction<Partial<LabellerState>>) {
      const initialState = action.payload;
      return { ...state, ...initialState };
    },
  },
});

export const {
  addLabelPart,
  removeLabelPart,
  completeLabel,
  changeLabelPartDimensions,
  setSelectedLabel,
  setInitialState,
} = labellerSlice.actions;

export default labellerSlice.reducer;
