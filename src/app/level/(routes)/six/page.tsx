import "server-only";

import { Page } from "@app/page-component";

import { validateLevelAccess } from "../../_utils/checkLevelAccess";
import LevelSix from "../../_components/LevelSix";

export default async function page() {
  await validateLevelAccess("six");

  return (
    <Page>
      <LevelSix />
    </Page>
  );
}
