import { useCallback, useEffect, useRef, useState } from "react";
import styles from "./index.module.scss";
import classNames from "classnames/bind";
import { Cell, Nullable } from "../../types";
import { getRandomNumberBetween } from "../../utils";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store";
import { changePhase } from "../../features/game";
import { ALL_DIRECTIONS } from "../../constants";

const cx = classNames.bind(styles);

const createCells = (width: number, height: number) => {
  const grid: Cell[] = [];

  for (let i = 0; i < height; i += 1) {
    for (let j = 0; j < width; j += 1) {
      grid.push({ i, j, isOpened: false, hasFlag: false });
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

const createMineCountArray = (checkArray: number[][]) => {
  const width = checkArray[0].length;
  const height = checkArray.length;

  const res = Array(height)
    .fill(0)
    .map(() => Array(width).fill(0));

  for (let i = 0; i < height; i += 1) {
    for (let j = 0; j < width; j += 1) {
      ALL_DIRECTIONS.forEach(([di, dj]) => {
        const nextI = i + di;
        const nextJ = j + dj;
        if (nextI >= 0 && nextI < height && nextJ >= 0 && nextJ < width && checkArray[nextI][nextJ]) {
          res[i][j] += 1;
        }
      });
    }
  }

  return res;
};

const createVisitCheckArray = (width: number, height: number) => {
  return Array(height)
    .fill(0)
    .map(() => Array(width).fill(false));
};

const Board = () => {
  const gamePhase = useSelector((state: RootState) => state.game.phase);
  const gameConfig = useSelector((state: RootState) => state.game.config);

  const dispatch = useDispatch();

  const [cells, setCells] = useState(createCells(gameConfig.width, gameConfig.height));
  const [restCellCount, setRestCellCount] = useState(gameConfig.width * gameConfig.height);
  const mineCheckArray = useRef<Nullable<number[][]>>(null);
  const mineCountArray = useRef<Nullable<number[][]>>(null);
  const visitCheckArray = useRef<Nullable<boolean[][]>>(null);

  const resetGame = useCallback(() => {
    dispatch(changePhase("ready"));
    setCells(createCells(gameConfig.width, gameConfig.height));
    setRestCellCount(gameConfig.width * gameConfig.height);
    mineCheckArray.current = null;
    mineCountArray.current = null;
    visitCheckArray.current = null;
  }, [dispatch, gameConfig.height, gameConfig.width]);

  useEffect(() => {
    // game config 업데이트 시 데이터를 초기화
    resetGame();
  }, [resetGame]);

  useEffect(() => {
    // 남은 셀의 개수가 전체 지뢰 수와 같다면 성공
    if (gamePhase !== "failed" && restCellCount === gameConfig.count) {
      dispatch(changePhase("success"));
    }
  }, [dispatch, gameConfig.count, gamePhase, restCellCount]);

  // 게임 상단 중앙의 얼굴 버튼을 눌러서 게임 초기화
  const handleResetButtonClick = useCallback(() => {
    resetGame();
  }, [resetGame]);

  // @TODO 50x50 이상의 큰 사이즈에서 maximum callback 발생
  const updateTargetCells = useCallback(
    (i: number, j: number, res: [number, number][]) => {
      if (!mineCheckArray.current || !mineCountArray.current || !visitCheckArray.current) return;
      // 로그 제거하면 2000번 이상의 재귀 호출에서 maximum callback 발생
      console.log(i, j);

      res.push([i, j]);
      visitCheckArray.current![i][j] = true;

      if (mineCountArray.current[i][j] !== 0) return;

      ALL_DIRECTIONS.forEach(([di, dj]) => {
        const nextI = i + di;
        const nextJ = j + dj;
        if (
          nextI >= 0 &&
          nextI < gameConfig.height &&
          nextJ >= 0 &&
          nextJ < gameConfig.width &&
          !mineCheckArray.current![nextI][nextJ] &&
          !visitCheckArray.current![nextI][nextJ]
        ) {
          updateTargetCells(nextI, nextJ, res);
        } else {
          return;
        }
      });
    },
    [gameConfig.height, gameConfig.width]
  );

  const handleCellClick = useCallback(
    (i: number, j: number, isRightClick: boolean) => {
      // 성공이나 실패 상태에서는 클릭 불가
      if (gamePhase === "success" || gamePhase === "failed") return;
      // 우클릭 시에는 해당 셀에 깃발 표시 혹은 표시 해제
      if (isRightClick) {
        setCells((prev) =>
          prev.map((cell) => (cell.i === i && cell.j === j ? { ...cell, hasFlag: !cell.hasFlag } : cell))
        );
      } else {
        if (gamePhase === "ready") {
          // 게임 준비단계라면(클릭을 한 번도 하지 않은 상태라면) 상태를 진행으로 바꾸고, 지뢰를 배치
          dispatch(changePhase("playing"));
          mineCheckArray.current = createMineCheckArray(i, j, gameConfig.width, gameConfig.height, gameConfig.count);
          mineCountArray.current = createMineCountArray(mineCheckArray.current);
          visitCheckArray.current = createVisitCheckArray(gameConfig.width, gameConfig.height);
        }
        if (mineCheckArray.current) {
          // 지뢰가 있는 셀을 클릭했다면 실패
          if (mineCheckArray.current[i][j]) {
            dispatch(changePhase("failed"));
          }
          // 업데이트 처리할 셀들의 [i, j]가 담긴 배열 업데이트
          const targetCells: [number, number][] = [];
          updateTargetCells(i, j, targetCells);
          // 한 번에 업데이트
          setCells((prev) =>
            prev.map((cell) => {
              if (targetCells.find(([targetI, targetJ]) => targetI === cell.i && targetJ === cell.j)) {
                return { ...cell, isOpened: true };
              } else {
                return cell;
              }
            })
          );
          // 클릭 시 남은 셀 수 차감
          setRestCellCount((prev) => prev - targetCells.length);
        }
      }
    },
    [dispatch, gameConfig.count, gameConfig.height, gameConfig.width, gamePhase, updateTargetCells]
  );

  useEffect(() => {
    // 우측 클릭으로 깃발 표시를 하기 위해 기본 이벤트를 방지
    const handleContext = (event: MouseEvent) => {
      event.preventDefault();
    };

    window.addEventListener("contextmenu", handleContext);

    return () => {
      window.removeEventListener("contextmenu", handleContext);
    };
  }, []);

  return (
    <div className={cx("container", gamePhase)}>
      <div className={cx("controls")}>
        <div className={cx("endTimer")}>
          <div className={cx("time")} />
          <div className={cx("time")} />
          <div className={cx("time")} />
        </div>
        <div className={cx("resetButton")} onClick={() => handleResetButtonClick()}>
          <div />
        </div>
        <div className={cx("currentTimer")}>
          <div className={cx("time")} />
          <div className={cx("time")} />
          <div className={cx("time")} />
        </div>
      </div>
      <div className={cx("gameTableWrapper")}>
        <div
          className={cx("gameTable")}
          style={{ width: gameConfig.width * 16 + 2, height: gameConfig.height * 16 + 2 }}
        >
          {cells.map((cell, idx) => (
            <div
              className={cx("cell", `open${mineCountArray.current?.[cell.i][cell.j] ?? 0}`, {
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
