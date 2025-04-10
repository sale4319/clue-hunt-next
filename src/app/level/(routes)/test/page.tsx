import { cookies } from "next/headers";
import {
  deleteThemeCookie,
  setThemeCookie,
  toggleThemeCookie,
} from "@app/actions";

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
      <form action={deleteThemeCookie}>
        <button
          type="submit"
          className="bg-red-200 text-gray-600 px-4 py-3 rounded-lg hover:bg-red-400 duration-75 ease-in-out transition-all border-red-700 border disabled:bg-red-50 disabled:cursor-not-allowed"
          disabled={!theme?.value}
        >
          Delete Cookie
        </button>
      </form>
    </main>
  );
}
