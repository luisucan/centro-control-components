import * as React from "react";
import { createComponent } from "@lit/react";
import { ConexiaLabel as ConexiaLabelElement } from "@luisvillafania/core";

export const ConexiaLabel = createComponent({
  react: React,
  tagName: "conexia-label",
  elementClass: ConexiaLabelElement
});
