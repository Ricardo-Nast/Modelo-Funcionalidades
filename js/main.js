document.addEventListener('DOMContentLoaded', () => {
    
    // 1. Menu responsivo no mobile
    const menuBtn = document.getElementById('menu-btn');
    const navLinks = document.getElementById('nav-links');

    if (menuBtn && navLinks) {
        menuBtn.addEventListener('click', () => {
            navLinks.classList.toggle('aberto');
        });

        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('aberto');
            });
        });
    }

    // 2. Fade-out da Imagem do Hero ao rolar a página
    window.addEventListener('scroll', () => {
        const heroBg = document.querySelector('.hero-bg');
        if (heroBg) {
            let opacidade = 1 - (window.scrollY / 450);
            heroBg.style.opacity = Math.max(opacidade, 0);
        }
    });

    // 3. Efeito Fade-in nos elementos ao rolar
    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visivel');
                obs.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15 });

    document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));

    // 4. Controle dos vídeos locais (pausa os outros vídeos se um começar a tocar)
    const videosReels = document.querySelectorAll('.reel-local-card video');
    if (videosReels.length > 0) {
        videosReels.forEach(videoAtual => {
            videoAtual.addEventListener('play', () => {
                videosReels.forEach(outroVideo => {
                    if (outroVideo !== videoAtual) {
                        outroVideo.pause();
                    }
                });
            });
        });
    }

    // 5. Lógica de Filtro pelo Menu de Opções na página catalogo.html
    const formFiltro = document.getElementById('form-filtro-catalogo');
    const cardsCatalogo = document.querySelectorAll('#lista-catalogo .card-imovel');
    const mensagemVazia = document.getElementById('mensagem-vazia');

    if (formFiltro && cardsCatalogo.length > 0) {
        const selFinalidade = document.getElementById('filtro-finalidade');
        const selTipo = document.getElementById('filtro-tipo');

        function aplicarFiltros() {
            const valFinalidade = selFinalidade.value.toLowerCase();
            const valTipo = selTipo.value.toLowerCase();

            let visiveis = 0;

            cardsCatalogo.forEach(card => {
                const cFinalidade = (card.getAttribute('data-finalidade') || '').toLowerCase();
                const cTipo = (card.getAttribute('data-tipo') || '').toLowerCase();

                const okFinalidade = !valFinalidade || cFinalidade === valFinalidade;
                const okTipo = !valTipo || cTipo === valTipo;

                if (okFinalidade && okTipo) {
                    card.style.display = 'flex';
                    visiveis++;
                } else {
                    card.style.display = 'none';
                }
            });

            if (mensagemVazia) {
                mensagemVazia.style.display = visiveis === 0 ? 'block' : 'none';
            }
        }

        // Preenche automaticamente os selects se o usuário veio da busca da index.html
        const params = new URLSearchParams(window.location.search);
        if (params.get('finalidade')) selFinalidade.value = params.get('finalidade');
        if (params.get('tipo')) selTipo.value = params.get('tipo');
        aplicarFiltros();

        // Filtra ao clicar no botão Buscar ou trocar qualquer opção do menu
        formFiltro.addEventListener('submit', (e) => {
            e.preventDefault();
            aplicarFiltros();
        });

        [selFinalidade, selTipo].forEach(select => {
            select.addEventListener('change', aplicarFiltros);
        });
    }

    // 6. Envio do formulário da página anuncio.html para o WhatsApp
    const formAnuncio = document.getElementById('form-anuncio');
    if (formAnuncio) {
        formAnuncio.addEventListener('submit', (e) => {
            e.preventDefault();
            const nome = document.getElementById('nome').value;
            const telefone = document.getElementById('telefone').value;
            const finalidade = document.getElementById('finalidade').value;
            const tipo = document.getElementById('tipo').value;
            const bairro = document.getElementById('bairro').value;
            const valor = document.getElementById('valor').value || 'A avaliar';
            const detalhes = document.getElementById('detalhes').value || 'Não informado';

            const texto = `Olá, gostaria de anunciar um imóvel na Horizonte Lar:\n\n` +
                          `*Proprietário:* ${nome}\n` +
                          `*Contato:* ${telefone}\n` +
                          `*Finalidade:* ${finalidade}\n` +
                          `*Tipo:* ${tipo}\n` +
                          `*Bairro:* ${bairro}\n` +
                          `*Valor pretendido:* ${valor}\n` +
                          `*Detalhes:* ${detalhes}`;

            const urlWhats = `https://wa.me/5522999991234?text=${encodeURIComponent(texto)}`;
            window.open(urlWhats, '_blank');
        });
    }
});