import { Pool } from "pg";
import { Request, Response } from 'express';
import { alteracaoPergunta } from '../';

describe('alteracaoPergunta', () => {
    let req: Partial<Request>;
    let res: Partial<Response>;
    let pool: jest.Mocked<Pool>;

    beforeEach(() => {
        req = {
            params: {
                id: '1',
            },
            body: {
                texto: 'texto',
                resposta: 'resposta',
            },
        };

        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        pool = {
            query: jest.fn(),
        } as any;
    });

    it('Deve retornar 200 se a pergunta for atualizada com sucesso', async () => {
        pool.query.mockResolvedValueOnce({ rowCount: 1 } as never);
        pool.query.mockResolvedValueOnce({ rowCount: 1 } as never);
        await alteracaoPergunta(req as Request, res as Response, pool);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ message: `Atualizada a pergunta "${req.params!.id}" no banco.` });
    });

    it('Deve retornar 500 se houver um erro ao atualizar a pergunta', async () => {
        pool.query.mockResolvedValueOnce({ rowCount: 1 } as never);
        pool.query.mockResolvedValueOnce({ rowCount: 0 } as never);
        await alteracaoPergunta(req as Request, res as Response, pool);
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ message: 'Erro ao atualizar a pergunta no banco.' });
    });

    it('Deve retornar 404 se a pergunta não for encontrada', async () => {
        pool.query.mockResolvedValueOnce({ rowCount: 0 } as never);
        await alteracaoPergunta(req as Request, res as Response, pool);
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ message: `Pergunta com id ${req.params!.id} não encontrada.` });
    });
});