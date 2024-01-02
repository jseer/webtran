import commander from "commander";
import build, { type BuildOpts } from "./build";

const { program } = commander;

program
  .command("build")
  .description("build propject")
  .argument("[root]", "project path")
  .option("-c, --config [configFile]", "config file")
  .action((root: string, options: BuildOpts) => {
    build({
      root,
      configFile: options.configFile,
    });
  });

program.parse();
