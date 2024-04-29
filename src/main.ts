// Importando os módulos necessários
import express, { Request, Response } from 'express';
import { Pool } from 'pg';
import bodyParser from 'body-parser';
import { efetuarLogin } from './login/Login';
import usuarioRoutes from './usuario/Routes';
import perguntaRoutes from './pergunta/Routes';
import respostaRoutes from './resposta/Routes';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

require('dotenv').config();

// Configurando o express
const app = express();
app.use(bodyParser.json());

//Configurando swagger
const swaggerOptions = {
  swaggerDefinition: {
    info: {
      title: 'APIs para cadastro e listagem de usuários, perguntas e respostas.',
      version: '1.0.0',
      description: 'Esta documentação foi criada para auxiliar na análise de código para contratação de desenvolvedor PJ backend.',
    },
    servers: ['http://localhost:3000'],
  },
  apis: ['./**/*.ts'],
}

const swaggerDocs = swaggerJsdoc(swaggerOptions)
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Configurando a conexão com o PostgreSQL
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: parseInt(process.env.DB_PORT!) //passando o "!" para dizer que a variável não é nula nunca.
});

//Api utilizada para fazer a autenticação do usuário
app.post('/login', (req: Request, res: Response) => efetuarLogin(req, res, pool));
app.use('/usuario', usuarioRoutes(pool))
app.use('/pergunta', perguntaRoutes(pool));
app.use('/resposta', respostaRoutes(pool))

// Iniciando o servidor
app.listen(3000, () => console.log('Server running on port 3000'));

export default app;