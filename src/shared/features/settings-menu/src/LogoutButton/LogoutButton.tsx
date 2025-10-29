"use client";

import { useAuth } from "@app/context";
import styles from "./LogoutButton.module.css";
import { Button } from "clue-hunt-ui";

export function LogoutButton() {
  const { user, logout } = useAuth();

  return (
    <>
      {user && (
        <div className={styles.userInfo}>
          <span className={styles.username}>{user.username}</span>
          <Button onClick={logout} mode="close" size="small" label="Logout" />
        </div>
      )}
    </>
  );
}
