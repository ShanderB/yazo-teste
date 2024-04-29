CREATE TABLE IF NOT EXISTS perguntas (
  id SERIAL PRIMARY KEY,
  pergunta TEXT,
  criadoPor INTEGER,
  FOREIGN KEY (criadoPor) REFERENCES usuarios(id)
);

INSERT INTO perguntas (pergunta, criadoPor) VALUES ('Qual é a sua cor favorita?', 1);
INSERT INTO perguntas (pergunta, criadoPor) VALUES ('Qual é o seu animal favorito?', 2);