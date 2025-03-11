import {
  SubjectWithTopic,
  addSubject,
} from "@/services/repositories/subject/subject.repo";
import { subjectData as x1yr11 } from "./yr11-mathematics-extension-1";
import { subjectData as x1yr12 } from "./yr12-mathematics-extension-1";
import { subjectData as x2yr12 } from "./yr12-mathematics-extension-2";

export const handler = async () => {
  await addSubject(x1yr11);
  // await addSubject(x1yr12);
  // await addSubject(x2yr12);
  // await addSubject(x1yr11);
};
