import { css, html, LitElement } from "lit";
import { customElement, property } from "lit/decorators.js";

export type ConexiaLabelSize = "sm" | "md" | "lg";
export type ConexiaLabelTone = "default" | "muted" | "danger";

@customElement("conexia-label")
export class ConexiaLabel extends LitElement {
  static styles = css`
    :host {
      display: inline-block;
      font-family: var(--cx-font-family, "Source Sans 3", "Helvetica Neue", Arial, sans-serif);
      color: var(--cx-label-color, var(--cx-color-text, #0f172a));
    }

    label {
      display: inline-flex;
      align-items: center;
      gap: 0.3rem;
      font-weight: 600;
      line-height: 1.2;
    }

    .size-sm {
      font-size: 0.85rem;
    }

    .size-md {
      font-size: 0.95rem;
    }

    .size-lg {
      font-size: 1.05rem;
    }

    :host([tone="muted"]) {
      --cx-label-color: var(--cx-color-muted, #475569);
    }

    :host([tone="danger"]) {
      --cx-label-color: var(--cx-color-danger, #dc2626);
    }

    .required {
      color: var(--cx-color-danger, #dc2626);
      font-size: 0.85em;
    }
  `;

  @property({ type: String })
  for = "";

  @property({ type: String, reflect: true })
  size: ConexiaLabelSize = "md";

  @property({ type: String, reflect: true })
  tone: ConexiaLabelTone = "default";

  @property({ type: Boolean, reflect: true })
  required = false;

  render() {
    return html`
      <label class="size-${this.size}" for=${this.for}>
        <slot></slot>
        ${this.required ? html`<span class="required">*</span>` : null}
      </label>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "conexia-label": ConexiaLabel;
  }
}
