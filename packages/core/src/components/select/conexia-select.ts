import { css, html, LitElement } from "lit";
import { customElement, property, query, state } from "lit/decorators.js";

export type ConexiaSelectSize = "sm" | "md" | "lg";

@customElement("conexia-select")
export class ConexiaSelect extends LitElement {
  static styles = css`
    :host {
      display: block;
      font-family: var(--cx-font-family, "Source Sans 3", "Helvetica Neue", Arial, sans-serif);
      color: var(--cx-color-text, #0f172a);
    }

    .field {
      display: grid;
      gap: 0.4rem;
    }

    .label {
      font-weight: 600;
      font-size: 0.95rem;
    }

    .helper {
      font-size: 0.85rem;
      color: var(--cx-color-muted, #475569);
    }

    .control {
      position: relative;
      display: flex;
      align-items: center;
    }

    select {
      appearance: none;
      width: 100%;
      border-radius: var(--cx-radius-md, 12px);
      border: 1px solid var(--cx-control-border, #cbd5f5);
      background: var(--cx-control-bg, #ffffff);
      color: inherit;
      font-size: 0.95rem;
      padding: 0.6rem 2.5rem 0.6rem 0.9rem;
      transition: border-color 160ms ease, box-shadow 160ms ease;
    }

    select:focus-visible {
      outline: none;
      border-color: var(--cx-color-focus, #0f172a);
      box-shadow: var(--cx-shadow-focus, 0 0 0 3px rgba(15, 23, 42, 0.18));
    }

    select:hover:not(:disabled) {
      border-color: var(--cx-control-border-hover, #94a3b8);
    }

    select:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    select[multiple] {
      padding-right: 0.9rem;
      min-height: 8rem;
    }

    .placeholder {
      color: var(--cx-control-placeholder, #94a3b8);
    }

    .icon {
      position: absolute;
      right: 0.8rem;
      pointer-events: none;
      color: var(--cx-color-muted, #475569);
    }

    :host([size="sm"]) select {
      font-size: 0.85rem;
      padding: 0.5rem 2.2rem 0.5rem 0.8rem;
    }

    :host([size="lg"]) select {
      font-size: 1rem;
      padding: 0.75rem 2.8rem 0.75rem 1rem;
    }

    :host([invalid]) select {
      border-color: var(--cx-color-danger, #dc2626);
    }

    :host([invalid]) .helper {
      color: var(--cx-color-danger, #dc2626);
    }
  `;

  @property({ type: String })
  label = "";

  @property({ type: String })
  placeholder = "";

  @property({ type: String })
  value = "";

  @property({ type: Array })
  values: string[] = [];

  @property({ type: Boolean, reflect: true })
  multiple = false;

  @property({ type: Boolean, reflect: true })
  disabled = false;

  @property({ type: Boolean, reflect: true })
  required = false;

  @property({ type: Boolean, reflect: true })
  invalid = false;

  @property({ type: String, reflect: true })
  size: ConexiaSelectSize = "md";

  @property({ type: String, attribute: "helper-text" })
  helperText = "";

  @query("select")
  private selectElement!: HTMLSelectElement;

  @query("slot:not([name])")
  private optionsSlotElement!: HTMLSlotElement;

  @state()
  private optionItems: Array<{ value: string; label: string; disabled: boolean }> = [];

  firstUpdated() {
    if (this.optionsSlotElement) {
      this.optionsSlotElement.addEventListener("slotchange", () => this.updateOptionItems());
    }
    this.updateOptionItems();
  }

  updated(changed: Map<string, unknown>) {
    if (!this.selectElement) {
      return;
    }

    if (!this.multiple && changed.has("value")) {
      this.syncValue();
    }

    if (this.multiple && changed.has("values")) {
      const valuesSet = new Set(this.values);
      Array.from(this.selectElement.options || []).forEach((option) => {
        option.selected = valuesSet.has(option.value);
      });
    }
  }

  private syncValue() {
    if (!this.selectElement) {
      return;
    }
    const options = Array.from(this.selectElement.options || []);
    const values = options.map((option) => option.value);
    const nextValue = values.includes(this.value) ? this.value : values[0] ?? "";
    if (nextValue && this.selectElement.value !== nextValue) {
      this.selectElement.value = nextValue;
    }
    if (nextValue && this.value !== nextValue) {
      this.value = nextValue;
    }
  }

  private updateOptionItems() {
    if (!this.optionsSlotElement) {
      return;
    }
    const assigned = this.optionsSlotElement.assignedElements({ flatten: true });
    const options = assigned.filter(
      (node): node is HTMLOptionElement => node.tagName === "OPTION",
    );
    this.optionItems = options.map((option) => ({
      value: option.value,
      label: option.textContent?.trim() ?? "",
      disabled: option.disabled,
    }));
    this.updateComplete.then(() => this.syncValue());
  }

  private handleChange(event: Event) {
    event.stopPropagation();
    if (this.multiple) {
      const selected = Array.from(this.selectElement.selectedOptions).map(
        (option) => option.value
      );
      this.values = selected;
    } else {
      this.value = this.selectElement.value;
    }

    this.dispatchEvent(new Event("change", { bubbles: true, composed: true }));
  }

  private handleInput(event: Event) {
    event.stopPropagation();
    this.dispatchEvent(new Event("input", { bubbles: true, composed: true }));
  }

  render() {
    const showLabel = this.label.length > 0;
    const showHelper = this.helperText.length > 0;
    const showPlaceholder = !this.multiple && this.placeholder.length > 0 && !this.value;

    return html`
      <div class="field">
        ${showLabel
          ? html`<label class="label">
              <slot name="label">${this.label}</slot>
            </label>`
          : null}
        <slot hidden></slot>
        <div class="control">
          <select
            ?multiple=${this.multiple}
            ?disabled=${this.disabled}
            ?required=${this.required}
            aria-label=${showLabel ? this.label : this.placeholder}
            @change=${this.handleChange}
            @input=${this.handleInput}
          >
            ${showPlaceholder
              ? html`<option class="placeholder" value="" disabled ?selected=${showPlaceholder} hidden>
                  ${this.placeholder}
                </option>`
              : null}
            ${this.optionItems.map(
              (option) => html`
                <option
                  value=${option.value}
                  ?disabled=${option.disabled}
                  ?selected=${this.multiple
                    ? this.values.includes(option.value)
                    : this.value === option.value}
                >
                  ${option.label}
                </option>
              `,
            )}
          </select>
          ${this.multiple
            ? null
            : html`<span class="icon"><slot name="icon">▾</slot></span>`}
        </div>
        ${showHelper
          ? html`<div class="helper"><slot name="helper">${this.helperText}</slot></div>`
          : null}
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "conexia-select": ConexiaSelect;
  }
}
