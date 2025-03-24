# 🧩Desafio BGC - PS Estágio

O projeto automatiza a captura de dados sobre os produtos mais vendidos na Amazon, facilitando a análise de tendências de mercado para a BGC Brasil.

### 🧰 Tecnologias utilizadas

- **Node Js + TypeScript** - Backend.
- **Puppeteer** - Captura e extração dos dados da Amazon.
- **DynamoDB** - Armazenamento dos produtos coletados.
- **AWS Lambda + API Gateway** - Hospedagem da API.
- **Serverless Framework** - Automação do deploy na AWS.

### 🎯 Objetivo

Criar um sistema que retorne os três produtos mais vendidos da Amazon ([https://www.amazon.com.br/bestsellers)](https://www.amazon.com.br/bestsellers)) e disponibilize esses dados por meio de uma API.

## 🗃️ Arquitetura

O fluxo do projeto segue os seguintes passos:

1.  **O scraper (Puppeteer) acessa a Amazon** e extrai os três produtos mais vendidos.
2.  **Os dados são armazenados no DynamoDB**, garantindo persistência.
3.  **A API (AWS Lambda + API Gateway) permite acesso aos dados**, retornando os produtos armazenados.

_O Serverless Framework gerencia a infraestrutura e facilita a implantação na AWS._

**Vídeo explicando arquitetura do projeto:** (https://youtu.be/Ege-UKG-qXQ)

Fluxo de atualização da lista de produtos no BD: <br>

[<img src="https://media.discordapp.net/attachments/867480197598281803/1353874793266548870/image.png?ex=67e33da8&is=67e1ec28&hm=9a6460b14ead559217910e2ef93b81cd37ce4d54d12571056caaa18142b85b60&=&format=webp&quality=lossless" height="470"/>](https://media.discordapp.net/attachments/867480197598281803/1353874793266548870/image.png?ex=67e33da8&is=67e1ec28&hm=9a6460b14ead559217910e2ef93b81cd37ce4d54d12571056caaa18142b85b60&=&format=webp&quality=lossless)

## 🛠️ Como rodar o Projeto

### Pré-requisitos:

- AWS CLI configurada.
- Conta AWS com permissões adequadas
- Node.js instalado.
- Dependências do projeto.

### Passos para execução:

1. **Clonar o repositório**

```bash
git clone https://github.com/AnaLara714/desafio-bgc
cd desafio-bgc
```

2. **Instalar dependências**

```console
 npm install
```

3. **Configuração de variáveis de ambiente**

- Criar um arquivo `.env` na raiz do projeto e a adicionar as credenciais da AWS

```ini
ACCESS_KEY=your_access_key
SECRET_KEY=your_secret_key
ACCOUNT_ID=your_account_id
```

4. **Executar o scraper localmente**

```powershell
 npm run start-dev
```

5. **Realizar o deploy na AWS**

```powershell
serverless deploy
```

## 🛎️ API

A API retorna os produtos mais vendidos armazenados no banco de dados.

- 📍**Endpoint:**

```console
https://g3guck0l4k.execute-api.sa-east-1.amazonaws.com/dev/products
```

- 📝 **Método:** GET/products
- 📨 **Exemplo de Requisição:**

  - Utilizando o Terminal/cmd:

  ```
   curl -X GET https://g3guck0l4k.execute-api.sa-east-1.amazonaws.com/dev/products
  ```

  - Ou caso utilize um IDE para requisições, por exemplo o Insomnia:<br>
    ![Exemplo de requisição utilizando o Insomnia](https://media.discordapp.net/attachments/867480197598281803/1353840680891584603/image.png?ex=67e31de3&is=67e1cc63&hm=38102f939255fed9cfaf8be36950259eaeb5f71019dfa0cd442308ff5df9c9c4&=&format=webp&quality=lossless)

- 📦 **Exemplo de Resposta:**

```json
[
  {
    "id": "B09BK73232",
    "title": "Filtro/Refil de Água...",
    "price": "R$ 74,90",
    "image": "https://...",
    "link": "https://..."
  }
]
```

## 🎲 Banco de Dados

- Tabela: `Products`
- Dados armazenados
  - `id`
  - Identificador do produto na Amazon
  - `title` - Nome do produto
  - `price` - Preço atual
  - `image` - URL da imagem
  - `link` - Link do produto
  - `createAt` - Data do armazenamento

## 🥠Melhorias Futuras

- Implementar um dashboard para visualização dos produtos capturados ( Consumindo API).
- Ordenação para produtos na API
- Autenticação para proteger a API
