import program from "commander";

import { deriveAddress } from "./actions/deriveAddress";

program
  .command("derive")
  .option("--address <addr>", "The address that you're deriving from.", "")
  .option("--index <num>", "The indesx of the derived account (default 0).", "0")
  .option("--ss58Prefix <num>", "The prefix for the network to use for encoding.", "0")
  .action(deriveAddress);

program.parse(process.argv);
