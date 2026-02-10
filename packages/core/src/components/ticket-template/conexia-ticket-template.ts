import { css, html, LitElement, nothing } from "lit";
import { customElement, property, state } from "lit/decorators.js";

import "../card/conexia-card";
import "../button/conexia-button";
import "../select/conexia-select";
import "../input/conexia-input";
import "../toggle/conexia-toggle";
import "../label/conexia-label";
import "../ticket-preview/conexia-ticket-preview";

type Align = "left" | "center" | "right";

type BlockKind = "image" | "text" | "cut" | "openDrawer" | "charLine" | "table" | "qr";

type TextBlock = {
  text: string;
  align?: Align;
};

type ImageBlock = {
  src: string;
};

type CutBlock = {
  cut: boolean;
};

type OpenDrawerBlock = {
  openDrawer: boolean;
};

type CharLineBlock = {
  charLine: string;
};

type QrBlock = {
  qrContent: string;
};

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

export type EscPosContentBlock =
  | TextBlock
  | ImageBlock
  | CutBlock
  | OpenDrawerBlock
  | CharLineBlock
  | TableBlock
  | QrBlock;

type BuilderBlock =
  | { kind: "text"; text: string; align: Align }
  | { kind: "image"; src: string }
  | { kind: "cut"; cut: boolean }
  | { kind: "openDrawer"; openDrawer: boolean }
  | { kind: "charLine"; charLine: string }
  | {
      kind: "table";
      header: TableCell[];
      headerBold: boolean;
      columnWidths: number[];
      lineChar: string;
      rowSpacing: number;
      footerLine: boolean;
      rows: TableCell[][];
    }
  | { kind: "qr"; qrContent: string };

const blockKinds: { value: BlockKind; label: string }[] = [
  { value: "text", label: "Texto" },
  { value: "image", label: "Imagen" },
  { value: "cut", label: "Corte" },
  { value: "openDrawer", label: "Abrir cajon" },
  { value: "charLine", label: "Linea" },
  { value: "table", label: "Tabla" },
  { value: "qr", label: "QR" }
];

@customElement("conexia-ticket-template")
export class ConexiaTicketTemplate extends LitElement {
  static styles = css`
    :host {
      display: block;
      font-family: var(--cx-font-family, "Source Sans 3", "Helvetica Neue", Arial, sans-serif);
      color: var(--cx-color-text, #0f172a);
      max-width: 100%;
      width: 100%;
    }

    .builder {
      display: grid;
      gap: 1rem;
      max-height: 70vh;
      overflow-y: auto;
      overflow-x: hidden;
      padding-right: 0.5rem;
    }

    .layout {
      display: grid;
      grid-template-columns: minmax(0, 1fr) auto;
      gap: 1.25rem;
      align-items: start;
    }

    .layout.hidden-preview {
      grid-template-columns: 1fr;
    }

    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 0.75rem;
      flex-wrap: wrap;
    }

    .block {
      border: 1px solid var(--cx-color-border, #e2e8f0);
      border-radius: var(--cx-radius-md, 12px);
      padding: 0.75rem;
      display: grid;
      gap: 0.6rem;
      background: var(--cx-color-surface, #ffffff);
      max-width: 100%;
      overflow: hidden;
    }

    .block-header {
      display: grid;
      grid-template-columns: 1fr auto;
      align-items: center;
      gap: 0.5rem;
    }

    .block-header > * {
      min-width: 0;
    }

    .block-actions {
      display: inline-flex;
      gap: 0.35rem;
      flex-wrap: wrap;
    }

    .row {
      display: grid;
      gap: 0.5rem;
      grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
      max-width: 100%;
    }

    .row > * {
      min-width: 0;
    }

    .table-editor {
      display: grid;
      gap: 0.75rem;
      background: var(--cx-color-secondary, #f8fafc);
      border-radius: var(--cx-radius-md, 12px);
      padding: 0.75rem;
      max-width: 100%;
    }

    .table-grid {
      display: grid;
      gap: 0.5rem;
      max-width: 100%;
    }

    .table-actions {
      display: inline-flex;
      gap: 0.5rem;
      flex-wrap: wrap;
    }

    .footer {
      display: flex;
      justify-content: flex-end;
    }

    .muted {
      color: var(--cx-color-muted, #475569);
      font-size: 0.9rem;
    }

    conexia-input,
    conexia-select,
    conexia-toggle {
      max-width: 100%;
    }

    .preview {
      position: sticky;
      top: 1rem;
    }

    @media (max-width: 1024px) {
      .layout {
        grid-template-columns: 1fr;
      }

      .preview {
        position: static;
      }
    }
  `;

