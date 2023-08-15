import { useCallback, useRef, useState } from "react";
import styles from "./index.module.scss";
import classNames from "classnames/bind";
import { GameModeTypes } from "../../types";
import { firstUpperCase } from "../../utils";
import Board from "../Board";
import { useOutsideClick } from "../../hooks";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store";
import { changeMode } from "../../features/game";

const cx = classNames.bind(styles);

const GAME_MODES: GameModeTypes[] = ["beginner", "intermediate", "expert", "custom"];

const Game = () => {
  const gameMode = useSelector((state: RootState) => state.game.mode);

  const dispatch = useDispatch();

  const [isHeaderOpen, setIsHeaderOpen] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);

  const handleHeaderItemClick = () => {
    setIsHeaderOpen((prev) => !prev);
  };

  const handleModeOptionClick = (mode: GameModeTypes) => {
    if (mode === "custom") {
      // @TODO modal로 custom 설정
      // w, h는 8-100, count는 최대 (w * h) / 3
    } else {
      dispatch(changeMode({ mode }));
      setIsHeaderOpen(false);
    }
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
      <div className={cx("border")}>
        <Board />
      </div>
    </div>
  );
};

export default Game;
