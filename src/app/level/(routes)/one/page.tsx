import "server-only";
import LevelOne from "./_components/LevelOne";
import { Page } from "@/shared/components/Page";

export default function page() {
  return (
    <Page title="Level one">
      <LevelOne />
    </Page>
  );
}
