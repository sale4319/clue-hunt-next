import "server-only";
import { Page } from "@app/page-component";
import LevelOne from "./_components/LevelOne";

export default function page() {
  return (
    <Page title="Level one">
      <LevelOne />
    </Page>
  );
}
