import { useCallback, useEffect, useRef, useState } from "react";
import styles from "./index.module.scss";
import classNames from "classnames/bind";
import { Cell, GamePhaseTypes, Nullable } from "../../types";
import { getRandomNumberBetween } from "../../utils";

const cx = classNames.bind(styles);

const GAME_CONFIG = {
  width: 8,
  height: 6,
  count: 10,
};

const createCells = (width: number, height: number) => {
  const grid: Cell[] = [];

  for (let i = 0; i < height; i += 1) {
    for (let j = 0; j < width; j += 1) {
      grid.push({ i, j, isOpened: false, mineCount: 0, hasFlag: false });
    }
  }

  return grid;
};

const createMineCheckArray = (exceptI: number, exceptJ: number, width: number, height: number, count: number) => {
  const array: [number, number][] = [];
  while (array.length < count) {
    const [newI, newJ] = [getRandomNumberBetween(0, height), getRandomNumberBetween(0, width)];
    if (newI === exceptI && newJ === exceptJ) continue;
    if (array.find(([i, j]) => i === newI && j === newJ)) continue;
    array.push([newI, newJ]);
  }

  const res = Array(height)
    .fill(0)
    .map(() => Array(width).fill(false));
  array.forEach(([i, j]) => {
    res[i][j] = true;
  });

  return res;
};

const Board = () => {
  const currentGameMode = "beginner";
  const [currentGamePhase, setCurrentGamePhase] = useState<GamePhaseTypes>("ready");
  const [cells, setCells] = useState(createCells(GAME_CONFIG.width, GAME_CONFIG.height));
  const mineCheckArray = useRef<Nullable<number[][]>>();

  const handleStartButtonClick = useCallback(() => {
    setCells(createCells(GAME_CONFIG.width, GAME_CONFIG.height));
    setCurrentGamePhase("ready");
    mineCheckArray.current = null;
  }, []);

  const handleCellClick = useCallback(
    (i: number, j: number, useFlag: boolean) => {
      if (currentGamePhase === "success" || currentGamePhase === "failed") return;
      if (useFlag) {
        setCells((prev) => prev.map((cell) => (cell.i === i && cell.j === j ? { ...cell, hasFlag: true } : cell)));
      } else {
        if (currentGamePhase === "ready") {
          setCurrentGamePhase("playing");
          mineCheckArray.current = createMineCheckArray(i, j, GAME_CONFIG.width, GAME_CONFIG.height, GAME_CONFIG.count);
        }
        if (mineCheckArray.current) {
          if (mineCheckArray.current[i][j]) {
            setCurrentGamePhase("failed");
          }
          setCells((prev) =>
            prev.map((cell) => {
              // @TODO mineCount도 업데이트
              return cell.i === i && cell.j === j ? { ...cell, isOpened: true } : cell;
            })
          );
        }
      }
    },
    [currentGamePhase, mineCheckArray]
  );

  useEffect(() => {
    const handleContext = (event: MouseEvent) => {
      event.preventDefault();
    };

    window.addEventListener("contextmenu", handleContext);

    return () => {
      window.removeEventListener("contextmenu", handleContext);
    };
  }, []);

  return (
    <div className={cx("container", currentGameMode, { fail: currentGamePhase === "failed" })}>
      <div className={cx("controls")}>
        <div className={cx("endTimer")}>
          <div className={cx("time")} />
          <div className={cx("time")} />
          <div className={cx("time")} />
        </div>
        <div className={cx("startButton")} onClick={() => handleStartButtonClick()}>
          <div />
        </div>
        <div className={cx("currentTimer")}>
          <div className={cx("time")} />
          <div className={cx("time")} />
          <div className={cx("time")} />
        </div>
      </div>
      <div className={cx("gameTableWrapper")}>
        <div className={cx("gameTable")} style={{ width: GAME_CONFIG.width * 16 + 2 }}>
          {cells.map((cell, idx) => (
            <div
              className={cx("cell", {
                opened: cell.isOpened,
                hasFlag: cell.hasFlag,
                hasMine: mineCheckArray.current && mineCheckArray.current[cell.i][cell.j],
              })}
              key={idx}
              onMouseDown={(event) => handleCellClick(cell.i, cell.j, event.button === 2)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Board;
