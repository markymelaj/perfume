-- 1) Agregar rol super_admin
DO $$
BEGIN
  ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'super_admin';
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

-- 2) Hacer que las políticas actuales traten owner y super_admin como administradores
CREATE OR REPLACE FUNCTION public.is_owner()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COALESCE(public.current_user_role() IN ('owner', 'super_admin'), false)
$$;

GRANT EXECUTE ON FUNCTION public.is_owner() TO authenticated;

-- 3) Convierte tu usuario actual a super_admin manualmente cambiando el email
-- UPDATE public.profiles
-- SET role = 'super_admin', is_active = true, must_reenroll_security = false
-- WHERE email = 'tu_correo@dominio.com';
