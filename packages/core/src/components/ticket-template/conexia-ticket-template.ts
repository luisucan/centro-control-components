import { css, html, LitElement, nothing } from "lit";
import { customElement, property, query, state } from "lit/decorators.js";

import "../card/conexia-card";
import "../button/conexia-button";
import "../select/conexia-select";
import "../input/conexia-input";
import "../toggle/conexia-toggle";
import "../ticket-preview/conexia-ticket-preview";
import "../ticket-text-block/conexia-ticket-text-block";
import "../ticket-table-header-editor/conexia-ticket-table-header-editor";
import "../ticket-image-block/conexia-ticket-image-block";
import "../ticket-qr-block/conexia-ticket-qr-block";

type Align = "left" | "center" | "right";

type BlockKind =
  | "image"
  | "text"
  | "cut"
  | "openDrawer"
  | "charLine"
  | "table"
  | "qr";

type TextBlock = {
  text: string;
  bold?: boolean;
  size?: {
    width: number;
    height: number;
  };
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
  | {
      kind: "text";
      text: string;
      align: Align;
      bold: boolean;
      sizeWidth: number | null;
      sizeHeight: number | null;
    }
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
  { value: "qr", label: "QR" },
  { value: "table", label: "Tabla" },
  { value: "cut", label: "Corte" },
  { value: "openDrawer", label: "Abrir caja" },
  { value: "cut", label: "Corte de caja" },
];

@customElement("conexia-ticket-template")
export class ConexiaTicketTemplate extends LitElement {
  static styles = css`
    :host {
      display: block;
      font-family: var(
        --cx-font-family,
        "Source Sans 3",
        "Helvetica Neue",
        Arial,
        sans-serif
      );
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
      grid-template-columns: minmax(0, 1.7fr) minmax(0, 1fr);
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

    .cut-label {
      text-align: center;
      font-weight: 600;
      color: var(--cx-color-text, #0f172a);
      background: var(--cx-color-secondary, #f8fafc);
      border: 1px dashed var(--cx-color-border, #e2e8f0);
      border-radius: 999px;
      padding: 0.35rem 0.75rem;
    }

    .drawer-label {
      text-align: center;
      font-weight: 600;
      color: var(--cx-color-text, #0f172a);
      background: var(--cx-color-secondary, #f8fafc);
      border: 1px dashed var(--cx-color-border, #e2e8f0);
      border-radius: 999px;
      padding: 0.35rem 0.75rem;
    }

    conexia-input,
    conexia-select,
    conexia-toggle {
      max-width: 100%;
    }

    .size-input {
      max-width: 140px;
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

  @state()
  private shouldScrollToEnd = false;

  @state()
  private restoreScrollTop: number | null = null;

  @query(".builder")
  private builderElement?: HTMLElement;

  updated(changed: Map<string, unknown>) {
    if (changed.has("value")) {
      this.blocks = this.normalizeValue(this.value);
    }
    if (this.restoreScrollTop !== null) {
      const builder = this.builderElement;
      if (builder) {
        builder.scrollTop = this.restoreScrollTop;
      }
      this.restoreScrollTop = null;
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
          align: item.align ?? "center",
          bold: Boolean(item.bold),
          sizeWidth: item.size?.width ?? 1,
          sizeHeight: item.size?.height ?? 1,
        };
      }

      return this.createDefaultBlock();
    });
  }

  private normalizeTable(table: TableBlock): BuilderBlock {
    const header = (table.header || []).map((cell) => ({
      text: cell.text ?? "",
      align: cell.align ?? "left",
    }));

    const safeHeader =
      header.length > 0 ? header : [{ text: "", align: "left" }];
    const columnCount = safeHeader.length;
    const rows = (table.rows || []).map((row) =>
      Array.from({ length: columnCount }).map((_, index) => {
        const cell = row[index] || { text: "", align: "left" };
        return {
          text: cell.text ?? "",
          align: cell.align ?? "left",
        };
      }),
    );
    const columnWidths = this.normalizeColumnWidths(
      table.columnWidths,
      columnCount,
    );

    return {
      kind: "table",
      header: safeHeader,
      headerBold: Boolean(table.headerBold),
      columnWidths,
      lineChar: table.lineChar ?? "-",
      rowSpacing: typeof table.rowSpacing === "number" ? table.rowSpacing : 1,
      footerLine: Boolean(table.footerLine),
      rows,
    };
  }

  private normalizeColumnWidths(
    widths: number[] | undefined,
    count: number,
  ): number[] {
    if (!widths || widths.length === 0) {
      const base = Math.floor(100 / count);
      return Array.from({ length: count }).map((_, index) =>
        index === count - 1 ? 100 - base * (count - 1) : base,
      );
    }

    return Array.from({ length: count }).map(
      (_, index) => widths[index] ?? widths[0] ?? 0,
    );
  }

  private createDefaultBlock(): BuilderBlock {
    return {
      kind: "text",
      text: "",
      align: "center",
      bold: false,
      sizeWidth: 1,
      sizeHeight: 1,
    };
  }

  private emitChange() {
    const content = this.blocks.map((block) => this.toContentBlock(block));
    this.dispatchEvent(
      new CustomEvent<EscPosContentBlock[]>("contentChange", {
        detail: content,
        bubbles: true,
        composed: true,
      }),
    );
  }

  private emitSubmit() {
    const content = this.blocks.map((block) => this.toContentBlock(block));
    this.dispatchEvent(
      new CustomEvent<EscPosContentBlock[]>("contentSubmit", {
        detail: content,
        bubbles: true,
        composed: true,
      }),
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
        return {
          text: block.text,
          align: block.align ?? "center",
          bold: block.bold || undefined,
          size:
            block.sizeWidth !== null && block.sizeHeight !== null
              ? { width: block.sizeWidth, height: block.sizeHeight }
              : undefined,
        };
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
          rows: block.rows,
        };
      case "qr":
        return { qrContent: block.qrContent };
      default:
        return { text: "", align: "left" };
    }
  }

  private updateBlock(index: number, updated: BuilderBlock) {
    const builder = this.builderElement;
    if (builder) {
      this.restoreScrollTop = builder.scrollTop;
    }
    this.blocks = this.blocks.map((block, i) =>
      i === index ? updated : block,
    );
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
            { text: "Columna 3", align: "right" },
          ],
          headerBold: true,
          columnWidths: [60, 20, 20],
          lineChar: "-",
          rowSpacing: 1,
          footerLine: true,
          rows: [],
        };
      case "qr":
        return { kind: "qr", qrContent: "" };
      case "text":
      default:
        return {
          kind: "text",
          text: "",
          align: "center",
          bold: false,
          sizeWidth: 1,
          sizeHeight: 1,
        };
    }
  }

  private removeBlock(index: number) {
    const builder = this.builderElement;
    if (builder) {
      this.restoreScrollTop = builder.scrollTop;
    }
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
    const builder = this.builderElement;
    if (builder) {
      this.restoreScrollTop = builder.scrollTop;
    }
    const updated = [...this.blocks];
    const [moved] = updated.splice(index, 1);
    updated.splice(targetIndex, 0, moved);
    this.blocks = updated;
    this.emitChange();
  }

  private renderTableEditor(block: BuilderBlock) {
    if (block.kind !== "table") {
      return nothing;
    }

    return html`
      <conexia-ticket-table-header-editor
        .header=${block.header}
        .headerBold=${block.headerBold}
        .columnWidths=${block.columnWidths}
        ?disabled=${this.disabled}
        @change=${(event: CustomEvent) => {
          const detail = event.detail as {
            header: TableCell[];
            headerBold: boolean;
            columnWidths: number[];
          };
          this.updateBlock(this.blocks.indexOf(block), {
            ...block,
            header: detail.header,
            headerBold: detail.headerBold,
            columnWidths: detail.columnWidths
          });
        }}
      ></conexia-ticket-table-header-editor>
    `;
  }

  private renderBlock(block: BuilderBlock, index: number) {
    return html`
      <div class="block">
        <div class="block-header">
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
            <conexia-button
              size="sm"
              variant="ghost"
              @click=${() => this.removeBlock(index)}
            >
              Quitar
            </conexia-button>
          </div>
        </div>

