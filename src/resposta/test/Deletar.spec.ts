import { Pool } from "pg";
import { Request, Response } from 'express';
import { deletarResposta } from '../';

describe('deletarResposta', () => {
    let req: Partial<Request>;
    let res: Partial<Response>;
    let pool: jest.Mocked<Pool>;

    beforeEach(() => {
        req = {
            params: {
                id: '1',
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

    it('Deve retornar 200 se a resposta for deletada com sucesso', async () => {
        pool.query.mockResolvedValueOnce({ rows: [], rowCount: 1 } as never);
        pool.query.mockResolvedValueOnce({ rows: [], rowCount: 1 } as never);
        await deletarResposta(req as Request, res as Response, pool);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ message: `Deletada a resposta "${req.params!.id}" do banco.` });
    });

    it('Deve retornar 500 se houver um erro ao deletar a resposta', async () => {
        pool.query.mockResolvedValueOnce({ rows: [], rowCount: 1 } as never);
        pool.query.mockResolvedValueOnce({ rows: [], rowCount: undefined } as never);
        await deletarResposta(req as Request, res as Response, pool);
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ message: 'Erro ao deletar a resposta do banco.' });
    });

    it('Deve retornar 404 se a resposta não for encontrada', async () => {
        pool.query.mockResolvedValueOnce({ rows: [], rowCount: 0 } as never);
        await deletarResposta(req as Request, res as Response, pool);
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ message: `Resposta com id ${req.params!.id} não encontrada.` });
    });
});