import { Pool } from "pg";
import { Response } from 'express';
import { listagemUsuarios } from '../listagem'; // Import the listagemUsuarios function

describe('listagemUsuarios', () => {
    let res: Partial<Response>;
    let pool: jest.Mocked<Pool>;

    beforeEach(() => {
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        pool = {
            query: jest.fn(),
        } as any;
    });

    it('Deve retornar 200 se houver usuários no banco', async () => {
        const mockUsers = [{ id: '1', nome: 'nome', senha: 'senha', tipo: 'tipo' }];
        pool.query.mockResolvedValueOnce({ rows: mockUsers } as never);
        await listagemUsuarios(res as Response, pool);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(mockUsers);
    });

    it('Deve retornar 400 se não houver usuários no banco', async () => {
        pool.query.mockResolvedValueOnce({ rows: [] } as never);
        await listagemUsuarios(res as Response, pool);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ message: 'Sem dados no banco.' });
    });
});