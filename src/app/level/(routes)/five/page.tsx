import "server-only";

import { Suspense } from "react";

import { Page } from "@app/page-component";

import LevelFive from "../../_components/LevelFive";

export default function page() {
  return (
    <Page>
      <Suspense fallback={<div>Loading...</div>}>
        <LevelFive />
      </Suspense>
    </Page>
  );
}
