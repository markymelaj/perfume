# Consigna Privada

Starter interno para venta a consignación con Next.js, Supabase, GitHub y Vercel.

## Incluye

- Login privado e invite-only
- Roles `owner` y `seller`
- Productos y proveedores
- Consignaciones
- Registro de ventas
- Caja por vendedor
- Rendiciones parciales o totales
- Ubicación puntual
- Mensajería interna `owner ↔ seller`
- Auditoría
- SQL base para Supabase
- Preparado para Vercel

## Tecnologías

- Next.js App Router
- TypeScript
- Tailwind CSS
- Supabase Auth + Database + RLS
- `@supabase/ssr` para SSR con cookies
- GitHub + Vercel

## Antes de empezar

### 1) Crear el proyecto en Supabase
Crea un proyecto nuevo y separado para esta app.

### 2) Ejecutar el SQL
Abre el SQL Editor y corre:

- `supabase/schema.sql`

Opcional:
- `supabase/seed.sql`

### 3) Desactivar registro libre
En Supabase Auth, desactiva el registro libre. El login está pensado para usuarios previamente creados o invitados.

### 4) Crear el primer owner
Crea un usuario desde **Authentication > Users** y luego corre:

```sql
update public.profiles
set role = 'owner', is_active = true, must_reenroll_security = false
where email = 'tu_correo@dominio.com';
```

### 5) Variables de entorno
Copia `.env.example` a `.env.local` y completa:

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Desarrollo local

```bash
npm install
npm run dev
```

## Despliegue en Vercel

1. Sube este proyecto a GitHub.
2. Importa el repo en Vercel.
3. Agrega las mismas variables de entorno del `.env.local`.
4. Define `NEXT_PUBLIC_APP_URL` con la URL final de Vercel.
5. En Supabase Auth, agrega esa URL como Site URL y Redirect URL.

## Flujo de acceso

- El owner invita vendedores desde el panel.
- El vendedor recibe acceso inicial por email.
- El login usa magic link con `shouldCreateUser: false`.
- Existe una bandera `must_reenroll_security` para preparar un flujo de refuerzo de seguridad y recuperación.

## Estado actual del proyecto

Este starter deja operativos los módulos principales de negocio y el esquema de seguridad cerrado.
La parte de passkeys / WebAuthn queda **preparada a nivel de arquitectura**, pero no está implementada completamente en esta primera versión. La recuperación actual se resuelve reiniciando el acceso desde owner y volviendo a emitir ingreso inicial.

## Estructura principal

- `/login`
- `/owner`
- `/owner/users`
- `/owner/products`
- `/owner/consignments`
- `/owner/reconciliations`
- `/owner/messages`
- `/owner/locations`
- `/owner/audit`
- `/seller`
- `/seller/stock`
- `/seller/sales`
- `/seller/cash`
- `/seller/messages`
- `/seller/location`

## Notas

- Todas las lecturas sensibles pasan por RLS.
- Las escrituras principales pasan por route handlers del backend.
- El seller no ve ni interactúa con otros sellers.
- La mensajería interna es solo `owner ↔ seller`.
