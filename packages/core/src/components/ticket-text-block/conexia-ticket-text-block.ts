import { css, html, LitElement } from "lit";
import { customElement, property, state } from "lit/decorators.js";

import "../input/conexia-input";
import "../select/conexia-select";
import "../toggle/conexia-toggle";

type Align = "left" | "center" | "right";

export type ConexiaTicketTextValue = {
  text: string;
  align?: Align;
  bold?: boolean;
  size?: {
    width: number;
    height: number;
  };
};

@customElement("conexia-ticket-text-block")
export class ConexiaTicketTextBlock extends LitElement {
  static styles = css`
    :host {
      display: block;
      font-family: var(--cx-font-family, "Source Sans 3", "Helvetica Neue", Arial, sans-serif);
      color: var(--cx-color-text, #0f172a);
    }

    .row {
      display: grid;
      gap: 0.5rem;
      grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
    }

    .row.compact {
      grid-template-columns: repeat(3, minmax(0, max-content));
      align-items: center;
    }

    .size-input {
      max-width: 140px;
    }
  `;

  @property({ type: Object })
  value: ConexiaTicketTextValue = { text: "", align: "center", bold: false, size: { width: 1, height: 1 } };

  @property({ type: Boolean, reflect: true })
  disabled = false;

  @state()
  private text = "";

  @state()
  private align: Align = "center";

  @state()
  private bold = false;

  @state()
  private sizeWidth = 1;

  @state()
  private sizeHeight = 1;

  updated(changed: Map<string, unknown>) {
    if (changed.has("value")) {
      this.text = this.value?.text ?? "";
      this.align = this.value?.align ?? "center";
      this.bold = Boolean(this.value?.bold);
      this.sizeWidth = this.value?.size?.width ?? 1;
      this.sizeHeight = this.value?.size?.height ?? 1;
    }
  }

  private emitChange() {
    this.dispatchEvent(
      new CustomEvent<ConexiaTicketTextValue>("change", {
        detail: {
          text: this.text,
          align: this.align,
          bold: this.bold || undefined,
          size: { width: this.sizeWidth, height: this.sizeHeight }
        },
        bubbles: true,
        composed: true
      })
    );
  }

  private parseNumber(value: string): number {
    const parsed = Number(value);
    return Number.isNaN(parsed) ? 1 : parsed;
  }

  render() {
    return html`
      <div class="row">
        <conexia-input
          label="Texto"
          .value=${this.text}
          ?disabled=${this.disabled}
          @input=${(event: Event) => {
            const target = event.target as HTMLInputElement | null;
            this.text = target?.value ?? "";
            this.emitChange();
          }}
        ></conexia-input>
        <conexia-select
          label="Alineacion"
          .value=${this.align}
          ?disabled=${this.disabled}
          @change=${(event: Event) => {
            const target = event.target as HTMLSelectElement | null;
            const selected = (target?.value ?? "center") as Align;
            this.align = selected;
            this.emitChange();
          }}
        >
          <option value="left">left</option>
          <option value="center">center</option>
          <option value="right">right</option>
        </conexia-select>
      </div>
      <div class="row compact">
        <conexia-input
          label="Tamano ancho"
          class="size-input"
          .value=${String(this.sizeWidth)}
          ?disabled=${this.disabled}
          @input=${(event: Event) => {
            const target = event.target as HTMLInputElement | null;
            this.sizeWidth = this.parseNumber(target?.value ?? "1");
            this.emitChange();
          }}
        ></conexia-input>
        <conexia-input
          label="Tamano alto"
          class="size-input"
          .value=${String(this.sizeHeight)}
          ?disabled=${this.disabled}
          @input=${(event: Event) => {
            const target = event.target as HTMLInputElement | null;
            this.sizeHeight = this.parseNumber(target?.value ?? "1");
            this.emitChange();
          }}
        ></conexia-input>
        <conexia-toggle
          label="Negrita"
          ?checked=${this.bold}
          ?disabled=${this.disabled}
          @change=${(event: Event) => {
            const target = event.target as HTMLInputElement | null;
            this.bold = Boolean(target?.checked);
            this.emitChange();
          }}
        ></conexia-toggle>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "conexia-ticket-text-block": ConexiaTicketTextBlock;
  }
}
