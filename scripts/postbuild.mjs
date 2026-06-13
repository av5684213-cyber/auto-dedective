import { cpSync, mkdirSync } from "fs";
import { join } from "path";

const standalone = join(process.cwd(), ".next/standalone");
const staticDir = join(process.cwd(), ".next/static");
const publicDir = join(process.cwd(), "public");

try {
  mkdirSync(join(standalone, ".next"), { recursive: true });
  cpSync(staticDir, join(standalone, ".next/static"), { recursive: true });
  cpSync(publicDir, join(standalone, "public"), { recursive: true });
  console.log("[postbuild] ✓ Static chunks kopyalandı");
  console.log("[postbuild] ✓ Public assets kopyalandı");
  console.log("[postbuild] Tamamlandı.");
} catch (e) {
  console.warn("[postbuild] Uyarı:", e.message);
}
