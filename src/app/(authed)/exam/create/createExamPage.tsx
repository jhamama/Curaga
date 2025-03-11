"use client";

import { GradientText } from "@/app/components/GradientText/GradientText";
import { Button } from "@/app/components/ui/button";
import { api } from "@/app/utils/trpc/react";
import { motion } from "framer-motion";
import { ScrollToDiv } from "./components/ScrollToDiv";
import { useDrivenSlider } from "./components/useDrivenSlider";
import { UseRadioBoxes } from "./components/UseRadioBoxes";
import {
  CustomTopicSelection,
  DifficultySlider,
} from "./components/CustomTopicSelection";
import { initializeTopicSelection } from "./components/helpers";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useGetUserInfo } from "@/app/utils/hooks/useGetUserInfo";

export function CreateExamPage() {
  const router = useRouter();
  const { isLoading: isLoadingUserInfo, loggedIn } = useGetUserInfo();
  const { data: subjectsData, isLoading: isLoadingSubjectsData } =
    api.exam.getAllSubjects.useQuery();

  const { mutateAsync: createExam, isLoading: isCreatingExam } =
    api.exam.createExam.useMutation();

  const { val: subjectSelectedId, component: subjectSelectedRadio } =
    UseRadioBoxes({
      name: "subject",
      values: !subjectsData
        ? []
        : subjectsData.map((x) => ({
            id: x.subjectId,
            displayName: x.subjectData.name,
          })),
    });
  const selectedSubject = subjectsData?.find(
    (subjectData) => subjectData.subjectId === subjectSelectedId,
  );
  const { component: examDurationSlider, val: examDuration } = useDrivenSlider({
    min: 30,
    max: 120,
    step: 5,
    text: "mins",
  });

  const { val: topicType, component: topicTypeRadio } = UseRadioBoxes<
    "all" | "custom"
  >({
    name: "topicType",
    values: [
      { displayName: "All topics", id: "all" },
      { displayName: "Custom topics", id: "custom" },
    ],
  });

  const [allTopicDifficulty, setAllTopicDifficulty] = useState<null | number>(
    null,
  );

  const { component: CustomTopicSection, val: customTopics } =
    CustomTopicSelection(selectedSubject);

  const customTopicsSelected =
    Object.entries(customTopics).reduce((total, val) => {
      return (total += val[1].amount);
    }, 0) > 0;

  const isLoading = isLoadingSubjectsData || isLoadingUserInfo;

  if (isLoading)
    return <span className="loading loading-ring loading-md"></span>;

  return (
    <main className="flex w-full flex-col items-center">
      {/* HEADING SECTION */}
      <div className="z-30 mb-12 flex flex-col items-center">
        <motion.h1
          className="z-30 mb-1 text-center text-6xl font-extrabold leading-tight tracking-tighter"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          <GradientText>{"Exam Generator"}</GradientText> 📚
          <br />
        </motion.h1>
        <motion.span
          className="text-center text-2xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          your personalised exam revision tool
        </motion.span>
      </div>
      {/* SUBJECT SELECTION */}
      <motion.div
        className="z-30 mb-12 flex flex-col items-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.7 }}
      >
        <h2 className="mb-1 text-center text-2xl font-extrabold">
          Select a subject
        </h2>

        {subjectSelectedRadio}
      </motion.div>
      {/* DURATION SELECTION */}
      {subjectSelectedId && (
        <ScrollToDiv>
          <motion.div
            className="mb-12 flex flex-col items-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
          >
            <h2 className="z-30 mb-1 text-center text-2xl font-extrabold">
              Select max duration
            </h2>

            {examDurationSlider}
          </motion.div>
        </ScrollToDiv>
      )}
      {/* TOPIC TYPE SELECTION */}
      {examDuration && (
        <motion.div
          className="mb-12 flex w-full flex-col items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          <h2 className="mb-1 text-center text-2xl font-extrabold">
            Select the topics
          </h2>

          {topicTypeRadio}
        </motion.div>
      )}
      {/* ALL TOPIC DIFFICULTY SELECTION */}
      {topicType === "all" && (
        <ScrollToDiv>
          <motion.div
            className="mb-12 flex flex-col items-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
          >
            <h2 className="mb-1 text-center text-2xl font-extrabold">
              Select the difficulty
            </h2>

            <div className="w-full pt-4">
              <DifficultySlider
                value={allTopicDifficulty}
                onChange={(e) => {
                  const value = Number(e.target.value);
                  setAllTopicDifficulty(value);
                }}
              />
            </div>
          </motion.div>
        </ScrollToDiv>
      )}
      {topicType === "custom" && selectedSubject && (
        <>
          <ScrollToDiv className="w-full">
            <motion.div
              className="mb-12 flex flex-col items-center gap-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1 }}
            >
              {CustomTopicSection}
            </motion.div>
          </ScrollToDiv>
        </>
      )}

      {/* CREATE EXAM BUTTON  */}
      {((topicType === "all" && allTopicDifficulty) ||
        (topicType === "custom" && customTopicsSelected)) &&
        selectedSubject && (
          <motion.div
            className="mb-2 flex flex-col items-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
          >
            <Button
              variant={"outline"}
              onClick={async () => {
                if (!examDuration || !subjectSelectedId) return;
                const exam = await createExam({
                  numMinutes: examDuration,
                  subjectId: subjectSelectedId,
                  topicOptions:
                    topicType === "all"
                      ? initializeTopicSelection({
                          subject: selectedSubject,
                          initialAmount: 1,
                          initialDifficulty: allTopicDifficulty || 1,
                        })
                      : customTopics,
                });

                console.dir(exam, { depth: Infinity });

                router.push(`/exam/${exam.id}`);
              }}
            >
              Create exam
              {isCreatingExam && (
                <span className="loading loading-ring loading-md ml-2"></span>
              )}
            </Button>
          </motion.div>
        )}
    </main>
  );
}
