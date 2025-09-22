const input = `import { Button as MyButton, BackTop } from "antd";
import { merge } from "lodash";`;
const output = `import MyButton from "antd/lib/button";
import "antd/lib/button/style";
import BackTop from "antd/lib/back-top";
import "antd/lib/back-top/style";
import merge from "lodash/merge";`;

import { transform } from "@swc/core";

transform(input, {
  filename: "test.mjs",
  jsc: {
    experimental: {
      plugins: [
        [
          "./transform_imports.wasm",
          {
            antd: {
              transform: "antd/lib/${member}",
              skipDefaultConversion: false,
              preventFullImport: true,
              style: "antd/lib/${member}/style",
              memberTransformers: ["dashed_case"],
            },
            lodash: {
              transform: "lodash/${member}",
              preventFullImport: true,
            },
          },
        ],
      ],
    },
  },
})
  .then(({ code }) => {
    if (code?.trim() === output.trim()) {
      console.log("Test passed!");
    } else {
      console.log("Expected Output:\n", output);
      console.log("Actual Output:\n", code);
      throw new Error("Test failed: Output did not match expected output");
    }
  })
  .catch((err) => {
    throw err;
  });
