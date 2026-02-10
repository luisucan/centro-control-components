import "./styles/tokens.css";

export { defineConexiaComponents } from "./register";
export {
  ConexiaButton,
  type ConexiaButtonSize,
  type ConexiaButtonVariant
} from "./components/button/conexia-button";
export {
  ConexiaLabel,
  type ConexiaLabelSize,
  type ConexiaLabelTone
} from "./components/label/conexia-label";
export {
  ConexiaSelect,
  type ConexiaSelectSize
} from "./components/select/conexia-select";
export {
  ConexiaTable,
  type ConexiaTableDensity
} from "./components/table/conexia-table";
export {
  ConexiaCard,
  type ConexiaCardPadding,
  type ConexiaCardVariant
} from "./components/card/conexia-card";
export { ConexiaInput, type ConexiaInputSize } from "./components/input/conexia-input";
export { ConexiaToggle } from "./components/toggle/conexia-toggle";
export {
  ConexiaTicketTemplate,
  type EscPosContentBlock
} from "./components/ticket-template/conexia-ticket-template";
export { ConexiaTicketPreview } from "./components/ticket-preview/conexia-ticket-preview";
export {
  ConexiaTicketTextBlock,
  type ConexiaTicketTextValue
} from "./components/ticket-text-block/conexia-ticket-text-block";
export {
  ConexiaTicketTableHeaderEditor,
  type ConexiaTableHeaderCell,
  type ConexiaTableHeaderConfig
} from "./components/ticket-table-header-editor/conexia-ticket-table-header-editor";
export {
  ConexiaTicketImageBlock,
  type ConexiaTicketImageValue
} from "./components/ticket-image-block/conexia-ticket-image-block";
export {
  ConexiaTicketQrBlock,
  type ConexiaTicketQrValue
} from "./components/ticket-qr-block/conexia-ticket-qr-block";
