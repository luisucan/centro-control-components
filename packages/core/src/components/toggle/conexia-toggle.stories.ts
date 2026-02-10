import { html } from "lit";
import type { Meta, StoryObj } from "@storybook/web-components";

import "./conexia-toggle";

const meta: Meta = {
  title: "Core/Toggle",
  component: "conexia-toggle",
  argTypes: {
    checked: { control: "boolean" },
    disabled: { control: "boolean" }
  },
  args: {
    label: "Enable feature",
    checked: false,
    disabled: false
  }
};

export default meta;

type Story = StoryObj;

export const Default: Story = {
  render: (args) => html`
    <conexia-toggle label=${args.label} ?checked=${args.checked} ?disabled=${args.disabled}>
    </conexia-toggle>
  `
};
