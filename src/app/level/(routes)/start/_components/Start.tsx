"use client";
import { useState } from "react";
import { DefaultButton } from "@app/default-button";
import { getRoute } from "@app/utils";

export default function Start() {
  const [state, setstate] = useState(true);

  const handleState = () => {
    setstate(!state);
  };
  return (
    <>
      <DefaultButton
        size="medium"
        href={""}
        label="Unlock"
        mode="pulse"
        onClick={handleState}
      />
      <DefaultButton
        size="medium"
        href={`${getRoute(state, "start")}`}
        isLocked={state}
        primary={state}
      />
    </>
  );
}
