CREATE TABLE profiles (
    id UUID PRIMARY KEY,
    family_id UUID,
    full_name TEXT,
    role TEXT
);

ALTER TABLE profiles enable ROW LEVEL SECURITY;

CREATE POlICY "Users can view family members"
ON profiles FOR SELECT
TO authenticated
USING (
    family_id = (SELECT family_id FROM profiles WHERE id = auth.uid())
    );

CREATE POLICY "Users can update their own profiles"
ON profiles FOR UPDATE
TO authenticated
USING (auth.uid() = id);

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, role)
  VALUES (
    new.id,
    new.raw_user_meta_data->>'full_name', -- Grabs the name from the signup form
    'member'                              -- Everyone starts as a standard member
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
