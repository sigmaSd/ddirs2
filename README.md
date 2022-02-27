# Ddirs
Deno wrapper over https://github.com/dirs-dev/dirs-rs

# Usage
```ts
import * as dirs from "https://github.com/sigmaSd/ddirs2/raw/master/ddirs.ts"

console.log(dirs.config_dir())
```

# Devolpement
To develop this library locally:
- Generate `ddirs.ts` by running `deno run -A build.ts`
- Set "BOLT" enviorenent variable to "dev", this allows changes to the local `ddirsRust` crate to be reflected
- Run the example `deno run -A --unstable example/main.ts` and start developping
