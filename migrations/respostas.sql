CREATE TABLE IF NOT EXISTS respostas (
  id SERIAL PRIMARY KEY,
  idPergunta INTEGER,
  respondidoPor INTEGER,
  resposta TEXT
);

INSERT INTO respostas (idPergunta, respondidoPor, resposta) VALUES (1, 1, 'Azul');
INSERT INTO respostas (idPergunta, respondidoPor, resposta) VALUES (2, 2, 'Cachorro');