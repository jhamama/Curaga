"use client";
import useElementSize from "@/app/utils/hooks/useElementSize";
import { useEffect, useMemo, useRef } from "react";
import { useIsMobileView } from "@/app/utils/hooks/useMobileWidth";

type ColorString = `${number},${number},${number}`;
type CoordinateString = `${number},${number}`;
type TimeAdded = number;

type BackgroundBoxesProps = {
  angle: number;
  spacing: number;
  fadeDuration: number;
  colors: ColorString[];
  lineColor?: string;
  randomStrobeDuration?: number;
};

function getMousePos(canvas: HTMLCanvasElement, evt: MouseEvent) {
  var rect = canvas.getBoundingClientRect();
  return {
    x: ((evt.clientX - rect.left) / (rect.right - rect.left)) * canvas.width,
    y: ((evt.clientY - rect.top) / (rect.bottom - rect.top)) * canvas.height,
  };
}

export const BackgroundBoxesCustom = ({
  angle,
  spacing,
  fadeDuration,
  colors,
  lineColor,
  randomStrobeDuration,
}: BackgroundBoxesProps) => {
  const getNewCoord = useMemo(
    () => (x: number, y: number) => {
      const k1 = (Math.tan(angle) * x) / spacing;
      const k2 = y / spacing;
      const X = k1 + k2;
      const Y = -k1 + k2;
      return [X, Y];
    },
    [spacing, angle],
  );

  const getOldCoord = useMemo(
    () => (x: number, y: number) => {
      const k = spacing / Math.tan(angle);
      const X = (k * x - k * y) / 2;
      const Y = (spacing * x + spacing * y) / 2;
      return [X, Y];
    },
    [spacing, angle],
  );

  const getConsistentRandomColor = useMemo(
    () => (x: number, y: number) => {
      const val = Math.abs(x * 31 + y * 17) % colors.length;
      return colors[val];
    },
    [colors],
  );

  const gridRef = useRef<HTMLCanvasElement>(null);
  const linesRef = useRef<HTMLCanvasElement>(null);
  const hoveredCoordsRef = useRef<Record<CoordinateString, TimeAdded>>({});
  const setHoveredCoords = (newCoords: Record<CoordinateString, TimeAdded>) => {
    hoveredCoordsRef.current = { ...hoveredCoordsRef.current, ...newCoords };
  };
  const { width, height } = useElementSize(gridRef, true);

  // Original use effect to draw the lines
  useEffect(() => {
    const canvas = linesRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "#ffffff00"; // Set the background color here
    ctx.fillRect(0, 0, canvas.width, canvas.height); // Fill the canvas

    // Set the line color and width
    ctx.strokeStyle = lineColor || "rgb(226,232,240)";
    ctx.lineWidth = 1;

    const excessHeight = Math.tan(angle) * width;

    // Horizontal
    for (
      let y = -Math.floor(excessHeight / spacing) * spacing;
      y < height;
      y += spacing
    ) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y + excessHeight);
      ctx.stroke();
    }

    // Vertical lines
    for (let y = 0; y < height + excessHeight; y += spacing) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y - excessHeight);
      ctx.stroke();
    }

    const addCoord = (x: number, y: number) => {
      if (x <= 0 || x >= width || y <= 0 || y >= height) return;
      const [X, Y] = getNewCoord(x, y);

      const X_floor = Math.floor(X);
      const Y_floor = Math.floor(Y);
      const coordinate: CoordinateString = `${X_floor},${Y_floor}`;
      setHoveredCoords({
        ...hoveredCoordsRef.current,
        [coordinate]: Date.now(),
      });
    };

    const addCoordOnMouseMove = (e: MouseEvent) => {
      var pos = getMousePos(canvas, e);
      addCoord(pos.x, pos.y);
    };

    let timeout: NodeJS.Timeout;

    const addCoordRandom = () => {
      if (!randomStrobeDuration) return;
      const x = Math.random() * canvas.width;
      const y = Math.random() * canvas.height;
      addCoord(x, y);
      timeout = setTimeout(() => {
        addCoordRandom();
      }, randomStrobeDuration);
    };

    if (randomStrobeDuration) {
      addCoordRandom();
    } else {
      window.addEventListener("mousemove", addCoordOnMouseMove, false);
    }

    return () => {
      clearTimeout(timeout);
      removeEventListener("mousemove", addCoordOnMouseMove);
    };
  }, [
    width,
    spacing,
    angle,
    height,
    getNewCoord,
    lineColor,
    randomStrobeDuration,
    fadeDuration,
  ]);

  useEffect(() => {
    const canvas = gridRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let frameRequest: number;

    const draw = () => {
      const hoveredCoordData = Object.entries(hoveredCoordsRef.current);
      for (const [coord, time] of hoveredCoordData) {
        const X = Number(coord.split(",")[0]);
        const Y = Number(coord.split(",")[1]);
        const currentTime = Date.now();
        const elapsedTime = currentTime - time;
        const opacity = Math.max(1 - elapsedTime / fadeDuration, 0);
        if (opacity === 0)
          delete hoveredCoordsRef.current[coord as CoordinateString];

        const p1 = getOldCoord(X, Y);
        const p2 = getOldCoord(X + 1, Y);
        const p3 = getOldCoord(X + 1, Y + 1);
        const p4 = getOldCoord(X, Y + 1);

        const clearGrid = () => {
          ctx.save(); // Save the current context state

          ctx.beginPath();
          ctx.moveTo(p1[0], p1[1]);
          ctx.lineTo(p2[0], p2[1]);
          ctx.lineTo(p3[0], p3[1]);
          ctx.lineTo(p4[0], p4[1]);
          ctx.closePath();

          // Set the clipping region to the triangle path
          ctx.clip();

          // Clear only within the clipped area (triangle)
          ctx.clearRect(0, 0, canvas.width, canvas.height); // Clears only the triangle area due to the clipping

          ctx.restore(); // Restore the context to remove the clipping region
        };

        ctx.globalCompositeOperation = "destination-over";

        clearGrid();
        const color = getConsistentRandomColor(X, Y);
        ctx.fillStyle = `rgba(${color}, ${opacity})`;
        ctx.beginPath();
        ctx.moveTo(p1[0], p1[1]);
        ctx.lineTo(p2[0], p2[1]);
        ctx.lineTo(p3[0], p3[1]);
        ctx.lineTo(p4[0], p4[1]);
        ctx.closePath();
        ctx.fill();
        ctx.globalCompositeOperation = "source-over";

        // Remove dot when fully transparent
        if (elapsedTime >= fadeDuration) {
          delete hoveredCoordsRef.current[coord as CoordinateString];
          clearGrid();
        }
      }

      frameRequest = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(frameRequest);
    };
  }, [
    width,
    spacing,
    angle,
    height,
    fadeDuration,
    getConsistentRandomColor,
    getOldCoord,
  ]);

  return (
    <div className="relative h-full w-full" id="background-boxes">
      <canvas
        width={width}
        height={height}
        ref={linesRef}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
        }}
      />
      <canvas
        width={width}
        height={height}
        ref={gridRef}
        style={{
          top: 0,
          left: 0,
          position: "absolute",
          opacity: 0.2,
          width: "100%",
          height: "100%",
        }}
      />
    </div>
  );
};

export const BackgroundBoxesDefault = () => {
  const isMobileWidth = useIsMobileView();

  return (
    <BackgroundBoxesCustom
      angle={(25 * Math.PI) / 180}
     colors = {[
    "172,225,175", // Soft Mint Green (Adjusted from --green-300 for a more natural medical feel)
    "241,174,181", // Pastel Pink (Softer, more in line with Curaga's aesthetic)
    "246,224,152", // Soft Yellow (Warm and healing, avoiding too much brightness)
    "255,194,182", // Warm Coral Red (Less harsh, more approachable)
    "200,170,250", // Light Lavender (Balances tech & care aspects)
]}
      fadeDuration={isMobileWidth ? 2000 : 500}
      spacing={70}
      lineColor="rgba(186, 186, 186, 0.4)"
      randomStrobeDuration={isMobileWidth ? 2000 : undefined}
    />
  );
};
