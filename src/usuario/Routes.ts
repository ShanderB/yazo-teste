import { Router, Request, Response, NextFunction } from 'express';
import { Pool } from 'pg';
import { criarUsuario, listagemUsuarios, alteracaoUsuario, deletarUsuario } from './';
import { validacaoTipoUsuario } from '../common/validacaoTipoUsuario';
import { UsuarioTipo } from '../constants';

export default function usuarioRoutes(pool: Pool) {
    const router = Router();

    router
        //Middleware para validar o tipo de usuário, ao invés de colocar a mesma função dentro de cada rota.
        .use((req: Request, res: Response, next: NextFunction) => validacaoTipoUsuario(req, res, UsuarioTipo.ORGANIZADOR, pool, next))
        .post('/', (req: Request, res: Response) => criarUsuario(req, res, pool))
        .get('/', (req: Request, res: Response) => listagemUsuarios(res, pool))
        .put('/', (req: Request, res: Response) => alteracaoUsuario(req, res, pool))
        .delete('/', (req: Request, res: Response) => deletarUsuario(req, res, pool));

    return router;
}