// --- FUNÇÃO GERAL PARA ABRIR/FECHAR OS MENUS LATERAIS (Mantida) ---
function abreMenu(event, menu) {
    event.preventDefault(); 
    menu.classList.toggle('active');
}

function fechaMenu(event, menu, btn) {
    if (menu && btn && !menu.contains(event.target) && event.target !== btn) {
        menu.classList.remove('active');
    }
}

// --- CONFIGURAÇÃO PRINCIPAL APÓS O CARREGAMENTO DA PÁGINA ---
document.addEventListener("DOMContentLoaded", function() {
    
    // 1. Seleciona os elementos dos Menus Laterais Principais
    const menuSobre = document.getElementById('menuSobre');
    const menuVerticalSobre = document.getElementById('sub-sobre');
    const menuContato = document.getElementById('menuContato');
    const menuVerticalContato = document.getElementById('sub-contato');

    // Ativa os cliques para abrir as abas laterais da Pizzaria
    if (menuSobre && menuVerticalSobre) {
        menuSobre.addEventListener('click', function(event) {
            abreMenu(event, menuVerticalSobre);
        });
    }

    if (menuContato && menuVerticalContato) {
        menuContato.addEventListener('click', function(event) {
            abreMenu(event, menuVerticalContato);
        });
    }

    // Fecha as abas se clicar totalmente fora delas
    document.addEventListener('click', function(event) {
        fechaMenu(event, menuVerticalSobre, menuSobre);
        fechaMenu(event, menuVerticalContato, menuContato);
    });

    // ==========================================================================
    // 2. ATIVAÇÃO DOS SUBMENUS INTERNOS (CONTATO E SOBRE)
    // ==========================================================================

    // --- SUBMENU: CONTATO (Novos botões mapeados) ---
    const btnTelefone = document.getElementById("btn-telefone");
    const btnEmail = document.getElementById("btn-email");
    const conteudoTelefone = document.getElementById("conteudo-telefone");
    const conteudoEmail = document.getElementById("conteudo-email");

    if (btnTelefone && conteudoTelefone) {
        btnTelefone.addEventListener("click", function(event) {
            event.stopPropagation(); // Não fecha a aba principal ao clicar no botão
            conteudoTelefone.classList.toggle("ativo");
        });
    }

    if (btnEmail && conteudoEmail) {
        btnEmail.addEventListener("click", function(event) {
            event.stopPropagation();
            conteudoEmail.classList.toggle("ativo");
        });
    }

    // --- SUBMENU: SOBRE (Empresa e Clientes) ---
    const btnEmpresa = document.getElementById("btn-empresa");
    const btnClientes = document.getElementById("btn-clientes");
    const conteudoEmpresa = document.getElementById("conteudo-empresa");
    const conteudoClientes = document.getElementById("conteudo-clientes");

    if (btnEmpresa && conteudoEmpresa) {
        btnEmpresa.addEventListener("click", function(event) {
            event.stopPropagation();
            conteudoEmpresa.classList.toggle("ativo");
        });
    }

    if (btnClientes && conteudoClientes) {
        btnClientes.addEventListener("click", function(event) {
            event.stopPropagation();
            conteudoClientes.classList.toggle("ativo");
        });
    }

    // ==========================================================================
    // 3. CAPTURA E SALVAMENTO DOS DADOS EM JSON (Nova Funcionalidade Adicionada)
    // ==========================================================================
    const formulario = document.getElementById('meuFormulario');
    
    if (formulario) {
        formulario.addEventListener('submit', function(event) {
            event.preventDefault(); // Impede o recarregamento padrão da página

            // Captura os valores digitados nos inputs do seu HTML
            const dadosUsuario = {
                nome: document.getElementById('nome').value,
                email: document.getElementById('email').value,
                senha: document.getElementById('senha').value,
                cpf: document.getElementById('cpf').value,
                endereco: document.getElementById('endereco').value
            };

            // Converte o objeto javascript em uma String formato JSON
            const dadosJSON = JSON.stringify(dadosUsuario);

            // Salva a string JSON de forma segura no banco local do navegador
            localStorage.setItem('cadastroUsuario', dadosJSON);

            alert('Cadastro realizado com sucesso! Dados salvos em formato JSON.');
            formulario.reset(); // Limpa os campos do formulário
        });
    }

    // ==========================================================================
    // 4. CÓDIGO DO RODAPÉ (DATA ATUALIZADA)
    // ==========================================================================
    const opcoes = { day: '2-digit', month: 'long', year: 'numeric' };
    const dataFormatada = new Date().toLocaleDateString('pt-BR', opcoes);
    const elementoData = document.getElementById("data-atual");
    if (elementoData) {
        elementoData.textContent = dataFormatada;
    }
});
