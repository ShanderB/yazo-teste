CREATE TABLE IF NOT EXISTS respostas (
  id SERIAL PRIMARY KEY,
  idPergunta INTEGER,
  respondidoPor INTEGER,
  resposta TEXT,
  FOREIGN KEY (idPergunta) REFERENCES perguntas(id),
  FOREIGN KEY (respondidoPor) REFERENCES usuarios(id)
);

INSERT INTO respostas (idPergunta, respondidoPor, resposta) VALUES (1, 2, 'Azul');
INSERT INTO respostas (idPergunta, respondidoPor, resposta) VALUES (2, 1, 'Cachorro');