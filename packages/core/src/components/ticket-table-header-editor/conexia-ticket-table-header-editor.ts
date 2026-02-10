import { css, html, LitElement } from "lit";
import { customElement, property, state } from "lit/decorators.js";

import "../input/conexia-input";
import "../select/conexia-select";
import "../toggle/conexia-toggle";
import "../button/conexia-button";

type Align = "left" | "center" | "right";

export type ConexiaTableHeaderCell = {
  text: string;
  align?: Align;
};

export type ConexiaTableHeaderConfig = {
  header: ConexiaTableHeaderCell[];
  headerBold: boolean;
  columnWidths: number[];
};

@customElement("conexia-ticket-table-header-editor")
export class ConexiaTicketTableHeaderEditor extends LitElement {
  static styles = css`
    :host {
      display: block;
      font-family: var(--cx-font-family, "Source Sans 3", "Helvetica Neue", Arial, sans-serif);
      color: var(--cx-color-text, #0f172a);
    }

    .editor {
      display: grid;
      gap: 0.75rem;
      background: var(--cx-color-secondary, #f8fafc);
      border-radius: var(--cx-radius-md, 12px);
      padding: 0.75rem;
    }

    .row {
      display: grid;
      gap: 0.5rem;
      grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
      align-items: center;
    }

    .row.compact {
      grid-template-columns: repeat(4, minmax(0, max-content));
    }

    .actions {
      display: inline-flex;
      gap: 0.5rem;
      flex-wrap: wrap;
    }
  `;

  @property({ type: Array })
  header: ConexiaTableHeaderCell[] = [];

  @property({ type: Boolean, attribute: "header-bold" })
  headerBold = true;

  @property({ type: Array, attribute: "column-widths" })
  columnWidths: number[] = [];

  @property({ type: Boolean, reflect: true })
  disabled = false;

  @state()
  private localHeader: ConexiaTableHeaderCell[] = [];

  @state()
  private localHeaderBold = true;

  @state()
  private localColumnWidths: number[] = [];

  updated(changed: Map<string, unknown>) {
    if (changed.has("header")) {
      this.localHeader = this.header.length
        ? this.header.map((cell) => ({
            text: cell.text ?? "",
            align: (cell.align ?? "left") as Align
          }))
        : [{ text: "", align: "left" as Align }];
    }
    if (changed.has("headerBold")) {
      this.localHeaderBold = Boolean(this.headerBold);
    }
    if (changed.has("columnWidths")) {
      this.localColumnWidths = this.normalizeWidths(this.columnWidths, this.localHeader.length);
    }
  }

  private normalizeWidths(widths: number[], count: number): number[] {
    if (!widths || widths.length === 0) {
      const base = Math.floor(100 / count);
      return Array.from({ length: count }).map((_, index) =>
        index === count - 1 ? 100 - base * (count - 1) : base
      );
    }
    return Array.from({ length: count }).map((_, index) => widths[index] ?? widths[0] ?? 0);
  }

  private emitChange() {
    this.dispatchEvent(
      new CustomEvent<ConexiaTableHeaderConfig>("change", {
        detail: {
          header: this.localHeader,
          headerBold: this.localHeaderBold,
          columnWidths: this.localColumnWidths
        },
        bubbles: true,
        composed: true
      })
    );
  }

  private addColumn() {
    const header = [...this.localHeader, { text: "", align: "left" as Align }];
    this.localHeader = header;
    this.localColumnWidths = this.normalizeWidths(this.localColumnWidths, header.length);
    this.emitChange();
  }

  private removeColumn(index: number) {
    if (this.localHeader.length <= 1) {
      return;
    }
    this.localHeader = this.localHeader.filter((_, idx) => idx !== index);
    this.localColumnWidths = this.normalizeWidths(this.localColumnWidths, this.localHeader.length);
    this.emitChange();
  }

  private updateHeaderText(index: number, value: string) {
    this.localHeader = this.localHeader.map((cell, idx) =>
      idx === index ? { ...cell, text: value } : cell
    );
    this.emitChange();
  }

  private updateHeaderAlign(index: number, align: Align) {
    this.localHeader = this.localHeader.map((cell, idx) =>
      idx === index ? { ...cell, align } : cell
    );
    this.emitChange();
  }

  private updateWidth(index: number, value: string) {
    const parsed = Number(value);
    const safe = Number.isNaN(parsed) ? 0 : parsed;
    this.localColumnWidths = this.localColumnWidths.map((width, idx) =>
      idx === index ? safe : width
    );
    this.emitChange();
  }

  render() {
    return html`
      <div class="editor">
        <div class="row">
          <conexia-toggle
            label="Encabezado en negrita"
            ?checked=${this.localHeaderBold}
            ?disabled=${this.disabled}
            @change=${(event: Event) => {
              const target = event.target as HTMLInputElement | null;
              this.localHeaderBold = Boolean(target?.checked);
              this.emitChange();
            }}
          ></conexia-toggle>
        </div>
        <div class="actions">
          <conexia-button size="sm" variant="secondary" ?disabled=${this.disabled} @click=${this.addColumn}
            >Agregar columna</conexia-button
          >
        </div>
        <div>
          ${this.localHeader.map(
            (cell, index) => html`
              <div class="row compact">
                <conexia-input
                  label="Encabezado ${index + 1}"
                  .value=${cell.text}
                  ?disabled=${this.disabled}
                  @input=${(event: Event) => {
                    const target = event.target as HTMLInputElement | null;
                    this.updateHeaderText(index, target?.value ?? "");
                  }}
                ></conexia-input>
                <conexia-select
                  label="Alineacion"
                  .value=${cell.align ?? "left"}
                  ?disabled=${this.disabled}
                  @change=${(event: Event) => {
                    const target = event.target as HTMLSelectElement | null;
                    const selected = (target?.value ?? "left") as Align;
                    this.updateHeaderAlign(index, selected);
                  }}
                >
                  <option value="left">left</option>
                  <option value="center">center</option>
                  <option value="right">right</option>
                </conexia-select>
                <conexia-input
                  label="Ancho"
                  .value=${String(this.localColumnWidths[index] ?? 0)}
                  ?disabled=${this.disabled}
                  @input=${(event: Event) => {
                    const target = event.target as HTMLInputElement | null;
                    this.updateWidth(index, target?.value ?? "0");
                  }}
                ></conexia-input>
                <conexia-button
                  size="sm"
                  variant="ghost"
                  ?disabled=${this.localHeader.length <= 1 || this.disabled}
                  @click=${() => this.removeColumn(index)}
                >
                  Quitar
                </conexia-button>
              </div>
            `
          )}
        </div>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "conexia-ticket-table-header-editor": ConexiaTicketTableHeaderEditor;
  }
}
