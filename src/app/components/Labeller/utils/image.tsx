import { LabelBoxLocation, LabelPart, LabelWithData } from "../labeller.types";

type CanvasLocation = {
  canvas: HTMLCanvasElement;
  location: LabelBoxLocation;
};

const getCanvasLocations = (parts: LabelPart[]): CanvasLocation[] => {
  const canvasLocationArray = [];

  for (let part of parts) {
    const location = part.location;
    const canvas = document
      .getElementById(`page_${part.pageNumber}`)
      ?.querySelector("canvas");
    if (canvas && location) canvasLocationArray.push({ location, canvas });
  }

  return canvasLocationArray;
};

export const extractImageFromCanvas = (
  label: LabelWithData,
  maxWidth: number,
) => {
  const canvasLocationArray = getCanvasLocations(label.parts);

  let width = canvasLocationArray.reduce(
    (a, b) => Math.max(a, (b.location.w / 100) * b.canvas.width),
    -Infinity,
  );
  let height = canvasLocationArray.reduce(
    (a, b) => a + (b.location.h / 100) * b.canvas.height,
    0,
  );

  let scaleFactor = 1;

  if (width > maxWidth) {
    scaleFactor = maxWidth / width;
    width = maxWidth;
    height = Math.round(height * scaleFactor);
  }

  const tempCanvas = document.createElement("canvas");
  tempCanvas.width = width;
  tempCanvas.height = height;
  const context = tempCanvas.getContext("2d") as CanvasRenderingContext2D;

  // Fill the canvas with a white background
  context.fillStyle = "white";
  context.fillRect(0, 0, width, height);

  let currentHeight = 0;

  for (const canvasLocation of canvasLocationArray) {
    const { location, canvas } = canvasLocation;
    let { x, y, w, h } = location;
    x = (x / 100) * canvas.width;
    w = (w / 100) * canvas.width;
    y = (y / 100) * canvas.height;
    h = (h / 100) * canvas.height;
    context.drawImage(
      canvas,
      x,
      y,
      w,
      h,
      0,
      currentHeight,
      Math.round(w * scaleFactor),
      Math.round(h * scaleFactor),
    );
    currentHeight += Math.round(h * scaleFactor);
  }

  // // Saving it locally automatically
  // let link = document.createElement("a");
  // link.setAttribute("download", "download");
  // link.href = tempCanvas.toDataURL("image/jpeg", 0.7);
  // link.click();

  return tempCanvas.toDataURL("image/jpeg", 0.7);
};
