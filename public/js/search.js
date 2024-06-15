document.addEventListener('DOMContentLoaded', () => {
    const searchForm = document.getElementById('search-form');
    const resultsList = document.getElementById('results-list');
    const chatModal = document.getElementById('chatModal');
    const closeChatBtn = document.querySelector('.close');
    const chatMessages = document.getElementById('chatMessages');
    const chatForm = document.getElementById('chatForm');

    searchForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const searchTerm = document.getElementById('search-term').value;
        const searchType = document.getElementById('search-type').value;

        searchBooks(searchTerm, searchType);
    });

    function searchBooks(term, type) {
        fetch(`/search?type=${type}&term=${encodeURIComponent(term)}`)
        .then(response => response.json())
        .then(books => {
            displayBooks(books);
        })
        .catch(error => {
            console.error('Erro durante a busca:', error);
            resultsList.innerHTML = '<li>Erro durante a busca. Tente novamente mais tarde.</li>';
        });
    }

    function displayBooks(books) {
        resultsList.innerHTML = '';
        if (books.length === 0) {
            resultsList.innerHTML = '<li>Nenhum livro encontrado.</li>';
        } else {
            books.forEach(book => {
                const li = document.createElement('li');
                li.innerHTML = `
                    <h3>${book.title}</h3>
                    <h4>Autor: ${book.author}</h4>
                    <p>Deseja: ${book.desiredBooks}</p>
                    <p>Email: ${book.email || 'Não informado'}</p>
                    <p>Celular: ${book.phone || 'Não informado'}</p>
                    <p>Cidade: ${book.city || 'Não informada'}</p>
                `;

                // Botão "Fechar Negócio"
                const closeButton = document.createElement('button');
                closeButton.textContent = 'Fechar Negócio';
                closeButton.classList.add('close-deal-btn'); // Adiciona classe para estilização
                closeButton.addEventListener('click', () => {
                    openChatModal(book.email); // Chama a função para abrir o modal de chat com o email do anunciante
                });

                li.appendChild(closeButton);
                resultsList.appendChild(li);
            });
        }
    }

    // Função para abrir o modal de chat com o anunciante
    function openChatModal(email) {
        // Aqui você pode preencher informações adicionais do anunciante no modal de chat, se necessário
        chatModal.style.display = 'block'; // Exibe o modal de chat

        // Evento para fechar o modal de chat ao clicar no botão de fechar (X)
        closeChatBtn.addEventListener('click', () => {
            chatModal.style.display = 'none';
        });

        // Evento para enviar mensagem no chat
        chatForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const message = document.getElementById('messageInput').value;
            // Aqui você enviaria a mensagem para o anunciante, implementando a lógica necessária
            // Pode enviar a mensagem via WebSocket ou outro método, dependendo da sua arquitetura
            // Aqui apenas um exemplo de atualização visual da interface
            displayMessage('Você', message); // Exibe a mensagem enviada na interface
            document.getElementById('messageInput').value = ''; // Limpa o campo de mensagem após enviar
        });
    }

    // Função para exibir mensagens no chat
    function displayMessage(sender, message) {
        const msgDiv = document.createElement('div');
        msgDiv.classList.add('message');
        msgDiv.innerHTML = `<strong>${sender}:</strong> ${message}`;
        chatMessages.appendChild(msgDiv);
    }
});
