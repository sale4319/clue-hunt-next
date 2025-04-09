import { cookies } from "next/headers";
import { setThemeCookie, toggleThemeCookie } from "@app/actions";

import { SubmitButton } from "clue-hunt-ui";

export default async function App() {
  const theme = (await cookies()).get("theme");
  return (
    <main>
      <h1>Theme Switcher</h1>
      {theme?.value ? (
        <p>
          Current cookie value: <span>{theme?.value}</span>
        </p>
      ) : (
        <p>No theme cookie detected</p>
      )}
      <div>
        <button onClick={toggleThemeCookie}>Click me</button>
        {["Light", "Dark"].map((themeName) => (
          <form action={setThemeCookie} key={themeName}>
            <input
              hidden
              name="theme"
              value={themeName.toLowerCase()}
              readOnly
            />
            <SubmitButton
              submit
              disabled={theme?.value === themeName.toLowerCase()}
              label={themeName}
            />
          </form>
        ))}
      </div>
    </main>
  );
}
