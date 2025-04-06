import "server-only";
import { Button } from "clue-hunt-ui";
import { Page } from "@app/page-component";
import { getRoute } from "@app/utils";

export default function page() {
  return (
    <Page title="Level two">
      <Button
        size="medium"
        href={`${getRoute(false, "level", "start")}`}
        mode="raise"
        label="Recycle"
      />
    </Page>
  );
}
