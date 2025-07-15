// QUnit - Adicionando via CDN
// Inclua o seguinte em um arquivo HTML de testes ou diretamente aqui para rodar no navegador:
// <link rel="stylesheet" href="https://code.jquery.com/qunit/qunit-2.19.4.css">
// <script src="https://code.jquery.com/qunit/qunit-2.19.4.js"></script>

// Para rodar os testes, crie um arquivo tests.html com os links do QUnit e inclua este tests.js:
//
// <!DOCTYPE html>
// <html lang="pt-br">
// <head>
//   <meta charset="UTF-8">
//   <title>Testes QUnit</title>
//   <link rel="stylesheet" href="https://code.jquery.com/qunit/qunit-2.19.4.css">
// </head>
// <body>
//   <div id="qunit"></div>
//   <div id="qunit-fixture"></div>
//   <script src="https://code.jquery.com/qunit/qunit-2.19.4.js"></script>
//   <script src="tests.js"></script>
// </body>
// </html>

// Mocks e helpers para testes
function mockDb() {
    return {
        put: sinon.stub().resolves({ok: true, id: 'mock_id'}),
        get: sinon.stub().resolves({
            _id: 'mock_id',
            titulo: 'Filme Teste',
            categoria: 'acao',
            sinopse: 'desc',
            trailer: 'url',
            imagem: 'img',
            nome: 'Usuário Teste',
            email: 'teste@teste.com',
            senha: '123456',
            tipoAcesso: 'admin',
            _rev: '1-abc'
        }),
        remove: sinon.stub().resolves({ok: true}),
        allDocs: sinon.stub().resolves({rows: []})
    };
}

// ====== INÍCIO DOS TESTES ======

QUnit.module('Funções de Filmes', hooks => {
    let oldDbFilmes, oldAlert, oldConfirm;
    hooks.beforeEach(() => {
        oldDbFilmes = window.dbFilmes;
        dbFilmes = window.dbFilmes = mockDb();
        oldAlert = window.alert;
        window.alert = sinon.stub();
        oldConfirm = window.confirm;
        window.confirm = sinon.stub().returns(true);
        // Mock DOM
        document.getElementById('qunit-fixture').innerHTML = `
            <form id="formFilme">
                <input id="titulo"><input id="categoria"><input id="sinopse"><input id="trailer"><input id="imagem">
                <button type="submit">Cadastrar Filme</button>
            </form>
            <div id="listaFilmes"></div>
        `;
    });
    hooks.afterEach(() => {
        dbFilmes = window.dbFilmes = oldDbFilmes;
        window.alert = oldAlert;
        window.confirm = oldConfirm;
        document.getElementById('qunit-fixture').innerHTML = '';
    });

    QUnit.test('cadastrarFilme cadastra corretamente', assert => {
        const done = assert.async();
        cadastrarFilme({titulo: 'Teste', categoria: 'acao', sinopse: 'desc', trailer: 'url', imagem: 'img'})
            .then(result => {
                assert.ok(window.dbFilmes.put.calledOnce, 'dbFilmes.put chamado');
                assert.ok(window.alert.calledWithMatch('sucesso'), 'alerta de sucesso chamado');
                done();
            });
    });

    QUnit.test('editarFilme preenche formulário com dados do filme', assert => {
        const done = assert.async();
        editarFilme('mock_id');
        setTimeout(() => {
            assert.equal(document.getElementById('titulo').value, 'Filme Teste', 'Título preenchido');
            assert.equal(document.getElementById('categoria').value, 'acao', 'Categoria preenchida');
            done();
        }, 10);
    });

    QUnit.test('excluirFilme remove filme corretamente', assert => {
        const done = assert.async();
        excluirFilme('mock_id');
        setTimeout(() => {
            assert.ok(window.dbFilmes.get.calledOnce, 'dbFilmes.get chamado');
            assert.ok(window.dbFilmes.remove.calledOnce, 'dbFilmes.remove chamado');
            assert.ok(window.alert.calledWithMatch('excluído'), 'alerta de exclusão chamado');
            done();
        }, 10);
    });
});

QUnit.module('Funções de Usuários', hooks => {
    let oldDbUsuarios, oldAlert, oldConfirm;
    hooks.beforeEach(() => {
        oldDbUsuarios = window.dbUsuarios;
        dbUsuarios = window.dbUsuarios = mockDb();
        oldAlert = window.alert;
        window.alert = sinon.stub();
        oldConfirm = window.confirm;
        window.confirm = sinon.stub().returns(true);
        // Mock DOM
        document.getElementById('qunit-fixture').innerHTML = `
            <form id="formUsuario">
                <input id="nome"><input id="email"><input id="senha"><input id="tipoAcesso">
                <button type="submit">Cadastrar Usuário</button>
            </form>
            <div id="listaUsuarios"></div>
        `;
    });
    hooks.afterEach(() => {
        dbUsuarios = window.dbUsuarios = oldDbUsuarios;
        window.alert = oldAlert;
        window.confirm = oldConfirm;
        document.getElementById('qunit-fixture').innerHTML = '';
    });

    QUnit.test('cadastrarUsuario cadastra corretamente', assert => {
        const done = assert.async();
        cadastrarUsuario({nome: 'Teste', email: 'teste@teste.com', senha: '123456', tipoAcesso: 'admin'})
            .then(result => {
                assert.ok(window.dbUsuarios.put.calledOnce, 'dbUsuarios.put chamado');
                assert.ok(window.alert.calledWithMatch('sucesso'), 'alerta de sucesso chamado');
                done();
            });
    });

    QUnit.test('editarUsuario preenche formulário com dados do usuário', assert => {
        const done = assert.async();
        editarUsuario('mock_id');
        setTimeout(() => {
            assert.equal(document.getElementById('nome').value, 'Usuário Teste', 'Nome preenchido');
            assert.equal(document.getElementById('email').value, 'teste@teste.com', 'Email preenchido');
            done();
        }, 10);
    });

    QUnit.test('excluirUsuario remove usuário corretamente', assert => {
        const done = assert.async();
        excluirUsuario('mock_id');
        setTimeout(() => {
            assert.ok(window.dbUsuarios.get.calledOnce, 'dbUsuarios.get chamado');
            assert.ok(window.dbUsuarios.remove.calledOnce, 'dbUsuarios.remove chamado');
            assert.ok(window.alert.calledWithMatch('excluído'), 'alerta de exclusão chamado');
            done();
        }, 10);
    });
});
    
