# @conexia/react

Wrappers React para los Web Components de Conexia.

## Instalacion

```
npm install @conexia/react @conexia/core
```

## Uso

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

- `onContentChange`: `CustomEvent` con `detail` = `content[]`
- `onContentSubmit`: `CustomEvent` con `detail` = `content[]`
