import styles from "./index.module.scss";
import classNames from "classnames/bind";

const cx = classNames.bind(styles);

const Footer = () => {
  return (
    <footer className={cx("container")}>
      <p>&copy; kennycha</p>
      <p>|</p>
      <a href="https://github.com/kennycha/mine-sweeper" target="_blank">
        <p>Github</p>
      </a>
    </footer>
  );
};

export default Footer;
