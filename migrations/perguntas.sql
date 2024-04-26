CREATE TABLE IF NOT EXISTS perguntas (
  id SERIAL PRIMARY KEY,
  pergunta VARCHAR(40),
  criadoPor INTEGER
);