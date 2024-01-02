import { AsyncSeriesWaterfallHook } from "kooh";
import alias from "@rollup/plugin-alias";
import commonjs from "@rollup/plugin-commonjs";
import json from "@rollup/plugin-json";
import resolve from "@rollup/plugin-node-resolve";
import replace from "@rollup/plugin-replace";
import terser from "@rollup/plugin-terser";
import { dts } from "rollup-plugin-dts";
import babel from "@rollup/plugin-babel";
import ts from "@rollup/plugin-typescript";
import { OutputOptions, RollupOptions, rollup } from "rollup";
import { RollupBundleItemConfig } from "../../types";

export async function rollupBundle(options: RollupBundleItemConfig) {
  let rollupOptions = getRollupOptions(options);
  const hooks = {
    options: new AsyncSeriesWaterfallHook<RollupOptions>(),
  };
  if (options.hook) {
    options.hook(hooks);
  }
  rollupOptions = await hooks.options.call(rollupOptions);
  const bundle = await rollup(rollupOptions);
  await bundle.write(rollupOptions.output as OutputOptions);
}

function getRollupOptions(
  options: RollupBundleItemConfig
): RollupOptions {
  const plugins = options.plugins;
  const rollupOptions = {
    input: options.input,
    output: options.output,
    plugins: plugins
      ? [
          plugins.alias && alias(plugins.alias),
          plugins.resolve && resolve(plugins.resolve),
          plugins.json && json(plugins.json),
          plugins.commonjs && commonjs(plugins.commonjs),
          plugins.replace && replace(plugins.replace),
          plugins.terser && terser(plugins.terser),
          plugins.babel && babel(plugins.babel),
          plugins.ts && ts(plugins.ts),
          plugins.dts && dts(plugins.dts),
        ].filter(Boolean)
      : undefined,
  };
  return rollupOptions;
}
