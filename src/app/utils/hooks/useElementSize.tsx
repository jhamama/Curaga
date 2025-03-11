import { useState, useEffect, RefObject } from "react";

function useElementSize(
  ref: RefObject<HTMLCanvasElement>,
  scalePixelRatio?: boolean,
) {
  const [size, setSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    if (!ref.current) return;

    const scalar = scalePixelRatio ? window.devicePixelRatio : 1;

    const observer = new ResizeObserver((entries) => {
      for (let entry of entries) {
        if (entry.target === ref.current) {
          setSize({
            width: entry.contentRect.width * scalar,
            height: entry.contentRect.height * scalar,
          });
        }
      }
    });

    observer.observe(ref.current);

    return () => observer.disconnect();
  }, [ref, scalePixelRatio]);

  return size;
}

export default useElementSize;
