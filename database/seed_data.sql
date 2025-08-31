-- Insert sample users
INSERT INTO users (email, password_hash, name) VALUES
('user1@example.com', 'hashed_password_1', 'John Doe'),
('user2@example.com', 'hashed_password_2', 'Jane Smith'),
('user3@example.com', 'hashed_password_3', 'Mike Johnson');

-- Insert sample skills
INSERT INTO skills (name) VALUES
('Python Programming'),
('Web Development'),
('Data Analysis'),
('Graphic Design'),
('Content Writing'),
('Digital Marketing');

-- Insert user offered skills
INSERT INTO user_offered_skills (user_id, skill_id) VALUES
(1, 1),  -- John offers Python
(1, 2),  -- John offers Web Dev
(2, 3),  -- Jane offers Data Analysis
(2, 4),  -- Jane offers Graphic Design
(3, 5),  -- Mike offers Content Writing
(3, 6);  -- Mike offers Digital Marketing

-- Insert user required skills
INSERT INTO user_required_skills (user_id, skill_id) VALUES
(1, 4),  -- John needs Graphic Design
(1, 6),  -- John needs Digital Marketing
(2, 1),  -- Jane needs Python
(2, 2),  -- Jane needs Web Dev
(3, 1),  -- Mike needs Python
(3, 3);  -- Mike needs Data Analysis
