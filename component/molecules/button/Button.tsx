import styles from "./styles.module.scss";

interface ButtonProps {
  title: string;
  icon?: string;
  buttonFontColor?: string;
  handleClick?: () => void;
  bgColor?: string;
  buttonBorder?: string;
  responsiveClass?: string;
  disabled?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  title,
  icon,
  handleClick,
  bgColor,
  buttonFontColor,
  buttonBorder,
  responsiveClass,
  disabled = false,
}) => {
  return (
    <button
      className={`${styles.button} ${responsiveClass}`}
      onClick={handleClick}
      style={{
        backgroundColor: `${bgColor}`,
        color: `${buttonFontColor}`,
        border: `${buttonBorder}`,
      }}
      disabled={disabled}
    >
      {icon && <img src={icon} alt="download" />}
      <p>{title}</p>
    </button>
  );
};

export default Button;
