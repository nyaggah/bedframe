import path from "node:path";
import { promises as fs } from "node:fs";
import type { AnyCase, PackageManager } from "@bedframe/core";
import { runDegit } from "./degit";
import { ensureDir } from "./utils.fs";

/**
 *
 * Degit assets directory
 * removing assets (icons, fonts, etc) from cli
 * to reduce package size
 *
 * @export
 * @param {string} projectPath
 * @param {AnyCase<PackageManager>} [packageManager='npm']
 */
export async function getAssetsDir(
  projectPath: string,
  packageManager: AnyCase<PackageManager> = "npm",
) {
  const srcDir = path.join(projectPath, "src");
  const assetsDir = path.join(projectPath, "src", "assets");
  const tempAssetsDir = path.join(projectPath, ".bedframe-assets");
  await ensureDir(srcDir);
  await ensureDir(assetsDir);
  const repo = "https://github.com/nyaggah/bedframe/assets";
  const dest = tempAssetsDir;

  try {
    const stdout = await runDegit(repo, dest, packageManager);
    console.log(stdout);
    await ensureDir(path.join(assetsDir, "icons"));
    await fs.cp(path.join(tempAssetsDir, "icons"), path.join(assetsDir, "icons"), {
      recursive: true,
      force: true,
    });
    await fs.rm(tempAssetsDir, { recursive: true, force: true });
    // biome-ignore lint:  @typescript-eslint/no-explicit-any
  } catch (error: any) {
    await fs.rm(tempAssetsDir, { recursive: true, force: true });
    throw new Error(`Failed to run degit command: ${error.message}`);
  }
}
