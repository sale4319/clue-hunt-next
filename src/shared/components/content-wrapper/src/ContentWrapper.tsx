"use client";

import { useState } from "react";
import { Container } from "clue-hunt-ui";
import { SettingsModal } from "@app/settings-menu";
import { useGameSettings } from "@app/context";
import styles from "./ContentWrapper.module.css";

type ContentWrapperProps = {
  children: React.ReactNode;
};

export const ContentWrapper = ({ children }: ContentWrapperProps) => {
  const { darkMode } = useGameSettings();
  const [isModalOpen, setModalIsOpen] = useState(false);

  const toggleModal = () => {
    setModalIsOpen(!isModalOpen);
  };
  return (
    <Container darkMode={darkMode}>
      {children}
      {isModalOpen && <SettingsModal onRequestClose={toggleModal} />}
      <button
        className={styles.settingsButton}
        onClick={toggleModal}
        type="button"
      >
        <i className={styles.settingsIcon} />
      </button>
    </Container>
  );
};
