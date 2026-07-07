### Donaciones (`/api/donaciones`)

| Método | Ruta | Rol |
|---|---|---|
| POST | `/` | Público (anónima o registrada, comprobante obligatorio: JPG/PNG/PDF, máx. 5MB) |
| GET | `/` | `central` |
| PATCH | `/:id` | `central` (valida o rechaza) |
