import "server-only";

import { Page } from "@app/page-component:";

import LoginPage from "./_components/Login";

export default function page() {
  return (
    <Page>
      <LoginPage />
    </Page>
  );
}
