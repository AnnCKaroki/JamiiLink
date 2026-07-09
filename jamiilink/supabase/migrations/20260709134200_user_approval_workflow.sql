ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS is_approved BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS approved_at TIMESTAMP WITH TIME ZONE;

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, role, is_approved)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'full_name', 'New Family Member'),
    'member',
    false -- Blocked by default until an admin activates them
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP POLICY IF EXISTS "Family members can view contacts" ON public.contacts;

CREATE POLICY "Approved family members can view contacts"
ON public.contacts FOR SELECT TO authenticated
USING (
    family_id = public.get_my_family_id()
    AND (SELECT is_approved FROM public.profiles WHERE id = auth.uid()) = true
);

CREATE POLICY "Admins can manage user approval statuses"
ON public.profiles FOR UPDATE TO authenticated
USING (
    (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin'
);
