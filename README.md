# 🏥 Ficha de Amputados

Sistema web para cadastro e gerenciamento de fichas clínicas de pacientes amputados, desenvolvido com **Laravel 13** e **Tailwind CSS**.

---

## 📋 Sobre o Projeto

O **Ficha de Amputados** é uma aplicação web voltada para profissionais de saúde que precisam registrar e consultar informações clínicas de pacientes com amputações. O sistema permite cadastrar dados do paciente, classificar o nível de amputação por segmento corporal e gerar relatórios.

### Funcionalidades

- Cadastro completo de pacientes (nome, CPF, prontuário, data de nascimento, profissão, etc.)
- Cálculo automático da idade a partir da data de nascimento
- Registro do nível de amputação (membros superiores e inferiores)
- Associação entre paciente e suas amputações
- Listagem com busca e paginação
- Atualização e exclusão de registros
- Interface de relatórios

---

## 🛠️ Tecnologias Utilizadas

| Camada | Tecnologia |
|---|---|
| Backend | PHP 8.3+, Laravel 13 |
| Frontend | Blade Templates, Tailwind CSS 4, Vite 8 |
| Banco de Dados | MySQL / SQLite |
| Testes | PestPHP 4 |
| ORM | Eloquent |

---

## 🗂️ Estrutura do Banco de Dados

### Tabela `paciente`

| Campo | Tipo | Descrição |
|---|---|---|
| `id_paciente` | INT (PK) | Identificador único |
| `nome` | VARCHAR(60) | Nome completo |
| `genero` | VARCHAR(30) | Gênero do paciente |
| `prontuario` | INT | Número do prontuário |
| `cpf` | VARCHAR(15) | CPF (único) |
| `data_nascimento` | VARCHAR(16) | Data de nascimento |
| `idade` | INT | Calculada automaticamente |
| `profissao` | VARCHAR(40) | Profissão |
| `acompanhante` | VARCHAR(40) | Nome do acompanhante |
| `data_avaliacao` | VARCHAR(16) | Data da avaliação clínica |

### Tabela `nivel_amputacao`

Registra o nível de amputação por segmento corporal. Cada campo representa um tipo de amputação e recebe um valor inteiro.

**Membros Superiores:** `desarticulacao_ombro`, `transumeral`, `desarticulacao_cotovelo`, `transradial`, `desarticulacao_punho`, `parcial_mao`, `dedos_mao`

**Membros Inferiores:** `desarticulacao_quadril`, `transfemoral`, `desarticulacao_joelho`, `transtibal`, `syme`, `parcial_pe`, `dedos_pe`

**Outros campos:** `paciente_id` (FK), `direito`, `esquerdo`, `tempo_amputacao`, `lado_dominante`

---

## 🚀 Como Executar o Projeto

### Pré-requisitos

- PHP >= 8.3
- Composer
- Node.js >= 18
- Banco de dados MySQL ou SQLite

### Instalação (com o script automático)

```bash
git clone https://github.com/seu-usuario/fichaAmputados.git
cd fichaAmputados
composer run setup
```

O script `setup` realiza automaticamente:
1. `composer install`
2. Copia o `.env.example` para `.env`
3. Gera a chave da aplicação (`php artisan key:generate`)
4. Executa as migrations (`php artisan migrate`)
5. `npm install` e `npm run build`

### Instalação manual (passo a passo)

```bash
# 1. Clone o repositório
git clone https://github.com/seu-usuario/fichaAmputados.git
cd fichaAmputados

# 2. Instale as dependências PHP
composer install

# 3. Configure o ambiente
cp .env.example .env
php artisan key:generate

# 4. Configure o banco de dados no .env e execute as migrations
php artisan migrate

# 5. Instale as dependências JavaScript
npm install

# 6. Compile os assets
npm run build
```

### Rodando em desenvolvimento

```bash
composer run dev
```

Isso inicia em paralelo:
- Servidor PHP (`php artisan serve`)
- Worker de filas (`php artisan queue:listen`)
- Vite em modo watch (`npm run dev`)

Acesse: **http://localhost:8000**

---

## 🔌 API REST

A aplicação expõe uma API RESTful para gerenciamento de pacientes e amputações.

### Pacientes — `/api/paciente`

| Método | Endpoint | Descrição |
|---|---|---|
| GET | `/paciente` | Lista todos os pacientes (paginado, com busca) |
| POST | `/paciente` | Cadastra um novo paciente |
| GET | `/paciente/{id}` | Busca um paciente por ID |
| PUT | `/paciente/{id}` | Atualiza os dados de um paciente |
| DELETE | `/paciente/{id}` | Remove um paciente |

**Parâmetro de busca:** `GET /paciente?busca=João` — pesquisa em nome, CPF, prontuário, etc.

**Exemplo de corpo (POST/PUT):**
```json
{
  "nome": "Maria da Silva",
  "genero": "Feminino",
  "prontuario": 12345,
  "cpf": "123.456.789-00",
  "data_nascimento": "1985-04-10",
  "profissao": "Professora",
  "acompanhante": "João Silva",
  "data_avaliacao": "2026-07-17"
}
```

---

### Amputações — `/api/amputacao`

| Método | Endpoint | Descrição |
|---|---|---|
| GET | `/amputacao` | Lista todas as amputações (paginado, com busca) |
| GET | `/amputacao?paciente_id=1` | Lista amputações de um paciente específico |
| POST | `/amputacao` | Cadastra uma nova amputação |
| GET | `/amputacao/{id}` | Busca uma amputação por ID |
| PUT | `/amputacao/{id}` | Atualiza uma amputação |
| DELETE | `/amputacao/{id}` | Remove uma amputação |

**Exemplo de corpo (POST/PUT):**
```json
{
  "paciente_id": 1,
  "transumeral": 1,
  "transtibal": 1,
  "direito": 1,
  "esquerdo": 0,
  "tempo_amputacao": "5 anos",
  "lado_dominante": "Direito"
}
```

> Os campos de nível de amputação recebem `1` (presente) ou `0` (ausente).

---

## 🧪 Testes

```bash
composer run test
```

Os testes utilizam o framework **PestPHP** com integração ao Laravel.

---

## 📁 Estrutura de Diretórios

```
fichaAmputados/
├── app/
│   ├── Http/Controllers/
│   │   ├── PacienteController.php
│   │   └── AmputacaoController.php
│   └── Models/
│       ├── Paciente.php
│       └── Amputacao.php
├── database/
│   └── migrations/
│       ├── ..._create_paciente_table.php
│       └── ..._create_nivel_amputacao_table.php
├── resources/
│   └── views/
│       ├── paciente.blade.php
│       ├── dashboard.blade.php
│       ├── relatorios.blade.php
│       └── welcome.blade.php
├── routes/
│   └── web.php
└── tests/
```

---

## 🤝 Contribuindo

1. Faça um fork do projeto
2. Crie uma branch para sua feature: `git checkout -b feature/minha-feature`
3. Commit suas mudanças: `git commit -m 'feat: adiciona minha feature'`
4. Envie para o repositório: `git push origin feature/minha-feature`
5. Abra um Pull Request

---

## 📄 Licença

Este projeto está sob a licença **MIT**. Consulte o arquivo [LICENSE](LICENSE) para mais detalhes.
