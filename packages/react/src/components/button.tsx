import * as React from "react";
import { createComponent } from "@lit/react";
import { ConexiaButton as ConexiaButtonElement } from "@luisvillafania/core";

export const ConexiaButton = createComponent({
  react: React,
  tagName: "conexia-button",
  elementClass: ConexiaButtonElement
});
