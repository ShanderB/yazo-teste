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
    it('Deve retornar 401 se nenhum cabeçalho de autorização for fornecido', async () => {
      const req = {
        headers: {}
      } as unknown as Request;

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      } as unknown as Response;

      const next: NextFunction = jest.fn();

      await validacaoTipoUsuario(req, res, UsuarioTipo.ORGANIZADOR, mockPool, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ message: 'Token não fornecido' });
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
