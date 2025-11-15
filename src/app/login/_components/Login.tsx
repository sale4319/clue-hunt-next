"use client";

import { useState } from "react";
import { SubmitButton } from "clue-hunt-ui";

import { authApi } from "@app/lib/client";
import { LoginMessages } from "@app/messages-contract";

import styles from "./Login.module.css";

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (isLogin) {
        await authApi.login(username, password);
      } else {
        await authApi.register(username, password);
      }

      window.location.href = "/level/start";
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.card}>
      <h1 className={styles.title}>
        {isLogin ? LoginMessages.TITLE_LOGIN : LoginMessages.TITLE_REGISTER}
      </h1>

      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.inputGroup}>
          <label htmlFor="username" className={styles.label}>
            {LoginMessages.USERNAME}
          </label>
          <input
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className={styles.input}
            placeholder="Enter username"
            required
            minLength={3}
            maxLength={50}
            autoComplete="username"
          />
        </div>

        <div className={styles.inputGroup}>
          <label htmlFor="password" className={styles.label}>
            {LoginMessages.PASSWORD}
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={styles.input}
            placeholder="Enter password"
            required
            minLength={6}
            autoComplete={isLogin ? "current-password" : "new-password"}
          />
        </div>

        {error && <div className={styles.error}>{error}</div>}

        <SubmitButton
          submit
          size="medium"
          disabled={loading}
          label={loading ? "Loading..." : isLogin ? "Login" : "Register"}
        />
      </form>

      <div className={styles.toggleContainer}>
        <button
          type="button"
          onClick={() => {
            setIsLogin(!isLogin);
            setError("");
          }}
          className={styles.toggleButton}
        >
          {isLogin ? LoginMessages.NO_ACCOUNT : LoginMessages.HAVE_ACCOUNT}
        </button>
      </div>
    </div>
  );
}
