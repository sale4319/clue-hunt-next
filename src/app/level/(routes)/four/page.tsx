import "server-only";

import { Page } from "@app/page-component";

import { validateLevelAccess } from "../../_utils/checkLevelAccess";
import LevelFour from "../../_components/LevelFour";

export default async function page() {
  await validateLevelAccess("four");

  return (
    <Page>
      <LevelFour />
    </Page>
  );
}
