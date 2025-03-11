import { SubjectWithTopic } from "@/services/repositories/subject/subject.repo";

export const subjectData: SubjectWithTopic = {
  subjectId: "aus-nsw-mathematics-advanced",
  subjectData: {
    description: "Year 12 Advanced Mathematics HSC Course",
    name: "Advanced Mathematics",
    syllabusLink:
      "https://www.boardofstudies.nsw.edu.au/syllabus_hsc/pdf_doc/mathematics-extension-1-st6-syl-from2019.pdf",
    country: "Australia",
    state: "NSW",
  },
  topics: [
    {
      name: "Functions and Algebra",
      topicId: "functions-and-algebra",
      description: "Functions and Algebra",
      subTopics: [
        {
          name: "Algebraic techniques",
          subTopicId: "algebraic-techniques",
          description: "Algebraic techniques",
          mappedFrom: [1, 3],
        },
        {
          name: "Function notation",
          subTopicId: "working-with-functions",
          description:
            "Function notation, composite functions & piecewise functions",
          mappedFrom: [7, 9],
        },
        {
          name: "Properties of functions",
          subTopicId: "properties-of-functions",
          description: "Properties of functions",
          mappedFrom: [4, 8],
        },
        {
          name: "Relations and mappings",
          subTopicId: "relations",
          description: "Relations",
          mappedFrom: [2],
        },
        {
          name: "Solving inequalities",
          subTopicId: "inequalities",
          description: "Inequalities",
          mappedFrom: [5],
        },
        {
          name: "Basic simultaneous equations",
          subTopicId: "simultaneous-equations",
          description: "Basic simultaneous equations",
          mappedFrom: [6],
        },
        {
          name: "Lines, quadratics and cubics",
          subTopicId: "lines-quadratics-and-cubics",
          description: "Lines, quadratics and cubics",
          mappedFrom: [10, 11, 12],
        },
        {
          name: "Non polynomial functions",
          subTopicId: "non-polynomial-functions",
          description: "Circles, absolute values and hyperbolas",
          mappedFrom: [13, 14, 15],
        },
      ],
    },
    {
      name: "Trigonometry",
      topicId: "trigonometry",
      description: "Trigonometric functions, equations and identities.",
      subTopics: [
        {
          name: "Finding lengths and angles in triangles",
          subTopicId: "lengths-and-angles-in-triangles",
          description: "Using Pythagoras, SOH CAH TOA, sine and cosine rules",
          mappedFrom: [16],
        },
        {
          name: "Bearings and 3D Trigonometry",
          subTopicId: "bearings-and-3d-trigonometry",
          description: "Bearings and 3D Trigonometry",
          mappedFrom: [17],
        },
        {
          name: "Trigonometric identities",
          subTopicId: "trigonometric-identities",
          description:
            "Utilizing trigonometric identities to prove and solve problems",
          mappedFrom: [19, 21],
        },
        {
          name: "Solving trigonometric equations",
          subTopicId: "trigonometric-equations",
          description: "Solving complex trigonometric equations",
          mappedFrom: [20],
        },
        {
          name: "Graphs of trigonometric functions",
          subTopicId: "graphs-of-trigonometric-functions",
          description: "Graphs of trigonometric functions",
          mappedFrom: [22],
        },
        {
          name: "Arcs and sectors",
          subTopicId: "arcs-and-sectors",
          description: "Arcs and sectors",
        },
      ],
    },
    {
      name: "Differentiation",
      topicId: "differentiation",
      description: "Differentiation",
      subTopics: [
        {
          name: "First principles and differentiability",
          subTopicId: "first-principles-and-differentiability",
          description: "First principles and differentiability",
          mappedFrom: [24, 25],
        },
        {
          name: "Finding tangents, normals and gradients",
          subTopicId: "tangents-normals-and-gradients",
          description: "Tangents, normals and gradients",
          mappedFrom: [27],
        },
        {
          name: "Second derivative and concavity",
          subTopicId: "graphical-interpretation-of-derivatives",
          description: "Graphical interpretation of derivatives",
          mappedFrom: [26, 28],
        },
      ],
    },
  ],
};
