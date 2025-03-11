import { useState } from "react";

type useDrivenSliderProps = {
  min: number;
  max: number;
  step?: number;
  text?: string;
  initialVal?: number;
  onChange?: (val: number) => void;
};

export const useDrivenSlider = ({
  max,
  min,
  text,
  step,
  initialVal,
  onChange,
}: useDrivenSliderProps) => {
  const [val, setVal] = useState<number | null>(
    initialVal === undefined ? null : initialVal,
  );

  const changeVal = (newVal: number) => {
    setVal(newVal);
    if (onChange) onChange(newVal);
  };

  return {
    component: (
      <div className="bg pointer-events-auto mt-4 flex flex-row items-center justify-around gap-5">
        <label className="flex flex-row justify-center gap-4">
          <input
            type="range"
            min={min}
            {...(step ? { step } : {})}
            max={max}
            value={`${val}`}
            onChange={(e) => changeVal(Number(e.target.value))}
            className="range flex w-64 max-w-[60%] sm:w-80"
          />
          {text && <div>{`${val === null ? "❓" : val} ${text}`}</div>}
        </label>
      </div>
    ),
    val,
    setVal,
  };
};
