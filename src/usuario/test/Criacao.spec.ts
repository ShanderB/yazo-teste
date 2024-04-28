import { Pool } from "pg";
import { Request, Response } from 'express';
import { UsuarioTipo } from '../../constants';
import { criarUsuario } from '../';

describe('criarUsuario', () => {
    let req: Partial<Request>;
    let res: Partial<Response>;
    let pool: jest.Mocked<Pool>;

    beforeEach(() => {
        req = {
            body: {
                usuario: 'usuario',
                senha: 'senha',
                tipo: UsuarioTipo.ORGANIZADOR,
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

    it('Deve retornar 200 se o usuário for criado com sucesso', async () => {
        pool.query.mockResolvedValueOnce({ rows: [] } as never);
        pool.query.mockResolvedValueOnce({ rowCount: 1 } as never);
        await criarUsuario(req as Request, res as Response, pool);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ message: `Adicionado "${req.body.usuario}" ao banco.` });
    });

    it('Deve retornar 400 se o usuário já existir', async () => {
        pool.query.mockResolvedValueOnce({ rows: [{ usuario: req.body.usuario }] } as never);
        await criarUsuario(req as Request, res as Response, pool);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ message: 'Usuário já existe.' });
    });

    it('Deve retornar 400 se os dados do usuário forem inválidos', async () => {
        req.body = { usuario: '', senha: '', tipo: '' };
        await criarUsuario(req as Request, res as Response, pool);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ message: 'Por favor, preencha todos os campos corretamente.' });
    });

    it('Deve retornar 500 se houver um erro ao criar o usuário', async () => {
        pool.query.mockResolvedValueOnce({ rows: [] } as never);
        pool.query.mockResolvedValueOnce({ rowCount: 0 } as never);
        await criarUsuario(req as Request, res as Response, pool);
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ message: 'Erro ao adicionar novo usuário ao banco.' });
    });

    it('Deve retornar 400 se o tipo do usuário for diferente de ORGANIZADOR e PARTICIPANTE', async () => {
        req.body.tipo = 'INVALIDO';
        await criarUsuario(req as Request, res as Response, pool);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ message: 'Por favor, preencha todos os campos corretamente.' });
    });
});