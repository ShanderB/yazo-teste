import { NextFunction, Request, Response } from 'express';
import { Pool } from "pg";
import jwt from 'jsonwebtoken';
import { UsuarioTipo } from '../constants';
import { MinhaJwtPayload } from '../interfaces/JWT';
import { UsuarioBanco } from '../interfaces/UsuarioBanco';

const TOKEN_NOT_PROVIDED = 'Token não fornecido';
const UNAUTHORIZED = 'Você não tem autorização.';
const INVALID_TOKEN = 'Token inválido';

export async function validacaoTipoUsuario(req: Request, res: Response, tipoUsuarioPermissao: UsuarioTipo, pool: Pool, next: NextFunction): Promise<void> {
  const authHeader = req.headers.authorization?.split(' ')[1];

  if (!authHeader) {
    res.status(401).json({ message: TOKEN_NOT_PROVIDED });
    return;
  }

  try {
    const { usuario, senha } = jwt.verify(authHeader, process.env.JWT_SECRET!) as MinhaJwtPayload;

    if (usuario && senha) {
      const retornoBanco = await pool.query('SELECT * FROM usuarios WHERE usuario = $1 AND senha = $2', [usuario, senha]);
      const usuarioBanco: UsuarioBanco = retornoBanco.rows?.pop();

      if (usuarioBanco.tipo === UsuarioTipo.ORGANIZADOR || usuarioBanco.tipo === tipoUsuarioPermissao) {
        next();
        return;
      }
    }

    res.status(401).json({ message: UNAUTHORIZED });
  } catch (err) {
    res.status(401).json({ message: INVALID_TOKEN });
  }
};

export function dadosJWT(req: Request, res: Response, pool: Pool): MinhaJwtPayload | undefined {
  const authHeader = req.headers.authorization?.split(' ')[1];
  let dadosUsuario: MinhaJwtPayload | undefined = undefined;

  try {
    const { usuario, senha, usuarioId } = jwt.verify(authHeader!, process.env.JWT_SECRET!) as MinhaJwtPayload;
    dadosUsuario = { usuario, senha, usuarioId };
  } catch (err) {
    console.log(err)
  }

  return dadosUsuario;
}