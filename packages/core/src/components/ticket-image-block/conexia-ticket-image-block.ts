import { css, html, LitElement } from "lit";
import { customElement, property } from "lit/decorators.js";

import "../input/conexia-input";

export type ConexiaTicketImageValue = {
  src: string;
};

@customElement("conexia-ticket-image-block")
export class ConexiaTicketImageBlock extends LitElement {
  static styles = css`
    :host {
      display: block;
      font-family: var(--cx-font-family, "Source Sans 3", "Helvetica Neue", Arial, sans-serif);
      color: var(--cx-color-text, #0f172a);
    }
  `;

  @property({ type: Object })
  value: ConexiaTicketImageValue = { src: "" };

  @property({ type: Boolean, reflect: true })
  disabled = false;

  private emitChange(src: string) {
    this.dispatchEvent(
      new CustomEvent<ConexiaTicketImageValue>("change", {
        detail: { src },
        bubbles: true,
        composed: true
      })
    );
  }

  render() {
    return html`
      <conexia-input
        label="Ruta de imagen"
        .value=${this.value?.src ?? ""}
        ?disabled=${this.disabled}
        @input=${(event: Event) => {
          const target = event.target as HTMLInputElement | null;
          this.emitChange(target?.value ?? "");
        }}
      ></conexia-input>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "conexia-ticket-image-block": ConexiaTicketImageBlock;
  }
}
