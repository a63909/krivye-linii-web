import { readFile, writeFile } from "node:fs/promises";

const file = new URL("../config/site-operator.json", import.meta.url);
const [action, ...args] = process.argv.slice(2);
if (!["show", "hide"].includes(action) || args.length > 1) {
  throw new Error('Usage: node scripts/set-site-operator.mjs show ["Name"] | hide');
}
if (action === "hide" && args.length) throw new Error("hide does not take a name");

const profile = JSON.parse(await readFile(file, "utf8"));
if (args.length) {
  const name = args[0].trim();
  if (!name) throw new Error("The operator name must not be empty");
  // A different operator must never inherit someone else's identifiers.
  if (name !== profile.name) {
    profile.taxId = null;
    profile.address = null;
    profile.serviceArea = null;
  }
  profile.name = name;
}
if (action === "show" && !profile.name?.trim()) {
  throw new Error("Set the operator name before publishing");
}
profile.published = action === "show";
await writeFile(file, `${JSON.stringify(profile, null, 2)}\n`, "utf8");
console.log(profile.published ? `Operator enabled: ${profile.name}` : "Operator details hidden");
