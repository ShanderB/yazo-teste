CREATE TABLE IF NOT EXISTS usuarios (
  id SERIAL PRIMARY KEY,
  usuario VARCHAR(40),
  senha TEXT,
  tipo INTEGER NOT NULL DEFAULT 2 CHECK (tipo IN (1, 2))
);

-- Adiciona um usuário padrão
INSERT INTO usuarios (usuario, senha, tipo) VALUES ('admin', 'admin', 1);
INSERT INTO usuarios (usuario, senha, tipo) VALUES ('test', 'test', 2);