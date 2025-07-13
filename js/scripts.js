// Função para abrir modal com detalhes do filme
function abrirModalFilme(filmeId) {
    console.log('Abrindo modal para filme ID:', filmeId);
    
    // Inicializar banco se ainda não foi inicializado
    if (!dbFilmes) {
        dbFilmes = new PouchDB('neteflix_filmes');
    }
    
    // Buscar dados do filme no banco de dados
    dbFilmes.get(filmeId)
        .then(function(filme) {
            // Converter dados do filme para o formato do modal
            var dadosFilme = {
                _id: filme._id,
                titulo: filme.titulo,
                ano: '2024', // Ano padrão
                genero: filme.categoria,
                duracao: '120 min', // Duração padrão
                descricao: filme.sinopse,
                poster: filme.imagem,
                trailer: filme.trailer.replace('watch?v=', 'embed/')
            };
            
            // Salvar nos filmes visitados recentemente
            adicionarFilmeRecente(dadosFilme);
            
            // Atualizar elementos do modal
            atualizarModalFilme(dadosFilme);
            
            // Abrir modal
            var modal = new bootstrap.Modal(document.getElementById('movieModal'));
            modal.show();
        })
        .catch(function(err) {
            console.error('Erro ao carregar filme:', err);
            alert('Erro ao carregar dados do filme.');
        });
}

// Função para adicionar filme à lista de visitados recentemente
function adicionarFilmeRecente(filme) {
    var recentes = JSON.parse(localStorage.getItem('recentesFilmes') || '[]');
    // Remove se já existir
    recentes = recentes.filter(function(f) { return f._id !== filme._id; });
    // Adiciona no início
    recentes.unshift({
        _id: filme._id,
        titulo: filme.titulo,
        poster: filme.poster
    });
    // Limita a 5 filmes
    if (recentes.length > 5) {
        recentes = recentes.slice(0, 5);
    }
    localStorage.setItem('recentesFilmes', JSON.stringify(recentes));
    // Atualiza o grid se existir na página
    if (typeof atualizarGridRecentes === 'function') atualizarGridRecentes();
}

// Função para atualizar o modal com dados do filme
function atualizarModalFilme(dados) {
    // Atualizar elementos do modal
    var elementos = {
        'modal-title': dados.titulo,
        'modal-genre': dados.genero,
        'modal-description': dados.descricao,
        'modal-poster': dados.poster,
        'modal-trailer': dados.trailer
    };
    // Atualizar cada elemento
    for (var id in elementos) {
        var elemento = document.getElementById(id);
        if (elemento) {
            if (id === 'modal-poster') {
                elemento.src = elementos[id];
                elemento.alt = dados.titulo;
            } else if (id === 'modal-trailer') {
                elemento.src = elementos[id];
            } else if (id === 'modal-description') {
                const desc = elementos[id] || '';
                elemento.textContent = desc;
                elemento.classList.remove('desc-clamp');
            } else {
                elemento.textContent = elementos[id];
            }
        }
    }
}

// Função para trocar categoria ativa
function trocarCategoria(categoria) {
    // Remover classe active de todos os botões
    var botoes = document.querySelectorAll('.category-btn');
    botoes.forEach(function(botao) {
        botao.classList.remove('active');
    });
    
    // Adicionar classe active ao botão clicado
    var botaoAtivo = document.querySelector('[data-category="' + categoria + '"]');
    if (botaoAtivo) {
        botaoAtivo.classList.add('active');
    }
    
    // Atualizar título da seção
    var sectionTitle = document.getElementById('section-title');
    if (sectionTitle) {
        var titulos = {
            'todos': 'Todos os Filmes',
            'acao': 'Filmes de Ação',
            'comedia': 'Filmes de Comédia',
            'drama': 'Filmes de Drama',
            'ficcao': 'Filmes de Ficção',
            'terror': 'Filmes de Terror'
        };
        
        sectionTitle.textContent = titulos[categoria] || 'Filmes';
    }
    
    // Carregar filmes do banco de dados
    carregarFilmesPorCategoria(categoria);
}

