import { css, html, LitElement } from "lit";
import { customElement, property, queryAssignedElements, state } from "lit/decorators.js";

export type ConexiaCardVariant = "elevated" | "outline";
export type ConexiaCardPadding = "sm" | "md" | "lg";

@customElement("conexia-card")
export class ConexiaCard extends LitElement {
  static styles = css`
    :host {
      display: block;
      font-family: var(--cx-font-family, "Source Sans 3", "Helvetica Neue", Arial, sans-serif);
      color: var(--cx-color-text, #0f172a);
      background: var(--cx-color-surface, #ffffff);
      border-radius: var(--cx-radius-md, 12px);
      border: 1px solid var(--cx-card-border, var(--cx-color-border, #e2e8f0));
      box-shadow: var(--cx-card-shadow, var(--cx-shadow-sm, 0 1px 2px rgba(15, 23, 42, 0.08)));
      overflow: hidden;
    }

    :host([variant="outline"]) {
      --cx-card-shadow: none;
    }

    .section {
      padding: var(--cx-card-padding, 1rem);
    }

    .divider {
      border-top: 1px solid var(--cx-color-border, #e2e8f0);
    }

    :host([padding="sm"]) {
      --cx-card-padding: 0.75rem;
    }

    :host([padding="md"]) {
      --cx-card-padding: 1rem;
    }

    :host([padding="lg"]) {
      --cx-card-padding: 1.25rem;
    }
  `;

  @property({ type: String, reflect: true })
  variant: ConexiaCardVariant = "elevated";

  @property({ type: String, reflect: true })
  padding: ConexiaCardPadding = "md";

  @state()
  private hasHeader = false;

  @state()
  private hasFooter = false;

  @queryAssignedElements({ slot: "header", flatten: true })
  private headerNodes!: HTMLElement[];

  @queryAssignedElements({ slot: "footer", flatten: true })
  private footerNodes!: HTMLElement[];

  private handleSlotChange() {
    this.hasHeader = (this.headerNodes?.length || 0) > 0;
    this.hasFooter = (this.footerNodes?.length || 0) > 0;
  }

  render() {
    return html`
      <div class="section" ?hidden=${!this.hasHeader}>
        <slot name="header" @slotchange=${this.handleSlotChange}></slot>
      </div>
      <div class="divider" ?hidden=${!this.hasHeader}></div>
      <div class="section">
        <slot name="body"></slot>
      </div>
      <div class="divider" ?hidden=${!this.hasFooter}></div>
      <div class="section" ?hidden=${!this.hasFooter}>
        <slot name="footer" @slotchange=${this.handleSlotChange}></slot>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "conexia-card": ConexiaCard;
  }
}
