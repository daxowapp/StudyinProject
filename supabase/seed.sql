-- Seed Universities
insert into public.universities (name, slug, city, province, ranking, description, features) values
('Tsinghua University', 'tsinghua-university', 'Beijing', 'Beijing', '#1 in China', 'Tsinghua University is a major research university in Beijing, and a member of the C9 League.', ARRAY['Project 985', 'C9 League', 'Double First Class']),
('Peking University', 'peking-university', 'Beijing', 'Beijing', '#2 in China', 'Peking University is a major research university in Beijing, and a member of the C9 League.', ARRAY['Project 985', 'C9 League']),
('Fudan University', 'fudan-university', 'Shanghai', 'Shanghai', '#3 in China', 'Fudan University is a major research university in Shanghai.', ARRAY['Project 985', 'C9 League']),
('Zhejiang University', 'zhejiang-university', 'Hangzhou', 'Zhejiang', '#4 in China', 'Zhejiang University is a major research university in Hangzhou.', ARRAY['Project 985', 'C9 League']);

-- Seed Programs (We need to look up university IDs, but for raw SQL seed we can use subqueries or just insert assuming order if we reset DB)
-- Here we use a DO block to insert related data
DO $$
DECLARE
  tsinghua_id uuid;
  peking_id uuid;
BEGIN
  SELECT id INTO tsinghua_id FROM public.universities WHERE slug = 'tsinghua-university';
  SELECT id INTO peking_id FROM public.universities WHERE slug = 'peking-university';

  INSERT INTO public.programs (university_id, title, level, field, duration, tuition_fee, language, intake) VALUES
  (tsinghua_id, 'Computer Science and Technology', 'Bachelor', 'Engineering', '4 Years', 30000, 'English', 'Sep 2025'),
  (tsinghua_id, 'Architecture', 'Master', 'Architecture', '2 Years', 40000, 'English', 'Sep 2025'),
  (peking_id, 'MBA', 'Master', 'Business', '2 Years', 98000, 'English', 'Sep 2025'),
  (peking_id, 'Chinese Language', 'Non-Degree', 'Language', '1 Year', 18000, 'Chinese', 'Feb 2025');
END $$;