// Função para carregar filmes por categoria
function carregarFilmesPorCategoria(categoria) {
    // Inicializar banco se ainda não foi inicializado
    if (!dbFilmes) {
        dbFilmes = new PouchDB('neteflix_filmes');
    }
    
    dbFilmes.allDocs({
        include_docs: true,
        startkey: 'filme_',
        endkey: 'filme_\ufff0'
    })
    .then(function(result) {
        var filmes = result.rows.map(function(row) {
            return row.doc;
        });
        
        // Filtrar por categoria (se não for "todos")
        var filmesFiltrados = filmes;
        if (categoria !== 'todos') {
            filmesFiltrados = filmes.filter(function(filme) {
                return filme.categoria === categoria;
            });
        }
        
        // Exibir filmes na página principal
        exibirFilmesNaPaginaPrincipal(filmesFiltrados, categoria);
    })
    .catch(function(err) {
        console.error('Erro ao carregar filmes:', err);
        document.getElementById('movies-grid').innerHTML = '<div class="col-12"><p class="text-center text-danger">Erro ao carregar filmes.</p></div>';
    });
}

// Função para exibir filmes na página principal
function exibirFilmesNaPaginaPrincipal(filmes, categoria) {
    var moviesGrid = document.getElementById('movies-grid');
    if (!moviesGrid) return;
    
    if (!filmes || filmes.length === 0) {
        moviesGrid.innerHTML = '<div class="col-12"><p class="text-center">Nenhum filme encontrado nesta categoria.</p></div>';
        return;
    }
    
    var html = '';
    filmes.forEach(function(filme) {
        html += `
            <div>
                <div class="card movie-card h-100" data-id="${filme._id}" style="cursor: pointer;">
                    <img src="${filme.imagem}" class="card-img-top" alt="${filme.titulo}">
                    <div class="movie-hover-info">
                        <div class="movie-hover-title">${filme.titulo}</div>
                        ${filme.categoria ? `<div class='movie-hover-cat'>${filme.categoria.charAt(0).toUpperCase() + filme.categoria.slice(1)}</div>` : ''}
                        ${filme.duracao ? `<div class='movie-hover-dur'>${filme.duracao} min</div>` : ''}
                    </div>
                </div>
            </div>
        `;
    });
    
    moviesGrid.innerHTML = html;
}

// Função para validar o formulário de login
function validarLogin() {
    // Pegar os valores dos campos
    var email = document.getElementById('email').value;
    var senha = document.getElementById('senha').value;
    
    // Verificar se os campos estão vazios
    if (email === '' || senha === '') {
        alert('Por favor, preencha todos os campos!');
        return false;
    }
    
    // Verificar se o email tem formato básico
    if (!email.includes('@')) {
        alert('Por favor, digite um email válido!');
        return false;
    }
    
    // Verificar se a senha tem pelo menos 6 caracteres
    if (senha.length < 6) {
        alert('A senha deve ter pelo menos 6 caracteres!');
        return false;
    }
    
    // Verificar credenciais no banco de dados
    verificarCredenciais(email, senha);
    
    return false; // Previne o envio do formulário
}

// Função para verificar credenciais no banco de dados
function verificarCredenciais(email, senha) {
    console.log('Verificando credenciais para:', email);
    
    // Inicializar banco se ainda não foi inicializado
    if (!dbUsuarios) {
        dbUsuarios = new PouchDB('neteflix_usuarios');
    }
    
    // Primeiro, garantir que os usuários padrão existam
    criarUsuariosPadrao()
        .then(function() {
            // Agora buscar usuário por email
            return dbUsuarios.allDocs({
                include_docs: true,
                startkey: 'usuario_',
                endkey: 'usuario_\ufff0'
            });
        })
        .then(function(result) {
            console.log('Usuários encontrados:', result.rows.length);
            
            var usuario = result.rows.find(function(row) {
                console.log('Verificando usuário:', row.doc.email, 'vs', email);
                return row.doc.email === email && row.doc.senha === senha;
            });
            
            if (usuario) {
                console.log('Usuário encontrado:', usuario.doc);
                // Login bem-sucedido
                alert('Login realizado com sucesso! Bem-vindo, ' + usuario.doc.nome + '!');
                
                // Salvar dados do usuário na sessão
                sessionStorage.setItem('usuarioLogado', JSON.stringify({
                    id: usuario.doc._id,
                    nome: usuario.doc.nome,
                    email: usuario.doc.email,
                    tipoAcesso: usuario.doc.tipoAcesso
                }));
                
                console.log('Redirecionando para:', usuario.doc.tipoAcesso === 'admin' ? 'admin.html' : 'cliente.html');
                
                // Redirecionar baseado no tipo de acesso
                if (usuario.doc.tipoAcesso === 'admin') {
                    window.location.href = 'admin.html';
                } else {
                    window.location.href = 'cliente.html';
                }
            } else {
                console.log('Usuário não encontrado ou senha incorreta');
                alert('Email ou senha incorretos! Verifique suas credenciais.');
            }
        })
        .catch(function(err) {
            console.error('Erro ao verificar credenciais:', err);
            alert('Erro ao fazer login. Tente novamente.');
        });
}

