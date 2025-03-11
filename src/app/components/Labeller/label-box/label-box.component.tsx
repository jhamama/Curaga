/* eslint-disable react-hooks/exhaustive-deps */
import { RefObject, useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  changeLabelPartDimensions,
  removeLabelPart,
  setSelectedLabel,
} from "../redux/slices/labeller/labeller.slice";
import { LabelBoxLocation, LabelPart } from "../labeller.types";
import styles from "./label-box.styles.module.scss";
import {
  selectLabelOrderPosition,
  selectSelectedPartIds,
} from "../redux/slices/labeller/labeller.selectors";
import { RootState } from "../redux/reducers";
import { aIsChildOfB } from "../utils/utils";

type LabelBoxProps = {
  labelPart: LabelPart;
  pageRef: RefObject<HTMLDivElement>;
};

const getColor = (index: number) => {
  const colors = [
    "#ff767632",
    "#ff983e31",
    "#ffe18f31",
    "#7fd69232",
    "#77c8ee32",
    "#cba8ec32",
    "#f7a1c932",
  ];

  if (index == -1) return "#22222222";

  return colors[index % colors.length];
};

const minDist = 2;

export const LabelBox = ({ labelPart, pageRef }: LabelBoxProps) => {
  const dispatch = useDispatch();
  // Extracts values from props
  const id = labelPart.id;
  const selected = useSelector(selectSelectedPartIds).includes(id);
  const labelColorNumber = useSelector((state: RootState) =>
    selectLabelOrderPosition(
      state,
      labelPart.parentId ? labelPart.parentId : "",
    ),
  );
  // Creates state variables and references to for internal callback state
  const [location, _setLocation] = useState(labelPart.location);
  const locationRef = useRef(location);
  const setLocation = (data: LabelBoxLocation) => {
    locationRef.current = data;
    _setLocation(data);
  };
  const { x, y, w, h } = location;
  // variables for click tracking
  const rectIsMovingRef = useRef(false);
  const clickPosRef = useRef({ xPix: 0, yPix: 0 });
  const labelBoxRef = useRef<HTMLDivElement>(null);

  // Allows for resizing the instant the component mounts
  useEffect(() => {
    // The Callback attached for resizing when a fresh box is added
    const initialResizing = (e: MouseEvent) => {
      // Checks if the mouse is currently down. If not removes the listener
      if (e.buttons !== 1) {
        window.removeEventListener("mousemove", initialResizing);
        if (locationRef.current.h == 0) dispatch(removeLabelPart(labelPart));
        return;
      }

      // Allow the rect to move and attach listener for resizing on connect
      if (!rectIsMovingRef.current) {
        rectIsMovingRef.current = true;
        clickPosRef.current = { xPix: e.pageX, yPix: e.pageY };
        // Listener to remove the initial resizing when mouse is released
        window.addEventListener(
          "mouseup",
          (e) => {
            e.stopPropagation();
            rectIsMovingRef.current = false;
            window.removeEventListener("mousemove", initialResizing);
            dispatch(
              changeLabelPartDimensions({
                labelPart,
                location: locationRef.current,
              }),
            );
            // dispatch(setSelectedPart(id));
          },
          { once: true },
        );
      }

      // Applies the resizing based on wether we are moving up or down
      if (e.pageY >= clickPosRef.current.yPix) {
        resizeBottom(e);
      } else {
        resizeTop(e);
      }
    };

    window.addEventListener("mousemove", initialResizing);

    return () => window.removeEventListener("mousemove", initialResizing);
  }, []);

  // Updates if the labelPart data updates
  useEffect(() => {
    setLocation(labelPart.location);
  }, [labelPart]);

  // Handles the selection, deselection, deletion and labelling
  useEffect(() => {
    const formDiv = document.getElementById("label-form");

    const deselectCallback = (e: MouseEvent) => {
      const target = e.target as Node;
      const selfClicked = aIsChildOfB(target, labelBoxRef.current);
      const formClicked = aIsChildOfB(target, formDiv);
      if (!selfClicked && !formClicked) {
        dispatch(setSelectedLabel(null));
        window.removeEventListener("mousedown", deselectCallback);
      }
    };

    const deleteCallback = (e: KeyboardEvent) => {
      const target = e.target as Node;
      const inForm = aIsChildOfB(target, formDiv);
      if (e.code == "Backspace" && !inForm) {
        dispatch(removeLabelPart(labelPart));
        window.removeEventListener("keydown", deleteCallback);
      }
    };

    // Adds the deselection callback if the box is selected
    if (selected) {
      window.addEventListener("mousedown", deselectCallback);
      window.addEventListener("keydown", deleteCallback);
    }
    return () => {
      window.removeEventListener("mousedown", deselectCallback);
      window.removeEventListener("keydown", deleteCallback);
    };
  }, [selected]);

  const resizeRight = (e: MouseEvent) => {
    if (pageRef.current && clickPosRef.current) {
      const { xPix } = clickPosRef.current;
      const dx = ((e.pageX - xPix) / pageRef.current.clientWidth) * 100;
      const newW = Math.min(Math.max(minDist, w + dx), 100 - x);
      setLocation({ ...location, w: newW });
    }
  };

  const resizeLeft = (e: MouseEvent) => {
    if (pageRef.current && clickPosRef.current) {
      const { xPix } = clickPosRef.current;
      const dx = ((e.pageX - xPix) / pageRef.current.clientWidth) * 100;
      const newX = Math.min(Math.max(x + dx, 0), x + w - minDist);
      const newW = Math.min(Math.max(w - dx, minDist), x + w);
      setLocation({ ...location, x: newX, w: newW });
    }
  };

  const resizeTop = (e: MouseEvent) => {
    if (pageRef.current && clickPosRef.current) {
      const { yPix } = clickPosRef.current;
      const dy = ((e.pageY - yPix) / pageRef.current.clientHeight) * 100;
      const newY = Math.min(Math.max(y + dy, 0), y + h - minDist);
      const newH = Math.min(Math.max(h - dy, minDist), y + h);
      setLocation({ ...location, y: newY, h: newH });
    }
  };

  const resizeBottom = (e: MouseEvent) => {
    if (pageRef.current && clickPosRef.current) {
      const { yPix } = clickPosRef.current;
      const dy = ((e.pageY - yPix) / pageRef.current.clientHeight) * 100;
      const newH = Math.min(Math.max(minDist, h + dy), 100 - y);
      setLocation({ ...location, h: newH });
    }
  };

  const moveWhole = (e: MouseEvent) => {
    if (pageRef.current && clickPosRef.current) {
      const { xPix, yPix } = clickPosRef.current;

      const dx = ((e.pageX - xPix) / pageRef.current.clientWidth) * 100;
      const dy = ((e.pageY - yPix) / pageRef.current.clientHeight) * 100;
      const newX = Math.min(Math.max(0, x + dx), 100 - w);
      const newY = Math.min(Math.max(0, y + dy), 100 - h);

      setLocation({ ...location, x: newX, y: newY });
    }
  };

  const setMoving = (
    e: React.MouseEvent,
    resizerFunction: (e: MouseEvent) => void,
  ) => {
    // Prevents any other mouse options and selects the component
    e.stopPropagation();
    dispatch(setSelectedLabel(labelPart.parentId));

    // Store the initial click location
    if (!rectIsMovingRef.current) {
      rectIsMovingRef.current = true;
      clickPosRef.current = { xPix: e.pageX, yPix: e.pageY };
    }

    // Adds the mousemove resizer function
    window.addEventListener("mousemove", resizerFunction);

    // Adds the ending move event listener
    window.addEventListener(
      "mouseup",
      (e) => {
        dispatch(
          changeLabelPartDimensions({
            labelPart,
            location: locationRef.current,
          }),
        );
        window.removeEventListener("mousemove", resizerFunction);
        rectIsMovingRef.current = false;
      },
      { once: true, capture: true },
    );
  };

  const removeBox = (e: React.MouseEvent) => {
    e.stopPropagation();
    dispatch(removeLabelPart(labelPart));
  };

  return (
    <div
      id={id}
      className={styles.labelBox}
      onMouseDown={(e) => setMoving(e, moveWhole)}
      ref={labelBoxRef}
      style={{
        left: `${location.x}%`,
        top: `${location.y}%`,
        width: `${location.w}%`,
        height: `${location.h}%`,
        background: getColor(labelColorNumber), // TODO FIX
      }}
    >
      {selected && (
        <>
          <div
            onMouseDown={(e) => setMoving(e, resizeTop)}
            className={styles.resizer + " " + styles.topResizer}
          ></div>
          <div
            onMouseDown={(e) => setMoving(e, resizeRight)}
            className={styles.resizer + " " + styles.rightResizer}
          ></div>
          <div
            onMouseDown={(e) => setMoving(e, resizeBottom)}
            className={styles.resizer + " " + styles.bottomResizer}
          ></div>
          <div
            onMouseDown={(e) => setMoving(e, resizeLeft)}
            className={styles.resizer + " " + styles.leftResizer}
          ></div>
          <div
            title="Delete Part"
            onMouseDown={(e) => removeBox(e)}
            className={styles.deleter}
          ></div>
        </>
      )}
    </div>
  );
};
