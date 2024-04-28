import { Pool } from "pg";
import { Request, Response } from 'express';
import { listagemPorId } from '../ListagemPorId';

describe('listagemPorId', () => {
    let req: Partial<Request>;
    let res: Partial<Response>;
    let pool: jest.Mocked<Pool>;


    beforeAll(() => {
        jest.spyOn(console, 'log').mockImplementation(() => { });
    });

    beforeEach(() => {
        req = {
            params: {
                id: '1',
            },
            query: {
                page: '1',
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

    it('Deve retornar a pergunta e as respostas se a busca for bem-sucedida', async () => {
        const mockPergunta = { id: '1', pergunta: 'Pergunta?' };
        const mockRespostas = [{ id: '1', resposta: 'Resposta 1' }, { id: '2', resposta: 'Resposta 2' }];
        pool.query.mockResolvedValueOnce({ rows: [{ ...mockPergunta, respostas: mockRespostas }] } as never);

        await listagemPorId(req as Request, res as Response, pool);
        expect(res.json).toHaveBeenCalledWith({
            pergunta: mockPergunta,
            respostas: mockRespostas,
            offset: 0,
            limit: 10,
            page: 1
        });
    });

    it('Deve retornar 500 se houver um erro ao buscar as respostas', async () => {
        pool.query.mockRejectedValueOnce(new Error() as never);
        await listagemPorId(req as Request, res as Response, pool);
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ message: 'Erro ao buscar respostas.' });
    });

    it('Deve usar 1 como valor padrão para a página se nenhuma página for fornecida', async () => {
        delete (req.query as any).page;

        const mockPergunta = { id: '1', pergunta: 'Pergunta?' };
        const mockRespostas = [{ id: '1', resposta: 'Resposta 1' }, { id: '2', resposta: 'Resposta 2' }];
        pool.query.mockResolvedValueOnce({ rows: [{ ...mockPergunta, respostas: mockRespostas }] } as never);

        await listagemPorId(req as Request, res as Response, pool);
        expect(res.json).toHaveBeenCalledWith({
            pergunta: mockPergunta,
            respostas: mockRespostas,
            offset: 0,
            limit: 10,
            page: 1
        });
    });

    it('Deve retornar 404 se a pergunta não for encontrada', async () => {
        pool.query.mockResolvedValueOnce({ rows: [] } as never);

        await listagemPorId(req as Request, res as Response, pool);
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ message: 'Pergunta não encontrada.' });
    });

    it('Deve retornar 404 se não houver respostas para a pergunta', async () => {
        const mockPergunta = { id: '1', pergunta: 'Pergunta?' };
        pool.query.mockResolvedValueOnce({ rows: [{ ...mockPergunta, respostas: null }] } as never);

        await listagemPorId(req as Request, res as Response, pool);
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ message: 'Não há nada para listar nesta página.' });
    });
});