import { Pool } from "pg";
import { Request, Response } from 'express';
import { criarResposta } from '../Resposta'; // Import the criarResposta function
import jwt from 'jsonwebtoken';

describe('criarResposta', () => {
    let req: Partial<Request>;
    let res: Partial<Response>;
    let pool: jest.Mocked<Pool>;

    beforeEach(() => {
        req = {
            body: {
                idPergunta: '1',
                resposta: 'resposta',
            },
            headers: {
                authorization: 'Bearer 123'
            }
        };

        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        pool = {
            query: jest.fn(),
        } as any;
    });

    it('Deve retornar 400 se o idPergunta ou resposta estiverem faltando', async () => {
        req.body = {};
        await criarResposta(req as Request, res as Response, pool);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ message: 'Por favor, preencha todos os campos corretamente.' });
    });

    it('Deve retornar 404 se a pergunta não existir', async () => {
        pool.query.mockResolvedValueOnce({ rows: [], rowCount: 0 } as never);
        await criarResposta(req as Request, res as Response, pool);
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ message: 'Pergunta não existe.' });
    });

    it('Deve retornar 400 se o usuário tentar responder sua própria pergunta', async () => {
        pool.query.mockResolvedValueOnce({ rows: [{ criadopor: '1' }], rowCount: 1 } as never);
        pool.query.mockResolvedValueOnce({ rows: [{ pergunta: '1', respondidoPor: '1' }], rowCount: 1 } as never);
        pool.query.mockResolvedValueOnce({ rows: [], rowCount: 0 } as never);

        jwt.verify = jest.fn().mockReturnValue({ usuario: 'usuario', senha: 'senha', usuarioId: '1' });
    
        await criarResposta(req as Request, res as Response, pool);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ message: 'Não é possível responder uma pergunta criada por si mesmo.' });
    });

    it('Deve retornar 400 se o usuário já respondeu a pergunta', async () => {
        pool.query.mockResolvedValueOnce({ rows: [{ criadopor: '2' }], rowCount: 1 } as never);
        pool.query.mockResolvedValueOnce({ rows: [{ pergunta: '1', respondidoPor: '1' }], rowCount: 1 } as never);
        await criarResposta(req as Request, res as Response, pool);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ message: 'Você já respondeu essa pergunta.' });
    });

    it('Deve retornar 200 se a resposta for adicionada com sucesso', async () => {
        pool.query.mockResolvedValueOnce({ rows: [{ criadopor: '2' }], rowCount: 1 } as never);
        pool.query.mockResolvedValueOnce({ rows: [], rowCount: 0 } as never);
        pool.query.mockResolvedValueOnce({ rowCount: 1 } as never);
        await criarResposta(req as Request, res as Response, pool);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ message: 'Adicionado resposta ao banco.' });
    });

    it('Deve retornar 500 se houver um erro ao adicionar a resposta', async () => {
        pool.query.mockResolvedValueOnce({ rows: [{ criadopor: '2' }], rowCount: 1 } as never);
        pool.query.mockResolvedValueOnce({ rows: [], rowCount: 0 } as never);
        pool.query.mockResolvedValueOnce({ rowCount: 0 } as never);
        await criarResposta(req as Request, res as Response, pool);
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ message: 'Erro ao adicionar resposta ao banco.' });
    });
});