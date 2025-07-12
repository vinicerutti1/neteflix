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