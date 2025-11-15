import "server-only";

import { Page } from "@app/page-component";

import { validateLevelAccess } from "../../_utils/checkLevelAccess";
import LevelStart from "../../_components/LevelStart";

export default async function page() {
  await validateLevelAccess("start");

  return (
    <Page>
      <LevelStart />
    </Page>
  );
}
