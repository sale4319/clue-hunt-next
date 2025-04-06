import Start from "./_components/Start";
import "server-only";

import { Page } from "@/shared/components/Page";

export default function Home() {
  return (
    <Page title="Start">
      <Start />
    </Page>
  );
}
