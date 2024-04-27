CREATE TABLE IF NOT EXISTS respostas (
  id SERIAL PRIMARY KEY,
  idPergunta INTEGER,
  respondidoPor INTEGER,
  resposta TEXT
);