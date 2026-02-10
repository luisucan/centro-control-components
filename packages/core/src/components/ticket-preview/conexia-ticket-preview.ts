import { css, html, LitElement, nothing } from "lit";
import { customElement, property, state } from "lit/decorators.js";

import type { EscPosContentBlock } from "../ticket-template/conexia-ticket-template";

type Align = "left" | "center" | "right";

type TableCell = {
  text: string;
  align?: Align;
};

type TableBlock = {
  header: TableCell[];
  headerBold?: boolean;
  columnWidths?: number[];
  lineChar?: string;
  rowSpacing?: number;
  footerLine?: boolean;
  rows: TableCell[][];
};

const placeholderImageUrl = new URL("../../assets/placeholder.jpg", import.meta.url).toString();
const placeholderQrUrl = new URL("../../assets/qr-code.png", import.meta.url).toString();

@customElement("conexia-ticket-preview")
export class ConexiaTicketPreview extends LitElement {
  static styles = css`
    :host {
      display: block;
      max-width: 100%;
    }

    .preview {
      width: var(--cx-ticket-width, 80mm);
      max-width: 100%;
      background: #ffffff;
      border: 1px solid var(--cx-color-border, #e2e8f0);
      border-radius: 10px;
      padding: 0.75rem 0.9rem;
      box-shadow: var(--cx-shadow-sm, 0 1px 2px rgba(15, 23, 42, 0.08));
      font-family: "IBM Plex Mono", "Source Code Pro", "Menlo", monospace;
      font-size: 0.85rem;
      color: var(--cx-color-text, #0f172a);
      line-height: 1.35;
      display: grid;
      gap: 0.35rem;
    }

    .text {
      white-space: pre-wrap;
      width: 100%;
      display: block;
      justify-self: stretch;
    }

    .cut {
      border-top: 1px dashed var(--cx-color-border, #e2e8f0);
      margin: 0.3rem 0;
    }

    .line {
      color: var(--cx-color-muted, #475569);
      letter-spacing: 0.04em;
    }

    .image {
      max-width: 100%;
      display: block;
      margin: 0 auto;
      max-height: 64px;
      object-fit: contain;
    }

    .table {
      width: 100%;
      border-collapse: collapse;
      font-size: 0.82rem;
    }

    .table th,
    .table td {
      padding: 0.15rem 0.1rem;
    }

    .table thead tr {
      border-bottom: 1px solid var(--cx-color-border, #e2e8f0);
    }

    .table tfoot tr {
      border-top: 1px solid var(--cx-color-border, #e2e8f0);
    }

    .qr {
      display: grid;
      place-items: center;
    }

    .qr img {
      width: 88px;
      height: 88px;
      object-fit: contain;
    }

    .drawer {
      text-align: center;
      font-size: 0.75rem;
      color: var(--cx-color-muted, #475569);
    }
  `;

  @property({ type: Array })
  content: EscPosContentBlock[] = [];

  @property({ type: Number, attribute: "width-mm" })
  widthMm = 80;

  @property({ type: Boolean, attribute: "show-margins" })
  showMargins = true;

  @state()
  private brokenImages = new Set<string>();

  private handleImageError(event: Event) {
    const target = event.target as HTMLImageElement | null;
    const src = target?.src;
    if (!src) {
      return;
    }
    this.brokenImages = new Set([...this.brokenImages, src]);
    if (target && target.src !== placeholderImageUrl) {
      target.src = placeholderImageUrl;
      target.alt = "Imagen no disponible";
    }
  }

  private renderLine(charLine: string) {
    const count = Math.max(10, Math.round((this.widthMm / 80) * 32));
    return charLine.repeat(count).slice(0, count);
  }

  private renderTable(block: TableBlock) {
    const columnCount = block.header.length;
    const widths = block.columnWidths && block.columnWidths.length > 0
      ? block.columnWidths
      : Array.from({ length: columnCount }).map(() => Math.floor(100 / columnCount));

    return html`
      <table class="table">
        <thead>
          <tr>
            ${block.header.map(
              (cell, index) => html`
                <th
                  style="width: ${widths[index] ?? widths[0]}%; text-align: ${cell.align ?? "left"}; font-weight: ${
                    block.headerBold ? "700" : "600"
                  };"
                >
                  ${cell.text}
                </th>
              `
            )}
          </tr>
        </thead>
        <tbody>
          ${block.rows.map(
            (row) => html`
              <tr>
                ${row.map(
                  (cell, index) => html`
                    <td style="text-align: ${cell.align ?? "left"}; width: ${
                      widths[index] ?? widths[0]
                    }%;">
                      ${cell.text}
                    </td>
                  `
                )}
              </tr>
              ${block.rowSpacing && block.rowSpacing > 1
                ? html`<tr><td colspan=${columnCount}>&nbsp;</td></tr>`
                : nothing}
            `
          )}
        </tbody>
        ${block.footerLine
          ? html`
              <tfoot>
                <tr>
                  <td colspan=${columnCount} class="line">
                    ${this.renderLine(block.lineChar ?? "-")}
                  </td>
                </tr>
              </tfoot>
            `
          : nothing}
      </table>
    `;
  }

  private renderBlock(block: EscPosContentBlock) {
    if ("src" in block) {
      const src = block.src;
      if (!src || this.brokenImages.has(src)) {
        return html`<img class="image" src=${placeholderImageUrl} alt="Imagen no disponible" />`;
      }
      return html`
        <img class="image" src=${src} @error=${this.handleImageError} alt="Logo" />
      `;
    }

    if ("text" in block) {
      const sizeHeight = block.size?.height ?? 1;
      const sizeWidth = block.size?.width ?? 1;
      const fontSize = 0.85 * sizeHeight;
      const letterSpacing = sizeWidth > 1 ? 0.02 * sizeWidth : 0;
      return html`<div
        class="text"
        style="text-align: ${block.align ?? "left"}; font-weight: ${
          block.bold ? "700" : "400"
        }; font-size: ${fontSize}rem; letter-spacing: ${letterSpacing}em;"
      >${block.text}</div>`;
    }

    if ("cut" in block) {
      return html`<div class="cut"></div>`;
    }

    if ("openDrawer" in block) {
      return html`<div class="drawer">Abrir caja</div>`;
    }

    if ("charLine" in block) {
      return html`<div class="line">${this.renderLine(block.charLine)}</div>`;
    }

    if ("header" in block && "rows" in block) {
      return this.renderTable(block as TableBlock);
    }

    if ("qrContent" in block) {
      return html`
        <div class="qr">
          <img src=${placeholderQrUrl} alt="QR" />
        </div>
      `;
    }

    return nothing;
  }

  render() {
    const width = `${this.widthMm}mm`;
    return html`
      <div class="preview" style=${`--cx-ticket-width: ${width};`}>
        ${this.content.map((block) => this.renderBlock(block))}
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "conexia-ticket-preview": ConexiaTicketPreview;
  }
}
