import "server-only";
import { DefaultButton } from "@app/default-button";
import { Page } from "@app/page-component";
import { getRoute } from "@app/utils";

export default function page() {
  return (
    <Page title="Level two">
      <DefaultButton
        size="medium"
        href={`${getRoute(true, "start")}`}
        mode="raise"
        label="Recycle"
      />
    </Page>
  );
}
