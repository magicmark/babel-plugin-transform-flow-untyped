const babel = require("babel-core");

const transform = babel.transformFileSync("examples/example1.js", {
  parserOpts: {
    plugins: ["flow"]
  },
  babelrc: false,
  plugins: ["../lib/index"]
});

console.log(transform.code);
