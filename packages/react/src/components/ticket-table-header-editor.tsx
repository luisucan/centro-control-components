import * as React from "react";
import { createComponent } from "@lit/react";
import { ConexiaTicketTableHeaderEditor as ConexiaTicketTableHeaderEditorElement } from "@luisvillafania/core";

export const ConexiaTicketTableHeaderEditor = createComponent({
  react: React,
  tagName: "conexia-ticket-table-header-editor",
  elementClass: ConexiaTicketTableHeaderEditorElement,
  events: {
    onChange: "change"
  }
});
