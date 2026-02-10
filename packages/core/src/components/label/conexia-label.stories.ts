import { html } from "lit";
import type { Meta, StoryObj } from "@storybook/web-components";

import "./conexia-label";

const meta: Meta = {
  title: "Core/Label",
  component: "conexia-label",
  argTypes: {
    size: { control: { type: "select" }, options: ["sm", "md", "lg"] },
    tone: { control: { type: "select" }, options: ["default", "muted", "danger"] },
    required: { control: "boolean" }
  },
  args: {
    size: "md",
    tone: "default",
    required: false
  }
};

export default meta;

type Story = StoryObj;

export const Default: Story = {
  render: (args) => html`
    <conexia-label size=${args.size} tone=${args.tone} ?required=${args.required}>
      Nombre
    </conexia-label>
  `
};
