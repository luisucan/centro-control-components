import { css, html, LitElement } from "lit";
import { customElement, property } from "lit/decorators.js";

export type ConexiaButtonVariant = "primary" | "secondary" | "ghost";
export type ConexiaButtonSize = "sm" | "md" | "lg";

@customElement("conexia-button")
export class ConexiaButton extends LitElement {
  static styles = css`
    :host {
      display: inline-block;
      font-family: var(--cx-font-family, "Source Sans 3", "Helvetica Neue", Arial, sans-serif);
    }

    button {
      appearance: none;
      border: 1px solid var(--cx-button-border, transparent);
      border-radius: var(--cx-radius-pill, 999px);
      cursor: pointer;
      font-weight: 600;
      line-height: 1;
      padding: 0.65rem 1.2rem;
      background: var(--cx-button-bg, var(--cx-color-primary, #1f2937));
      color: var(--cx-button-text, var(--cx-color-primary-contrast, #ffffff));
      box-shadow: var(--cx-shadow-sm, 0 1px 2px rgba(15, 23, 42, 0.08));
      transition: background 160ms ease, border-color 160ms ease, box-shadow 160ms ease,
        transform 120ms ease;
      user-select: none;
    }

    button:hover:not(:disabled) {
      background: var(--cx-button-hover, var(--cx-color-primary-hover, #111827));
    }

    button:focus-visible {
      outline: none;
      box-shadow: var(--cx-shadow-focus, 0 0 0 3px rgba(15, 23, 42, 0.18));
    }

    button:active {
      transform: scale(0.98);
    }

    button:disabled {
      cursor: not-allowed;
      opacity: 0.55;
    }

    button.variant-primary {
      --cx-button-bg: var(--cx-color-primary, #1f2937);
      --cx-button-text: var(--cx-color-primary-contrast, #ffffff);
      --cx-button-border: transparent;
      --cx-button-hover: var(--cx-color-primary-hover, #111827);
    }

    button.variant-secondary {
      --cx-button-bg: var(--cx-color-secondary, #f8fafc);
      --cx-button-text: var(--cx-color-text, #0f172a);
      --cx-button-border: var(--cx-color-border, #e2e8f0);
      --cx-button-hover: var(--cx-color-secondary-hover, #f1f5f9);
    }

    button.variant-ghost {
      --cx-button-bg: transparent;
      --cx-button-text: var(--cx-color-text, #0f172a);
      --cx-button-border: var(--cx-color-border, #e2e8f0);
      --cx-button-hover: var(--cx-color-ghost-hover, #f8fafc);
    }

    button.size-sm {
      font-size: 0.85rem;
      padding: 0.5rem 1rem;
    }

    button.size-md {
      font-size: 0.95rem;
    }

    button.size-lg {
      font-size: 1rem;
      padding: 0.8rem 1.5rem;
    }

    .content {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
    }

    .spinner {
      width: 0.75rem;
      height: 0.75rem;
      border-radius: 999px;
      border: 2px solid currentColor;
      border-right-color: transparent;
      animation: spin 0.8s linear infinite;
    }

    @keyframes spin {
      to {
        transform: rotate(360deg);
      }
    }
  `;

  @property({ type: String, reflect: true })
  variant: ConexiaButtonVariant = "primary";

  @property({ type: String, reflect: true })
  size: ConexiaButtonSize = "md";

  @property({ type: Boolean, reflect: true })
  disabled = false;

  @property({ type: Boolean, reflect: true })
  loading = false;

  render() {
    const classes = `variant-${this.variant} size-${this.size}`;
    const isDisabled = this.disabled || this.loading;

    return html`
      <button
        class=${classes}
        ?disabled=${isDisabled}
        aria-busy=${this.loading ? "true" : "false"}
        data-loading=${this.loading ? "true" : "false"}
      >
        <span class="content">
          <slot></slot>
          ${this.loading ? html`<span class="spinner" aria-hidden="true"></span>` : null}
        </span>
      </button>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "conexia-button": ConexiaButton;
  }
}
