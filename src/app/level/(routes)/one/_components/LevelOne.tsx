"use client";
import { DefaultButton } from "@/shared/components/DefaultButton/src";
import { getRoute } from "@/shared/utils";
import React, { useState } from "react";

export default function LevelOne() {
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
        href={`${getRoute(state, "one")}`}
        isLocked={state}
        primary={state}
      />
    </>
  );
}
