# Neteflix 🎬

Bem-vindo ao Neteflix! Este é um projeto fictício de site de streaming, usando apenas HTML, CSS e JavaScript puro. Aqui você pode cadastrar, editar e listar filmes, além de gerenciar usuários, tudo sem precisar de backend!


## 📦 Parte 1: Como executar o projeto localmente

### Requisitos
- Um navegador moderno (Google Chrome, Firefox, Edge, etc.)
- Conexão com a internet (para carregar as bibliotecas via CDN)

### Passos para rodar o site
1. **Baixe ou clone o repositório** para o seu computador.
2. **Abra o arquivo `index.html`** no seu navegador (basta dar dois cliques ou clicar com o direito e escolher "Abrir com").
3. Pronto! O site funciona totalmente no navegador, sem precisar instalar nada ou rodar servidor/backend.

> **Obs:** O projeto é 100% client-side, ou seja, tudo acontece no seu navegador. Não precisa de backend, banco de dados externo ou nada do tipo.



## 🧪 Parte 2: Como rodar os testes automatizados

- Os testes automatizados estão no arquivo `tests.js`.
- Usamos o QUnit, uma biblioteca de testes JavaScript que já está incluída via CDN.
- Para rodar os testes, **abra o arquivo `tests-runner.html` no navegador**.
- O QUnit vai mostrar automaticamente na tela se os testes passaram ou falharam, de forma visual e fácil de entender.



## 📖 Parte 3: Sobre o projeto

O Neteflix é um site de streaming fictício, feito para praticar e aprender desenvolvimento web. O objetivo é simular um sistema de filmes, com cadastro, login, listagem e edição, além de perfis de usuário e logout.

### Funcionalidades principais
- Cadastro de usuários e filmes
- Login e autenticação
- Listagem e edição de filmes
- Perfis de usuário (admin e comum)
- Logout seguro

### Tecnologias utilizadas
- **HTML** e **CSS** para a estrutura e o visual
- **JavaScript puro** para toda a lógica
- **PouchDB** e **localStorage** para salvar os dados no navegador
- **QUnit** para os testes automatizados



## 🛠️ Parte 4: Documentação técnica básica

### Principais métodos em `scripts.js`

- **cadastrarUsuario(dados):** adiciona um novo usuário ao banco local (PouchDB/localStorage)
- **validarLogin():** verifica as credenciais digitadas e autentica o usuário
- **editarFilme(filmeId):** carrega os dados de um filme para edição no formulário
- **cadastrarFilme(dados):** adiciona um novo filme ao banco local
- **excluirFilme(filmeId):** remove um filme do banco
- **editarUsuario(usuarioId):** carrega os dados de um usuário para edição
- **excluirUsuario(usuarioId):** remove um usuário do banco
- **fazerLogout():** limpa os dados de sessão e redireciona para a tela de login

### Regras e proteções básicas
- **Acesso restrito:** só usuários autenticados podem acessar páginas como `cliente.html` e `admin.html`.
- **Logout seguro:** depois de sair, tentar voltar pelo navegador redireciona para o login (tem verificação de sessão).
- **Persistência:** todos os dados ficam salvos no navegador usando localStorage e PouchDB, então não se perdem ao recarregar a página.
