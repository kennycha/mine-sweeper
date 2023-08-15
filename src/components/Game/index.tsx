import { useCallback, useRef, useState } from "react";
import styles from "./index.module.scss";
import classNames from "classnames/bind";
import { GameModeTypes } from "../../types";
import { firstUpperCase } from "../../utils";
import Board from "../Board";
import { useOutsideClick } from "../../hooks";

const cx = classNames.bind(styles);

const GAME_MODES: GameModeTypes[] = ["beginner", "intermediate", "expert", "custom"];

const Game = () => {
  const [isHeaderOpen, setIsHeaderOpen] = useState(false);
  const [currentGameMode, setCurrentGameMode] = useState<GameModeTypes>("beginner");

  const containerRef = useRef<HTMLDivElement>(null);

  const handleHeaderItemClick = () => {
    setIsHeaderOpen((prev) => !prev);
  };

  const handleModeOptionClick = (mode: GameModeTypes) => {
    if (mode === "custom") {
      // @TODO modal로 custom 설정
      // w, h는 8-100, count는 최대 (w * h) / 3
    } else {
      setCurrentGameMode(mode);
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
            {GAME_MODES.map((gameMode) => {
              return (
                <li
                  key={gameMode}
                  className={cx("modeOption", { current: currentGameMode === gameMode })}
                  onClick={() => handleModeOptionClick(gameMode)}
                >
                  <div className={cx("optionIcon")} />
                  <p className={cx("optionText")}>{firstUpperCase(gameMode)}</p>
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
