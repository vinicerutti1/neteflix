// Scripts para o Neteflix

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
    }
    
    console.log('Script carregado com sucesso!');
}); 