let selectedFile = null;
let currentStep = 0;
let isGuideActive = false;

const guideSteps = [
    {
        title: 'Bem-vindo ao Encaixa Vaga',
        content: `Nossa IA analisa vagas em tempo real e encontra as melhores oportunidades para o seu perfil.
        <br><br>
        Nesta demonstração, você vai ver como descrever o que procura, anexar seu currículo e receber resultados personalizados instantaneamente.`,
        highlightElement: null,
        position: 'center',
        showArrow: false
    },
    {
        title: 'Vamos realizar uma busca',
        content: `Descreva o tipo de vaga que você procura. Vamos realizar uma busca por vagas de programação no setor bancário.`,
        highlightElement: '.input-wrapper',
        position: 'input-top',
        showArrow: false,
        action: 'type'
    },
    {
        title: 'Anexe seu currículo',
        content: `Você pode anexar seu currículo para melhorar a precisão dos resultados. A inteligência analisa suas habilidades e experiências.`,
        highlightElement: '.attach-btn',
        position: 'file-side',
        showArrow: false,
        action: 'attach'
    },
    {
        title: 'Envie sua busca',
        content: `Clique no botão de enviar para processar sua solicitação. Nossa inteligência vai buscar as melhores vagas para você.`,
        highlightElement: '.send-btn',
        position: 'send-side',
        showArrow: false,
        action: 'send'
    },
    {
        title: 'Processando',
        content: ``,
        highlightElement: null,
        position: 'hidden',
        showArrow: false,
        action: 'loading'
    },
];

