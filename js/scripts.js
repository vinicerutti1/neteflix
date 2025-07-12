// Função para abrir modal com detalhes do filme
function abrirModalFilme(filmeId) {
    // Aqui futuramente será feita a requisição para o banco de dados
    console.log('Abrindo modal para filme ID:', filmeId);
    
    // Estrutura preparada para receber dados do backend
    var dadosFilme = {
        titulo: 'Título do Filme',
        ano: '2024',
        genero: 'Ação',
        duracao: '120 min',
        descricao: 'Descrição do filme será carregada aqui...',
        poster: 'https://via.placeholder.com/300x450/333/666?text=Poster',
        trailer: 'https://www.youtube.com/embed/dQw4w9WgXcQ'
    };
    
    // Atualizar elementos do modal
    atualizarModalFilme(dadosFilme);
    
    // Abrir modal
    var modal = new bootstrap.Modal(document.getElementById('movieModal'));
    modal.show();
}

// Função para atualizar o modal com dados do filme
function atualizarModalFilme(dados) {
    // Atualizar elementos do modal
    var elementos = {
        'modal-title': dados.titulo,
        'modal-year': dados.ano,
        'modal-genre': dados.genero,
        'modal-duration': dados.duracao,
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
            'destaque': 'Filmes em Destaque',
            'acao': 'Filmes de Ação',
            'comedia': 'Filmes de Comédia',
            'drama': 'Filmes de Drama',
            'ficcao': 'Filmes de Ficção',
            'terror': 'Filmes de Terror'
        };
        
        sectionTitle.textContent = titulos[categoria] || 'Filmes';
    }
    
    // Aqui futuramente será carregado os filmes do banco de dados
    console.log('Categoria selecionada:', categoria);
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
    
    // Se tudo estiver ok, mostrar mensagem de sucesso
    alert('Login realizado com sucesso!');
    
    // Redirecionar para a página principal (simulação)
    window.location.href = 'index.html';
    
    return false; // Previne o envio do formulário
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

// Adicionar eventos quando a página carregar
document.addEventListener('DOMContentLoaded', function() {
    // Verificar se estamos na página de login
    var loginForm = document.getElementById('loginForm');
    
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault(); // Previne o envio padrão do formulário
            validarLogin();
        });
    }
    
    // Verificar se estamos na página de administração
    var formFilme = document.getElementById('formFilme');
    var formUsuario = document.getElementById('formUsuario');
    
    if (formFilme || formUsuario) {
        // Inicializar bancos de dados
        inicializarBancos();
        
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
        // Adicionar eventos aos botões de categoria
        var botoesCategoria = document.querySelectorAll('.category-btn');
        botoesCategoria.forEach(function(botao) {
            botao.addEventListener('click', function() {
                var categoria = this.getAttribute('data-category');
                trocarCategoria(categoria);
            });
        });
        
        // Adicionar evento de clique nos cards de filme (quando existirem)
        // Futuramente, quando os filmes forem carregados dinamicamente
        document.addEventListener('click', function(e) {
            if (e.target.closest('.movie-card')) {
                var filmeId = e.target.closest('.movie-card').getAttribute('data-id') || '1';
                abrirModalFilme(filmeId);
            }
        });
    }
    
    console.log('Script carregado com sucesso!');
}); 