// Função para criar usuários padrão
function criarUsuariosPadrao() {
    return new Promise(function(resolve, reject) {
        // Criar usuário administrador
        var adminUser = {
            _id: 'usuario_admin',
            nome: 'Administrador',
            email: 'admin@neteflix.com',
            senha: 'admin123',
            tipoAcesso: 'admin',
            tipo: 'usuario',
            criadoEm: new Date().toISOString()
        };
        
        // Criar usuário cliente
        var clienteUser = {
            _id: 'usuario_cliente',
            nome: 'Cliente',
            email: 'cliente@neteflix.com',
            senha: 'cliente123',
            tipoAcesso: 'usuario',
            tipo: 'usuario',
            criadoEm: new Date().toISOString()
        };
        
        // Criar ambos os usuários
        Promise.all([
            dbUsuarios.get('usuario_admin').catch(function(err) {
                if (err.name === 'not_found') {
                    console.log('Criando usuário administrador...');
                    return dbUsuarios.put(adminUser);
                }
                throw err;
            }),
            dbUsuarios.get('usuario_cliente').catch(function(err) {
                if (err.name === 'not_found') {
                    console.log('Criando usuário cliente...');
                    return dbUsuarios.put(clienteUser);
                }
                throw err;
            })
        ])
        .then(function() {
            console.log('Usuários padrão criados/verificados');
            resolve();
        })
        .catch(function(err) {
            console.error('Erro ao criar usuários padrão:', err);
            reject(err);
        });
    });
}

// ===== INICIALIZAÇÃO DO BANCO DE DADOS COM DADOS MOCKADOS =====

// Função para inicializar dados padrão
function inicializarDadosPadrao() {
    console.log('Inicializando dados padrão...');
    
    // Criar usuário administrador
    var adminUser = {
        _id: 'usuario_admin',
        nome: 'Administrador',
        email: 'admin@neteflix.com',
        senha: 'admin123',
        tipoAcesso: 'admin',
        tipo: 'usuario',
        criadoEm: new Date().toISOString()
    };
    
    // Criar usuário cliente
    var clienteUser = {
        _id: 'usuario_cliente',
        nome: 'Cliente',
        email: 'cliente@neteflix.com',
        senha: 'cliente123',
        tipoAcesso: 'usuario',
        tipo: 'usuario',
        criadoEm: new Date().toISOString()
    };
    
    // Criar filme padrão
    var filmePadrao = {
        _id: 'filme_john_wick',
        titulo: 'John Wick - De Volta Ao Jogo',
        categoria: 'acao',
        sinopse: 'essa é a descrição',
        trailer: 'https://www.youtube.com/watch?v=rUKOAwlyNag',
        imagem: 'https://br.web.img3.acsta.net/pictures/14/10/27/20/07/170589.jpg',
        tipo: 'filme',
        criadoEm: new Date().toISOString()
    };
    
    // Adicionar usuário administrador
    dbUsuarios.get('usuario_admin')
        .catch(function(err) {
            if (err.name === 'not_found') {
                console.log('Criando usuário administrador...');
                return dbUsuarios.put(adminUser);
            }
            throw err;
        })
        .then(function() {
            console.log('Usuário administrador criado/verificado');
        })
        .catch(function(err) {
            console.error('Erro ao criar usuário administrador:', err);
        });
    
    // Adicionar usuário cliente
    dbUsuarios.get('usuario_cliente')
        .catch(function(err) {
            if (err.name === 'not_found') {
                console.log('Criando usuário cliente...');
                return dbUsuarios.put(clienteUser);
            }
            throw err;
        })
        .then(function() {
            console.log('Usuário cliente criado/verificado');
        })
        .catch(function(err) {
            console.error('Erro ao criar usuário cliente:', err);
        });
    
    // Adicionar filme padrão
    dbFilmes.get('filme_john_wick')
        .catch(function(err) {
            if (err.name === 'not_found') {
                return dbFilmes.put(filmePadrao);
            }
            throw err;
        })
        .then(function() {
            console.log('Filme padrão criado');
        })
        .catch(function(err) {
            console.error('Erro ao criar filme padrão:', err);
        });
}

