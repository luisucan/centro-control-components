import { html } from "lit";
import type { Meta, StoryObj } from "@storybook/web-components";

import "./conexia-ticket-text-block";

const meta: Meta = {
  title: "Core/Ticket Text Block",
  component: "conexia-ticket-text-block"
};

export default meta;

type Story = StoryObj;

export const Default: Story = {
  render: () => html`
    <conexia-ticket-text-block
      .value=${{
        text: "Tienda La Abejita Feliz",
        align: "center",
        bold: false,
        size: { width: 1, height: 1 }
      }}
    ></conexia-ticket-text-block>
  `
};
