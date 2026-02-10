import { html } from "lit";
import type { Meta, StoryObj } from "@storybook/web-components";

import "./conexia-ticket-qr-block";

const meta: Meta = {
  title: "Core/Ticket QR Block",
  component: "conexia-ticket-qr-block"
};

export default meta;

type Story = StoryObj;

export const Default: Story = {
  render: () => html`
    <conexia-ticket-qr-block
      .value=${{ qrContent: "https://example.com/qr-code" }}
    ></conexia-ticket-qr-block>
  `
};
