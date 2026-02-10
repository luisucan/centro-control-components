import type { Preview } from "@storybook/web-components";

import "../packages/core/src/styles/tokens.css";

const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: "^on[A-Z].*" },
    controls: { expanded: true },
    layout: "centered",
    backgrounds: {
      default: "paper",
      values: [
        { name: "paper", value: "#ffffff" },
        { name: "soft", value: "#f8fafc" }
      ]
    }
  }
};

export default preview;
