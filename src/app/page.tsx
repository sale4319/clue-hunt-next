import "server-only";
import Start from "@/shared/levels/Start/Start";

import { Page } from "@/shared/components/Page";

export default function Home() {
  return (
    <Page title="Start">
      <Start />
    </Page>
  );
}
