import express from 'express';
import { apiV1Router } from './routers/routes';
import path from 'path';
import { errorHandler } from './middleware/errorHandler';
import { logger } from './middleware/logEvents';
import cors from 'cors';
import { corsOptions } from './config/corsOptions';

const app = express();
const PORT = process.env.PORT || 8001;

// Middlewares globais
app.use(logger);
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.resolve(__dirname, "public")));

// Rotas
app.use("/api/v1", apiV1Router);

app.get("/", (req, res) => {
  res.send("Hello nodejs!");
});

// Tratamento de erros
app.use(errorHandler);

// Inicia o servidor
const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});