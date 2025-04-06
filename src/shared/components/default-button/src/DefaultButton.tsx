'use client"';
import Link from "next/link";

import styles from "./DefaultButton.module.css";

export interface ButtonProps {
  primary?: boolean;
  backgroundColor?: string;
  isLocked?: boolean;
  size?: "small" | "medium" | "large";
  mode?: "fill" | "pulse" | "close" | "raise" | "up" | "slide" | "offset";
  label?: string;
  onClick?: () => void;
  href: string;
}

export function DefaultButton({
  primary,
  size = "medium",
  mode = "fill",
  isLocked,
  backgroundColor,
  label,
  href,
  ...props
}: ButtonProps) {
  const toggleColor = primary
    ? styles.fill
    : primary === undefined
    ? styles[mode]
    : styles.pulse;

  return (
    <Link
      href={href}
      className={[styles.primaryButton, styles[size], toggleColor].join(" ")}
      style={{ backgroundColor }}
      {...props}
    >
      {isLocked ? "Locked" : isLocked === undefined ? label : "Unlocked"}
    </Link>
  );
}
