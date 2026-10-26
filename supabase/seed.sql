insert into public.trips (slug, city, theme, learning_purpose) values
  ('hyderabad-stem', 'Hyderabad', 'STEM & Innovation', 'Encourage curiosity, problem-solving and practical understanding of technology.'),
  ('jaipur-heritage', 'Jaipur', 'Heritage & Culture', 'Help students connect classroom learning with historic places, design, craftsmanship and local culture.'),
  ('delhi-discovery', 'Delhi', 'History, Leadership & Institutions', 'Introduce students to India''s historical narrative, public institutions and civic life.')
on conflict (slug) do update set
  city = excluded.city,
  theme = excluded.theme,
  learning_purpose = excluded.learning_purpose;
