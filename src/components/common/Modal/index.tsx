import { createPortal } from "react-dom";
import styles from "./index.module.scss";
import classNames from "classnames/bind";
import { PropsWithChildren, memo } from "react";
import DeleteButton from "../DeleteButton";

const cx = classNames.bind(styles);

interface ModalProps {
  onClose: () => void;
}

const Modal = memo(({ onClose, children }: PropsWithChildren<ModalProps>) => {
  return createPortal(
    <div className={cx("container")}>
      <div className={cx("backdrop")} onClick={onClose} />
      <div className={cx("inner")}>
        {children}
        <div className={cx("close")}>
          <DeleteButton onClick={onClose} />
        </div>
      </div>
    </div>,
    document.body
  );
});

export default Modal;