// ===== FUNÇÕES PARA ADMINISTRAÇÃO =====

// Variáveis globais para os bancos de dados
var dbFilmes;
var dbUsuarios;

// Inicializar bancos de dados
function inicializarBancos() {
    dbFilmes = new PouchDB('neteflix_filmes');
    dbUsuarios = new PouchDB('neteflix_usuarios');
    console.log('Bancos de dados inicializados');
}

// ===== FUNÇÕES PARA FILMES =====

// Cadastrar filme
function cadastrarFilme(dados) {
    dados._id = 'filme_' + Date.now();
    dados.tipo = 'filme';
    dados.criadoEm = new Date().toISOString();
    
    return dbFilmes.put(dados)
        .then(function(result) {
            alert('Filme cadastrado com sucesso!');
            limparFormFilme();
            carregarFilmes();
            return result;
        })
        .catch(function(err) {
            alert('Erro ao cadastrar filme: ' + err.message);
        });
}

// Carregar filmes
function carregarFilmes() {
    dbFilmes.allDocs({
        include_docs: true,
        startkey: 'filme_',
        endkey: 'filme_\ufff0'
    })
    .then(function(result) {
        var filmes = result.rows.map(function(row) {
            return row.doc;
        });
        exibirFilmes(filmes);
    })
    .catch(function(err) {
        console.error('Erro ao carregar filmes:', err);
        document.getElementById('listaFilmes').innerHTML = '<p class="text-danger">Erro ao carregar filmes.</p>';
    });
}

// Exibir filmes na lista
function exibirFilmes(filmes) {
    var lista = document.getElementById('listaFilmes');
    
    if (!filmes || filmes.length === 0) {
        lista.innerHTML = '<p class="text-muted">Nenhum filme cadastrado.</p>';
        return;
    }
    
    var html = '';
    filmes.forEach(function(filme) {
        html += `
            <div class="card mb-2">
                <div class="card-body p-2">
                    <h6 class="card-title mb-1">${filme.titulo}</h6>
                    <p class="card-text small text-muted mb-1">${filme.categoria}</p>
                    <div class="btn-group btn-group-sm">
                        <button class="btn btn-warning btn-sm" onclick="editarFilme('${filme._id}')">Editar</button>
                        <button class="btn btn-danger btn-sm" onclick="excluirFilme('${filme._id}')">Excluir</button>
                    </div>
                </div>
            </div>
        `;
    });
    
    lista.innerHTML = html;
}

// Editar filme
function editarFilme(filmeId) {
    dbFilmes.get(filmeId)
        .then(function(filme) {
            // Preencher formulário com dados do filme
            document.getElementById('titulo').value = filme.titulo || '';
            document.getElementById('categoria').value = filme.categoria || '';
            document.getElementById('sinopse').value = filme.sinopse || '';
            document.getElementById('trailer').value = filme.trailer || '';
            document.getElementById('imagem').value = filme.imagem || '';
            
            // Mudar botão para "Atualizar"
            var btnSubmit = document.querySelector('#formFilme button[type="submit"]');
            btnSubmit.textContent = 'Atualizar Filme';
            btnSubmit.onclick = function(e) {
                e.preventDefault();
                atualizarFilme(filmeId);
            };
        })
        .catch(function(err) {
            alert('Erro ao carregar filme: ' + err.message);
        });
}

