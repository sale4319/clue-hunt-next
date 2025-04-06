import "server-only";
import { DefaultButton } from "src/shared/components/default-button/src";
import { Page } from "@app/page-component";
import { getRoute } from "@app/utils";

export default function page() {
  return (
    <Page>
      <DefaultButton
        size="medium"
        href={`${getRoute("level", "start")}`}
        mode="raise"
        label="Recycle"
      />
    </Page>
  );
}
