# Repo Trabalho Prático - SISTEMAS DISTRIBUÍDOS 

# Info sobre o projeto:

## Tecnologias Utilizadas

- **Node.js**: Plataforma JavaScript no lado do servidor.
- **Express**: Framework para desenvolvimento de APIs.
- **Prisma**: ORM para interação com o banco de dados.
- **Typescript**: Linguagem utilizada no projeto para segurança com tipos.
- **JWT (jsonwebtoken)**: Para autenticação via tokens.
- **Bcrypt**: Para criptografia de senhas.
- **Zod**: Validação de dados.
- **dotenv**: Carregamento de variáveis de ambiente.
- **Nodemon**: Ferramenta para desenvolvimento que reinicia automaticamente a aplicação ao detectar mudanças.
- **Jest**: Framework de testes.

# Passos para Rodar o Projeto:

1. **Clone o repositório**:
   ```bash
   git clone https://github.com/filipetocchio/MobSocial-2024-2.git
   cd .\TP_Sistemas-Distribuidos
   ```

2. **Instale as dependências**:
   ```bash
   npm install
   ```

3. **Crie o arquivo `.env`**:
    - Nesse projeto como é um codigo inicial eu irei subir o `.env` para o repositorio com o `.env` comentado dentro do arquivo `.gitignore`. Porem quando alguem mudar o para uma **URL** sem ser *localhost* no `.env` seria sim importante descomentar o .env dentro do `.gitignore`.

4. **Execute as migrações do banco de dados**:
   ```bash
   npm run migrate
   ```

5. **Inicie o servidor em modo de desenvolvimento**:
   ```bash
   npm run dev
   ```

6. **Testes da API**:
   - Há um arquivo de coleção do **POSTMAN** chamado `NOME-ARQUIVO-DA-COLECTION-POSTMAN` que pode ser utilizado para testar os endpoints da API. Certifique-se de importá-lo no PostMan para rodar os testes.

# Scripts do `package.json`

**Como rodas os comandos**
    - coloque `npm run` + o algun dos ***Scripts*** abaixo abaixo.

- `dev`: Inicia o servidor em modo de desenvolvimento usando **Nodemon**.
- `migrate`: Executa as migrações do banco de dados usando **Prisma**.
- `studio`: Abre o Prisma Studio para visualizar e manipular os dados do banco.
- `build`: Remove a pasta `dist` e compila o código TypeScript.
- `start`: Compila o código e inicia o servidor de produção.
- `test`: Executa os testes unitários com **Jest**.
- `test:watch`: Executa os testes em modo de observação com **Jest**.

# Docker

Ainda estamos trabalhando na implementação do Docker para containerizar a aplicação e facilitar o deploy em diferentes ambientes. Uma vez finalizado, o projeto incluirá um arquivo `docker-compose.yml` para facilitar a configuração.

# Documentação da API - Get's:

Abaixo, você encontrará informações sobre os parâmetros de consulta suportados pelos endpoints Get.

## Parâmetros de Consulta:

Os endpoints da API utilizam os seguintes parâmetros para filtragem, paginação e busca:

| **Parâmetro**   | **Descrição**                                                                                   | **Valores Possíveis**             | **Comportamento/Limites**                                                                                     |
|------------------|------------------------------------------------------------------------------------------------|------------------------------------|--------------------------------------------------------------------------------------------------------------|
| `limit`         | Define o número máximo de registros retornados por página.                                     | Inteiro positivo (ex.: `10`, `20`) | Deve ser > 0. Padrão é `10`. Se menor que 1, retorna erro 400 ("Page and limit must be positive numbers").   |
| `page`          | Define a página atual da paginação.                                                            | Inteiro positivo (ex.: `1`, `2`)   | Deve ser > 0. Padrão é `1`. Se menor que 1, retorna erro 400 ("Page and limit must be positive numbers").    |
| `search` (String) | Busca por texto nos campos `conteudo`, `tema`, `tecnica` ou `modalidade` (case-insensitive).   | Qualquer string (ex.: `"João"`)    | Filtra registros contendo o texto em pelo menos um dos campos especificados. Não diferencia maiúsculas/minúsculas. |
| `showDeleted`   | Controla a exibição de registros deletados (`excludedAt`).                                     | `"true"`, `"false"`, `"only"`      | - `"false"`: apenas não deletados (padrão).<br>- `"true"`: todos (deletados e não deletados).<br>- `"only"`: apenas deletados. |

### Notas
- O parâmetro `search` atualmente suporta apenas buscas por texto (strings). Buscas por números ou booleanos não são práticas no contexto atual, pois os campos pesquisáveis são strings.
- O parâmetro `showDeleted` é útil para gerenciar registros com "soft delete" (exclusão lógica via `excludedAt`).



# integrantes:

### Integrante 1:

**Nome**: Filipe Mota Tocchio Rodrigues
**Matricula**: 2211830

### Integrante 2:

**Nome**: Guilherme Rezende Damaceno
**Matricula**: 2212157

### Integrante 3:

**Nome**: José Victor Pereira Silva
**Matricula**: 2210867

### Integrante 4:

**Nome**: Ruan de Freitas Moreira
**Matricula**: 2211403
