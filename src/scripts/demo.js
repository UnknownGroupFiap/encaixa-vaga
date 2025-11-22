function scrollToBottom() {
    setTimeout(() => {
        const container = document.getElementById('messagesContainer');
        if (container) {
            container.scrollTop = container.scrollHeight;
        }
    }, 100);
}

function addMessage(text, sender, delay = 0) {
    return new Promise((resolve) => {
        setTimeout(() => {
            const container = document.getElementById('messagesContainer');
            const messageDiv = document.createElement('div');
            messageDiv.className = `message ${sender}-message`;
            
            messageDiv.innerHTML = `
                <div class="message-content">${text}</div>
            `;
            
            container.appendChild(messageDiv);
            scrollToBottom();
            resolve();
        }, delay);
    });
}

function showLoading(text = 'Analisando sua busca') {
    const container = document.getElementById('messagesContainer');
    const loadingDiv = document.createElement('div');
    loadingDiv.className = 'message ai-message';
    loadingDiv.id = 'loadingMessage';
    loadingDiv.innerHTML = `
        <div class="message-content">
            <div class="loading-dots">
                ${text}<span class="dots"></span>
            </div>
        </div>
    `;
    container.appendChild(loadingDiv);
    scrollToBottom();
}

function removeLoading() {
    const loading = document.getElementById('loadingMessage');
    if (loading) loading.remove();
}

async function animateTokenDecrement(element, from, to, duration = 1000) {
    const steps = from - to;
    const stepDuration = duration / steps;
    
    for (let i = from; i >= to; i--) {
        element.textContent = i + ' tokens';
        await new Promise(resolve => setTimeout(resolve, stepDuration));
    }
}

function removeFile() {
    document.getElementById('filePreview').style.display = 'none';
}

async function sendMessage() {
    const input = document.getElementById('messageInput');
    const textToSend = input.value.trim();
    
    if (!textToSend) return;
    
    const tokensAvailable = document.querySelector('.tokens-available');
    const currentTokens = parseInt(tokensAvailable.textContent);
    
    await addMessage(textToSend, 'user');
    input.value = '';
    
    tokensAvailable.classList.add('token-consume');
    await animateTokenDecrement(tokensAvailable, currentTokens, currentTokens - 50, 1500);
    tokensAvailable.classList.remove('token-consume');
    
    showLoading('Entendendo seu perfil e preferências...');
    await new Promise(resolve => setTimeout(resolve, 3000));
    removeLoading();
    
    const jobsMessage = `Perfeito! Já interpretei sua intenção de vagas remotas no ecossistema bancário com foco em programação e cruzei esses critérios com sinais de senioridade, stack principal e rituais de cada empresa.
    <br><br>
    Mapeei <strong>6 oportunidades</strong> que refletem o fit técnico, cultural e ritmo de trabalho que você descreveu, priorizando ambientes com boas práticas de engenharia e squads distribuídos.`;
    await addMessage(jobsMessage, 'ai');
    
    await new Promise(resolve => setTimeout(resolve, 800));
    const container = document.getElementById('messagesContainer');
    
    const jobsCardsMessage = document.createElement('div');
    jobsCardsMessage.className = 'message ai-message';
    jobsCardsMessage.innerHTML = `
        <div class="message-content">
            <div class="job-cards-scroll">
                <div class="job-card">
                    <div class="job-header">
                        <h3>Desenvolvedor Backend Sênior</h3>
                        <span class="match-badge">95% Match</span>
                    </div>
                    <div class="job-company">Banco Itaú</div>
                    <div class="job-match">
                        Esta vaga é perfeita para você porque o Itaú busca alguém com sólida experiência em Java e Spring Boot no setor financeiro. Seu domínio em desenvolvimento de APIs RESTful, integração com bancos de dados relacionais (PostgreSQL/Oracle) e conhecimento em mensageria (Kafka) são essenciais para esta posição sênior.
                    </div>
                </div>
                
                <div class="job-card">
                    <div class="job-header">
                        <h3>Tech Lead Java/Spring</h3>
                        <span class="match-badge">92% Match</span>
                    </div>
                    <div class="job-company">Nubank</div>
                    <div class="job-match">
                        O Nubank procura tech leads com expertise em Java/Kotlin e arquitetura de microserviços. Sua experiência com Spring Framework, design patterns e práticas de clean code se alinham perfeitamente com a cultura de excelência técnica da fintech líder do mercado.
                    </div>
                </div>
                
                <div class="job-card">
                    <div class="job-header">
                        <h3>Engenheiro de Software Pleno</h3>
                        <span class="match-badge">88% Match</span>
                    </div>
                    <div class="job-company">Bradesco</div>
                    <div class="job-match">
                        O Bradesco valoriza engenheiros que entendam integração de sistemas e arquitetura de soluções. Sua experiência com Java EE, web services (SOAP/REST) e conhecimento em sistemas legados bancários são diferenciais importantes para projetos de modernização tecnológica.
                    </div>
                </div>
                
                <div class="job-card">
                    <div class="job-header">
                        <h3>Desenvolvedor Java Pleno</h3>
                        <span class="match-badge">90% Match</span>
                    </div>
                    <div class="job-company">Banco Inter</div>
                    <div class="job-match">
                        O Inter busca desenvolvedores backend com foco em performance e escalabilidade. Suas habilidades em otimização de queries, cache distribuído (Redis) e experiência com Spring Boot em ambientes cloud (AWS/GCP) são ideais para um banco 100% digital.
                    </div>
                </div>
                
                <div class="job-card">
                    <div class="job-header">
                        <h3>Arquiteto de Software</h3>
                        <span class="match-badge">93% Match</span>
                    </div>
                    <div class="job-company">Santander</div>
                    <div class="job-match">
                        O Santander precisa de arquitetos especialistas em desenhar soluções enterprise Java. Seu conhecimento em arquitetura hexagonal, event-driven architecture, patterns como CQRS e experiência com ferramentas de observabilidade (ELK, Grafana) são fundamentais para liderar a transformação digital.
                    </div>
                </div>
                
                <div class="job-card">
                    <div class="job-header">
                        <h3>Especialista Backend .NET</h3>
                        <span class="match-badge">85% Match</span>
                    </div>
                    <div class="job-company">Banco Safra</div>
                    <div class="job-match">
                        Embora o Safra trabalhe principalmente com .NET, sua experiência sólida em POO, SQL Server e APIs REST é transferível. A vaga oferece oportunidade de expandir stack técnico mantendo os mesmos princípios de arquitetura e qualidade que você já domina no ecossistema Java.
                    </div>
                </div>
            </div>
        </div>
    `;
    
    container.appendChild(jobsCardsMessage);
    scrollToBottom();
    
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const explainMessage = `Lembre-se: você pode refinar sua busca fornecendo mais detalhes (como tecnologias específicas, nível de senioridade ou preferências de cultura organizacional). Ou ainda anexar seu currículo para análises ainda mais precisas! 🚀`;
    await addMessage(explainMessage, 'ai');
}

document.getElementById('messageInput')?.addEventListener('keypress', function(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
    }
});

document.querySelector('.attach-btn')?.addEventListener('click', function() {
    const filePreview = document.getElementById('filePreview');
    document.getElementById('fileName').textContent = 'curriculo_joao_silva.pdf';
    filePreview.style.display = 'flex';
});
