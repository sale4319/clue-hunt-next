import { getRoute } from "@/utils";
import Link from "next/link";

export default function page() {
  return (
    <div>
      Level one <Link href={`${getRoute(false, "one")}`}>Continue</Link>
    </div>
  );
}
