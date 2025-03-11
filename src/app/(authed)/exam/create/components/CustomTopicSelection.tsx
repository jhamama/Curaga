"use client";

import { RouterOutput } from "@/app/utils/trpc/react";
import { ChevronRight, Diff } from "lucide-react";
import {
  ChangeEventHandler,
  Dispatch,
  SetStateAction,
  useEffect,
  useState,
} from "react";
import { initializeTopicSelection, TopicSettings } from "./helpers";

export const CustomTopicSelection = (
  subject: RouterOutput["exam"]["getAllSubjects"][0] | undefined,
) => {
  const [topicSettings, setTopicSettings] = useState<TopicSettings>({});

  useEffect(() => {
    if (subject === undefined) return;
    const initialTopicSelection = initializeTopicSelection({ subject });
    setTopicSettings(initialTopicSelection);
  }, [subject]);

  if (subject === undefined) return { component: null, val: {} };

  if (!(subject.topics[0].topicId in topicSettings)) {
    return { component: null, val: {} };
  }

  const component = (
    <>
      <div className="hidden w-full  px-2 sm:flex">
        <div className="mr-1 w-6"></div>
        <div className="flex w-full flex-row justify-between gap-8">
          <div className="flex-1">Topic</div>
          <div className="flex-1">Difficulty</div>
          <div className="flex-1">Amount</div>
        </div>
      </div>
      {subject.topics.map((topic) => (
        <TopicSlider
          topic={topic}
          key={topic.topicId}
          setTopicSettings={setTopicSettings}
          topicSettings={topicSettings}
        />
      ))}

      <SelectedSubjectsBar selectedTopics={topicSettings} />
    </>
  );

  return { component, val: topicSettings };
};