  @property({ type: Array })
  value: EscPosContentBlock[] | null = null;

  @property({ type: Boolean, reflect: true })
  disabled = false;

  @state()
  private blocks: BuilderBlock[] = [];

  @state()
  private showPreview = true;

  @state()
  private previewWidth = 80;

  updated(changed: Map<string, unknown>) {
    if (changed.has("value")) {
      this.blocks = this.normalizeValue(this.value);
    }
  }

  private normalizeValue(value: EscPosContentBlock[] | null): BuilderBlock[] {
    if (!value || value.length === 0) {
      return [this.createDefaultBlock()];
    }

    return value.map((item) => {
      if ("header" in item && "rows" in item) {
        return this.normalizeTable(item as TableBlock);
      }

      if ("qrContent" in item) {
        return { kind: "qr", qrContent: item.qrContent ?? "" };
      }

      if ("src" in item) {
        return { kind: "image", src: item.src ?? "" };
      }

      if ("charLine" in item) {
        return { kind: "charLine", charLine: item.charLine ?? "" };
      }

      if ("openDrawer" in item) {
        return { kind: "openDrawer", openDrawer: Boolean(item.openDrawer) };
      }

      if ("cut" in item) {
        return { kind: "cut", cut: Boolean(item.cut) };
      }

      if ("text" in item) {
        return {
          kind: "text",
          text: item.text ?? "",
          align: item.align ?? "left"
        };
      }

      return this.createDefaultBlock();
    });
  }

  private normalizeTable(table: TableBlock): BuilderBlock {
    const header = (table.header || []).map((cell) => ({
      text: cell.text ?? "",
      align: cell.align ?? "left"
    }));

    const safeHeader = header.length > 0 ? header : [{ text: "", align: "left" }];
    const columnCount = safeHeader.length;
    const rows = (table.rows || []).map((row) =>
      Array.from({ length: columnCount }).map((_, index) => {
        const cell = row[index] || { text: "", align: "left" };
        return {
          text: cell.text ?? "",
          align: cell.align ?? "left"
        };
      })
    );
    const columnWidths = this.normalizeColumnWidths(table.columnWidths, columnCount);

    return {
      kind: "table",
      header: safeHeader,
      headerBold: Boolean(table.headerBold),
      columnWidths,
      lineChar: table.lineChar ?? "-",
      rowSpacing: typeof table.rowSpacing === "number" ? table.rowSpacing : 1,
      footerLine: Boolean(table.footerLine),
      rows
    };
  }

  private normalizeColumnWidths(widths: number[] | undefined, count: number): number[] {
    if (!widths || widths.length === 0) {
      const base = Math.floor(100 / count);
      return Array.from({ length: count }).map((_, index) =>
        index === count - 1 ? 100 - base * (count - 1) : base
      );
    }

    return Array.from({ length: count }).map((_, index) => widths[index] ?? widths[0] ?? 0);
  }

  private createDefaultBlock(): BuilderBlock {
    return { kind: "text", text: "", align: "left" };
  }

  private emitChange() {
    const content = this.blocks.map((block) => this.toContentBlock(block));
    this.dispatchEvent(
      new CustomEvent<EscPosContentBlock[]>("contentChange", {
        detail: content,
        bubbles: true,
        composed: true
      })
    );
  }

  private emitSubmit() {
    const content = this.blocks.map((block) => this.toContentBlock(block));
    this.dispatchEvent(
      new CustomEvent<EscPosContentBlock[]>("contentSubmit", {
        detail: content,
        bubbles: true,
        composed: true
      })
    );
  }

  private readValue(event: Event): string {
    const target = event.target as { value?: string } | null;
    return target?.value ?? "";
  }

