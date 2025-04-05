import "server-only";
import LevelOne from "@/shared/levels/LevelOne/LevelOne";
import { Page } from "@/shared/components/Page";

export default function page() {
  return (
    <Page title="Level one">
      <LevelOne />
    </Page>
  );
}