const TopicSlider = ({
  topic,
  topicSettings,
  setTopicSettings,
}: {
  topic: RouterOutput["exam"]["getAllSubjects"][0]["topics"][0];
  topicSettings: TopicSettings;
  setTopicSettings: Dispatch<SetStateAction<TopicSettings>>;
}) => {
  const topicData = topicSettings[topic.topicId];

  if (!topicData) return null;

  return (
    <>
      <div className="flex w-full flex-row items-center justify-center rounded-lg bg-slate-200 p-2 ">
        <div
          onClick={() => {
            setTopicSettings((x) => {
              x[topic.topicId].showSubtopics = !x[topic.topicId].showSubtopics;
              return JSON.parse(JSON.stringify(x));
            });
          }}
          className="flex cursor-pointer items-center justify-center self-stretch"
        >
          <ChevronRight
            className={
              "mr-1 w-6 transition duration-200" +
              (topicData.showSubtopics ? " rotate-90" : "")
            }
          />
        </div>
        <div className="flex w-full flex-col items-center justify-center gap-2 rounded-lg sm:flex-row sm:gap-8">
          {/* TOPIC NAME */}
          <div className="flex w-full flex-1 flex-row items-center justify-between gap-2">
            <div className="flex-1 sm:hidden">Topic</div>
            <div className=" max-w-xs flex-[2_2_0%] text-ellipsis text-right sm:text-left">
              {topic.name}
            </div>
          </div>
          {/* TOPIC DIFFICULTY SLIDER */}
          <div className="flex w-full flex-1 items-center justify-between gap-2">
            <div className="flex-1 sm:hidden">Difficulty</div>

            <DifficultySlider
              value={topicData.difficulty}
              onChange={(e) => {
                const value = Number(e.target.value);
                setTopicSettings((x) => {
                  x[topic.topicId].difficulty = value;
                  const subTopics = x[topic.topicId].subtopics;
                  for (const subTopicKey of Object.keys(subTopics)) {
                    subTopics[subTopicKey].difficulty = value;
                  }
                  return JSON.parse(JSON.stringify(x));
                });
              }}
            />
          </div>
          {/* TOPIC AMOUNT SLIDER */}
          <div className="flex w-full flex-1 items-center justify-between gap-2">
            <div className="flex-1 sm:hidden">Amount</div>

            <input
              type="range"
              min={0}
              step={1}
              max={100}
              value={topicData.amount}
              onChange={(e) => {
                const value = Number(e.target.value);
                setTopicSettings((x) => {
                  x[topic.topicId].amount = value;
                  const subTopics = x[topic.topicId].subtopics;
                  for (const subTopicKey of Object.keys(subTopics)) {
                    subTopics[subTopicKey].amount = value;
                  }
                  return JSON.parse(JSON.stringify(x));
                });
              }}
              className="range pointer-events-auto w-full max-w-xs flex-[2_2_0%]"
            />
          </div>
        </div>
      </div>

      {/*  SUBTOPIC SLIDERS  */}
      {topicData.showSubtopics && (
        <div className="-mt-2 w-full  rounded-b-lg bg-slate-100">
          {topic.subTopics.map((subTopic) => {
            return (
              <div
                className="flex w-full flex-col items-center justify-center gap-2  border-b border-gray-300 p-2 pl-9 sm:flex-row sm:gap-8 "
                key={subTopic.subTopicId}
              >
                {/* SUBTOPIC NAME */}
                <div className="flex w-full flex-1 flex-row items-center justify-between gap-2">
                  <div className="flex-1 sm:hidden">Topic</div>
                  <div
                    className=" max-w-xs flex-[2_2_0%] text-ellipsis text-right sm:text-left"
                    onClick={() => {
                      setTopicSettings((x) => {
                        x[topic.topicId].showSubtopics =
                          !x[topic.topicId].showSubtopics;
                        return JSON.parse(JSON.stringify(x));
                      });
                    }}
                  >
                    <div>{subTopic.name}</div>
                  </div>
                </div>
                {/* SUBTOPIC DIFFICULTY SLIDER */}
                <div className="flex w-full flex-1 items-center justify-between gap-2">
                  <div className="flex-1 sm:hidden">Difficulty</div>

                  <DifficultySlider
                    value={topicData.subtopics[subTopic.subTopicId].difficulty}
                    onChange={(e) => {
                      setTopicSettings((x) => {
                        x[topic.topicId].subtopics[
                          subTopic.subTopicId
                        ].difficulty = Number(e.target.value);

                        const subTopics = Object.values(
                          x[topic.topicId].subtopics,
                        );
                        const average =
                          subTopics.reduce(
                            (cumSum, val) => cumSum + val.difficulty,
                            0,
                          ) / subTopics.length;

                        x[topic.topicId].difficulty = average;

                        return JSON.parse(JSON.stringify(x));
                      });
                    }}
                  />
                </div>
                {/* TOPIC AMOUNT SLIDER */}
                <div className="flex w-full flex-1 items-center justify-between gap-2">
                  <div className="flex-1 sm:hidden">Amount</div>

                  <input
                    type="range"
                    min={0}
                    step={1}
                    max={100}
                    value={topicData.subtopics[subTopic.subTopicId].amount}
                    onChange={(e) => {
                      setTopicSettings((x) => {
                        x[topic.topicId].subtopics[subTopic.subTopicId].amount =
                          Number(e.target.value);

                        const subTopics = Object.values(
                          x[topic.topicId].subtopics,
                        );
                        const average =
                          subTopics.reduce(
                            (cumSum, val) => cumSum + val.amount,
                            0,
                          ) / subTopics.length;

                        x[topic.topicId].amount = average;

                        return JSON.parse(JSON.stringify(x));
                      });
                    }}
                    className="range pointer-events-auto w-full max-w-xs flex-[2_2_0%]"
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </>
  );
};

const difficultyColors = [
  "#78e8b8",
  "#30d298",
  "#f7c54c",
  "#f9a25d",
  " #fb806f",
];

const SelectedSubjectsBar = ({
  selectedTopics,
}: {
  selectedTopics: TopicSettings;
}) => {
  const topicArray = Object.entries(selectedTopics);

  const totalAmount = topicArray.reduce((total, val) => {
    return (total += val[1].amount);
  }, 0);

  return (
    <div className="flex h-10 w-full flex-row items-center justify-center rounded-lg bg-slate-300">
      {topicArray.map(([topicId, topicData]) => {
        const widthPercentage = (topicData.amount / totalAmount) * 100 || 0;

        if (widthPercentage === 0) return null;

        return (
          <div
            key={topicId}
            className="flex items-center justify-center overflow-hidden rounded-lg border border-red-50"
            style={{
              minWidth: `${widthPercentage}%`,
              maxWidth: `${widthPercentage}%`,
              height: "100%",
              background:
                difficultyColors[Math.round(topicData.difficulty) - 1],
            }}
          >
            <span
              className="mx-2"
              style={{
                textWrap: "nowrap",
                textOverflow: "ellipsis",
                overflow: "hidden",
              }}
            >
              {topicData.name}
            </span>
          </div>
        );
      })}
      {totalAmount === 0 && (
        <div className="w-full text-center">No topics selected</div>
      )}
    </div>
  );
};

export const DifficultySlider = ({
  value,
  onChange,
}: {
  value: number | null;
  onChange: ChangeEventHandler<HTMLInputElement>;
}) => {
  return (
    <>
      <style>
        {`
          .custom-slider::-webkit-slider-thumb {
          appearance: none;
          width: 20%;
          height: 1rem;
          box-shadow: 0px 0px 0px 4px rgba(69, 74, 86, .7);
          cursor: pointer;
          border-radius: 4px;
          background: none;
          }

          .hide-slider::-webkit-slider-thumb {
            display: none;
          }
         `}
      </style>

      <input
        className={
          "custom-slider pointer-events-auto w-full max-w-xs flex-[2_2_0%] "
        }
        style={{
          background: `linear-gradient(90deg, ${difficultyColors[0]} 20%, ${difficultyColors[1]} 20%, ${difficultyColors[1]} 40%, ${difficultyColors[2]} 40%, ${difficultyColors[2]} 60%, ${difficultyColors[3]} 60%, ${difficultyColors[3]} 80%, ${difficultyColors[4]} 80%, ${difficultyColors[4]} 100%)`,
          WebkitAppearance: "none",
          height: "1rem",
          outline: "none",
          borderRadius: "4px",
          display: "flex",
          cursor: "pointer",
        }}
        type="range"
        min={1}
        step={1}
        max={5}
        value={value || 1}
        onChange={onChange}
        // @ts-ignore - dodgy ah well
        onMouseUp={onChange}
      />
    </>
  );
};
