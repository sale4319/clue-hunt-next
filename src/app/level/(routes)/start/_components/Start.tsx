"use client";
import { useState } from "react";
import { QuizForm } from "distributed-ui";
import { DefaultButton } from "@/shared/components/DefaultButton";
import { getRoute } from "@/shared/utils";
import { questionSetOne } from "../../../../../../QuizSets";
import { Button } from "chn-ui";

export default function Start() {
  const [state, setstate] = useState(true);

  const handleState = () => {
    setstate(!state);
  };
  return (
    <>
      <Button label="Start" />
      <QuizForm questions={questionSetOne} handleUnlock={handleState} />

      <DefaultButton
        size="medium"
        href={`${getRoute(state, "start")}`}
        isLocked={state}
        primary={state}
      />
    </>
  );
}
