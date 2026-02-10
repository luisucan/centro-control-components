import { html } from "lit";
import type { Meta, StoryObj } from "@storybook/web-components";

import "./conexia-button";

const meta: Meta = {
  title: "Core/Button",
  component: "conexia-button",
  argTypes: {
    onClick: { action: "click" },
    variant: {
      control: { type: "select" },
      options: ["primary", "secondary", "ghost"]
    },
    size: {
      control: { type: "select" },
      options: ["sm", "md", "lg"]
    },
    disabled: { control: "boolean" },
    loading: { control: "boolean" }
  },
  args: {
    variant: "primary",
    size: "md",
    disabled: false,
    loading: false
  }
};

export default meta;

type Story = StoryObj;

export const Default: Story = {
  render: (args) => html`
    <conexia-button
      variant=${args.variant}
      size=${args.size}
      ?disabled=${args.disabled}
      ?loading=${args.loading}
      @click=${args.onClick}
    >
      Conexia Button
    </conexia-button>
  `
};
