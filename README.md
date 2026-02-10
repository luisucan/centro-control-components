# Conexia Components

Monorepo de componentes web con Lit y wrappers para React y Angular.

## Paquetes

- `@conexia/core`: Web Components en Lit
- `@conexia/react`: Wrapper React
- `@conexia/angular`: Wrapper Angular

## Scripts

- `npm run build`: compila todos los paquetes
- `npm run dev`: modo watch en paquetes que lo soporten
- `npm run storybook`: Storybook para `@conexia/core`
- `npm run build-storybook`: build estático de Storybook

## Uso en Vanilla (sin bundler)

```html
<script type="module">
  import { defineConexiaComponents } from "https://unpkg.com/@conexia/core@latest/dist/index.js";

  defineConexiaComponents();

  const template = document.querySelector("conexia-ticket-template");
  template.addEventListener("contentChange", (event) => {
    console.log(event.detail);
  });

  template.addEventListener("contentSubmit", (event) => {
    console.log("Guardar", event.detail);
  });
</script>
```

## Uso en React

```tsx
import { useCallback } from "react";
import {
  ConexiaTicketTemplate,
  defineConexiaComponents
} from "@conexia/react";

defineConexiaComponents();

export function App() {
  const handleChange = useCallback((event: CustomEvent) => {
    console.log(event.detail);
  }, []);

  return (
    <ConexiaTicketTemplate onContentChange={handleChange} />
  );
}
```

## Eventos

- `contentChange`: emite el `content[]` actualizado
- `contentSubmit`: emite el `content[]` cuando se presiona Guardar

## Ejemplos

- `examples/vanilla/index.html`
- `examples/react/index.html`