// Atualizar filme
function atualizarFilme(filmeId) {
    var dados = {
        _id: filmeId,
        titulo: document.getElementById('titulo').value,
        categoria: document.getElementById('categoria').value,
        sinopse: document.getElementById('sinopse').value,
        trailer: document.getElementById('trailer').value,
        imagem: document.getElementById('imagem').value,
        tipo: 'filme',
        atualizadoEm: new Date().toISOString()
    };
    
    dbFilmes.get(filmeId)
        .then(function(doc) {
            dados._rev = doc._rev;
            return dbFilmes.put(dados);
        })
        .then(function() {
            alert('Filme atualizado com sucesso!');
            limparFormFilme();
            carregarFilmes();
        })
        .catch(function(err) {
            alert('Erro ao atualizar filme: ' + err.message);
        });
}

// Excluir filme
function excluirFilme(filmeId) {
    if (confirm('Tem certeza que deseja excluir este filme?')) {
        dbFilmes.get(filmeId)
            .then(function(doc) {
                return dbFilmes.remove(doc);
            })
            .then(function() {
                alert('Filme excluído com sucesso!');
                carregarFilmes();
            })
            .catch(function(err) {
                alert('Erro ao excluir filme: ' + err.message);
            });
    }
}

// Limpar formulário de filme
function limparFormFilme() {
    document.getElementById('formFilme').reset();
    var btnSubmit = document.querySelector('#formFilme button[type="submit"]');
    btnSubmit.textContent = 'Cadastrar Filme';
    btnSubmit.onclick = null;
}

// ===== FUNÇÕES PARA USUÁRIOS =====

// Cadastrar usuário
function cadastrarUsuario(dados) {
    dados._id = 'usuario_' + Date.now();
    dados.tipo = 'usuario';
    dados.criadoEm = new Date().toISOString();
    
    return dbUsuarios.put(dados)
        .then(function(result) {
            alert('Usuário cadastrado com sucesso!');
            limparFormUsuario();
            carregarUsuarios();
            return result;
        })
        .catch(function(err) {
            alert('Erro ao cadastrar usuário: ' + err.message);
        });
}

// Carregar usuários
function carregarUsuarios() {
    dbUsuarios.allDocs({
        include_docs: true,
        startkey: 'usuario_',
        endkey: 'usuario_\ufff0'
    })
    .then(function(result) {
        var usuarios = result.rows.map(function(row) {
            return row.doc;
        });
        exibirUsuarios(usuarios);
    })
    .catch(function(err) {
        console.error('Erro ao carregar usuários:', err);
        document.getElementById('listaUsuarios').innerHTML = '<p class="text-danger">Erro ao carregar usuários.</p>';
    });
}

// Exibir usuários na lista
function exibirUsuarios(usuarios) {
    var lista = document.getElementById('listaUsuarios');
    
    if (!usuarios || usuarios.length === 0) {
        lista.innerHTML = '<p class="text-muted">Nenhum usuário cadastrado.</p>';
        return;
    }
    
    var html = '';
    usuarios.forEach(function(usuario) {
        html += `
            <div class="card mb-2">
                <div class="card-body p-2">
                    <h6 class="card-title mb-1">${usuario.nome}</h6>
                    <p class="card-text small text-muted mb-1">${usuario.email} • ${usuario.tipoAcesso}</p>
                    <div class="btn-group btn-group-sm">
                        <button class="btn btn-warning btn-sm" onclick="editarUsuario('${usuario._id}')">Editar</button>
                        <button class="btn btn-danger btn-sm" onclick="excluirUsuario('${usuario._id}')">Excluir</button>
                    </div>
                </div>
            </div>
        `;
    });
    
    lista.innerHTML = html;
}