  private readChecked(event: Event): boolean {
    const target = event.target as { checked?: boolean } | null;
    return Boolean(target?.checked);
  }

  private toContentBlock(block: BuilderBlock): EscPosContentBlock {
    switch (block.kind) {
      case "image":
        return { src: block.src };
      case "text":
        return { text: block.text, align: block.align };
      case "cut":
        return { cut: block.cut };
      case "openDrawer":
        return { openDrawer: block.openDrawer };
      case "charLine":
        return { charLine: block.charLine };
      case "table":
        return {
          header: block.header,
          headerBold: block.headerBold,
          columnWidths: block.columnWidths,
          lineChar: block.lineChar,
          rowSpacing: block.rowSpacing,
          footerLine: block.footerLine,
          rows: block.rows
        };
      case "qr":
        return { qrContent: block.qrContent };
      default:
        return { text: "", align: "left" };
    }
  }

  private updateBlock(index: number, updated: BuilderBlock) {
    this.blocks = this.blocks.map((block, i) => (i === index ? updated : block));
    this.emitChange();
  }

  private addBlock(kind: BlockKind) {
    const newBlock = this.createBlockByKind(kind);
    this.blocks = [...this.blocks, newBlock];
    this.emitChange();
  }

  private createBlockByKind(kind: BlockKind): BuilderBlock {
    switch (kind) {
      case "image":
        return { kind: "image", src: "" };
      case "cut":
        return { kind: "cut", cut: true };
      case "openDrawer":
        return { kind: "openDrawer", openDrawer: true };
      case "charLine":
        return { kind: "charLine", charLine: "-" };
      case "table":
        return {
          kind: "table",
          header: [
            { text: "Columna 1", align: "left" },
            { text: "Columna 2", align: "center" },
            { text: "Columna 3", align: "right" }
          ],
          headerBold: true,
          columnWidths: [60, 20, 20],
          lineChar: "-",
          rowSpacing: 1,
          footerLine: true,
          rows: []
        };
      case "qr":
        return { kind: "qr", qrContent: "" };
      case "text":
      default:
        return { kind: "text", text: "", align: "left" };
    }
  }

  private removeBlock(index: number) {
    this.blocks = this.blocks.filter((_, i) => i !== index);
    if (this.blocks.length === 0) {
      this.blocks = [this.createDefaultBlock()];
    }
    this.emitChange();
  }

