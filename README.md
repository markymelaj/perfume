# Consigna Privada

Starter interno para venta a consignación con Supabase + Next.js + Vercel.

## Qué incluye
- Login por email + contraseña
- Roles `super_admin`, `owner`, `seller`
- Alta manual de usuarios sin depender del magic link
- Activar / desactivar vendedores
- Reset manual de contraseña temporal
- Proveedores, productos, consignaciones, ventas y rendiciones
- Ubicación puntual
- Mensajería interna owner/seller

## Variables de entorno
Copia `.env.example` a `.env.local`.

## Puesta en marcha
1. Crea proyecto en Supabase.
2. Ejecuta `supabase/schema.sql`.
3. Ejecuta la migración `supabase/migrations/20260414_super_admin_password_auth.sql` en 2 bloques separados.
4. Crea tu primer usuario en Supabase Auth.
5. Conviértelo a `super_admin`.
6. Despliega en Vercel con las variables correctas.

## Usuario inicial
Después de crear tu usuario en Auth:

```sql
update public.profiles
set role = 'super_admin', is_active = true, must_reenroll_security = false
where email = 'TU_CORREO';
```

## Recomendaciones
- Desactiva signup libre en Supabase.
- Mantén `SUPABASE_SERVICE_ROLE_KEY` solo en Vercel y nunca en frontend.
- Usa SMTP propio solo si luego quieres recuperación por correo.
