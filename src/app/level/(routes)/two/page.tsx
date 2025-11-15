import "server-only";

import { Page } from "@app/page-component";

import { validateLevelAccess } from "../../_utils/checkLevelAccess";
import LevelTwo from "../../_components/LevelTwo";

export default async function page() {
  await validateLevelAccess("two");

  return (
    <Page>
      <LevelTwo />
    </Page>
  );
}
