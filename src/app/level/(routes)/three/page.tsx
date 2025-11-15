import "server-only";

import { Page } from "@app/page-component";

import { validateLevelAccess } from "../../_utils/checkLevelAccess";
import LevelThree from "../../_components/LevelThree";

export default async function page() {
  await validateLevelAccess("three");

  return (
    <Page>
      <LevelThree />
    </Page>
  );
}
