import * as React from "react";
import { createComponent } from "@lit/react";
import { ConexiaTicketQrBlock as ConexiaTicketQrBlockElement } from "@conexia/core";

export const ConexiaTicketQrBlock = createComponent({
  react: React,
  tagName: "conexia-ticket-qr-block",
  elementClass: ConexiaTicketQrBlockElement,
  events: {
    onChange: "change"
  }
});
