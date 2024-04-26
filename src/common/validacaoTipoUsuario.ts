import { Request, Response } from 'express';
import { Pool, QueryResult } from "pg";
import jwt, { JwtPayload } from 'jsonwebtoken';
import { UsuarioTipo } from '../constants';


//TODO jogar em uma interface própria
interface MinhaJwtPayload extends JwtPayload {
  usuario: string;
  senha: string;
}

//TODO jogar em uma interface própria
interface UsuarioBanco {
  id: string;
  nome: string;
  senha: string;
  tipo: UsuarioTipo;
}

export async function validacaoTipoUsuario(req: Request, res: Response, tipoUsuarioPermissao: UsuarioTipo, pool: Pool): Promise<boolean> {
  const authHeader = req.headers.authorization?.split(' ')[1];

  if (!authHeader) {
    res.status(401).json({ message: 'Token não fornecido' });
    return false;
  }

  try {
    const { usuario, senha } = jwt.verify(authHeader, process.env.JWT_SECRET!) as MinhaJwtPayload;


    if (usuario && senha) {
      const retornoBanco = await pool.query('SELECT * FROM usuarios WHERE nome = $1 AND senha = $2', [usuario, senha]);

      if (retornoBanco.rows?.pop().tipo === tipoUsuarioPermissao) {
        return true;
      }
    }

    res.status(401).json({ message: 'Você não tem autorização para efetuar o cadastro.' });
    return false;
  } catch (err) {
    throw new Error('Você não tem autorização para efetuar o cadastro.') as any;
    res.status(401).json({ message: 'Token inválido' });
    return false;
  }
};