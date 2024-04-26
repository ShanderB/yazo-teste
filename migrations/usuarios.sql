CREATE TABLE IF NOT EXISTS usuarios (
  id SERIAL PRIMARY KEY,
  nome VARCHAR(40),
  senha TEXT,
  tipo INTEGER NOT NULL DEFAULT 2 CHECK (tipo IN (1, 2))
);

-- Adiciona um usuário padrão
INSERT INTO usuarios (nome, senha, tipo) VALUES ('admin', 'admin', 1);