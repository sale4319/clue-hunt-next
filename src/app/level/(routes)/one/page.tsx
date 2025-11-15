import "server-only";

import { Page } from "@app/page-component";

import { validateLevelAccess } from "../../_utils/checkLevelAccess";
import LevelOne from "../../_components/LevelOne";

export default async function page() {
  await validateLevelAccess("one");

  return (
    <Page>
      <LevelOne />
    </Page>
  );
}