// Editar usuário
function editarUsuario(usuarioId) {
    dbUsuarios.get(usuarioId)
        .then(function(usuario) {
            // Preencher formulário com dados do usuário
            document.getElementById('nome').value = usuario.nome || '';
            document.getElementById('email').value = usuario.email || '';
            document.getElementById('senha').value = usuario.senha || '';
            document.getElementById('tipoAcesso').value = usuario.tipoAcesso || '';
            
            // Mudar botão para "Atualizar"
            var btnSubmit = document.querySelector('#formUsuario button[type="submit"]');
            btnSubmit.textContent = 'Atualizar Usuário';
            btnSubmit.onclick = function(e) {
                e.preventDefault();
                atualizarUsuario(usuarioId);
            };
        })
        .catch(function(err) {
            alert('Erro ao carregar usuário: ' + err.message);
        });
}

// Atualizar usuário
function atualizarUsuario(usuarioId) {
    var dados = {
        _id: usuarioId,
        nome: document.getElementById('nome').value,
        email: document.getElementById('email').value,
        senha: document.getElementById('senha').value,
        tipoAcesso: document.getElementById('tipoAcesso').value,
        tipo: 'usuario',
        atualizadoEm: new Date().toISOString()
    };
    
    dbUsuarios.get(usuarioId)
        .then(function(doc) {
            dados._rev = doc._rev;
            return dbUsuarios.put(dados);
        })
        .then(function() {
            alert('Usuário atualizado com sucesso!');
            limparFormUsuario();
            carregarUsuarios();
        })
        .catch(function(err) {
            alert('Erro ao atualizar usuário: ' + err.message);
        });
}

// Excluir usuário
function excluirUsuario(usuarioId) {
    if (confirm('Tem certeza que deseja excluir este usuário?')) {
        dbUsuarios.get(usuarioId)
            .then(function(doc) {
                return dbUsuarios.remove(doc);
            })
            .then(function() {
                alert('Usuário excluído com sucesso!');
                carregarUsuarios();
            })
            .catch(function(err) {
                alert('Erro ao excluir usuário: ' + err.message);
            });
    }
}

// Limpar formulário de usuário
function limparFormUsuario() {
    document.getElementById('formUsuario').reset();
    var btnSubmit = document.querySelector('#formUsuario button[type="submit"]');
    btnSubmit.textContent = 'Cadastrar Usuário';
    btnSubmit.onclick = null;
}

// ===== EVENTOS DOS FORMULÁRIOS =====

// Processar formulário de filme
function processarFormFilme(event) {
    event.preventDefault();
    
    var dados = {
        titulo: document.getElementById('titulo').value,
        categoria: document.getElementById('categoria').value,
        sinopse: document.getElementById('sinopse').value,
        trailer: document.getElementById('trailer').value,
        imagem: document.getElementById('imagem').value
    };
    
    // Validações básicas
    if (!dados.titulo || !dados.categoria || !dados.sinopse) {
        alert('Por favor, preencha todos os campos obrigatórios!');
        return;
    }
    
    cadastrarFilme(dados);
}

// Processar formulário de usuário
function processarFormUsuario(event) {
    event.preventDefault();
    
    var dados = {
        nome: document.getElementById('nome').value,
        email: document.getElementById('email').value,
        senha: document.getElementById('senha').value,
        tipoAcesso: document.getElementById('tipoAcesso').value
    };
    
    // Validações básicas
    if (!dados.nome || !dados.email || !dados.senha || !dados.tipoAcesso) {
        alert('Por favor, preencha todos os campos obrigatórios!');
        return;
    }
    
    if (dados.senha.length < 6) {
        alert('A senha deve ter pelo menos 6 caracteres!');
        return;
    }
    
    cadastrarUsuario(dados);
}

// Função para atualizar o grid de visitados recentemente
function atualizarGridRecentes() {
    var recentes = JSON.parse(localStorage.getItem('recentesFilmes') || '[]');
    var grid = document.getElementById('recentes-grid');
    if (!grid) return;
    if (!recentes.length) {
        grid.innerHTML = '<div class="col-12"><p class="recent-empty-msg">NÃO HÁ FILMES VISUALIZADOS RECENTEMENTE</p></div>';
        return;
    }
    var html = '';
    recentes.forEach(function(filme) {
        html += `
            <div class="col-6 col-sm-4 col-md-3 col-lg-2 mb-3 d-flex justify-content-center">
                <div class="card recent-card h-100" style="cursor:pointer" onclick="abrirModalFilme('${filme._id}')">
                    <img src="${filme.poster}" class="card-img-top" alt="${filme.titulo}">
                    <div class="recent-title-hover">${filme.titulo}</div>
                </div>
            </div>
        `;
    });
    grid.innerHTML = html;
}

