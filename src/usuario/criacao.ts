import { Pool } from "pg";
import { Request, Response } from 'express';
import { UsuarioTipo } from "../constants";
import { validacaoTipoUsuario } from "../common/validacaoTipoUsuario";

export async function criarUsuario(req: Request, res: Response, pool: Pool) {
    const { usuario, senha, tipo } = req.body;

    //TODO separar isso no próprio validador.
    if (!usuario || usuario.length > 40 || !senha || !tipo || (tipo !== UsuarioTipo.ORGANIZADOR && tipo !== UsuarioTipo.PARTICIPANTE)) {
        res.status(400).json({ message: 'Por favor, preencha todos os campos corretamente.' });
        return;
    }

    const hasUsuario = await pool.query('SELECT usuario FROM usuarios WHERE usuario = $1', [usuario]);

    //TODO Separar em arquivo.
    if (hasUsuario.rows.length) {
        res.status(400).json({ message: 'Usuário já existe.' });
        return;
    } else if (hasUsuario.rows[0]?.usuario.length > 40) {
        res.status(400).json({ message: 'Nome do usuário excede o limite.' });
        return;
    }

    //TODO salvar como jwt
    const retornoBanco = await pool.query('INSERT INTO usuarios (usuario, senha, tipo) VALUES ($1, $2, $3)', [usuario, senha, tipo]);

    if (retornoBanco.rowCount === 1) {
        res.status(200).json({ message: `Adicionado "${usuario}" ao banco.` });
        return;
    } else {
        res.status(500).json({ message: 'Erro ao adicionar novo usuário ao banco.' });
        return;
    }
}