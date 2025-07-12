// Scripts para o Neteflix
// Desenvolvido por: Estagiário

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

// Adicionar evento ao formulário quando a página carregar
document.addEventListener('DOMContentLoaded', function() {
    // Verificar se estamos na página de login
    var loginForm = document.getElementById('loginForm');
    
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault(); // Previne o envio padrão do formulário
            validarLogin();
        });
    }
    
    console.log('Script carregado com sucesso!');
}); 