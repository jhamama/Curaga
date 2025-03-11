import { SubjectWithTopic } from "@/services/repositories/subject/subject.repo";
import { year11Topics } from "./yr11-mathematics-extension-1";

const year12Topics = [
  {
    name: "Proofs by Induction",
    topicId: "proof-by-induction",
    description: "Proof by Induction",
    subTopics: [
      {
        name: "Induction proofs",
        subTopicId: "induction-proofs",
        description: "Induction proofs",
      },
      {
        name: "Divisibility proofs",
        subTopicId: "divisibility-proofs",
        description: "Divisibility proofs",
      },
    ],
  },
  {
    name: "Vectors",
    topicId: "vectors",
    description: "Vectors",
    subTopics: [],
  },
  {
    name: "Integral calculus",
    topicId: "integral-calculus",
    description: "Integral calculus",
    subTopics: [
      {
        subTopicId: "substitution-integrals",
        name: "Substitution Integrals",
        description: "Substitution Integrals",
      },
      {
        subTopicId: "harder-trigonometric-integrals",
        name: "Harder Trigonometric Integrals",
        description: "Harder Trigonometric Integrals",
      },
      {
        subTopicId: "inverse-trigonometric-integrals",
        name: "Inverse Trigonometric Integrals",
        description: "Inverse Trigonometric Integrals",
      },
      {
        subTopicId: "volumes-of-revolutions",
        name: "Volumes of Revolutions",
        description: "Volumes of Revolutions",
      },
      {
        subTopicId: "slope-fields",
        name: "Slope Fields",
        description: "Slope Fields",
      },
      {
        subTopicId: "solving-differential-equations",
        name: "Solving Differential Equations",
        description: "Solving Differential Equations",
      },
    ],
  },
  {
    name: "Statistical Analysis",
    topicId: "statistical-analysis",
    description: "Statistical Analysis",
    subTopics: [
      {
        subTopicId: "discrete-binomial-probability",
        name: "Discrete Binomial Probability",
        description: "",
      },
      {
        subTopicId: "binomial-bernoulli-mean-variance",
        name: "Binomial / Bernoulli mean and variance",
        description: "",
      },
      {
        subTopicId: "continuous-binomial-probability",
        name: "Binomial Probability Using Normal Approximations",
        description: "",
      },
      {
        subTopicId: "sample-proportions",
        name: "Sample Proportions",
        description: "",
      },
    ],
  },
];

export const subjectData: SubjectWithTopic = {
  subjectId: "aus-nsw-mathematics-extension1-yr12",
  subjectData: {
    description: "Year 12 Extension 1 Mathematics HSC Course",
    name: "Year 12 Extension 1 Mathematics",
    syllabusLink:
      "https://www.boardofstudies.nsw.edu.au/syllabus_hsc/pdf_doc/mathematics-extension-1-st6-syl-from2019.pdf",
    country: "Australia",
    state: "NSW",
  },
  topics: [...year11Topics, ...year12Topics],
};