        ${block.kind === "text"
          ? html`
              <conexia-ticket-text-block
                .value=${{
                  text: block.text,
                  align: block.align,
                  bold: block.bold,
                  size: {
                    width: block.sizeWidth ?? 1,
                    height: block.sizeHeight ?? 1
                  }
                }}
                ?disabled=${this.disabled}
                @change=${(event: CustomEvent) => {
                  const detail = event.detail as {
                    text: string;
                    align: Align;
                    bold?: boolean;
                    size?: { width: number; height: number };
                  };
                  this.updateBlock(index, {
                    ...block,
                    text: detail.text,
                    align: detail.align ?? "center",
                    bold: Boolean(detail.bold),
                    sizeWidth: detail.size?.width ?? 1,
                    sizeHeight: detail.size?.height ?? 1
                  });
                }}
              ></conexia-ticket-text-block>
            `
          : nothing}
        ${block.kind === "image"
          ? html`
              <conexia-ticket-image-block
                .value=${{ src: block.src }}
                ?disabled=${this.disabled}
                @change=${(event: CustomEvent) => {
                  const detail = event.detail as { src: string };
                  this.updateBlock(index, { ...block, src: detail.src });
                }}
              ></conexia-ticket-image-block>
            `
          : nothing}
        ${block.kind === "cut"
          ? html`
              <div class="cut-label">Cortar papel</div>
            `
          : nothing}
        ${block.kind === "openDrawer"
          ? html`
              <div class="drawer-label">Abrir caja</div>
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
                    charLine: this.readValue(event),
                  });
                }}
              ></conexia-input>
            `
          : nothing}
        ${block.kind === "qr"
          ? html`
              <conexia-ticket-qr-block
                .value=${{ qrContent: block.qrContent }}
                ?disabled=${this.disabled}
                @change=${(event: CustomEvent) => {
                  const detail = event.detail as { qrContent: string };
                  this.updateBlock(index, { ...block, qrContent: detail.qrContent });
                }}
              ></conexia-ticket-qr-block>
            `
          : nothing}
        ${block.kind === "table" ? this.renderTableEditor(block) : nothing}
      </div>
    `;
  }

  render() {
    return html`
      <conexia-card style="width: 100%; max-width: 1440px; margin: 0 auto;">
        <div slot="header" class="header">
          <strong>Plantilla</strong>
          <div class="table-actions">
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
                (kind) =>
                  html`<option value=${kind.value}>${kind.label}</option>`,
              )}
            </conexia-select>
          </div>
        </div>
        <div
          slot="body"
          class="layout ${this.showPreview ? "" : "hidden-preview"}"
        >
          <div class="builder">
            ${this.blocks.map((block, index) => this.renderBlock(block, index))}
          </div>
          ${this.showPreview
            ? html`
                <div class="preview">
                  <conexia-ticket-preview
                    .content=${this.blocks.map((block) =>
                      this.toContentBlock(block),
                    )}
                    .widthMm=${this.previewWidth}
                  ></conexia-ticket-preview>
                </div>
              `
            : nothing}
        </div>
        <div slot="footer" class="footer">
          <conexia-button ?disabled=${this.disabled} @click=${this.emitSubmit}>
            Guardar
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
