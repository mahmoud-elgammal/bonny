import { babel } from "@rollup/plugin-babel";
import commonjs from "@rollup/plugin-commonjs";
import json from "@rollup/plugin-json";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import { terser } from "rollup-plugin-terser";
import pkg from "./package.json";

const extensions = [".js", ".jsx", ".ts", ".tsx"];

const plugins = [
  json(),
  nodeResolve({ extensions }),
  commonjs(),
  babel({
    extensions,
  }),
  terser(),
];

export default [
  {
    input: "src/index.ts",
    external: [
      Object.keys(pkg.dependencies || {}),
      Object.keys(pkg.peerDependencies || {}),
    ].flat(),
    output: [
      {
        file: "dist/index.mjs",
        format: "esm",
      },
      {
        file: "dist/index.js",
        format: "cjs",
      },
    ],
    plugins,
  },
  {
    input: "src/index.ts",
    output: [
      {
        name: pkg.name,
        file: "dist/index.umd.js",
        format: "umd",
      },
    ],
    plugins,
  },
];
