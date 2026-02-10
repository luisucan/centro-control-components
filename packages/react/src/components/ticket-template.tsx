import * as React from "react";
import { createComponent } from "@lit/react";
import { ConexiaTicketTemplate as ConexiaTicketTemplateElement } from "@luisvillafania/core";

export const ConexiaTicketTemplate = createComponent({
  react: React,
  tagName: "conexia-ticket-template",
  elementClass: ConexiaTicketTemplateElement,
  events: {
    onContentChange: "contentChange",
    onContentSubmit: "contentSubmit"
  }
});
