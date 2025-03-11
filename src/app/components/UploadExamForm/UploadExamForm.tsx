"use client";

import { useUploadFile } from "@/app/utils";
import { api } from "@/app/utils/trpc/react";
import React from "react";

interface UploadExamModalProps {
  onSubmit: (labelledExamId: string) => void;
}

const UploadExamForm: React.FC<UploadExamModalProps> = ({ onSubmit }) => {
  const { data: preSignUploadUrls } = api.exam.getUploadUrls.useQuery({
    count: 1,
  });
  const [selectedSubject, setSelectedSubject] = React.useState<string>("");
  const [examName, setExamName] = React.useState<string>("");
  const utils = api.useUtils();
  const { data: subjectData, isLoading: isLoadingSubjectData } =
    api.exam.getAllSubjects.useQuery();
  const {
    mutateAsync: uploadLabelledExam,
    isLoading: isUploadingLabelledExam,
  } = api.exam.addLabelledExam.useMutation({
    onSuccess: ({ data: labelledExamData }) => {
      utils.exam.getLabelledExamsByUserId.invalidate();
      onSubmit(labelledExamData.labelledExamId);
    },
  });
  const {
    uploadFile,
    progress,
    isUploading,
    isError,
    isComplete,
    uploadedUrl,
    error,
  } = useUploadFile();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files ? event.target.files[0] : null;
    if (file && preSignUploadUrls && preSignUploadUrls[0]) {
      uploadFile({ file, url: preSignUploadUrls[0] });
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (isComplete && examName && selectedSubject && uploadedUrl) {
      uploadLabelledExam({
        examName,
        fileLink: uploadedUrl,
        subjectId: selectedSubject,
      });
    }
  };

  const isLoading = isLoadingSubjectData || isUploadingLabelledExam;

  return (
    <div className="modal-box">
      {isLoading && (
        <div className="absolute h-full w-full -translate-x-6 -translate-y-6 bg-blue-200 bg-opacity-50 backdrop-blur-sm backdrop-filter">
          <span className="loading loading-infinity loading-lg absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"></span>
        </div>
      )}

      <h3 className="text-lg font-bold">Exam Upload</h3>
      <p className="py-4">Select an exam to begin labelling</p>
      <div className="flex flex-col gap-3">
        <input
          type="file"
          onChange={handleFileChange}
          disabled={isUploading}
          accept=".pdf"
          className={
            "file-input file-input-bordered" +
            (isUploading ? " file-input-warning" : "") +
            (isComplete ? " file-input-success" : "") +
            (isError ? " file-input-error" : "")
          }
        />
        {isUploading && (
          <progress
            className="progress progress-primary w-full"
            value={progress}
            max="100"
          ></progress>
        )}
        {isError && <div>Error uploading file: {error?.message}</div>}

        <input
          type="text"
          value={examName}
          onChange={(e) => setExamName(e.target.value)}
          placeholder="Exam Name"
          className="input input-bordered"
        />
        <select
          onChange={(e) => setSelectedSubject(e.target.value)}
          defaultValue="default"
          className="select select-bordered"
        >
          <option disabled value="default">
            -- select an option --
          </option>
          {subjectData?.map((subject) => (
            <option key={subject.subjectId} value={subject.subjectId}>
              {subject.subjectData.name}
            </option>
          ))}
        </select>
        <button
          type="submit"
          onClick={handleSubmit}
          disabled={!isComplete || !examName || !selectedSubject}
          className="btn"
        >
          Submit
        </button>
      </div>
    </div>
  );
};

export default UploadExamForm;
