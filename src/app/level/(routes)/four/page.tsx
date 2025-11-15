import "server-only";

import { Page } from "@app/page-component";

import LevelFour from "../../_components/LevelFour";
import { validateLevelAccess } from "../../_utils/checkLevelAccess";

type Props = {
  searchParams?: Promise<{ skip?: string; progress?: string }>;
};

export default async function page(props: Props) {
  const searchParams = await props.searchParams;
  const skip = searchParams?.skip === "true";
  const progress = searchParams?.progress === "true";
  await validateLevelAccess("four", skip, progress);

  return (
    <Page>
      <LevelFour />
    </Page>
  );
}
