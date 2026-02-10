import { html } from "lit";
import type { Meta, StoryObj } from "@storybook/web-components";

import "./conexia-table";

const meta: Meta = {
  title: "Core/Table",
  component: "conexia-table",
  argTypes: {
    density: { control: { type: "select" }, options: ["compact", "regular"] },
    striped: { control: "boolean" },
    bordered: { control: "boolean" },
    stickyHeader: { control: "boolean" }
  },
  args: {
    density: "regular",
    striped: true,
    bordered: false,
    stickyHeader: false
  }
};

export default meta;

type Story = StoryObj;

export const Default: Story = {
  render: (args) => html`
    <conexia-table
      density=${args.density}
      ?striped=${args.striped}
      ?bordered=${args.bordered}
      ?sticky-header=${args.stickyHeader}
    >
      <caption slot="caption">Resumen de facturacion</caption>
      <thead slot="header">
        <tr>
          <th>Cliente</th>
          <th>Plan</th>
          <th>Monto</th>
        </tr>
      </thead>
      <tbody slot="body">
        <tr>
          <td>Clinica Norte</td>
          <td>Premium</td>
          <td>$12,400</td>
        </tr>
        <tr>
          <td>IPS Central</td>
          <td>Standard</td>
          <td>$6,750</td>
        </tr>
        <tr>
          <td>Hospital Sur</td>
          <td>Premium</td>
          <td>$9,280</td>
        </tr>
      </tbody>
    </conexia-table>
  `
};
