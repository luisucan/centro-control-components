import { html } from "lit";
import type { Meta, StoryObj } from "@storybook/web-components";

import "./conexia-input";

const meta: Meta = {
  title: "Core/Input",
  component: "conexia-input",
  argTypes: {
    size: { control: { type: "select" }, options: ["sm", "md", "lg"] },
    disabled: { control: "boolean" },
    invalid: { control: "boolean" }
  },
  args: {
    label: "Name",
    placeholder: "Write your name",
    value: "",
    size: "md",
    disabled: false,
    invalid: false,
    helperText: "Helper text"
  }
};

export default meta;

type Story = StoryObj;

export const Default: Story = {
  render: (args) => html`
    <conexia-input
      label=${args.label}
      placeholder=${args.placeholder}
      .value=${args.value}
      size=${args.size}
      ?disabled=${args.disabled}
      ?invalid=${args.invalid}
      helper-text=${args.helperText}
    ></conexia-input>
  `
};
