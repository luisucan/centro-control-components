import * as React from "react";
import { createComponent } from "@lit/react";
import { ConexiaTicketImageBlock as ConexiaTicketImageBlockElement } from "@conexia/core";

export const ConexiaTicketImageBlock = createComponent({
  react: React,
  tagName: "conexia-ticket-image-block",
  elementClass: ConexiaTicketImageBlockElement,
  events: {
    onChange: "change"
  }
});
