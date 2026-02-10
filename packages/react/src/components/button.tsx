import * as React from "react";
import { createComponent } from "@lit/react";
import { ConexiaButton as ConexiaButtonElement } from "@conexia/core";

export const ConexiaButton = createComponent({
  react: React,
  tagName: "conexia-button",
  elementClass: ConexiaButtonElement
});
