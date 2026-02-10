import * as React from "react";
import { createComponent } from "@lit/react";
import { ConexiaTicketTextBlock as ConexiaTicketTextBlockElement } from "@conexia/core";

export const ConexiaTicketTextBlock = createComponent({
  react: React,
  tagName: "conexia-ticket-text-block",
  elementClass: ConexiaTicketTextBlockElement,
  events: {
    onChange: "change"
  }
});
