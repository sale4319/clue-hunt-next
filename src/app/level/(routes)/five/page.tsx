import "server-only";

import { Suspense } from "react";

import { Page } from "@app/page-component";

import { validateLevelAccess } from "../../_utils/checkLevelAccess";
import LevelFive from "../../_components/LevelFive";

export default async function page() {
  await validateLevelAccess("five");

  return (
    <Page>
      <Suspense fallback={<div>Loading...</div>}>
        <LevelFive />
      </Suspense>
    </Page>
  );
}
