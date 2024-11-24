"use client";
import React, { useState } from "react";
import { DefaultButton } from "@/shared/components/DefaultButton";
import { getRoute } from "@/utils";

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
        onClick={handleState}
      />
      <DefaultButton
        size="medium"
        href={`${getRoute(state, "start")}`}
        label="Continue"
        primary={state}
      />
    </>
  );
}
