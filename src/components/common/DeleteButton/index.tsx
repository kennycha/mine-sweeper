import styles from "./index.module.scss";
import classNames from "classnames/bind";

const cx = classNames.bind(styles);

interface DeleteButtonProps {
  onClick: () => void;
}

const DeleteButton = ({ onClick }: DeleteButtonProps) => {
  const handleClick = () => {
    onClick();
  };

  return (
    <button className={cx("container")} onClick={handleClick}>
      <div className={cx("icon")} />
    </button>
  );
};

export default DeleteButton;
