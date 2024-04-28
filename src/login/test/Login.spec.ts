import { Pool } from "pg";
import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { efetuarLogin } from '../Login'; // Importe a função efetuarLogin

jest.mock('jsonwebtoken');

describe('efetuarLogin', () => {
    let req: Partial<Request>;
    let res: Partial<Response>;
    let pool: jest.Mocked<Pool>;
    let jwtSign: jest.SpyInstance;

    beforeEach(() => {
        req = {
            body: {
                usuario: 'usuario',
                senha: 'senha',
            },
        };

        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        pool = {
            query: jest.fn(),
        } as any;

        jwtSign = jest.spyOn(jwt, 'sign');
    });

    it('Deve retornar 400 se o usuário ou senha forem inválidos', async () => {
        pool.query.mockResolvedValue({ rows: [], rowCount: 0 } as never);

        await efetuarLogin(req as Request, res as Response, pool);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ message: 'Usuário ou senha inválidos ou usuário inexistente.' });
    });

    it('Deve retornar um token se o usuário e senha forem válidos', async () => {
        const fakeUser = { id: 1, tipo: 'tipo' };
        pool.query.mockResolvedValue({ rows: [fakeUser], rowCount: 1 } as never);
        jwtSign.mockReturnValue('token');

        await efetuarLogin(req as Request, res as Response, pool);

        expect(jwtSign).toHaveBeenCalledWith(
            { usuario: req.body.usuario, senha: req.body.senha, usuarioId: fakeUser.id, tipo: fakeUser.tipo },
            process.env.JWT_SECRET!,
            { expiresIn: '1h' }
        );
        expect(res.json).toHaveBeenCalledWith({ token: 'token' });
    });
});