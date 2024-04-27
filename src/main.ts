// Importando os módulos necessários
import express from 'express';
import { Pool } from 'pg';
import bodyParser from 'body-parser';
import { criarUsuario } from './usuario/criacao';
import { listagemUsuarios } from './usuario/listagem';
import { alteracaoUsuario } from './usuario/alteracao';
import { deletarUsuario } from './usuario/deletar';
import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { dadosJWT, validacaoTipoUsuario } from './common/validacaoTipoUsuario';
import { UsuarioTipo } from './constants';
import { criarPergunta } from './pergunta/Criacao';

require('dotenv').config();

// Configurando o express
const app = express();
app.use(bodyParser.json());

/**
 * Configurando a conexão com o PostgreSQL
 * A classe Pool é usada para criar um pool de conexões com o banco de dados.
 * Um pool de conexões é um cache de conexões de banco de dados mantido para que as conexões possam ser reutilizadas quando necessário.
 **/
//TODO mover para arquivo próprio.
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: parseInt(process.env.DB_PORT!) //passando o "!" para dizer que a variável não é nula nunca.
});

app.post('/login', async (req: Request, res: Response) => {
  const { usuario, senha } = req.body;

  //TODO separar em algum arquivo.
  const retornoBanco = await pool.query('SELECT * FROM usuarios WHERE usuario = $1 AND senha = $2', [usuario, senha]);

  if (!retornoBanco.rows.length) {
    res.status(400).json({ message: 'Usuário ou senha inválidos ou usuário inexistente.' });
    return;
  }
  // Se a autenticação for bem-sucedida, crie um token JWT.
  const token = jwt.sign({ usuario: usuario, senha, usuarioId: retornoBanco.rows[0].id }, process.env.JWT_SECRET!, { expiresIn: '1h' });

  // Envie o token de volta para o cliente.
  res.json({ token });
});


app.route('/usuario')
  .post(async (req: Request, res: Response) => {
    // Rota para criar um novo usuario.
    criarUsuario(req, res, pool);
  })
  .get(async (req: Request, res: Response) => {
    //TODO adicionar validação de permitir somente o organizador.
    // Rota para obter todos os usuarios.
    listagemUsuarios(res, pool);
  })
  .put(async (req: Request, res: Response) => {
    //TODO adicionar validação de permitir somente o organizador.
    alteracaoUsuario(req, res, pool);
  })
  .delete(async (req: Request, res: Response) => {
    //TODO adicionar validação de permitir somente o organizador.
    deletarUsuario(req, res, pool);
  })
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

app.route('/pergunta')
  .post(async (req: Request, res: Response) => {
    criarPergunta(req, res, pool);
  })
  .get(async (req: Request, res: Response) => { })
  .put(async (req: Request, res: Response) => { })
  .delete(async (req: Request, res: Response) => { })


app.route('/resposta')
  .post(async (req: Request, res: Response) => {
    const isValid = await validacaoTipoUsuario(req, res, UsuarioTipo.PARTICIPANTE, pool)

    if (!isValid) {
      return;
    }

    const { idPergunta, resposta } = req.body;

    if (!idPergunta || !resposta) {
      res.status(400).json({ message: 'Por favor, preencha todos os campos corretamente.' });
      return;
    }

    //talvez posso remover. Se ao tentar inserir der erro, simplesmente ignora.
    const hasPergunta = await pool.query('SELECT criadoPor FROM perguntas WHERE id = $1', [idPergunta]);

    if (!hasPergunta.rows.length) {
      res.status(404).json({ message: 'Pergunta não existe.' });
      return;
    }

    const dadosUsuario = dadosJWT(req, res, pool);

    if(hasPergunta.rows[0].criadopor == dadosUsuario?.id) {
      res.status(400).json({ message: 'Não é possível responder uma pergunta criada por si mesmo.' });
      return;
    }

    const hasResposta = await pool.query('SELECT pergunta, respondidoPor FROM respostas WHERE id = $1 AND respondidoPor = $2', [idPergunta, dadosUsuario?.id]);

    if (hasResposta.rows.length) {
      res.status(400).json({ message: 'Você já respondeu essa pergunta.' });
      return;
    }

    const retornoBanco = await pool.query('INSERT INTO respostas (pergunta, respondidoPor, resposta) VALUES ($1, $2, $3)', [idPergunta, dadosUsuario?.id, resposta]);

    if (retornoBanco.rowCount === 1) {
      res.status(200).json({ message: `Adicionado resposta ao banco.` });
      return;
    } else {
      res.status(500).json({ message: 'Erro ao adicionar resposta ao banco.' });
      return;
    }
  })

// Iniciando o servidor
app.listen(3000, () => {
  console.log('Server running on port 3000');
});