import * as React from "react";
import { createComponent } from "@lit/react";
import { ConexiaCard as ConexiaCardElement } from "@luisvillafania/core";

export const ConexiaCard = createComponent({
  react: React,
  tagName: "conexia-card",
  elementClass: ConexiaCardElement
});
