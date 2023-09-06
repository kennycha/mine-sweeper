import { memo } from "react";
import Game from "../Game";
import styles from "./index.module.scss";
import classNames from "classnames/bind";

const cx = classNames.bind(styles);

const App = memo(() => {
  return (
    <div className={cx("container")}>
      <Game />
    </div>
  );
});

export default App;
