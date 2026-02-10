import { html } from "lit";
import type { Meta, StoryObj } from "@storybook/web-components";

import "./conexia-select";

const meta: Meta = {
  title: "Core/Select",
  component: "conexia-select",
  argTypes: {
    onChange: { action: "change" },
    size: { control: { type: "select" }, options: ["sm", "md", "lg"] },
    multiple: { control: "boolean" },
    disabled: { control: "boolean" },
    invalid: { control: "boolean" }
  },
  args: {
    label: "Ciudad",
    placeholder: "Selecciona una ciudad",
    size: "md",
    multiple: false,
    disabled: false,
    invalid: false,
    helperText: "Usa el selector para elegir una opcion"
  }
};

export default meta;

type Story = StoryObj;

export const Default: Story = {
  render: (args) => html`
    <conexia-select
      label=${args.label}
      placeholder=${args.placeholder}
      size=${args.size}
      ?multiple=${args.multiple}
      ?disabled=${args.disabled}
      ?invalid=${args.invalid}
      helper-text=${args.helperText}
      @change=${args.onChange}
    >
      <option value="bogota">Bogota</option>
      <option value="medellin">Medellin</option>
      <option value="cali">Cali</option>
      <option value="barranquilla">Barranquilla</option>
    </conexia-select>
  `
};
