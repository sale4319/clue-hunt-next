"use client";

import { useState } from "react";
import { Container } from "clue-hunt-ui";
import { SettingsModal } from "@app/settings-menu";
import styles from "./ContentWrapper.module.css";

type ContentWrapperProps = {
  children: React.ReactNode;
  theme: string | undefined;
};

export const ContentWrapper = ({ children, theme }: ContentWrapperProps) => {
  const [isModalOpen, setModalIsOpen] = useState(false);

  const toggleModal = () => {
    setModalIsOpen(!isModalOpen);
  };
  return (
    <Container theme={theme}>
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
