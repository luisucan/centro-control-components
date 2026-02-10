# @conexia/core

Componentes web (Lit) para Conexia.

## Instalacion

```
npm install @conexia/core
```

## Uso (Vanilla, sin bundler)

```html
<script type="module">
  import { defineConexiaComponents } from "https://unpkg.com/@conexia/core@latest/dist/index.js";

  defineConexiaComponents();

  const template = document.querySelector("conexia-ticket-template");
  template.addEventListener("contentChange", (event) => {
    console.log(event.detail);
  });
</script>
```

## Eventos

- `contentChange`: emite el `content[]`
- `contentSubmit`: emite el `content[]` al guardar
