import "server-only";

import { Page } from "@app/page-component";

import LevelThree from "../../_components/LevelThree";
import { validateLevelAccess } from "../../_utils/checkLevelAccess";

type Props = {
  searchParams?: Promise<{ skip?: string; progress?: string }>;
};

export default async function page(props: Props) {
  const searchParams = await props.searchParams;
  const skip = searchParams?.skip === "true";
  const progress = searchParams?.progress === "true";
  await validateLevelAccess("three", skip, progress);

  return (
    <Page>
      <LevelThree />
    </Page>
  );
}
