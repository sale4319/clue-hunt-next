"use client";

import { Button } from "clue-hunt-ui";

import { useAuth } from "@app/context/client";

import styles from "./LogoutButton.module.css";

export function LogoutButton() {
  const { user, logout } = useAuth();

  return (
    <>
      {user && (
        <div className={styles.userInfo}>
          <label className={styles.username}>{user.username}</label>
          <Button onClick={logout} mode="close" size="small" label="Logout" />
        </div>
      )}
    </>
  );
}
