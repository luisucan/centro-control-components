import * as React from "react";
import { createComponent } from "@lit/react";
import { ConexiaInput as ConexiaInputElement } from "@conexia/core";

export const ConexiaInput = createComponent({
  react: React,
  tagName: "conexia-input",
  elementClass: ConexiaInputElement,
  events: {
    onChange: "change",
    onInput: "input"
  }
});
