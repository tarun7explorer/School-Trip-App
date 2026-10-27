insert into public.trips (slug, city, theme, learning_purpose) values
  ('hyderabad-stem', 'Hyderabad', 'STEM & Innovation', 'Connect science, design and problem-solving with the places and systems people build.'),
  ('jaipur-heritage', 'Jaipur', 'Heritage & Culture', 'Help students connect history, architecture, astronomy, craft and local culture through close observation.'),
  ('delhi-discovery', 'Delhi', 'History, Leadership & Institutions', 'Introduce students to India''s historical narrative, public institutions and the design of civic spaces.')
on conflict (slug) do update set
  city = excluded.city,
  theme = excluded.theme,
  learning_purpose = excluded.learning_purpose;
