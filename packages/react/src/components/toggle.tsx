import * as React from "react";
import { createComponent } from "@lit/react";
import { ConexiaToggle as ConexiaToggleElement } from "@luisvillafania/core";

export const ConexiaToggle = createComponent({
  react: React,
  tagName: "conexia-toggle",
  elementClass: ConexiaToggleElement,
  events: {
    onChange: "change"
  }
});
