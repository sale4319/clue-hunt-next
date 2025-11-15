import "server-only";

import { Page } from "@app/page-component";

import LevelStart from "../../_components/LevelStart";
import { validateLevelAccess } from "../../_utils/checkLevelAccess";

type Props = {
  searchParams?: Promise<{ skip?: string; progress?: string }>;
};

export default async function page(props: Props) {
  const searchParams = await props.searchParams;
  const skip = searchParams?.skip === "true";
  const progress = searchParams?.progress === "true";
  await validateLevelAccess("start", skip, progress);

  return (
    <Page>
      <LevelStart />
    </Page>
  );
}
