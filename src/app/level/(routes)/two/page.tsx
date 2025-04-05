import "server-only";
import { DefaultButton } from "@/shared/components/DefaultButton";
import { getRoute } from "@/utils";
import { Page } from "@/shared/components/Page/";

export default function page() {
  return (
    <Page title="Level two">
      <DefaultButton
        size="medium"
        href={`${getRoute(true, "start")}`}
        label="Recycle"
      />
    </Page>
  );
}
