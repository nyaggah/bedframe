import type { AnyCase, PackageManager } from "@bedframe/core";
import { execa } from "execa";

function resolveDegitCommand(packageManager: AnyCase<PackageManager> = "npm"): {
  command: string;
  args: string[];
} {
  const pm = packageManager.toLowerCase();

  switch (pm) {
    case "yarn":
      return {
        command: "yarn",
        args: ["dlx", "degit"],
      };
    case "bun":
      return {
        command: "bunx",
        args: ["degit"],
      };
    case "npm":
      return {
        command: "npx",
        args: ["degit"],
      };
    case "pnpm":
      return {
        command: "pnpm",
        args: ["dlx", "degit"],
      };
    default:
      throw new Error(`Unknown package manager: ${pm}`);
  }
}

export async function runDegit(
  repo: string,
  destination: string,
  packageManager: AnyCase<PackageManager> = "npm",
): Promise<string> {
  const { command, args } = resolveDegitCommand(packageManager);
  const { stdout } = await execa(command, [...args, repo, destination]);
  return stdout;
}
