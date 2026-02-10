import { css, html, LitElement } from "lit";
import { customElement, property } from "lit/decorators.js";

import "../input/conexia-input";

export type ConexiaTicketQrValue = {
  qrContent: string;
};

@customElement("conexia-ticket-qr-block")
export class ConexiaTicketQrBlock extends LitElement {
  static styles = css`
    :host {
      display: block;
      font-family: var(--cx-font-family, "Source Sans 3", "Helvetica Neue", Arial, sans-serif);
      color: var(--cx-color-text, #0f172a);
    }
  `;

  @property({ type: Object })
  value: ConexiaTicketQrValue = { qrContent: "" };

  @property({ type: Boolean, reflect: true })
  disabled = false;

  private emitChange(qrContent: string) {
    this.dispatchEvent(
      new CustomEvent<ConexiaTicketQrValue>("change", {
        detail: { qrContent },
        bubbles: true,
        composed: true
      })
    );
  }

  render() {
    return html`
      <conexia-input
        label="Contenido QR"
        .value=${this.value?.qrContent ?? ""}
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
    "conexia-ticket-qr-block": ConexiaTicketQrBlock;
  }
}
