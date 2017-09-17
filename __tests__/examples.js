import fs from "mz/fs";
import { format } from "prettier";
import path from "path";
import { transformFileSync } from "babel-core";

it("examples pass tests", async () => {
  const exampleFileNames = fs
    .readdirSync(path.join(__dirname, "..", "./examples"))
    .filter(f => f.endsWith(".js"));

  for (let fileName of exampleFileNames) {
    const transform = transformFileSync(
      path.join(__dirname, "..", "examples", fileName),
      {
        parserOpts: {
          plugins: ["flow"]
        },
        babelrc: false,
        plugins: ["../lib/index"]
      }
    );

    const output = format(transform.code);
    expect(output).toMatchSnapshot();
  }
});
