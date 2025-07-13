// Arquivo de testes unitários usando QUnit
// Este arquivo contém todos os testes para o projeto Neteflix

QUnit.module('Testes Básicos do Projeto Neteflix');

QUnit.test('Verificar se QUnit está funcionando', function(assert) {
    assert.ok(true, 'QUnit está funcionando corretamente');
    assert.equal(1 + 1, 2, 'Operações matemáticas básicas funcionam');
});

QUnit.test('Verificar se a página carregou corretamente', function(assert) {
    assert.ok(document.querySelector('body'), 'Body da página existe');
    assert.ok(document.querySelector('.navbar'), 'Navbar existe');
    assert.ok(document.querySelector('.hero-banner'), 'Hero banner existe');
    assert.ok(document.querySelector('footer'), 'Footer existe');
});

QUnit.test('Verificar elementos de navegação', function(assert) {
    const navbar = document.querySelector('.navbar');
    const brand = navbar.querySelector('.navbar-brand');
    const loginLink = navbar.querySelector('a[href="login.html"]');
    
    assert.ok(brand, 'Logo/marca da navbar existe');
    assert.equal(brand.textContent, 'NETEFLIX', 'Texto da marca está correto');
    assert.ok(loginLink, 'Link de login existe');
    assert.equal(loginLink.textContent, 'Entrar', 'Texto do link de login está correto');
});

QUnit.test('Verificar conteúdo do hero banner', function(assert) {
    const heroContent = document.querySelector('.hero-content');
    const title = heroContent.querySelector('h1');
    const subtitle = heroContent.querySelector('p');
    const button = heroContent.querySelector('.btn');
    
    assert.ok(title, 'Título do hero banner existe');
    assert.equal(title.textContent, 'Filmes, séries e muito mais', 'Título está correto');
    assert.ok(subtitle, 'Subtítulo do hero banner existe');
    assert.equal(subtitle.textContent, 'Feito com amor para o iskailer', 'Subtítulo está correto');
    assert.ok(button, 'Botão do hero banner existe');
    assert.equal(button.textContent, 'Começar', 'Texto do botão está correto');
    assert.ok(button.classList.contains('btn-primary'), 'Botão tem a classe btn-primary');
});

QUnit.test('Verificar footer', function(assert) {
    const footer = document.querySelector('footer');
    const copyright = footer.querySelector('p');
    
    assert.ok(copyright, 'Copyright do footer existe');
    assert.ok(copyright.textContent.includes('2024'), 'Copyright contém o ano 2024');
    assert.ok(copyright.textContent.includes('Neteflix'), 'Copyright contém o nome Neteflix');
});

// Testes para verificar se os scripts externos carregaram
QUnit.test('Verificar carregamento de dependências externas', function(assert) {
    assert.ok(typeof $ !== 'undefined' || typeof jQuery !== 'undefined', 'jQuery está disponível (via Bootstrap)');
    assert.ok(typeof PouchDB !== 'undefined', 'PouchDB está disponível');
    assert.ok(typeof QUnit !== 'undefined', 'QUnit está disponível');
});

// Testes para verificar responsividade
QUnit.test('Verificar classes de responsividade', function(assert) {
    const navbar = document.querySelector('.navbar');
    const heroBanner = document.querySelector('.hero-banner');
    
    assert.ok(navbar.classList.contains('navbar-expand-lg'), 'Navbar tem classe de expansão responsiva');
    assert.ok(heroBanner.classList.contains('hero-banner'), 'Hero banner tem suas classes CSS');
});

// Testes para verificar estrutura HTML
QUnit.test('Verificar estrutura HTML básica', function(assert) {
    assert.ok(document.doctype, 'Documento tem DOCTYPE');
    assert.equal(document.documentElement.lang, 'pt-br', 'Linguagem do documento está definida como pt-br');
    assert.ok(document.title.includes('Neteflix'), 'Título da página contém Neteflix');
});

// Testes para verificar links e navegação
QUnit.test('Verificar links de navegação', function(assert) {
    const loginLinks = document.querySelectorAll('a[href="login.html"]');
    assert.ok(loginLinks.length > 0, 'Existe pelo menos um link para login.html');
    
    loginLinks.forEach(function(link, index) {
        assert.ok(link.href.includes('login.html'), `Link ${index + 1} aponta para login.html`);
    });
});

// Testes para verificar estilos CSS
QUnit.test('Verificar aplicação de estilos', function(assert) {
    const body = document.querySelector('body');
    const computedStyle = window.getComputedStyle(body);
    
    assert.ok(body.classList.contains('index-page'), 'Body tem a classe index-page');
    assert.ok(computedStyle.backgroundImage.includes('background-index.jpg'), 'Background image está aplicado');
});

// Testes para verificar funcionalidades JavaScript
QUnit.test('Verificar disponibilidade de funções JavaScript', function(assert) {
    // Aqui você pode adicionar testes para funções específicas do seu scripts.js
    // Por exemplo, se você tiver funções de autenticação, validação, etc.
    assert.ok(true, 'Estrutura básica para testes de JavaScript está pronta');
});

// Testes para verificar acessibilidade básica
QUnit.test('Verificar acessibilidade básica', function(assert) {
    const images = document.querySelectorAll('img');
    const buttons = document.querySelectorAll('button, .btn');
    
    // Verificar se imagens têm alt text (se houver imagens)
    images.forEach(function(img, index) {
        assert.ok(img.alt !== undefined, `Imagem ${index + 1} tem atributo alt`);
    });
    
    // Verificar se botões têm texto ou aria-label
    buttons.forEach(function(button, index) {
        const hasText = button.textContent.trim().length > 0;
        const hasAriaLabel = button.getAttribute('aria-label') !== null;
        assert.ok(hasText || hasAriaLabel, `Botão ${index + 1} tem texto ou aria-label`);
    });
});

// Testes para verificar meta tags
QUnit.test('Verificar meta tags importantes', function(assert) {
    const charset = document.querySelector('meta[charset]');
    const viewport = document.querySelector('meta[name="viewport"]');
    
    assert.ok(charset, 'Meta tag charset existe');
    assert.ok(viewport, 'Meta tag viewport existe');
    assert.equal(charset.getAttribute('charset'), 'UTF-8', 'Charset está definido como UTF-8');
});

console.log('Arquivo de testes QUnit carregado com sucesso!'); 