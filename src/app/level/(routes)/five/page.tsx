import "server-only";

import { Page } from "@app/page-component";
import LevelFive from "../../_components/LevelFive";
import { Suspense } from "react";

export default function page() {
  return (
    <Page>
      <Suspense fallback={<div>Loading...</div>}>
        <LevelFive />
      </Suspense>
    </Page>
  );
}
