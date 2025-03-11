import { SubjectWithTopic } from "@/services/repositories/subject/subject.repo";

export const subjectData: SubjectWithTopic = {
  subjectId: "aus-nsw-mathematics-extension2",
  subjectData: {
    description: "Year 12 Extension 2 Mathematics HSC Course",
    name: "Extension 2 Mathematics",
    syllabusLink:
      "https://www.boardofstudies.nsw.edu.au/syllabus_hsc/pdf_doc/mathematics-extension-2-st6-syl-from2019.pdf",
    country: "Australia",
    state: "NSW",
  },
  topics: [
    {
      topicId: "proofs",
      description: "",
      name: "Proofs",
      subTopics: [
        {
          description:
            "Understanding the language of proofs and the logical operations used to construct them.",
          name: "Language and notation of proofs",
          subTopicId: "language-of-proofs",
        },
        {
          description: "Proving statements using the contrapositive.",
          name: "Contrapositive proofs",
          subTopicId: "contrapositive-proofs",
        },
        {
          description: "Proving numerical statements using proof methods.",
          name: "Numeric proofs",
          subTopicId: "numeric-proofs",
        },
        {
          description:
            "Proving statements using the method of proof by contradiction.",
          name: "Proof by contradiction",
          subTopicId: "proof-by-contradiction",
        },
        {
          description:
            "Proving statements using the method of proof by contradiction.",
          name: "Proof by contradiction",
          subTopicId: "proof-by-contradiction",
        },
        {
          description: "Proving statements involving inequalities",
          name: "Inequalities",
          subTopicId: "inequalities",
        },
        {
          description: "Proving statements using mathematical induction",
          name: "Mathematical induction",
          subTopicId: "mathematical-induction",
        },
      ],
    },

    {
      topicId: "complex-numbers",
      description: "",
      name: "Complex Numbers",
      subTopics: [
        {
          description:
            "Algebraic and graph based problems involving complex numbers.",
          name: "Algebra operations and the Argand Plane",
          subTopicId: "complex-algebra",
        },
        {
          description: "Using Cartesian, Polar and Euler representations.",
          name: "Cartesian, polar and Euler representations",
          subTopicId: "complex-representations",
        },
        {
          description: "Problems involving the roots of complex equations.",
          name: "Roots of complex equations",
          subTopicId: "complex-roots",
        },
        {
          description:
            "Analyzing and solving problems involving polynomials with complex roots.",
          name: "Polynomials in the complex plane",
          subTopicId: "complex-polynomials",
        },
        {
          description: "Paths and regions in the complex plane.",
          name: "Lines, circles and loci",
          subTopicId: "complex-loci",
        },
        {
          description:
            "Proving trigonometric identities using complex numbers.",
          name: "Trigonometric identities",
          subTopicId: "complex-trigonometry",
        },
        {
          description: "Geometric problems involving complex numbers.",
          name: "Geometry in the complex plane",
          subTopicId: "complex-geometry",
        },
      ],
    },

    {
      name: "Calculus",
      description: "",
      topicId: "calculus",
      subTopics: [
        {
          name: "Harder 3 unit calculus",
          description:
            "Integration and differentiation problems from 3 unit, but harder.",
          subTopicId: "harder-3-unit-calculus",
        },
        {
          name: "Substitution integrals",
          description:
            "Solving integration problems by identifying and utilizing substitutions.",
          subTopicId: "integration-substitution",
        },
        {
          name: "Partial fractions",
          description:
            "Solving integration problems by using partial fractions.",
          subTopicId: "integration-partial-fractions",
        },
        {
          name: "Integration by parts",
          description:
            "Identifying and solving problems that require integration by parts",
          subTopicId: "integration-by-parts",
        },
        {
          name: "Integration by parts",
          description:
            "Identifying and solving problems that require integration by parts",
          subTopicId: "integration-by-parts",
        },
        {
          name: "Recurrence relationships and reduction integrals",
          description:
            "Identifying integration problems that are recursive and solving them.",
          subTopicId: "recurrence-relationships",
        },
        {
          name: "Practical applications of calculus",
          description: "Applying calculus to real world problems.",
          subTopicId: "calculus-applications",
        },
      ],
    },
    {
      name: "Mechanics",
      description: "",
      topicId: "mechanics",
      subTopics: [
        {
          name: "Force analysis and non resisted motion",
          description: "Introductory force analysis and motion quesitons.",
          subTopicId: "force-analysis",
        },
        {
          name: "Simple harmonic motion",
          description: "Problems involving simple harmonic motion.",
          subTopicId: "simple-harmonic-motion",
        },
        {
          name: "Resisted motion",
          description: "Problems involving motion with resistance.",
          subTopicId: "resisted-motion",
        },
        {
          name: "Projectile motion",
          description: "Problems involving projectile motion.",
          subTopicId: "projectile-motion",
        },
        {
          name: "Miscellaneous applications of mechanics",
          description:
            "Problems involving mechanics that do not fit into other categories.",
          subTopicId: "miscellaneous-mechanics",
        },
      ],
    },
    {
      name: "Vectors",
      description: "",
      topicId: "vectors",
      subTopics: [
        {
          name: "Vector operations in 3D",
          description:
            "Addition, subtraction and scalar multiplication of vectors in 3D.",
          subTopicId: "vector-operations",
        },
        {
          name: "Dot products and projections",
          description:
            "Finding dot products and projections of vectors in 3D space.",
          subTopicId: "dot-products",
        },
        {
          name: "Lines, planes and surfaces",
          description:
            "Finding vector equations of lines and planes in 3D space.",
          subTopicId: "vector-equations",
        },
        {
          name: "Geometry with vectors",
          description:
            "Problems involving vectors in 2/3D space and their geometric properties.",
          subTopicId: "vector-geometry",
        },
        {
          name: "Applications of vectors",
          description: "Applying vectors to real world problems.",
          subTopicId: "vector-applications",
        },
      ],
    },
  ],
};
