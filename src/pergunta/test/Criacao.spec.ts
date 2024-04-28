import { Request, Response } from 'express';
import { Pool } from 'pg';
import { criarPergunta } from '../';

jest.mock('pg');
jest.mock('express');
jest.mock('jsonwebtoken');

describe('criarPergunta', () => {
    const mockPool = { query: jest.fn() } as unknown as Pool;
    const mockReq = { body: {}, headers: { authorization: "Bearer 123" } } as unknown as Request;
    const mockRes = { status: jest.fn().mockReturnThis(), json: jest.fn() } as unknown as Response;
    const mockQuery = jest.fn();
    let consoleLogSpy: jest.SpyInstance;
    let consoleErrorSpy: jest.SpyInstance;

    beforeAll(() => {
        consoleLogSpy = jest.spyOn(console, 'log').mockImplementation(() => { });
        consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    });

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('deve retornar 400 se pergunta não for fornecida', async () => {
        await criarPergunta(mockReq, mockRes, mockPool);
        expect(mockRes.status).toHaveBeenCalledWith(400);
        expect(mockRes.json).toHaveBeenCalledWith({ message: 'Por favor, preencha todos os campos corretamente.' });
    });

    it('deve retornar 400 se pergunta já existir', async () => {
        mockReq.body.pergunta = 'teste';
        mockQuery.mockResolvedValueOnce({ rows: [{ pergunta: 'teste' }] });
        jest.spyOn(mockPool, 'query').mockReturnValue({ rows: [{ pergunta: 'teste' }] } as any);
        await criarPergunta(mockReq, mockRes, mockPool);

        expect(mockRes.status).toHaveBeenCalledWith(400);
        expect(mockRes.json).toHaveBeenCalledWith({ message: 'Pergunta já existe.' });
    });

    it('deve retornar 200 se pergunta for adicionada com sucesso', async () => {
        mockQuery.mockResolvedValueOnce({ rows: [] }); // Nenhuma pergunta existente
        mockQuery.mockResolvedValueOnce({ rowCount: 1 }); // Pergunta adicionada com sucesso

        jest.spyOn(mockPool, 'query')
            .mockImplementationOnce(() => Promise.resolve({ rows: [] })) // Primeira chamada
            .mockImplementationOnce(() => Promise.resolve({ rowCount: 1 })); // Segunda chamada

        await criarPergunta(mockReq, mockRes, mockPool);

        expect(mockRes.status).toHaveBeenCalledWith(200);
        expect(mockRes.json).toHaveBeenCalledWith({ message: 'Adicionado a pergunta ao banco.' });

    });

    it('deve retornar 500 se houver um erro ao adicionar pergunta', async () => {
        mockReq.body.pergunta = 'teste';
        mockQuery.mockResolvedValueOnce({ rows: [] });
        mockQuery.mockResolvedValueOnce({ rowCount: 0 });
        jest.spyOn(mockPool, 'query').mockReturnValue({ rows: [] } as any);

        await criarPergunta(mockReq, mockRes, mockPool);
        expect(mockRes.json).toHaveBeenCalledWith({ message: 'Erro ao adicionar ao banco.' });
    });
});