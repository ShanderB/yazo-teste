// Importando os módulos necessários
import express, { NextFunction } from 'express';
import { Pool } from 'pg';
import bodyParser from 'body-parser';
import { criarUsuario } from './usuario/criacao';
import { listagemUsuarios } from './usuario/listagem';
import { alteracaoUsuario } from './usuario/alteracao';
import { deletarUsuario } from './usuario/deletar';
import { Request, Response } from 'express';
import { validacaoTipoUsuario } from './common/validacaoTipoUsuario';
import { UsuarioTipo } from './constants';
import { criarPergunta } from './pergunta/Criacao';
import { criarResposta } from './resposta/Resposta';
import { listagemPerguntas } from './pergunta/Listagem';
import { efetuarLogin } from './login/Login';
import { listagemPorId } from './pergunta/ListagemPorId';
require('dotenv').config();

// Configurando o express
const app = express();
app.use(bodyParser.json());

/**
 * Configurando a conexão com o PostgreSQL
 * A classe Pool é usada para criar um pool de conexões com o banco de dados.
 **/
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: parseInt(process.env.DB_PORT!) //passando o "!" para dizer que a variável não é nula nunca.
});


//Api utilizada para fazer a autenticação do usuário
app.post('/login', async (req: Request, res: Response) => {
  efetuarLogin(req, res, pool);
});


//Middleware para validar o tipo de usuário.
app.use('/usuario', (req: Request, res: Response, next: NextFunction) => {
  validacaoTipoUsuario(req, res, UsuarioTipo.ORGANIZADOR, pool, next);
})
  //Rotas para o CRUD de usuários
  .route('/usuario')
  .post(async (req: Request, res: Response) => { criarUsuario(req, res, pool); })
  .get(async (req: Request, res: Response) => { listagemUsuarios(res, pool); })
  .put(async (req: Request, res: Response) => { alteracaoUsuario(req, res, pool); })
  .delete(async (req: Request, res: Response) => { deletarUsuario(req, res, pool); })


//Devido aos diferentes tipos de autorização, é necessário adicionar o middleware separadamente para cada rota.
app.use('/pergunta', (req: Request, res: Response, next: NextFunction) => {
  validacaoTipoUsuario(
    req, res,
    (req.method === 'GET' ? UsuarioTipo.PARTICIPANTE : UsuarioTipo.ORGANIZADOR),
    pool, next
  );
})
  //Rotas para a criação e listagem de perguntas.
  .route('/pergunta')
  .post(async (req: Request, res: Response) => { criarPergunta(req, res, pool); })
  .get(async (req: Request, res: Response) => { listagemPerguntas(req, res, pool); })

//Rota responsável pela listagem de perguntas por ID com respostas, permitido apenas para organizadores.
app.use('/pergunta/:id', (req: Request, res: Response, next: NextFunction) => {
  validacaoTipoUsuario(req, res, UsuarioTipo.ORGANIZADOR, pool, next);
})
  .route('/pergunta/:id')
  .get(async (req: Request, res: Response) => { listagemPorId(req, res, pool); })

//Rota para a criação de respostas, permitido apenas para participantes e organizadores.
app.use('/resposta', (req: Request, res: Response, next: NextFunction) => {
  validacaoTipoUsuario(req, res, UsuarioTipo.PARTICIPANTE, pool, next);
})
  .route('/resposta')
  .post(async (req: Request, res: Response) => { criarResposta(req, res, pool); })


// Iniciando o servidor
app.listen(3000, () => {
  console.log('Server running on port 3000');
});

export default app;