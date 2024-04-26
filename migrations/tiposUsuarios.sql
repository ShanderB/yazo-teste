CREATE TABLE usuarioTypes (
    id SERIAL PRIMARY KEY,
    description VARCHAR(255) NOT NULL,
    can_create BOOLEAN NOT NULL DEFAULT false,
    can_answer BOOLEAN NOT NULL DEFAULT true
);

INSERT INTO usuarioTypes (description, can_create, can_answer) VALUES
('Organizador', true, true),
('Participante', false, true);