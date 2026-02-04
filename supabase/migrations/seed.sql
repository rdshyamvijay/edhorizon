
-- Insert Module
INSERT INTO public.modules (title, slug, description, icon)
VALUES ('MathHorizon', 'math-horizon', 'Master the language of the universe.', 'Calculator');

-- Insert Course
INSERT INTO public.courses (module_id, title, "order")
SELECT id, 'Grade 1', 1 FROM public.modules WHERE slug = 'math-horizon';

-- Insert Topic
INSERT INTO public.topics (course_id, title, "order")
SELECT c.id, 'Counting to 10', 1 
FROM public.courses c
JOIN public.modules m ON c.module_id = m.id
WHERE m.slug = 'math-horizon' AND c.title = 'Grade 1';

-- Insert Video Capsule
INSERT INTO public.capsules (topic_id, title, type, status, content, "order")
SELECT t.id, 'Introduction to Numbers', 'video', 'published', 
'{"videoUrl": "https://www.youtube.com/watch?v=uK7YmI1bO70", "description": "Count with us!"}'::jsonb, 1
FROM public.topics t
JOIN public.courses c ON t.course_id = c.id
WHERE t.title = 'Counting to 10';

-- Insert Quiz Capsule
INSERT INTO public.capsules (topic_id, title, type, status, content, "order")
SELECT t.id, 'Counting Quiz', 'quiz', 'published', 
'{"questions": [{"question": "How many fingers do you have on one hand?", "options": ["4", "5", "6"], "correctIndex": 1}]}'::jsonb, 2
FROM public.topics t
JOIN public.courses c ON t.course_id = c.id
WHERE t.title = 'Counting to 10';
