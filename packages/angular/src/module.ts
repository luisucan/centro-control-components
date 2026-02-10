import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from "@angular/core";

import { registerConexiaComponents } from "./register";

@NgModule({
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ConexiaComponentsModule {
  static register(): void {
    registerConexiaComponents();
  }
}
