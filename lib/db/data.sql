DELETE FROM users;
DELETE FROM decisions;
DELETE FROM options;

INSERT INTO users (name)
VALUES
  ('Trevor'),
  ('Josh'),
  ('Jonathan'),
  ('Alan');

INSERT INTO decisions (description, user_id)
VALUES
  ('How do we scale?', (SELECT id FROM users WHERE name = 'Trevor')),
  ('What cloud provider do we use?', (SELECT id FROM users WHERE name = 'Josh')),
  ('What capstone project do we pursue?', (SELECT id FROM users WHERE name = 'Jonathan'));

INSERT INTO options (option, user_id, decision_id)
VALUES
  ('vertically', (SELECT id FROM users WHERE name = 'Trevor'), (SELECT id FROM decisions WHERE description = 'How do we scale?')),
  ('horizontally', (SELECT id FROM users WHERE name = 'Trevor'), (SELECT id FROM decisions WHERE description = 'How do we scale?')),
  ('AWS', (SELECT id FROM users WHERE name = 'Josh'), (SELECT id FROM decisions WHERE description = 'What cloud provider do we use?'));