async function genTs() {
  function gen(names: string[]): string {
    const prelude = `
import {Bolt, Crate} from "https://deno.land/x/bolt@0.1.5/src/bolt.ts"

const ddirs: Crate = {
  name: "ddirs",
  repo: {
    url: "https://github.com/sigmaSd/ddirs2",
    relativePath: "./ddirsRust",
  },
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
