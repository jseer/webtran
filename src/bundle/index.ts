import {
  Builder,
  BundleConfig,
  BundleItemConfig,
  BundlerType,
  RollupBundleConfig,
  RollupBundleItemConfig,
} from "../types";
import { defu } from "defu";
import { getPkgName } from "../utils/getPkgName";
import path from "path";

interface IBundleOpts {
  cwd: string;
  config: BundleConfig | BundleConfig[];
  pkg: Record<string, any>;
}

export function getBundle(opts: IBundleOpts): BundleItemConfig[] {
  let { config, cwd, pkg } = opts;
  config = Array.isArray(config) ? config : [config];
  return config.map((con) => normalizeConfig(con, pkg, cwd));
}

function normalizeConfig(
  config: BundleConfig,
  pkg: IBundleOpts["pkg"],
  cwd: IBundleOpts["cwd"]
) {
  if (!config.builder) {
    config.builder = Builder.rollup;
  }
  switch (config.builder) {
    case Builder.rollup:
      config = defu(config, {
        bundlerType: BundlerType.bundle,
        input: path.resolve(cwd, "src/index"),
        output: {
          format: "cjs",
          dir: path.resolve(cwd, "dist"),
        },
        plugins: {
          replace: {
            preventAssignment: true,
          },
          alias: {},
          resolve: {
            preferBuiltins: true,
            extensions: [".ts", ".mts", ".mjs", ".js", ".json", ".node"],
          },
          json: {
            preferConst: true,
          },
          commonjs: {
            ignoreTryCatch: true,
          },
          // dts: {
          //   compilerOptions: { preserveSymlinks: false },
          //   respectExternal: true,
          // },
          babel: {
            babelHelpers: "runtime",
            extensions: [".ts", ".tsx", ".js", ".jsx", ".es6", ".es", ".mjs"],
            plugins: [
              require("@babel/plugin-transform-runtime").default,
              require("@babel/plugin-transform-typescript").default,
            ],
          },
          // ts: { },
          terser: {},
        },
      }) as RollupBundleItemConfig;
  }
  return config as BundleItemConfig;
}