  private moveBlock(index: number, direction: "up" | "down") {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= this.blocks.length) {
      return;
    }
    const updated = [...this.blocks];
    const [moved] = updated.splice(index, 1);
    updated.splice(targetIndex, 0, moved);
    this.blocks = updated;
    this.emitChange();
  }

  private handleKindChange(index: number, kind: BlockKind) {
    const newBlock = this.createBlockByKind(kind);
    this.updateBlock(index, newBlock);
  }

  private updateTableHeader(block: BuilderBlock, headerIndex: number, value: string) {
    if (block.kind !== "table") {
      return;
    }
    const header = block.header.map((cell, index) =>
      index === headerIndex ? { ...cell, text: value } : cell
    );
    this.updateBlock(this.blocks.indexOf(block), { ...block, header });
  }

  private updateTableHeaderAlign(block: BuilderBlock, headerIndex: number, align: Align) {
    if (block.kind !== "table") {
      return;
    }
    const header = block.header.map((cell, index) =>
      index === headerIndex ? { ...cell, align } : cell
    );
    this.updateBlock(this.blocks.indexOf(block), { ...block, header });
  }

  private updateTableCell(
    block: BuilderBlock,
    rowIndex: number,
    cellIndex: number,
    value: string
  ) {
    if (block.kind !== "table") {
      return;
    }
    const rows = block.rows.map((row, index) => {
      if (index !== rowIndex) {
        return row;
      }
      return row.map((cell, cellPos) =>
        cellPos === cellIndex ? { ...cell, text: value } : cell
      );
    });
    this.updateBlock(this.blocks.indexOf(block), { ...block, rows });
  }

  private updateTableCellAlign(
    block: BuilderBlock,
    rowIndex: number,
    cellIndex: number,
    align: Align
  ) {
    if (block.kind !== "table") {
      return;
    }
    const rows = block.rows.map((row, index) => {
      if (index !== rowIndex) {
        return row;
      }
      return row.map((cell, cellPos) =>
        cellPos === cellIndex ? { ...cell, align } : cell
      );
    });
    this.updateBlock(this.blocks.indexOf(block), { ...block, rows });
  }

  private updateTableConfig(block: BuilderBlock, key: keyof BuilderBlock, value: unknown) {
    if (block.kind !== "table") {
      return;
    }
    const updated = { ...block, [key]: value } as BuilderBlock;
    this.updateBlock(this.blocks.indexOf(block), updated);
  }

  private addTableRow(block: BuilderBlock) {
    if (block.kind !== "table") {
      return;
    }
    const newRow = block.header.map(() => ({ text: "", align: "left" as Align }));
    this.updateBlock(this.blocks.indexOf(block), { ...block, rows: [...block.rows, newRow] });
  }

  private removeTableRow(block: BuilderBlock, rowIndex: number) {
    if (block.kind !== "table") {
      return;
    }
    const rows = block.rows.filter((_, index) => index !== rowIndex);
    this.updateBlock(this.blocks.indexOf(block), { ...block, rows });
  }

  private addTableColumn(block: BuilderBlock) {
    if (block.kind !== "table") {
      return;
    }
    const header = [...block.header, { text: "", align: "left" as Align }];
    const rows = block.rows.map((row) => [...row, { text: "", align: "left" as Align }]);
    const columnWidths = this.normalizeColumnWidths(block.columnWidths, header.length);
    this.updateBlock(this.blocks.indexOf(block), { ...block, header, rows, columnWidths });
  }

  private removeTableColumn(block: BuilderBlock, columnIndex: number) {
    if (block.kind !== "table" || block.header.length <= 1) {
      return;
    }
    const header = block.header.filter((_, index) => index !== columnIndex);
    const rows = block.rows.map((row) => row.filter((_, index) => index !== columnIndex));
    const columnWidths = this.normalizeColumnWidths(block.columnWidths, header.length);
    this.updateBlock(this.blocks.indexOf(block), { ...block, header, rows, columnWidths });
  }

  private updateColumnWidth(block: BuilderBlock, columnIndex: number, value: string) {
    if (block.kind !== "table") {
      return;
    }
    const numberValue = Number(value);
    const safeValue = Number.isNaN(numberValue) ? 0 : numberValue;
    const columnWidths = block.columnWidths.map((width, index) =>
      index === columnIndex ? safeValue : width
    );
    this.updateBlock(this.blocks.indexOf(block), { ...block, columnWidths });
  }

  private renderAlignSelect(value: Align, onChange: (align: Align) => void) {
    return html`
      <conexia-select
        .value=${value}
        @change=${(event: Event) => {
          const selected = this.readValue(event) as Align | "";
          if (selected) {
            onChange(selected);
          }
        }}
      >
        <option value="left">Izquierda</option>
        <option value="center">Centro</option>
        <option value="right">Derecha</option>
      </conexia-select>
    `;
  }

  private renderTableEditor(block: BuilderBlock) {
    if (block.kind !== "table") {
      return nothing;
    }

    return html`
      <div class="table-editor">
        <div class="row">
          <conexia-toggle
            label="Encabezado en negrita"
            ?checked=${block.headerBold}
            @change=${(event: Event) => {
              this.updateTableConfig(block, "headerBold", this.readChecked(event));
            }}
          ></conexia-toggle>
          <conexia-toggle
            label="Linea de cierre"
            ?checked=${block.footerLine}
            @change=${(event: Event) => {
              this.updateTableConfig(block, "footerLine", this.readChecked(event));
            }}
          ></conexia-toggle>
        </div>
        <div class="row">
          <conexia-input
            label="Caracter de linea"
            .value=${block.lineChar}
            @input=${(event: Event) => {
              this.updateTableConfig(block, "lineChar", this.readValue(event) || "-");
            }}
          ></conexia-input>
          <conexia-input
            label="Espaciado de filas"
            .value=${String(block.rowSpacing)}
            @input=${(event: Event) => {
              const value = Number(this.readValue(event) || "1");
              this.updateTableConfig(block, "rowSpacing", Number.isNaN(value) ? 1 : value);
            }}
          ></conexia-input>
        </div>
        <div class="table-actions">
          <conexia-button
            size="sm"
            variant="secondary"
            @click=${() => this.addTableColumn(block)}
          >
            Agregar columna
          </conexia-button>
          <conexia-button
            size="sm"
            variant="secondary"
            @click=${() => this.addTableRow(block)}
          >
            Agregar fila
          </conexia-button>
        </div>
        <div class="table-grid">
          ${block.header.map(
            (cell, index) => html`
              <div class="row">
                <conexia-input
                  label="Encabezado ${index + 1}"
                  .value=${cell.text}
                  @input=${(event: Event) => {
                    this.updateTableHeader(block, index, this.readValue(event));
                  }}
                ></conexia-input>
                ${this.renderAlignSelect(cell.align ?? "left", (align) =>
                  this.updateTableHeaderAlign(block, index, align)
                )}
                <conexia-input
                  label="Ancho"
                  .value=${String(block.columnWidths[index] ?? 0)}
                  @input=${(event: Event) => {
                    this.updateColumnWidth(block, index, this.readValue(event) || "0");
                  }}
                ></conexia-input>
                <conexia-button
                  size="sm"
                  variant="ghost"
                  ?disabled=${block.header.length <= 1}
                  @click=${() => this.removeTableColumn(block, index)}
                >
                  Quitar
                </conexia-button>
              </div>
            `
          )}
        </div>
        <div class="table-grid">
          ${block.rows.map(
            (row, rowIndex) => html`
              <div class="block">
                <div class="row">
                  <conexia-label tone="muted">Fila ${rowIndex + 1}</conexia-label>
                  <conexia-button
                    size="sm"
                    variant="ghost"
                    @click=${() => this.removeTableRow(block, rowIndex)}
                  >
                    Quitar fila
                  </conexia-button>
                </div>
                ${row.map(
                  (cell, cellIndex) => html`
                    <div class="row">
                      <conexia-input
                        label="Celda ${cellIndex + 1}"
                        .value=${cell.text}
                        @input=${(event: Event) => {
                          this.updateTableCell(block, rowIndex, cellIndex, this.readValue(event));
                        }}
                      ></conexia-input>
                      ${this.renderAlignSelect(cell.align ?? "left", (align) =>
                        this.updateTableCellAlign(block, rowIndex, cellIndex, align)
                      )}
                    </div>
                  `
                )}
              </div>
            `
          )}
        </div>
      </div>
    `;
  }

  private renderBlock(block: BuilderBlock, index: number) {
    return html`
      <div class="block">
        <div class="block-header">
          <conexia-select
          .value=${block.kind}
          ?disabled=${this.disabled}
          @change=${(event: Event) => {
              const selected = this.readValue(event) as BlockKind | "";
              if (selected) {
                this.handleKindChange(index, selected);
              }
            }}
          >
            ${blockKinds.map(
              (kind) => html`<option value=${kind.value}>${kind.label}</option>`
            )}
          </conexia-select>
          <div class="block-actions">
            <conexia-button
              size="sm"
              variant="ghost"
              ?disabled=${index === 0}
              @click=${() => this.moveBlock(index, "up")}
            >
              Subir
            </conexia-button>
            <conexia-button
              size="sm"
              variant="ghost"
              ?disabled=${index === this.blocks.length - 1}
              @click=${() => this.moveBlock(index, "down")}
            >
              Bajar
            </conexia-button>
            <conexia-button size="sm" variant="ghost" @click=${() => this.removeBlock(index)}>
              Quitar
            </conexia-button>
          </div>
        </div>

        ${block.kind === "text"
          ? html`
              <div class="row">
                <conexia-input
                  label="Texto"
                  .value=${block.text}
                  ?disabled=${this.disabled}
                  @input=${(event: Event) => {
                    this.updateBlock(index, {
                      ...block,
                      text: this.readValue(event)
                    });
                  }}
                ></conexia-input>
                ${this.renderAlignSelect(block.align, (align) =>
                  this.updateBlock(index, { ...block, align })
                )}
              </div>
            `
          : nothing}

        ${block.kind === "image"
          ? html`
                <conexia-input
                  label="Ruta de imagen"
                  .value=${block.src}
                  ?disabled=${this.disabled}
                  @input=${(event: Event) => {
                  this.updateBlock(index, { ...block, src: this.readValue(event) });
                }}
              ></conexia-input>
            `
          : nothing}

        ${block.kind === "cut"
          ? html`
                <conexia-toggle
                label="Cortar papel"
                  ?checked=${block.cut}
                  ?disabled=${this.disabled}
                  @change=${(event: Event) => {
                  this.updateBlock(index, { ...block, cut: this.readChecked(event) });
                }}
              ></conexia-toggle>
            `
          : nothing}

        ${block.kind === "openDrawer"
          ? html`
                <conexia-toggle
                label="Abrir cajon"
                  ?checked=${block.openDrawer}
                  ?disabled=${this.disabled}
                  @change=${(event: Event) => {
                  this.updateBlock(index, {
                    ...block,
                    openDrawer: this.readChecked(event)
                  });
                }}
              ></conexia-toggle>
            `
          : nothing}

        ${block.kind === "charLine"
          ? html`
                <conexia-input
                  label="Linea"
                  .value=${block.charLine}
                  ?disabled=${this.disabled}
                  @input=${(event: Event) => {
                  this.updateBlock(index, {
                    ...block,
                    charLine: this.readValue(event)
                  });
                }}
              ></conexia-input>
            `
          : nothing}

        ${block.kind === "qr"
          ? html`
                <conexia-input
                  label="Contenido QR"
                  .value=${block.qrContent}
                  ?disabled=${this.disabled}
                  @input=${(event: Event) => {
                  this.updateBlock(index, {
                    ...block,
                    qrContent: this.readValue(event)
                  });
                }}
              ></conexia-input>
            `
          : nothing}

        ${block.kind === "table" ? this.renderTableEditor(block) : nothing}
      </div>
    `;
  }

  render() {
    return html`
      <conexia-card style="width: 100%; max-width: 1280px; margin: 0 auto;">
        <div slot="header" class="header">
          <strong>Plantilla de ticket</strong>
          <div class="table-actions">
            <conexia-select
              .value=${String(this.previewWidth)}
              ?disabled=${this.disabled}
              @change=${(event: Event) => {
                const value = Number(this.readValue(event));
                this.previewWidth = Number.isNaN(value) ? 80 : value;
              }}
            >
              <option value="80">80mm</option>
              <option value="58">58mm</option>
            </conexia-select>
            <conexia-toggle
              label="Mostrar vista previa"
              ?checked=${this.showPreview}
              ?disabled=${this.disabled}
              @change=${(event: Event) => {
                this.showPreview = this.readChecked(event);
              }}
            ></conexia-toggle>
            <conexia-select
              placeholder="Agregar bloque"
              .value=${""}
              ?disabled=${this.disabled}
              @change=${(event: Event) => {
                const selected = this.readValue(event) as BlockKind | "";
                if (selected) {
                  this.addBlock(selected);
                }
              }}
            >
              ${blockKinds.map(
                (kind) => html`<option value=${kind.value}>${kind.label}</option>`
              )}
            </conexia-select>
          </div>
        </div>
        <div slot="body" class="layout ${this.showPreview ? "" : "hidden-preview"}">
          <div class="builder">
            ${this.blocks.map((block, index) => this.renderBlock(block, index))}
          </div>
          ${this.showPreview
            ? html`
                <div class="preview">
                  <conexia-ticket-preview
                    .content=${this.blocks.map((block) => this.toContentBlock(block))}
                    .widthMm=${this.previewWidth}
                  ></conexia-ticket-preview>
                </div>
              `
            : nothing}
        </div>
        <div slot="footer" class="footer">
          <conexia-button ?disabled=${this.disabled} @click=${this.emitSubmit}>
            Exportar JSON
          </conexia-button>
        </div>
      </conexia-card>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "conexia-ticket-template": ConexiaTicketTemplate;
  }
}
