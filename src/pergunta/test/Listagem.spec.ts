import { Pool } from "pg";
import { Request, Response } from 'express';
import { listagemPerguntas } from '../Listagem'; // Import the function listagemPerguntas

jest.mock('../../common/validacaoTipoUsuario');

describe('listagemPerguntas', () => {
    let req: Partial<Request>;
    let res: Partial<Response>;
    let pool: jest.Mocked<Pool>;

    beforeEach(() => {
        req = {};

        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        pool = {
            query: jest.fn(),
        } as any;
    });

    it('Deve retornar 400 se não houver perguntas no banco de dados', async () => {
        pool.query.mockResolvedValue({ rows: [], rowCount: 0 } as never);

        await listagemPerguntas(req as Request, res as Response, pool);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ message: 'Sem dados no banco.' });
    });

    it('Deve retornar 200 e a lista de perguntas se houver perguntas no banco de dados', async () => {
        const fakePerguntas = [{ id: 1, pergunta: 'pergunta', criadopor: 1 }];
        pool.query.mockResolvedValueOnce({ rows: fakePerguntas, rowCount: 1 } as never);
        pool.query.mockResolvedValueOnce({ rows: [], rowCount: 0 } as never);

        await listagemPerguntas(req as Request, res as Response, pool);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith([{ ...fakePerguntas[0], respondido: false }]);
    });

    it('Deve marcar perguntas como respondidas se o usuário já respondeu', async () => {
        const fakePerguntas = [{ id: 1, pergunta: 'pergunta', criadopor: 1 }];
        const fakeRespostas = [{ idpergunta: 1 }];
        pool.query.mockResolvedValueOnce({ rows: fakePerguntas, rowCount: 1 } as never);
        pool.query.mockResolvedValueOnce({ rows: fakeRespostas, rowCount: 1 } as never);

        await listagemPerguntas(req as Request, res as Response, pool);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith([{ ...fakePerguntas[0], respondido: true }]);
    });
});