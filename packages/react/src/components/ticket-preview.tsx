import * as React from "react";
import { createComponent } from "@lit/react";
import { ConexiaTicketPreview as ConexiaTicketPreviewElement } from "@luisvillafania/core";

export const ConexiaTicketPreview = createComponent({
  react: React,
  tagName: "conexia-ticket-preview",
  elementClass: ConexiaTicketPreviewElement
});
