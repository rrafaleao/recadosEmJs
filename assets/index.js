// Array para armazenar recados
let recados = [];

// Função para salvar no localStorage
function salvarStorage() {
    localStorage.setItem('recados', JSON.stringify(recados));
}

// Função para carregar do localStorage
function carregarStorage() {
    const dadosSalvos = localStorage.getItem('recados');
    return dadosSalvos ? JSON.parse(dadosSalvos) : [];
}

// Função para inicializar o sistema
function inicializar() {
    recados = carregarStorage();
    renderizarRecados();
    configurarEventos();
    atualizarContador();
}

// Função para configurar eventos
function configurarEventos() {
    $('#formRecado').on('submit', function(e) {
        e.preventDefault();
        adicionarRecado();
    });

    // Animação nos campos do formulário
    $('.form-control').on('focus', function() {
        $(this).parent().addClass('focused');
    }).on('blur', function() {
        $(this).parent().removeClass('focused');
    });
}

// Função para adicionar recado
function adicionarRecado() {
    const form = document.getElementById('formRecado');
    
    if (!validarFormulario()) {
        mostrarErroValidacao();
        return;
    }

    const novoRecado = {
        id: Date.now(),
        remetente: $('#remetente').val().trim(),
        destinatario: $('#destinatario').val().trim(),
        mensagem: $('#mensagem').val().trim(),
        dataHora: new Date().toLocaleString('pt-BR')
    };

    recados.unshift(novoRecado);
    salvarStorage();
    
    renderizarRecados();
    limparFormulario();
    atualizarContador();
    mostrarSucesso();
}

// Função para validar formulário
function validarFormulario() {
    let valido = true;
    const campos = ['remetente', 'destinatario', 'mensagem'];

    campos.forEach(function(campo) {
        const elemento = document.getElementById(campo);
        const valor = elemento.value.trim();

        if (!valor) {
            elemento.classList.add('is-invalid');
            valido = false;
        } else {
            elemento.classList.remove('is-invalid');
            elemento.classList.add('is-valid');
        }
    });

    return valido;
}

// Função para mostrar erro de validação
function mostrarErroValidacao() {
    // Efeito shake no formulário
    $('#formRecado').addClass('animate__animated animate__headShake');
    setTimeout(function() {
        $('#formRecado').removeClass('animate__animated animate__headShake');
    }, 1000);
}

// Função para remover recado
function removerRecado(id) {
    const index = recados.findIndex(function(recado) {
        return recado.id === id;
    });
    
    if (index !== -1) {
        // Animação de saída
        $('[data-recado-id="' + id + '"]').fadeOut(300, function() {
            recados.splice(index, 1);
            salvarStorage();
            renderizarRecados();
            atualizarContador();
        });
    }
}

// Função para renderizar recados
function renderizarRecados() {
    const container = $('#listaRecados');
    
    if (recados.length === 0) {
        container.html(`
            <div class="empty-state">
                <h4>Nenhum recado encontrado</h4>
                <p>Adicione seu primeiro recado usando o formulário acima.</p>
            </div>
        `);
        return;
    }

    const html = recados.map(function(recado) {
        return `
            <div class="recado-item bg-light p-3 mb-3 rounded fade-in" data-recado-id="${recado.id}">
                <div class="d-flex justify-content-between align-items-start">
                    <div class="flex-grow-1">
                        <div class="row mb-2">
                            <div class="col-md-6">
                                <small class="text-muted">
                                    <i class="fas fa-user me-1"></i>
                                    <strong>De:</strong> ${recado.remetente}
                                </small>
                            </div>
                            <div class="col-md-6">
                                <small class="text-muted">
                                    <i class="fas fa-user-tag me-1"></i>
                                    <strong>Para:</strong> ${recado.destinatario}
                                </small>
                            </div>
                        </div>
                        <p class="mb-2">${recado.mensagem}</p>
                        <small class="text-muted">
                            <i class="fas fa-clock me-1"></i>
                            ${recado.dataHora}
                        </small>
                    </div>
                    <button class="btn btn-danger btn-sm ms-3" onclick="removerRecado(${recado.id})" title="Remover recado">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `;
    }).join('');

    container.html(html);

    // Animação de entrada
    $('.fade-in').each(function(index, elemento) {
        $(elemento).delay(index * 100).fadeIn();
    });
}

// Função para limpar formulário
function limparFormulario() {
    $('#formRecado')[0].reset();
    $('.form-control').removeClass('is-valid is-invalid');
}

// Função para atualizar contador
function atualizarContador() {
    const total = recados.length;
    const texto = total === 1 ? '1 recado' : total + ' recados';
    $('#contadorRecados').text(texto);
}

// Inicializar o sistema quando a página carregar
$(document).ready(function() {
    inicializar();
});