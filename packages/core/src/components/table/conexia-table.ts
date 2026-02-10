import { css, html, LitElement } from "lit";
import { customElement, property } from "lit/decorators.js";

export type ConexiaTableDensity = "compact" | "regular";

@customElement("conexia-table")
export class ConexiaTable extends LitElement {
  static styles = css`
    :host {
      display: block;
      font-family: var(--cx-font-family, "Source Sans 3", "Helvetica Neue", Arial, sans-serif);
      color: var(--cx-color-text, #0f172a);
      background: var(--cx-color-surface, #ffffff);
      border-radius: var(--cx-radius-md, 12px);
      border: 1px solid var(--cx-color-border, #e2e8f0);
      overflow: hidden;
    }

    table {
      width: 100%;
      border-collapse: collapse;
      font-size: 0.95rem;
    }

    ::slotted(caption) {
      text-align: left;
      padding: 0.75rem 1rem;
      color: var(--cx-color-muted, #475569);
    }

    ::slotted(thead) {
      background: var(--cx-color-secondary, #f8fafc);
    }

    ::slotted(thead th) {
      font-weight: 600;
      text-align: left;
      color: var(--cx-color-text, #0f172a);
    }

    ::slotted(th),
    ::slotted(td) {
      padding: var(--cx-table-cell-padding, 0.75rem 1rem);
      border-bottom: 1px solid var(--cx-color-border, #e2e8f0);
    }

    :host([density="compact"]) {
      --cx-table-cell-padding: 0.5rem 0.75rem;
    }

    :host([density="regular"]) {
      --cx-table-cell-padding: 0.75rem 1rem;
    }

    :host([striped]) ::slotted(tbody tr:nth-child(even)) {
      background: var(--cx-color-secondary, #f8fafc);
    }

    :host([bordered]) ::slotted(th),
    :host([bordered]) ::slotted(td) {
      border-right: 1px solid var(--cx-color-border, #e2e8f0);
    }

    :host([bordered]) ::slotted(th:last-child),
    :host([bordered]) ::slotted(td:last-child) {
      border-right: none;
    }

    :host([stickyHeader]) ::slotted(thead th) {
      position: sticky;
      top: 0;
      background: var(--cx-color-secondary, #f8fafc);
      z-index: 1;
    }
  `;

  @property({ type: String, reflect: true })
  density: ConexiaTableDensity = "regular";

  @property({ type: Boolean, reflect: true })
  striped = false;

  @property({ type: Boolean, reflect: true })
  bordered = false;

  @property({ type: Boolean, attribute: "sticky-header", reflect: true })
  stickyHeader = false;

  render() {
    return html`
      <table>
        <slot name="caption"></slot>
        <slot name="header"></slot>
        <slot name="body"></slot>
        <slot name="footer"></slot>
      </table>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "conexia-table": ConexiaTable;
  }
}
