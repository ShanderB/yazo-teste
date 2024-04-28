import { Pool } from "pg";
import { Request, Response } from 'express';
import { alteracaoUsuario } from '../alteracao'; // Import the alteracaoUsuario function

describe('alteracaoUsuario', () => {
    let req: Partial<Request>;
    let res: Partial<Response>;
    let pool: jest.Mocked<Pool>;

    beforeEach(() => {
        req = {
            params: {
                id: '1',
            },
            body: {
                nome: 'nome',
                senha: 'senha',
                tipo: 'tipo',
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

    it('Deve retornar 200 se o usuário for atualizado com sucesso', async () => {
        pool.query.mockResolvedValueOnce({ rowCount: 1 } as never);
        await alteracaoUsuario(req as Request, res as Response, pool);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ message: `Atualizado "${req.body.nome}" ao banco.` });
    });

    it('Deve retornar 500 se houver um erro ao atualizar o usuário', async () => {
        pool.query.mockResolvedValueOnce({ rowCount: 0 } as never);
        await alteracaoUsuario(req as Request, res as Response, pool);
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ message: 'Erro ao atualizar no banco.' });
    });
});