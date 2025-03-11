import { useState } from "react";
import { twMerge } from "tailwind-merge";

type UseRadioBoxProps<T> = {
  values: {
    id: T;
    displayName: string;
  }[];
  name: string;
};

export function UseRadioBoxes<T extends string>({
  values,
  name,
}: UseRadioBoxProps<T>) {
  const [val, setVal] = useState<T | null>(null);

  return {
    val,
    component: (
      <div className="bg pointer-events-auto mt-4 flex w-full flex-wrap items-center justify-around gap-2 sm:w-auto sm:gap-5">
        {values.map(({ id, displayName }) => {
          return (
            <label
              key={id}
              className={twMerge(
                "pointer-events-auto flex h-auto w-full cursor-pointer items-center justify-center rounded-lg border-2 bg-primary p-2 transition-colors duration-300 sm:h-20 sm:w-48",
                val === id
                  ? "bg-primary text-white"
                  : "border-gray-300 bg-white text-gray-700 hover:bg-gray-100",
              )}
            >
              <input
                className="hidden"
                type="radio"
                name={name}
                value={id}
                checked={val === id}
                onChange={() => setVal(id)}
              />
              <span className="text-center  font-medium">{displayName}</span>
            </label>
          );
        })}
      </div>
    ),
  };
}
