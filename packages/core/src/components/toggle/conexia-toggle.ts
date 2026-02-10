import { css, html, LitElement } from "lit";
import { customElement, property } from "lit/decorators.js";

@customElement("conexia-toggle")
export class ConexiaToggle extends LitElement {
  static styles = css`
    :host {
      display: inline-flex;
      align-items: center;
      font-family: var(--cx-font-family, "Source Sans 3", "Helvetica Neue", Arial, sans-serif);
      color: var(--cx-color-text, #0f172a);
    }

    label {
      display: inline-flex;
      align-items: center;
      gap: 0.6rem;
      cursor: pointer;
      font-weight: 600;
      font-size: 0.95rem;
    }

    input {
      position: absolute;
      opacity: 0;
      pointer-events: none;
    }

    .track {
      width: 2.4rem;
      height: 1.3rem;
      background: var(--cx-color-border, #e2e8f0);
      border-radius: 999px;
      position: relative;
      transition: background 160ms ease;
    }

    .thumb {
      width: 1rem;
      height: 1rem;
      background: #ffffff;
      border-radius: 999px;
      position: absolute;
      top: 0.15rem;
      left: 0.2rem;
      transition: transform 160ms ease;
      box-shadow: 0 1px 2px rgba(15, 23, 42, 0.2);
    }

    input:checked + .track {
      background: var(--cx-color-primary, #1f2937);
    }

    input:checked + .track .thumb {
      transform: translateX(1.05rem);
    }

    input:focus-visible + .track {
      box-shadow: var(--cx-shadow-focus, 0 0 0 3px rgba(15, 23, 42, 0.18));
    }

    :host([disabled]) label {
      opacity: 0.6;
      cursor: not-allowed;
    }
  `;

  @property({ type: Boolean, reflect: true })
  checked = false;

  @property({ type: String })
  label = "";

  @property({ type: Boolean, reflect: true })
  disabled = false;

  private handleChange(event: Event) {
    const target = event.target as HTMLInputElement | null;
    if (!target) {
      return;
    }
    this.checked = target.checked;
    this.dispatchEvent(new Event("change", { bubbles: true, composed: true }));
  }

  render() {
    return html`
      <label>
        <input
          type="checkbox"
          ?checked=${this.checked}
          ?disabled=${this.disabled}
          @change=${this.handleChange}
        />
        <span class="track"><span class="thumb"></span></span>
        <span>${this.label}</span>
      </label>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "conexia-toggle": ConexiaToggle;
  }
}
