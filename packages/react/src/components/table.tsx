import * as React from "react";
import { createComponent } from "@lit/react";
import { ConexiaTable as ConexiaTableElement } from "@conexia/core";

export const ConexiaTable = createComponent({
  react: React,
  tagName: "conexia-table",
  elementClass: ConexiaTableElement
});
