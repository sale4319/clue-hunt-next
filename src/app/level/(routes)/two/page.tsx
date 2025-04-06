import "server-only";
import { Button } from "clue-hunt-ui";
import { Page } from "@app/page-component";
import { getRoute } from "@app/utils";

export default function page() {
  return (
    <Page>
      <Button
        size="medium"
        href={`${getRoute("level", "start")}`}
        mode="raise"
        label="Recycle"
      />
    </Page>
  );
}
