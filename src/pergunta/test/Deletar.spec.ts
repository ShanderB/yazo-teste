import { Pool } from "pg";
import { Request, Response } from 'express';
import { deletarPergunta } from '../';

describe('deletarPergunta', () => {
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

    describe('deletarPergunta', () => {

        it('Deve retornar 200 se a pergunta for deletada com sucesso', async () => {
            pool.query.mockResolvedValueOnce({ rows: [], rowCount: 1 } as never);
            pool.query.mockResolvedValueOnce({ rows: [], rowCount: 1 } as never);
            await deletarPergunta(req as Request, res as Response, pool);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({ message: `Removida a pergunta "${req.params!.id}" do banco.` });
        });
    
        it('Deve retornar 500 se houver um erro ao deletar a pergunta', async () => {
            pool.query.mockResolvedValueOnce({ rows: [], rowCount: 1 } as never);
            pool.query.mockResolvedValueOnce({ rows: [], rowCount: undefined } as never);
            await deletarPergunta(req as Request, res as Response, pool);
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ message: 'Erro ao remover a pergunta do banco.' });
        });
    
        it('Deve retornar 404 se a pergunta não for encontrada', async () => {
            pool.query.mockResolvedValueOnce({ rows: [], rowCount: 0 } as never);
            await deletarPergunta(req as Request, res as Response, pool);
            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ message: `Pergunta com id ${req.params!.id} não encontrada.` });
        });
    });
});