function scrollToBottom() {
    const chatBox = document.querySelector('.chat-box');
    if (chatBox) {
        chatBox.scrollTop = chatBox.scrollHeight;
    }
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

async function typeMessage(text = 'Busco vagas remotas na área de programação no setor bancário', speed = 50) {
    const input = document.getElementById('messageInput');
    input.value = '';
    input.style.height = 'auto';
    
    for (let i = 0; i <= text.length; i++) {
        input.value = text.substring(0, i);
        // Auto-resize textarea
        input.style.height = 'auto';
        input.style.height = input.scrollHeight + 'px';
        await new Promise(resolve => setTimeout(resolve, speed));
    }
}

async function showMockFile() {
    const filePreview = document.getElementById('filePreview');
    document.getElementById('fileName').textContent = 'curriculo_joao_silva.pdf';
    filePreview.style.display = 'flex';
}

async function animateTokenDecrement(element, from, to, duration = 1000) {
    const steps = from - to;
    const stepDuration = duration / steps;
    
    for (let i = from; i >= to; i--) {
        element.textContent = i + ' tokens';
        await new Promise(resolve => setTimeout(resolve, stepDuration));
    }
}

async function sendMessageAndConsumeTokens() {
    const input = document.getElementById('messageInput');
    const textToType = input.value || 'Busco vagas remotas na área de programação no setor bancário';
    const tokensAvailable = document.querySelector('.tokens-available');
    const currentTokens = parseInt(tokensAvailable.textContent);
    
    await addMessage(textToType, 'user');
    input.value = '';
    input.style.height = 'auto';
    document.getElementById('filePreview').style.display = 'none';
    
    tokensAvailable.classList.add('token-consume');
    await animateTokenDecrement(tokensAvailable, currentTokens, currentTokens - 50, 1500);
    tokensAvailable.classList.remove('token-consume');
}

function highlightElement(selector) {
    removeHighlight();
    
    if (selector) {
        const element = document.querySelector(selector);
        if (element) {
            element.classList.add('guide-highlight');
        }
    }
}

function removeHighlight() {
    document.querySelectorAll('.guide-highlight').forEach(el => {
        el.classList.remove('guide-highlight');
    });
}

function showModal(step) {
    const modal = document.getElementById('guideModal');
    const modalBox = document.querySelector('.guide-modal');
    const content = document.getElementById('modalContent');
    const nextBtn = document.getElementById('nextBtn');
    const prevBtn = document.getElementById('prevBtn');
    
    const currentStep = guideSteps[step];
    
    if (currentStep.position === 'hidden') {
        modal.style.display = 'none';
        return;
    }
    
    content.innerHTML = `
        <h2>${currentStep.title}</h2>
        <div class="modal-text">${currentStep.content}</div>
    `;
    
    const actions = document.querySelector('.modal-actions');
    if (currentStep.action === 'loading') {
        actions.style.display = 'none';
    } else if (currentStep.action === 'explain') {
        actions.style.display = 'flex';
        prevBtn.style.display = 'none';
        nextBtn.textContent = 'Continuar';
    } else {
        actions.style.display = 'flex';
        prevBtn.style.display = 'none';
        nextBtn.textContent = step === 0 ? 'Começar' : 'Continuar';
    }
    
    modal.style.display = 'flex';
    
    modal.classList.remove('with-blur');
    if (step === 0) {
        modal.classList.add('with-blur');
    }
    
    const position = currentStep.position || 'center';
    modalBox.setAttribute('data-position', position);
    
    if (currentStep.highlightElement) {
        setTimeout(() => {
            highlightElement(currentStep.highlightElement);
            positionModalNearElement(modalBox, currentStep.highlightElement, position);
        }, 100);
    } else {
        removeHighlight();
        if (position === 'result-side') {
            modalBox.style.top = '50%';
            modalBox.style.right = '20px';
            modalBox.style.left = 'auto';
            modalBox.style.transform = 'translateY(-50%)';
        } else if (position === 'chat-top') {
            modalBox.style.top = '80px';
            modalBox.style.left = '50%';
            modalBox.style.right = 'auto';
            modalBox.style.transform = 'translateX(-50%)';
        } else {
            modalBox.style.top = '50%';
            modalBox.style.left = '50%';
            modalBox.style.right = 'auto';
            modalBox.style.transform = 'translate(-50%, -50%)';
        }
    }
}

function positionModalNearElement(modal, selector, position) {
    const element = document.querySelector(selector);
    if (!element) return;
    
    const rect = element.getBoundingClientRect();
    const modalRect = modal.getBoundingClientRect();
    const padding = 20;
    
    switch(position) {
        case 'input-top':
            modal.style.top = (rect.top - modalRect.height - padding) + 'px';
            modal.style.left = rect.left + 'px';
            modal.style.transform = 'none';
            break;
        case 'file-side':
            modal.style.top = (rect.top + rect.height / 2) + 'px';
            modal.style.left = (rect.right + padding) + 'px';
            modal.style.transform = 'translateY(-50%)';
            break;
        case 'send-side':
            modal.style.top = (rect.top + rect.height / 2) + 'px';
            modal.style.left = (rect.right + padding) + 'px';
            modal.style.transform = 'translateY(-50%)';
            break;
        case 'result-side':
            modal.style.top = '50%';
            modal.style.left = (rect.right + padding) + 'px';
            modal.style.transform = 'translateY(-50%)';
            break;
        default:
            modal.style.top = '50%';
            modal.style.left = '50%';
            modal.style.transform = 'translate(-50%, -50%)';
    }
}

function closeModal() {
    document.getElementById('guideModal').style.display = 'none';
    removeHighlight();
}

function startGuide() {
    isGuideActive = true;
    currentStep = 0;
    
    const welcomeMsg = document.querySelector('.welcome-message');
    if (welcomeMsg) {
        welcomeMsg.style.display = 'none';
    }
    
    showModal(currentStep);
}

document.addEventListener('DOMContentLoaded', () => {
    startGuide();
    
    document.getElementById('nextBtn')?.addEventListener('click', async () => {
        if (currentStep === 0) {
            currentStep = 1;
            showModal(currentStep);
            await new Promise(resolve => setTimeout(resolve, 300));
            await typeMessage();
        } else if (currentStep === 1) {
            removeHighlight();
            currentStep = 2;
            showModal(currentStep);
            await new Promise(resolve => setTimeout(resolve, 300));
            await showMockFile();
        } else if (currentStep === 2) {
            removeHighlight();
            currentStep = 3;
            showModal(currentStep);
        } else if (currentStep === 3) {
            removeHighlight();
            currentStep = 4;
            showModal(currentStep);
            await sendMessageAndConsumeTokens();
            await new Promise(resolve => setTimeout(resolve, 500));
            
            showLoading('Entendendo seu perfil e preferências... Busco vagas remotas em programação no setor bancário');
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
                                <h3>Desenvolvedor Backend Sênior</h3>
                                <span class="match-badge">87% Match</span>
                            </div>
                            <div class="job-company">C6 Bank</div>
                            <div class="job-match">
                                O C6 Bank busca desenvolvedores backend para construir APIs robustas e seguras. Sua expertise em Java, Spring Security, implementação de autenticação OAuth2/JWT e conhecimento em boas práticas de segurança bancária são essenciais para esta posição.
                            </div>
                        </div>
                    </div>
                </div>
            `;
            container.appendChild(jobsCardsMessage);
            scrollToBottom();
            
            await new Promise(resolve => setTimeout(resolve, 1000));
            const scrollContainer = jobsCardsMessage.querySelector('.job-cards-scroll');
            if (scrollContainer) {
                const scrollAmount = scrollContainer.scrollWidth - scrollContainer.clientWidth;
                const duration = 3000;
                const startTime = Date.now();
                
                const smoothScroll = () => {
                    const elapsed = Date.now() - startTime;
                    const progress = Math.min(elapsed / duration, 1);
                    scrollContainer.scrollLeft = scrollAmount * progress;
                    
                    if (progress < 1) {
                        requestAnimationFrame(smoothScroll);
                    }
                };
                smoothScroll();
                
                await new Promise(resolve => setTimeout(resolve, duration + 500));
            }
            
            showSpecificationModal();
            
            async function showSpecificationModal() {
                const modal = document.getElementById('guideModal');
                const guideModal = modal.querySelector('.guide-modal');
                const modalContent = modal.querySelector('.modal-content');
                
                modal.classList.add('with-blur');
                guideModal.setAttribute('data-position', 'center');
                
                // Limpar estilos inline para usar CSS
                guideModal.style.top = '';
                guideModal.style.left = '';
                guideModal.style.right = '';
                guideModal.style.transform = '';
                
                modalContent.innerHTML = `
                    <h2>Vamos especificar mais!</h2>
                    <p class="modal-text">Agora vamos mostrar como você pode refinar ainda mais sua busca com detalhes específicos.</p>
                `;
                
                const modalActions = modal.querySelector('.modal-actions');
                modalActions.innerHTML = `
                    <button class="modal-btn primary" id="continueSpecBtn">Continuar</button>
                `;
                
                modal.style.display = 'flex';
                
                document.getElementById('continueSpecBtn').addEventListener('click', () => {
                    modal.style.display = 'none';
                    modal.classList.remove('with-blur');
                    continueWithNewSearch();
                });
            }
            
            window.continueWithNewSearch = async function() {
                await new Promise(resolve => setTimeout(resolve, 800));
                
                const newSearchText = "Estou procurando uma nova oportunidade para trabalhar com linguagens de baixo nível como C++ e Rust, e gostaria de ver vagas fora do Brasil, já que melhorei meu inglês recentemente.";
                await typeMessage(newSearchText, 30);
                
                await new Promise(resolve => setTimeout(resolve, 800));
                
                await sendMessageAndConsumeTokens();
                
                await new Promise(resolve => setTimeout(resolve, 500));
                showLoading('Refinando a busca... C++ e Rust, vagas internacionais remotas para nível Pleno com inglês');
                await new Promise(resolve => setTimeout(resolve, 3000));
                removeLoading();
                
                const refinedJobsMessage = `Excelente! Sua busca agora está muito mais específica e eu passei a considerar apenas empresas globais com squads distribuídos, documentação madura e projetos core em linguagens de baixo nível.
                <br><br>
                Encontrei <strong>2 vagas internacionais remotas</strong> perfeitas para o seu nível Pleno, ambas focadas em C++ e Rust, com onboarding em inglês e processos que já aceitam profissionais baseados no Brasil.`;
                await addMessage(refinedJobsMessage, 'ai');
                
                showInternationalJobsModal();
            };
            
            async function showInternationalJobsModal() {
                const container = document.getElementById('messagesContainer');
                
                const internationalJobsMessage = document.createElement('div');
                internationalJobsMessage.className = 'message ai-message';
                internationalJobsMessage.innerHTML = `
                    <div class="message-content">
                        <div class="job-cards-scroll">
                            <div class="job-card">
                                <div class="job-header">
                                    <h3>C++ Systems Engineer (Pleno)</h3>
                                    <span class="match-badge">97% Match</span>
                                </div>
                                <div class="job-company">Google • Remote • USA</div>
                                <div class="job-match">
                                    Oportunidade remota no time de infraestrutura do Google. Trabalho com C++ em sistemas de baixo nível, otimização de performance e arquitetura distribuída. Aceita profissionais do Brasil com inglês fluente.
                                </div>
                            </div>
                            
                            <div class="job-card">
                                <div class="job-header">
                                    <h3>Rust Backend Developer (Pleno)</h3>
                                    <span class="match-badge">95% Match</span>
                                </div>
                                <div class="job-company">Mozilla Foundation • Remote • Global</div>
                                <div class="job-match">
                                    Desenvolvimento de sistemas backend em Rust para projetos open-source da Mozilla. Trabalho 100% remoto com equipe internacional. Excelente oportunidade para aprimorar suas habilidades em Rust.
                                </div>
                            </div>
                        </div>
                    </div>
                `;
                container.appendChild(internationalJobsMessage);
                scrollToBottom();
                
                await new Promise(resolve => setTimeout(resolve, 5000));
                
                const modal = document.getElementById('guideModal');
                const guideModal = modal.querySelector('.guide-modal');
                const modalContent = modal.querySelector('.modal-content');
                
                modal.classList.add('with-blur');
                guideModal.setAttribute('data-position', 'center');
                
                guideModal.style.top = '';
                guideModal.style.left = '';
                guideModal.style.right = '';
                guideModal.style.transform = '';
                guideModal.style.maxWidth = '650px';
                
                modalContent.innerHTML = `
                    <h2>Demonstração Concluída!</h2>
                    <p class="modal-text">Agora você viu na prática como nossa IA encontra vagas que realmente combinam com seu perfil. Quer ser avisado quando lançarmos?</p>
                `;
                
                const modalActions = modal.querySelector('.modal-actions');
                modalActions.innerHTML = `
                    <button class="modal-btn primary" id="waitlistBtn">Entrar na Lista de Espera</button>
                    <button class="modal-btn" id="exitDemoBtn">Sair da Demo</button>
                `;
                
                modal.style.display = 'flex';
                
                document.getElementById('waitlistBtn').addEventListener('click', () => {
                    modal.style.display = 'none';
                    modal.classList.remove('with-blur');
                    setTimeout(() => {
                        showWaitlistModal();
                    }, 300);
                });
                
                document.getElementById('exitDemoBtn').addEventListener('click', () => {
                    window.location.href = '../../index.html';
                });

                await new Promise(resolve => setTimeout(resolve, 800));
            }
        }
    });
    
    document.getElementById('prevBtn')?.addEventListener('click', () => {
        if (currentStep > 0) {
            currentStep--;
            showModal(currentStep);
        }
    });
});

function showWaitlistModal() {
    const modal = document.getElementById('waitlistModal');
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
}

function closeWaitlistModal() {
    window.location.href = '../../index.html';
}

function handleWaitlistSubmit(event) {
    event.preventDefault();
    closeWaitlistModal();
    window.location.href = '../../index.html';
}

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('waitlistModal')?.addEventListener('click', function(e) {
        if (e.target === this) {
            closeWaitlistModal();
        }
    });
});