// Chamar atualizarGridRecentes ao carregar a página cliente.html
if (document.getElementById('recentes-grid')) {
    document.addEventListener('DOMContentLoaded', atualizarGridRecentes);
}

// Adicionar usuário mockado ao carregar a página de login
if (window.location.pathname.includes('login.html')) {
    const dbUsuarios = new PouchDB('usuarios');
    const usuarioMock = {
        _id: 'iskailer@neteflix.com',
        nome: 'Iskailer',
        email: 'iskailer@neteflix.com',
        senha: 'iskailer',
        tipo: 'cliente'
    };
    dbUsuarios.get(usuarioMock._id).catch(function (err) {
        if (err.status === 404) {
            dbUsuarios.put(usuarioMock);
        }
    });
}

// Adicionar eventos quando a página carregar
document.addEventListener('DOMContentLoaded', function() {
    // Verificar redirecionamento para usuários já autenticados
    if (verificarUsuarioAutenticado()) {
        return; // Se redirecionou, não continuar com o resto da inicialização
    }
    
    // Verificar se estamos na página de login
    var loginForm = document.getElementById('loginForm');
    
    if (loginForm) {
        // Verificar se usuário já está logado e redirecionar
        if (redirecionarSeLogado()) {
            return;
        }
        
        // Inicializar banco de usuários para a página de login
        if (!dbUsuarios) {
            dbUsuarios = new PouchDB('neteflix_usuarios');
            console.log('Banco de usuários inicializado');
        }
        
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault(); // Previne o envio padrão do formulário
            console.log('Formulário de login submetido');
            validarLogin();
        });
        
        console.log('Página de login carregada com sucesso');
    }
    
    // Verificar se estamos na página de administração
    var formFilme = document.getElementById('formFilme');
    var formUsuario = document.getElementById('formUsuario');
    
    if (formFilme || formUsuario) {
        // Verificar permissões de administrador
        if (!verificarPermissoes('admin')) {
            return;
        }
        
        // Inicializar bancos de dados
        inicializarBancos();
        
        // Inicializar dados padrão
        inicializarDadosPadrao();
        
        // Carregar dados existentes
        if (formFilme) {
            carregarFilmes();
            formFilme.addEventListener('submit', processarFormFilme);
        }
        
        if (formUsuario) {
            carregarUsuarios();
            formUsuario.addEventListener('submit', processarFormUsuario);
        }
    }
    
    // Verificar se estamos na página inicial
    var moviesGrid = document.getElementById('movies-grid');
    if (moviesGrid) {
        // A página inicial não precisa de autenticação
        
        // Inicializar banco de filmes se necessário
        if (!dbFilmes) {
            dbFilmes = new PouchDB('neteflix_filmes');
        }
        
        // Carregar todos os filmes por padrão
        carregarFilmesPorCategoria('todos');
        
        // Adicionar eventos aos botões de categoria
        var botoesCategoria = document.querySelectorAll('.category-btn');
        botoesCategoria.forEach(function(botao) {
            botao.addEventListener('click', function() {
                var categoria = this.getAttribute('data-category');
                trocarCategoria(categoria);
            });
        });
        
        // Adicionar evento de clique nos cards de filme
        document.addEventListener('click', function(e) {
            if (e.target.closest('.movie-card')) {
                var filmeId = e.target.closest('.movie-card').getAttribute('data-id') || '1';
                abrirModalFilme(filmeId);
            }
        });
    }
    
    // Verificar se estamos na página do cliente
    if (window.location.pathname.includes('cliente.html')) {
        // Verificar autenticação para página do cliente
        if (!verificarAutenticacao()) {
            return;
        }
    }
    
    // Verificar se há usuário logado
    verificarUsuarioLogado();
    
    console.log('Script carregado com sucesso!');
});

// ===== FUNÇÕES DE REDIRECIONAMENTO PARA USUÁRIOS AUTENTICADOS =====

