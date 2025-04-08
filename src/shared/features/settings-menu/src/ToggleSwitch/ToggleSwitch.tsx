import styles from "./ToggleSwitch.module.css";

interface ToggleSwitchProps {
  toggle?: boolean;
  label?: string;
  defaultChecked?: boolean;
  onChange?: () => void;
}

export const ToggleSwitch = ({
  toggle,
  label,
  onChange,
  defaultChecked,
  ...props
}: ToggleSwitchProps) => {
  return (
    <div className={styles.toggleContainer}>
      <span className={styles.toggleLabel}>{label}</span>
      <div>
        <label className={styles.toggleSwitch}>
          <input
            className={styles.toggleSwitchInput}
            type="checkbox"
            onChange={onChange}
            defaultChecked={toggle}
          />
          <span className={styles.slider}></span>
        </label>
        <br />
        {toggle ? (
          <span className={styles.toggleText}>on</span>
        ) : (
          <span className={styles.toggleText}>off</span>
        )}
      </div>
    </div>
  );
};
