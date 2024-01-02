import { DEFAULT_CONFIG_FILES } from "./utils/constants";
import { App as AppCore, AppOpts as AppCoreOpts } from "@zfast/core";
import { IConfig } from "./types";

export class App extends AppCore {
  config!: IConfig;
  constructor(props: Omit<AppCoreOpts, "name">) {
    super({
      ...props,
      name: "webtran",
      defaultConfigFiles: DEFAULT_CONFIG_FILES,
    });
  }
}
