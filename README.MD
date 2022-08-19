
# Api REST

User Rest API

## Documentação da API

#### Retorna todos os usuários

```http
  GET /api/user
```

| Parâmetro   | Tipo       | Descrição                           |
| :---------- | :--------- | :---------------------------------- |
| null | `string` | Retorna todos os usuários |

#### Retorna um usuário

```http
  GET /api/user/${id}
```

| Parâmetro   | Tipo       | Descrição                                   |
| :---------- | :--------- | :------------------------------------------ |
| `id`      | `string` | Retorna um usuário pelo ID |




## Variáveis de Ambiente

Para rodar esse projeto, você vai precisar adicionar as seguintes variáveis de ambiente no seu .env

```
DATABASE=""
DATABASE_HOST=""
DATABASE_USER=""
DATABASE_PASSWORD=

PORT=3000
```

## Rodando localmente

Clone o projeto

```bash
  git clone git@github.com:piazin/api-users.git
```

Entre no diretório do projeto

```bash
  cd api-users
```

Instale as dependências

```bash
  npm install
```

Inicie o servidor

```bash
  npm start
```


## Autores

- [@lucas](https://www.github.com/piazin)