// Função para verificar se o usuário está logado e redirecionar se necessário
function verificarUsuarioAutenticado() {
    var usuarioLogado = sessionStorage.getItem('usuarioLogado');
    if (usuarioLogado) {
        var usuario = JSON.parse(usuarioLogado);
        console.log('Usuário já autenticado:', usuario.nome, 'Tipo:', usuario.tipoAcesso);
        
        // Se estiver na página de login, redirecionar
        if (window.location.pathname.includes('login.html')) {
            if (usuario.tipoAcesso === 'admin') {
                window.location.href = 'admin.html';
            } else {
                window.location.href = 'cliente.html';
            }
            return true;
        }
        
        // Se estiver na página inicial e clicar em "Começar", redirecionar
        if (window.location.pathname.includes('index.html')) {
            // Adicionar evento ao botão "Começar"
            var btnComecar = document.querySelector('.hero-content .btn-primary');
            if (btnComecar) {
                btnComecar.addEventListener('click', function(e) {
                    e.preventDefault();
                    if (usuario.tipoAcesso === 'admin') {
                        window.location.href = 'admin.html';
                    } else {
                        window.location.href = 'cliente.html';
                    }
                });
            }
        }
        
        return true;
    }
    return false;
}

// Função para redirecionar usuário logado que tenta acessar login.html
function redirecionarSeLogado() {
    var usuarioLogado = sessionStorage.getItem('usuarioLogado');
    if (usuarioLogado) {
        var usuario = JSON.parse(usuarioLogado);
        console.log('Usuário já logado tentando acessar login, redirecionando...');
        
        if (usuario.tipoAcesso === 'admin') {
            window.location.href = 'admin.html';
        } else {
            window.location.href = 'cliente.html';
        }
        return true;
    }
    return false;
}

// ===== FUNÇÕES DE PROTEÇÃO DE ACESSO =====

// Função para verificar se o usuário está autenticado
function verificarAutenticacao() {
    var usuarioLogado = sessionStorage.getItem('usuarioLogado');
    if (!usuarioLogado) {
        alert('Você precisa estar logado para acessar esta página!');
        window.location.href = 'login.html';
        return false;
    }
    
    // Verificar se o usuário está na página correta
    var usuario = JSON.parse(usuarioLogado);
    var paginaAtual = window.location.pathname;
    
    if (paginaAtual.includes('cliente.html') && usuario.tipoAcesso === 'admin') {
        window.location.href = 'admin.html';
        return false;
    } else if (paginaAtual.includes('admin.html') && usuario.tipoAcesso !== 'admin') {
        window.location.href = 'cliente.html';
        return false;
    }
    
    return true;
}

// Função para verificar permissões de acesso
function verificarPermissoes(tipoPermitido) {
    var usuarioLogado = sessionStorage.getItem('usuarioLogado');
    if (!usuarioLogado) {
        window.location.href = 'login.html';
        return false;
    }
    
    var usuario = JSON.parse(usuarioLogado);
    if (usuario.tipoAcesso !== tipoPermitido) {
        alert('Você não tem permissão para acessar esta página!');
        if (usuario.tipoAcesso === 'admin') {
            window.location.href = 'admin.html';
        } else {
            window.location.href = 'cliente.html';
        }
        return false;
    }
    return true;
}

// Função para verificar se há usuário logado
function verificarUsuarioLogado() {
    var usuarioLogado = sessionStorage.getItem('usuarioLogado');
    if (usuarioLogado) {
        var usuario = JSON.parse(usuarioLogado);
        console.log('Usuário logado:', usuario.nome);
        
        // Atualizar interface se houver elementos para mostrar o usuário
        var userInfo = document.getElementById('user-info');
        if (userInfo) {
            userInfo.innerHTML = `
                <span class="navbar-text me-3">Olá, ${usuario.nome}!</span>
                <button class="btn btn-outline-light btn-sm" onclick="fazerLogout()">Sair</button>
            `;
        }
        return usuario;
    }
    return null;
}

// Função para fazer logout
function fazerLogout() {
    sessionStorage.removeItem('usuarioLogado');
    alert('Logout realizado com sucesso!');
    window.location.href = 'login.html';
} 