# TechStartup - Gestão de Funcionários

Sistema de gerenciamento de funcionários para uma startup de tecnologia.

## Funcionalidades

- Cadastro de funcionários com nome, idade, cargo e salário
- Listagem de todos os funcionários em uma tabela
- Edição e exclusão de funcionários
- Geração de relatórios:
  - Funcionários com salário acima de R$5000
  - Média salarial da empresa
  - Lista de cargos únicos
  - Nomes dos funcionários em maiúsculo

## Tecnologias Utilizadas

- HTML5
- CSS3
- JavaScript (ES6+)
- LocalStorage para persistência de dados

## Como Executar

1. Clone o repositório
2. Abra o arquivo `index.html` em um navegador moderno

### Opcional com Docker

1. Construa a imagem: `docker build -t gestao-funcionarios .`
2. Execute o container: `docker run -p 3000:3000 -d gestao-funcionarios`
3. Acesse no navegador: `http://localhost:3000`