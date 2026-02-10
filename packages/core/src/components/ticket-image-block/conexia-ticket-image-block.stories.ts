import { html } from "lit";
import type { Meta, StoryObj } from "@storybook/web-components";

import "./conexia-ticket-image-block";

const meta: Meta = {
  title: "Core/Ticket Image Block",
  component: "conexia-ticket-image-block"
};

export default meta;

type Story = StoryObj;

export const Default: Story = {
  render: () => html`
    <conexia-ticket-image-block
      .value=${{ src: "./src/assets/img/logo_empresa.png" }}
    ></conexia-ticket-image-block>
  `
};
