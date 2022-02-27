async function genTs() {
  function gen(names: string[]): string {
    const prelude = `
import {Bolt, Crate} from "https://raw.githubusercontent.com/sigmaSd/Bolt/master/src/bolt.ts"

const ddirs: Crate = {
  name: "ddirs",
  url: "https://github.com/sigmaSd/ddirs2",
  path: "./ddirsRust",
};
const bolt = new Bolt([ddirs]);
await bolt.init();

const libDdirs = bolt.getLib(ddirs.name);
    `;
    const fns = names.map((name) => `
export function ${name}(): string | undefined {
  const dylib = Deno.dlopen(libDdirs, {
    "${name}": { parameters: [], result: "pointer" },
  });
  const maybeResult = dylib.symbols.${name}();
  if (maybeResult.valueOf() !== 0n) {
    const result = new Deno.UnsafePointerView(maybeResult);
    return result.getCString();
  } else {
    return undefined;
  }
}
`).join("\n");
    return prelude + fns;
  }
  const code = gen([
    "audio_dir",
    "cache_dir",
    "config_dir",
    "data_dir",
    "data_local_dir",
    "desktop_dir",
    "document_dir",
    "download_dir",
    "executable_dir",
    "font_dir",
    "home_dir",
    "picture_dir",
    "preference_dir",
    "public_dir",
    "runtime_dir",
    "state_dir",
    "template_dir",
    "video_dir",
  ]);
  await Deno.writeTextFile("./ddirs.ts", code);
  await Deno.run({
    cmd: ["deno", "fmt", "./ddirs.ts"],
  }).status();
}
await genTs();
