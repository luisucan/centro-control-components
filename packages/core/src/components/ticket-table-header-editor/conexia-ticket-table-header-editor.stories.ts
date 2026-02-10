import { html } from "lit";
import type { Meta, StoryObj } from "@storybook/web-components";

import "./conexia-ticket-table-header-editor";

const meta: Meta = {
  title: "Core/Ticket Table Header",
  component: "conexia-ticket-table-header-editor"
};

export default meta;

type Story = StoryObj;

export const Default: Story = {
  render: () => html`
    <conexia-ticket-table-header-editor
      .header=${[
        { text: "Producto", align: "left" },
        { text: "Cant", align: "center" },
        { text: "Precio", align: "right" }
      ]}
      .headerBold=${true}
      .columnWidths=${[60, 20, 20]}
    ></conexia-ticket-table-header-editor>
  `
};
