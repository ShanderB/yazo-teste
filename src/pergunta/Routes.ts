import { Router, Request, Response, NextFunction } from 'express';
import { Pool } from 'pg';
import { criarPergunta, listagemPerguntas, listagemPorId } from './';
import { validacaoTipoUsuario } from '../common/validacaoTipoUsuario';
import { UsuarioTipo } from '../constants';

export default function perguntaRoutes(pool: Pool) {
    const router = Router();

    router
        //Preciso permitir que todos sejam somente organizadores, exceto para o get. Devido a isso, adicionei o tenário dentro da validação.
        .use((req: Request, res: Response, next: NextFunction) => validacaoTipoUsuario(
            req, res,
            (req.method === 'GET' ? UsuarioTipo.PARTICIPANTE : UsuarioTipo.ORGANIZADOR),
            pool, next
        ))
        .post('/', (req: Request, res: Response) => criarPergunta(req, res, pool))
        .get('/', (req: Request, res: Response) => listagemPerguntas(req, res, pool))

        //Como a validação é um pouco diferente para os requests acima, preferi separar para evitar um código muito complexo de entender.
        //Rota responsável pela listagem de perguntas por ID com respostas, permitido apenas para organizadores.
        .use('/:id', (req: Request, res: Response, next: NextFunction) => validacaoTipoUsuario(req, res, UsuarioTipo.ORGANIZADOR, pool, next))
        .get('/:id', (req: Request, res: Response) => listagemPorId(req, res, pool));

    return router;
}