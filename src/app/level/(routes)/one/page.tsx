import { Page } from "@app/page-component";
import LevelOne from "./_components/LevelOne";
import "server-only";

export default function page() {
  return (
    <Page title="Level one">
      <LevelOne />
    </Page>
  );
}
