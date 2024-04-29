import { Pool } from "pg";
import { Request, Response } from 'express';
import { alteracaoResposta } from '../';

describe('alteracaoResposta', () => {
    let req: Partial<Request>;
    let res: Partial<Response>;
    let pool: jest.Mocked<Pool>;

    beforeEach(() => {
        req = {
            params: {
                id: '1',
            },
            body: {
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

    it('Deve retornar 200 se a resposta for atualizada com sucesso', async () => {
        pool.query.mockResolvedValueOnce({ rowCount: 1 } as never);
        pool.query.mockResolvedValueOnce({ rowCount: 1 } as never);
        await alteracaoResposta(req as Request, res as Response, pool);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ message: `Atualizada a resposta \"${req.params!.id}\" no banco.` });
    });

    it('Deve retornar 500 se houver um erro ao atualizar a resposta', async () => {
        pool.query.mockResolvedValueOnce({ rowCount: 1 } as never);
        pool.query.mockResolvedValueOnce({ rowCount: 0 } as never);
        await alteracaoResposta(req as Request, res as Response, pool);
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ message: 'Erro ao atualizar a resposta no banco.' });
    });

    it('Deve retornar 404 se a resposta não for encontrada', async () => {
        pool.query.mockResolvedValueOnce({ rowCount: 0 } as never);
        await alteracaoResposta(req as Request, res as Response, pool);
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ message: `Resposta com id ${req.params!.id} não encontrada.` });
    });
});