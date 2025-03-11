import { ChangeEvent, FormEvent, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Select from "react-select";

import {
  selectLabelOrderArray,
  selectTopics,
  selectUnlabeledQuestions,
} from "../redux/slices/labeller/labeller.selectors";
import {
  completeLabel,
  setSelectedLabel,
} from "../redux/slices/labeller/labeller.slice";
import styles from "./label-form.styles.module.scss";

type FormProps = {
  initialState: any | null;
};

type FormData = {
  type: "question" | "solution" | "";
  questionName: string;
  marks: number;
  difficulty: number;
  topic: { value: string; label: string };
};

export const LabelForm = ({ initialState }: FormProps) => {
  const dispatch = useDispatch();
  const topics = useSelector(selectTopics);

  const unlabelledQuestions = useSelector(selectUnlabeledQuestions);
  const { questionsOrdered } = useSelector(selectLabelOrderArray);
  const questionList = questionsOrdered.map((q) => q.data.questionName);
  const unlabelledQuestionsOptions = unlabelledQuestions.map((q) => ({
    value: q.data.questionName,
    label: q.data.questionName,
  }));

  const [formState, setFormState] = useState<FormData>({
    ...{
      type: localStorage.getItem("lastSelectedType") || "question",
      questionName: "",
      marks: NaN,
      difficulty: NaN,
      topic: { value: "", label: "" },
    },
    ...(initialState
      ? {
          ...initialState?.data,
          type:
            initialState.type === "temp"
              ? localStorage.getItem("lastSelectedType")
              : initialState.type === "solution"
                ? "solution"
                : "question",
        }
      : {}),
  });

  const formSubmitCallback = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Checks topicValue is there, if not return
    if (formState.type == "question" && formState.topic.value === "") {
      alert("No topic selected");
      return;
    }
    if (formState.type == "solution" && formState.questionName === "") {
      alert("No solution selected ");
      return;
    }
    if (
      formState.type == "question" &&
      questionList.includes(formState.questionName) &&
      formState.questionName !== initialState?.data.questionName
    ) {
      alert("A label for this question already exists");
      return;
    }

    const { questionName, topic, marks, difficulty } = formState;

    if (formState.type == "solution") {
      dispatch(completeLabel({ questionName }));
    } else {
      dispatch(
        completeLabel({
          questionName,
          marks: Number(marks),
          difficulty: Number(difficulty),
          topic,
        }),
      );
    }

    dispatch(setSelectedLabel(null));
  };

  const handleFormChange = (e: ChangeEvent<HTMLInputElement>) => {
    const name = e.target.name;
    const value = e.target.value;

    if (name == "type") {
      localStorage.setItem("lastSelectedType", value);
    }

    if (name == "questionName") {
      // Checks if the input text is in the form 12a ect
      const passRegexTest = /^\d{1,3}[a-z]?$|^$/.test(value);
      if (!passRegexTest) return;
    }
    setFormState({ ...formState, [name]: value });
  };

  const handleTopicChange = (selectedOption: any) => {
    setFormState({ ...formState, topic: selectedOption });
  };

  const handleSolutionChange = (selectedOption: any) => {
    setFormState({
      ...formState,
      questionName: selectedOption.value,
    });
  };

  return (
    <div className={styles.formWrapper} id="label-form">
      <form onSubmit={formSubmitCallback}>
        <div className={styles.formFields}>
          <div className={styles.optionTitle}>Label Type</div>
          <div className={styles.optionButtons}>
            <input
              type="radio"
              name="type"
              value="question"
              checked={formState.type === "question"}
              onChange={handleFormChange}
              id={styles.questionRadio}
              required
              tabIndex={1}
            />
            <input
              type="radio"
              name="type"
              value="solution"
              checked={formState.type === "solution"}
              onChange={handleFormChange}
              id={styles.solutionRadio}
              required
              tabIndex={1}
            />
          </div>
          <div className={styles.optionTitle}>Question Name</div>

          {formState.type == "question" ? (
            <>
              <input
                type="text"
                name="questionName"
                value={formState.questionName}
                onChange={handleFormChange}
                maxLength={10}
                required
                tabIndex={1}
                className={styles.formFieldTextField}
                placeholder="e.g. 3 or 12b"
              />
            </>
          ) : (
            <>
              <Select
                // styles={reactSelectStyles}
                defaultValue={{
                  label: formState.questionName,
                  value: formState.questionName,
                }}
                onChange={handleSolutionChange}
                options={unlabelledQuestionsOptions}
                className={styles.dropdown}
                tabIndex={1}
                placeholder="e.g. 3 or 12b"
              />
            </>
          )}

          <div className={styles.optionTitle}>Topic</div>
          <Select
            // styles={reactSelectStyles}
            defaultValue={formState.topic}
            onChange={handleTopicChange}
            options={topics}
            className={styles.dropdown}
            isDisabled={formState.type == "solution"}
            tabIndex={1}
            placeholder="e.g. Algebra"
          />

          <div className={styles.optionTitle}>Marks</div>
          <input
            type="number"
            className={styles.formFieldTextField}
            name="marks"
            value={formState.marks || ""}
            onChange={handleFormChange}
            min="1"
            max="20"
            required
            disabled={formState.type == "solution"}
            tabIndex={1}
            placeholder={formState.type == "solution" ? "" : "1-20"}
          />
          <div className={styles.optionTitle}>Difficulty</div>
          <input
            type="number"
            className={styles.formFieldTextField}
            name="difficulty"
            value={formState.difficulty || ""}
            onChange={handleFormChange}
            min="1"
            max="10"
            required
            disabled={formState.type == "solution"}
            tabIndex={1}
            placeholder={formState.type == "solution" ? "" : "1-10"}
          />
        </div>
        <input
          className={styles.submitButton}
          type="submit"
          value="Submit"
          tabIndex={1}
        />
      </form>
    </div>
  );
};
