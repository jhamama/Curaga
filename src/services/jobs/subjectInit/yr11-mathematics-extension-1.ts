import { SubjectWithTopic } from "@/services/repositories/subject/subject.repo";

export const year11Topics = [
  {
    name: "Functions and Polynomials",
    topicId: "functions-and-polynomials",
    description: "Functions and Polynomials",
    subTopics: [
      {
        name: "Graphical relationships",
        subTopicId: "graphical-relationships",
        description: "Graphical relationships",
      },
      {
        name: "Inequalities",
        subTopicId: "inequalities",
        description: "Inequalities",
      },
      {
        name: "Inverse functions",
        subTopicId: "inverse-functions",
        description: "Inverse functions",
      },
      {
        name: "Parametric equations",
        subTopicId: "parametric-equations",
        description: "Parametric equations",
      },
      {
        name: "Remainder and factor theorems",
        subTopicId: "remainder-and-factor-theorems",
        description: "Remainder and factor theorems",
      },
      {
        name: "Sums and products of roots",
        subTopicId: "sums-and-products-of-roots",
        description: "Sums and products of roots",
      },
      {
        name: "Harder equations and algebra",
        subTopicId: "harder-equations-and-algebra",
        description: "Harder equations and algebra",
      },
    ],
  },
  {
    name: "Trigonometry",
    topicId: "trigonometry",
    description: "Trigonometric functions, equations and identities.",
    subTopics: [
      {
        name: "Inverse trigonometric functions",
        subTopicId: "inverse-trigonometric-functions",
        description: "Inverse trigonometric functions",
      },
      {
        name: "Solving trigonometric equations",
        subTopicId: "trigonometric-equations",
        description:
          "Solving equations using t-formulae, compound angles, double angles, half angles ect",
      },
      {
        name: "Trigonometric identities and proofs",
        subTopicId: "trigonometric-identities-proofs",
        description: "Working with trigonometric identities and proving them",
      },
      {
        name: "T-Method",
        subTopicId: "t-method",
        description:
          "Solving trigonometric equations and identities using the t-formulae",
      },
      {
        name: "Compound and double angles",
        subTopicId: "compound-and-double-angles",
        description: "Compound and double angles",
      },
      {
        name: "Product to sum and sum to product",
        subTopicId: "product-to-sum-and-sum-to-product",
        description: "Product to sum and sum to product",
      },
      {
        name: "Auxiliary angles",
        subTopicId: "auxiliary-angles",
        description: "Auxiliary angles",
      },
    ],
  },
  {
    name: "Differential Calculus",
    topicId: "differential-calculus",
    description: "",
    subTopics: [
      {
        name: "Motion (displacement, velocity & acceleration)",
        subTopicId: "motion",
        description: "Motion and rates of change",
      },
      {
        name: "Exponential growth and decay",
        subTopicId: "exponential-growth-and-decay",
        description: "Exponential growth and decay",
      },
      {
        name: "Related rates",
        subTopicId: "related-rates",
        description: "Related rates",
      },
    ],
  },
  {
    name: "Combinatorics",
    topicId: "combinatorics",
    description: "Combinatorics",
    subTopics: [
      {
        name: "Factorial algebra",
        subTopicId: "factorial-algebra",
        description: "Factorial algebra",
      },
      {
        name: "Counting and probability",
        subTopicId: "counting-and-probability",
        description: "Counting and probability",
      },
      {
        name: "Pidginhole principle",
        subTopicId: "pidginhole-principle",
        description: "Pidginhole principle",
      },
      {
        name: "Binomial expansion and coefficients",
        subTopicId: "binomial-expansion-and-coefficients",
        description: "Binomial expansion and coefficients",
      },
      {
        name: "Binomial identities and proofs",
        subTopicId: "binomial-identities-and-proofs",
        description: "Binomial identities and proofs",
      },
    ],
  },
];

export const subjectData: SubjectWithTopic = {
  subjectId: "aus-nsw-mathematics-extension1-yr11",
  subjectData: {
    description: "Year 11 Extension 1 Mathematics HSC Course",
    name: "Year 11 Extension 1 Mathematics",
    syllabusLink:
      "https://www.boardofstudies.nsw.edu.au/syllabus_hsc/pdf_doc/mathematics-extension-1-st6-syl-from2019.pdf",
    country: "Australia",
    state: "NSW",
  },
  topics: year11Topics,
};
