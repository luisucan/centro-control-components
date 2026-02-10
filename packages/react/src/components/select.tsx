import * as React from "react";
import { createComponent } from "@lit/react";
import { ConexiaSelect as ConexiaSelectElement } from "@conexia/core";

export const ConexiaSelect = createComponent({
  react: React,
  tagName: "conexia-select",
  elementClass: ConexiaSelectElement,
  events: {
    onChange: "change",
    onInput: "input"
  }
});
