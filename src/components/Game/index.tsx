import { FocusEventHandler, memo, useCallback, useMemo, useRef, useState } from "react";
import styles from "./index.module.scss";
import classNames from "classnames/bind";
import { GameModeTypes } from "../../types";
import { firstUpperCase } from "../../utils";
import Board from "../Board";
import { useOutsideClick } from "../../hooks";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store";
import { changeMode } from "../../features/game";
import Modal from "../common/Modal";

const cx = classNames.bind(styles);

const GAME_MODES: GameModeTypes[] = ["beginner", "intermediate", "expert", "custom"];
const DEFAULT_WIDTH = 8;
const DEFAULT_HEIGHT = 8;
const DEFAULT_COUNT = 10;
const MIN_WIDTH = 8;
const MAX_WIDTH = 50;
const MIN_HEIGHT = 8;
const MAX_HEIGHT = 50;
const MIN_COUNT = 1;

const Game = memo(() => {
  const gameMode = useSelector((state: RootState) => state.game.mode);

  const dispatch = useDispatch();

  const [isHeaderOpen, setIsHeaderOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [customWidth, setCustomWidth] = useState(DEFAULT_WIDTH);
  const [customHeight, setCustomHeight] = useState(DEFAULT_HEIGHT);
  const [customCount, setCustomCount] = useState(DEFAULT_COUNT);
  const [hasError, setHasError] = useState(false);

  const maxCount = useMemo(() => Math.floor((customWidth * customHeight) / 3), [customHeight, customWidth]);

  const containerRef = useRef<HTMLDivElement>(null);

  const handleHeaderItemClick = () => {
    setIsHeaderOpen((prev) => !prev);
  };

  const handleModeOptionClick = (mode: GameModeTypes) => {
    if (mode === "custom") {
      setIsModalOpen(true);
      setIsHeaderOpen(false);
    } else {
      dispatch(changeMode({ mode }));
      setIsHeaderOpen(false);
    }
  };

  const handleOkButtonClick = () => {
    setHasError(false);
  };

  const handleWidthInputBlur: FocusEventHandler<HTMLInputElement> = (event) => {
    const parsed = parseInt(event.target.value);
    if (typeof parsed !== "number") return;
    setCustomWidth(parsed);
  };

  const handleHeightInputBlur: FocusEventHandler<HTMLInputElement> = (event) => {
    const parsed = parseInt(event.target.value);
    if (typeof parsed !== "number") return;
    setCustomHeight(parsed);
  };

  const handleCountInputBlur: FocusEventHandler<HTMLInputElement> = (event) => {
    const parsed = parseInt(event.target.value);
    if (typeof parsed !== "number") return;
    setCustomCount(parsed);
  };

  const handleApplyButtonClick = () => {
    if (
      customWidth >= MIN_WIDTH &&
      customWidth <= MAX_WIDTH &&
      customHeight >= MIN_HEIGHT &&
      customHeight <= MAX_HEIGHT &&
      customCount >= MIN_COUNT &&
      customCount <= maxCount
    ) {
      setHasError(false);
      dispatch(
        changeMode({ mode: "custom", config: { width: customWidth, height: customHeight, count: customCount } })
      );
      setIsModalOpen(false);
    } else {
      setHasError(true);
    }
  };

  const onModalClose = () => {
    setIsModalOpen(false);
  };

  const onOutsideClick = useCallback(() => {
    setIsHeaderOpen(false);
  }, []);
  useOutsideClick(containerRef, onOutsideClick);

  return (
    <div className={cx("container")}>
      <div className={cx("header")} ref={containerRef}>
        <div className={cx("headerItem")} onClick={handleHeaderItemClick}>
          Game
        </div>
        {isHeaderOpen && (
          <ul className={cx("modeOptions")}>
            {GAME_MODES.map((mode) => {
              return (
                <li
                  key={mode}
                  className={cx("modeOption", { current: gameMode === mode })}
                  onClick={() => handleModeOptionClick(mode)}
                >
                  <div className={cx("optionIcon")} />
                  <p className={cx("optionText")}>{firstUpperCase(mode)}</p>
                </li>
              );
            })}
          </ul>
        )}
      </div>
      <div className={cx("board")}>
        <Board />
      </div>
      {isModalOpen && (
        <Modal onClose={onModalClose}>
          <div className={cx("modalInner")}>
            {hasError ? (
              <div className={cx("errorWrapper")}>
                <p className={cx("errorText")}>You can apply</p>
                <p className={cx("errorText")}>Width: 8 to 50</p>
                <p className={cx("errorText")}>Height: 8 to 50</p>
                <p className={cx("errorText")}>Count: 1 to 1/3 of squares</p>
              </div>
            ) : (
              <div className={cx("inputs")}>
                <label htmlFor="customWidth">Width:</label>
                <input
                  id="customWidth"
                  min={MIN_WIDTH}
                  max={MAX_WIDTH}
                  defaultValue={customWidth}
                  type="number"
                  onBlur={handleWidthInputBlur}
                />
                <label htmlFor="customHeight">Height:</label>
                <input
                  id="customHeight"
                  min={MIN_HEIGHT}
                  max={MAX_HEIGHT}
                  defaultValue={customHeight}
                  type="number"
                  onBlur={handleHeightInputBlur}
                />
                <label htmlFor="customCount">Count:</label>
                <input
                  id="customCount"
                  min={MIN_COUNT}
                  max={maxCount}
                  defaultValue={customCount}
                  type="number"
                  onBlur={handleCountInputBlur}
                />
              </div>
            )}
            <div className={cx("buttonWrapper")}>
              {hasError ? (
                <button className={cx("button")} onClick={handleOkButtonClick}>
                  Ok
                </button>
              ) : (
                <button className={cx("button")} onClick={handleApplyButtonClick}>
                  Apply
                </button>
              )}
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
});

export default Game;
