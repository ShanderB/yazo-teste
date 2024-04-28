import { validacaoTipoUsuario, dadosJWT } from '../../common/validacaoTipoUsuario';
import { Request, Response, NextFunction } from 'express';
import pg from 'pg';
import { UsuarioTipo } from '../../constants';
import jwt from 'jsonwebtoken';

describe('validacaoTipoUsuario', () => {

  const mockPool = {
    query: jest.fn().mockResolvedValue({ rows: [], rowCount: 0 }),
  } as any;

  jest.spyOn(pg as any, 'Pool').mockImplementation(() => mockPool as any);

  describe('validacaoTipoUsuario', () => {
    const req = {
      headers: {}
    } as unknown as Request;

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    } as unknown as Response;


    const next: NextFunction = jest.fn();

    it('Deve retornar 401 se nenhum cabeçalho de autorização for fornecido', async () => {


      await validacaoTipoUsuario(req, res, UsuarioTipo.ORGANIZADOR, mockPool, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ message: 'Token não fornecido' });
    });

    it('Deve chamar next e retornar se o token for válido e o usuário tiver permissão', async () => {
      const req = {
        headers: {
          authorization: 'Bearer token',
        },
      } as unknown as Request;

      jwt.verify = jest.fn().mockReturnValue({ usuario: 'usuario', senha: 'senha' });
      mockPool.query.mockResolvedValue({ rows: [{ tipo: UsuarioTipo.ORGANIZADOR }], rowCount: 1 });

      await validacaoTipoUsuario(req, res, UsuarioTipo.ORGANIZADOR, mockPool, next);

      expect(next).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalled();
    });

    it('Deve retornar 401 se o token for inválido', async () => {
      const req = {
        headers: {
          authorization: 'Bearer token',
        },
      } as unknown as Request;

      jwt.verify = jest.fn().mockImplementation(() => { throw new Error(); });

      await validacaoTipoUsuario(req, res, UsuarioTipo.ORGANIZADOR, mockPool, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ message: 'Token inválido' });
    });

    it('Deve chamar next e retornar se o token for válido e o usuário tiver o tipo de permissão especificado', async () => {
      const req = {
        headers: {
          authorization: 'Bearer token',
        },
      } as unknown as Request;

      jwt.verify = jest.fn().mockReturnValue({ usuario: 'usuario', senha: 'senha' });
      mockPool.query.mockResolvedValue({ rows: [{ tipo: UsuarioTipo.PARTICIPANTE }], rowCount: 1 });

      await validacaoTipoUsuario(req, res, UsuarioTipo.PARTICIPANTE, mockPool, next);

      expect(next).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalled();
    });

    it('Deve retornar 401 se o token for válido mas o usuário não tiver a permissão correta', async () => {
      const req = {
        headers: {
          authorization: 'Bearer token',
        },
      } as unknown as Request;

      jwt.verify = jest.fn().mockReturnValue({ usuario: 'usuario', senha: 'senha' });
      mockPool.query.mockResolvedValue({ rows: [{ tipo: UsuarioTipo.ORGANIZADOR }], rowCount: 1 });

      await validacaoTipoUsuario(req, res, UsuarioTipo.ORGANIZADOR, mockPool, next);

      expect(res.status).toHaveBeenCalledWith(401);
    });

    it('Deve retornar 401 se o token for válido mas o usuário não tiver a permissão correta', async () => {
      const req = {
        headers: {
          authorization: 'Bearer 123',
        },
      } as unknown as Request;

      jwt.verify = jest.fn().mockReturnValue({ usuario: undefined, senha: 'senha' });
      mockPool.query.mockResolvedValue({ rows: [{ tipo: UsuarioTipo.ORGANIZADOR }], rowCount: 1 });

      await validacaoTipoUsuario(req, res, UsuarioTipo.PARTICIPANTE, mockPool, next);
      expect(res.status).toHaveBeenCalledWith(401);
    });
  });

  describe('dadosJWT', () => {
    it('Deve retornar os dados corretos após verificar a key', () => {
      jest.spyOn(jwt as any, 'verify').mockReturnValue({ usuario: 'a', senha: '123', usuarioId: "1" });

      const req = {
        headers: {}
      } as unknown as Request;

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      } as unknown as Response;

      const result = dadosJWT(req, res, mockPool);

      expect(result).toEqual({ "senha": "123", "usuario": "a", "usuarioId": "1" });
    });

    it('Deve retornar indefinido se nenhum cabeçalho de autorização for fornecido', () => {
      const jwtSpy = jest.spyOn(jwt as any, 'verify').mockImplementation(() => { throw new Error('Invalid token') });

      const req = {
        headers: {}
      } as unknown as Request;

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      } as unknown as Response;

      dadosJWT(req, res, mockPool);

      expect(jwtSpy).toHaveBeenCalled();
    });
  });

})
