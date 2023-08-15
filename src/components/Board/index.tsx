import { useState } from "react";
import styles from "./index.module.scss";
import classNames from "classnames/bind";
import { Cell } from "../../types";

const cx = classNames.bind(styles);

const GAME_CONFIG = {
  width: 8,
  height: 8,
  count: 10,
};

const createCells = (width: number, height: number) => {
  const grid: Cell[] = [];

  for (let i = 0; i < width; i += 1) {
    for (let j = 0; j < height; j += 1) {
      grid.push({ i, j, isOpened: false, hasMine: false });
    }
  }

  return grid;
};

const Board = () => {
  const currentGameMode = "beginner";
  const [cells, setCells] = useState(createCells(GAME_CONFIG.width, GAME_CONFIG.height));

  const handleCellClick = (i: number, j: number) => {
    setCells((prev) => prev.map((cell) => (cell.i === i && cell.j === j ? { ...cell, isOpened: true } : cell)));
  };

  return (
    <div className={cx("container", currentGameMode)}>
      <div className={cx("controls")}>
        <div className={cx("endTimer")}>
          <div className={cx("time")} />
          <div className={cx("time")} />
          <div className={cx("time")} />
        </div>
        <div className={cx("startButton")}>
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
              className={cx("cell", { opened: cell.isOpened })}
              key={idx}
              onClick={() => handleCellClick(cell.i, cell.j)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Board;
