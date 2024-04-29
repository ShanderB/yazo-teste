import { Router, Request, Response, NextFunction } from 'express';
import { Pool } from 'pg';
import { validacaoTipoUsuario } from '../common/validacaoTipoUsuario';
import { UsuarioTipo } from '../constants';
import { alteracaoResposta, criarResposta, deletarResposta } from '.';

export default function respostaRoutes(pool: Pool) {
    const router = Router();

    router
        //Rota para a criação de respostas, permitido apenas para participantes e organizadores.
        .use((req: Request, res: Response, next: NextFunction) => validacaoTipoUsuario(req, res, UsuarioTipo.PARTICIPANTE, pool, next))
        .put('/:id', (req: Request, res: Response) => alteracaoResposta(req, res, pool))
        .delete('/:id', (req: Request, res: Response) => deletarResposta(req, res, pool))
        .post('/', (req: Request, res: Response) => criarResposta(req, res, pool));

    return router;
}