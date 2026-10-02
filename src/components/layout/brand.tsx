import Link from "next/link";
import { Layers3 } from "lucide-react";

export function Brand() {
  return (
    <Link
      aria-label="Aikitr 起步模板首页"
      className="inline-flex items-center gap-2.5 font-semibold tracking-tight"
      href="/"
    >
      <span className="bg-primary text-primary-foreground grid size-8 place-items-center rounded-xl">
        <Layers3 aria-hidden="true" className="size-4" />
      </span>
      <span>Aikitr</span>
    </Link>
  );
}
