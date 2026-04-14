# Patch: super usuario + login por contraseña

## Qué cambia
- se elimina la dependencia del magic link para operar
- login por email + contraseña
- se agrega el rol `super_admin`
- `super_admin` y `owner` usan el panel admin
- creación de vendedores con contraseña temporal
- activación / desactivación de vendedores
- reset manual de contraseña temporal

## Paso a paso
1. Corre el SQL de `supabase/migrations/20260414_super_admin_password_auth.sql`
2. Convierte tu usuario actual a `super_admin` con el UPDATE comentado del mismo archivo
3. Reemplaza los archivos del proyecto por estos
4. Haz redeploy en Vercel
5. En Supabase deja desactivado el signup libre
6. Entra con email + contraseña

## Nota
La ruta `/api/admin/invite-user` quedó reutilizada, pero ahora crea usuarios con contraseña temporal y no envía correo.
