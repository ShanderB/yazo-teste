import { Pool } from "pg";
import { Request, Response } from 'express';
import { UsuarioTipo } from "../constants";

// Mensagens de erro e sucesso
const ERRO_CAMPOS = 'Por favor, preencha todos os campos corretamente.';
const ERRO_USUARIO_EXISTE = 'Usuário já existe.';
const ERRO_ADICIONAR_USUARIO = 'Erro ao adicionar novo usuário ao banco.';
const SUCESSO_ADICIONAR_USUARIO = (usuario: string) => `Adicionado "${usuario}" ao banco.`;

export default async function criarUsuario(req: Request, res: Response, pool: Pool) {
    const { usuario, senha, tipo } = req.body;

    if (!usuario || usuario.length > 40 || !senha || !tipo || (tipo !== UsuarioTipo.ORGANIZADOR && tipo !== UsuarioTipo.PARTICIPANTE)) {
        res.status(400).json({ message: ERRO_CAMPOS });
        return;
    }

    const hasUsuario = await pool.query('SELECT usuario FROM usuarios WHERE usuario = $1', [usuario]);

    if (hasUsuario.rows.length) {
        res.status(400).json({ message: ERRO_USUARIO_EXISTE });
        return;
    }

    const retornoBanco = await pool.query('INSERT INTO usuarios (usuario, senha, tipo) VALUES ($1, $2, $3)', [usuario, senha, tipo]);

    if (retornoBanco.rowCount === 1) {
        res.status(200).json({ message: SUCESSO_ADICIONAR_USUARIO(usuario) });
        return;
    } else {
        res.status(500).json({ message: ERRO_ADICIONAR_USUARIO });
        return;
    }
}