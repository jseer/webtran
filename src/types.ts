import { Options as TerserOptions } from "@rollup/plugin-terser";
import { IPlugin } from "@zfast/core";
import { App } from "./app";
import { Hook } from "kooh";
import type { RollupReplaceOptions } from "@rollup/plugin-replace";
import type { RollupAliasOptions } from "@rollup/plugin-alias";
import type { RollupNodeResolveOptions } from "@rollup/plugin-node-resolve";
import type { RollupJsonOptions } from "@rollup/plugin-json";
import type { Options as RollupDtsOptions } from "rollup-plugin-dts";
import type { RollupTypescriptPluginOptions } from "@rollup/plugin-typescript";
import { RollupBabelInputPluginOptions } from "@rollup/plugin-babel";
import type commonjs from "@rollup/plugin-commonjs";
import {
  InputOption,
  OutputOptions,
  RollupOptions,
} from "rollup";
import { AsyncSeriesWaterfallHook } from "kooh";

export type RollupCommonJSOptions = Parameters<typeof commonjs>[0] & {};

export interface BaseOpts {
  root?: string;
  configFile?: string;
}

export interface BaseBuildItem {
  builder: Builder;
  bundlerType: BundlerType;
  cwd?: string;
}

export interface BaseBuildConfig {
  builder: Builder;
}

export interface IBuildPluginHook<H extends { [key: string]: Hook }> {
  (hooks: H): Promise<void> | void;
}

export interface RollupBundleConfig extends Omit<BaseBuildConfig, "builder"> {
  builder?: Builder.rollup;
  input?: InputOption;
  output?: OutputOptions | OutputOptions[];
  plugins?: RollupBuiltInPlugins;
  hook?: IBuildPluginHook<{ options: AsyncSeriesWaterfallHook<RollupOptions> }>;
}

export interface RollupBundleItemConfig
  extends Required<Omit<BaseBuildItem & RollupBundleConfig, "builder">> {
  builder: Builder.rollup;
}

export type BundleConfig = RollupBundleConfig;
export type BundleItemConfig = RollupBundleItemConfig;

export interface IConfig {
  plugins?: IPlugin<App>[];
  bundle?: BundleConfig | BundleConfig[];
}

export interface RollupBuiltInPlugins {
  replace?: RollupReplaceOptions | false;
  alias?: RollupAliasOptions | false;
  resolve?: RollupNodeResolveOptions | false;
  json?: RollupJsonOptions | false;
  commonjs?: RollupCommonJSOptions | false;
  dts?: RollupDtsOptions | false;
  babel?: RollupBabelInputPluginOptions | false;
  terser?: TerserOptions | false;
  ts?: RollupTypescriptPluginOptions | false;
}

export enum Format {
  umd = "umd",
  cjs = "cjs",
  esm = "esm",
}

export enum Builder {
  webpack = "webpack",
  rollup = "rollup",
  esbuild = "esbuild",
  swc = "swc",
}

export enum BundlerType {
  bundle = "bundle",
  bundless = "bundless",
}
