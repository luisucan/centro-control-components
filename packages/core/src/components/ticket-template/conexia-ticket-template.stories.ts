import { html } from "lit";
import type { Meta, StoryObj } from "@storybook/web-components";

import "./conexia-ticket-template";

const sampleContent = [
  { src: "./src/assets/img/logo_empresa.png" },
  { text: "Tienda La Abejita Feliz", align: "center" },
  { cut: true },
  { openDrawer: true },
  { text: "RFC: ABCD800101XYZ", align: "center" },
  { text: "Calle: conocido", align: "center" },
  { text: "Tel: 9991107140", align: "center" },
  { charLine: "=" },
  { charLine: "*" },
  {
    header: [
      { text: "Producto", align: "left" },
      { text: "Cant", align: "center" },
      { text: "Precio", align: "right" }
    ],
    headerBold: true,
    columnWidths: [60, 20, 20],
    lineChar: "-",
    rowSpacing: 1,
    footerLine: true,
    rows: [
      [
        { text: "Coca-Cola 500ml", align: "left" },
        { text: "2", align: "center" },
        { text: "$20.00", align: "right" }
      ],
      [
        { text: "Pan dulce", align: "left" },
        { text: "3", align: "center" },
        { text: "$15.00", align: "right" }
      ],
      [
        { text: "Cafe con leche", align: "left" },
        { text: "1", align: "center" },
        { text: "$10.00", align: "right" }
      ]
    ]
  },
  { qrContent: "https://example.com/qr-code" }
];

const meta: Meta = {
  title: "Core/Ticket Template",
  component: "conexia-ticket-template"
};

export default meta;

type Story = StoryObj;

export const Empty: Story = {
  render: () => html`<conexia-ticket-template></conexia-ticket-template>`
};

export const WithSample: Story = {
  render: () => html`
    <conexia-ticket-template .value=${sampleContent}></conexia-ticket-template>
  `
};
