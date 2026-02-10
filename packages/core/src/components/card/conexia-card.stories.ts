import { html } from "lit";
import type { Meta, StoryObj } from "@storybook/web-components";

import "./conexia-card";
import "../button/conexia-button";

const meta: Meta = {
  title: "Core/Card",
  component: "conexia-card",
  argTypes: {
    variant: { control: { type: "select" }, options: ["elevated", "outline"] },
    padding: { control: { type: "select" }, options: ["sm", "md", "lg"] }
  },
  args: {
    variant: "elevated",
    padding: "md"
  }
};

export default meta;

type Story = StoryObj;

export const Default: Story = {
  render: (args) => html`
    <conexia-card variant=${args.variant} padding=${args.padding}>
      <div slot="header">
        <strong>Resumen mensual</strong>
      </div>
      <div slot="body">
        <p>Este mes se procesaron 1,245 ordenes con un SLA del 98.2%.</p>
      </div>
      <div slot="footer">
        <conexia-button size="sm" variant="secondary">Ver detalle</conexia-button>
      </div>
    </conexia-card>
  `
};
