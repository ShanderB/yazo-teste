import { Pool } from "pg";
import { Request, Response } from 'express';
import { deletarUsuario } from '../';

describe('deletarUsuario', () => {
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

    it('Deve retornar 200 se o usuário for removido com sucesso', async () => {
        pool.query.mockResolvedValueOnce({ rowCount: 1 } as never);
        await deletarUsuario(req as Request, res as Response, pool);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ message: `Removido "1" do banco.` });
    });

    it('Deve retornar 500 se houver um erro ao remover o usuário', async () => {
        pool.query.mockResolvedValueOnce({ rowCount: 0 } as never);
        await deletarUsuario(req as Request, res as Response, pool);
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ message: 'Erro ao remover do banco.' });
    });
});