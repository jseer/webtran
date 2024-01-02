import { App } from "./app";
import { BaseOpts, Builder, BundleConfig, BundleItemConfig, BundlerType } from "./types";
import { getBundle } from "./bundle";
import { rollupBundle } from "./bundle/rollup";

export interface BuildOpts extends BaseOpts {}

export default async function build(opts: BuildOpts) {
  const app = await new App({
    cwd: opts.root,
    configFile: opts.configFile,
    command: "build",
  }).run();
  const { config, cwd, pkg } = app;
  const buildList: BundleItemConfig [] = [];
  if (config.bundle) {
    buildList.push(
      ...(await getBundle({
        cwd,
        pkg,
        config: config.bundle,
      }))
    );
  }
  if (buildList.length) {
    await Promise.all(
      buildList.map((config) => {
        if (config.bundlerType === BundlerType.bundle) {
          switch (config.builder) {
            case Builder.rollup:
              return rollupBundle(config);
            default:
              break;
          }
        }
      })
    );
  }
}
