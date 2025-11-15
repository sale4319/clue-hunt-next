import "server-only";

import { Page } from "@app/page-component";

import LevelSix from "../../_components/LevelSix";
import { validateLevelAccess } from "../../_utils/checkLevelAccess";

type Props = {
  searchParams?: Promise<{ skip?: string; progress?: string }>;
};

export default async function page(props: Props) {
  const searchParams = await props.searchParams;
  const skip = searchParams?.skip === "true";
  const progress = searchParams?.progress === "true";
  await validateLevelAccess("six", skip, progress);

  return (
    <Page>
      <LevelSix />
    </Page>
  );
}
