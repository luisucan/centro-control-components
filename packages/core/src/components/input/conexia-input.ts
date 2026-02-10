import { css, html, LitElement } from "lit";
import { customElement, property } from "lit/decorators.js";

export type ConexiaInputSize = "sm" | "md" | "lg";

@customElement("conexia-input")
export class ConexiaInput extends LitElement {
  static styles = css`
    :host {
      display: block;
      font-family: var(--cx-font-family, "Source Sans 3", "Helvetica Neue", Arial, sans-serif);
      color: var(--cx-color-text, #0f172a);
    }

    .field {
      display: grid;
      gap: 0.4rem;
    }

    .label {
      font-weight: 600;
      font-size: 0.95rem;
    }

    .helper {
      font-size: 0.85rem;
      color: var(--cx-color-muted, #475569);
    }

    input {
      box-sizing: border-box;
      width: 100%;
      border-radius: var(--cx-radius-md, 12px);
      border: 1px solid var(--cx-control-border, #cbd5e1);
      background: var(--cx-control-bg, #ffffff);
      color: inherit;
      font-size: 0.95rem;
      padding: 0.6rem 0.9rem;
      transition: border-color 160ms ease, box-shadow 160ms ease;
    }

    input::placeholder {
      color: var(--cx-control-placeholder, #94a3b8);
    }

    input:focus-visible {
      outline: none;
      border-color: var(--cx-color-focus, #0f172a);
      box-shadow: var(--cx-shadow-focus, 0 0 0 3px rgba(15, 23, 42, 0.18));
    }

    input:hover:not(:disabled) {
      border-color: var(--cx-control-border-hover, #94a3b8);
    }

    input:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    :host([size="sm"]) input {
      font-size: 0.85rem;
      padding: 0.5rem 0.8rem;
    }

    :host([size="lg"]) input {
      font-size: 1rem;
      padding: 0.75rem 1rem;
    }

    :host([invalid]) input {
      border-color: var(--cx-color-danger, #dc2626);
    }

    :host([invalid]) .helper {
      color: var(--cx-color-danger, #dc2626);
    }
  `;

  @property({ type: String })
  label = "";

  @property({ type: String })
  value = "";

  @property({ type: String })
  placeholder = "";

  @property({ type: Boolean, reflect: true })
  disabled = false;

  @property({ type: Boolean, reflect: true })
  invalid = false;

  @property({ type: String, reflect: true })
  size: ConexiaInputSize = "md";

  @property({ type: String, attribute: "helper-text" })
  helperText = "";

  private handleInput(event: Event) {
    const target = event.target as HTMLInputElement | null;
    if (!target) {
      return;
    }
    this.value = target.value;
    this.dispatchEvent(new Event("input", { bubbles: true, composed: true }));
  }

  private handleChange(event: Event) {
    const target = event.target as HTMLInputElement | null;
    if (!target) {
      return;
    }
    this.value = target.value;
    this.dispatchEvent(new Event("change", { bubbles: true, composed: true }));
  }

  render() {
    const showLabel = this.label.length > 0;
    const showHelper = this.helperText.length > 0;

    return html`
      <div class="field">
        ${showLabel
          ? html`<label class="label">
              <slot name="label">${this.label}</slot>
            </label>`
          : null}
        <input
          .value=${this.value}
          placeholder=${this.placeholder}
          ?disabled=${this.disabled}
          @input=${this.handleInput}
          @change=${this.handleChange}
        />
        ${showHelper
          ? html`<div class="helper"><slot name="helper">${this.helperText}</slot></div>`
          : null}
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "conexia-input": ConexiaInput;
  }
}
