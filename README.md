## Sobre o Projeto

Este projeto foi desenvolvido como parte da Fase 4 do curso da FIAP e apresenta o Encaixa Vaga, uma plataforma
inteligente que utiliza IA para transformar a forma como profissionais encontram oportunidades no mercado de trabalho.

O objetivo do Encaixa Vaga é simplificar e automatizar a busca por vagas: o usuário envia seu currículo, informa suas
preferências diretamente pelo chat, e a plataforma identifica, analisa e recomenda oportunidades que combinam tecnicamente
e culturalmente com seu perfil.

A solução integra dados de múltiplas fontes, como LinkedIn, sites corporativos e portais de emprego - oferecendo uma
experiência personalizada, rápida e eficiente.

## Demonstração Visual

[![Demo no YouTube](https://img.youtube.com/vi/4WL75ZqrF8E/hqdefault.jpg)](https://www.youtube.com/watch?v=4WL75ZqrF8E)

## Como Executar o Projeto

Se você estiver usando **Nix**, pode usar o ambiente de desenvolvimento configurado:

```bash
nix develop
```

### Instalação

1. Clone o repositório:
```bash
git clone https://github.com/UnknownGroupFiap/encaixa-vaga.git
cd encaixa-vaga
```

2. Instale as dependências:
```bash
pnpm install
```

### Executando o Projeto

Para iniciar o servidor de desenvolvimento:

```bash
pnpm run dev
```

O site estará disponível em: `http://localhost:5173`

### Outros Comandos

```bash
pnpm run build

pnpm run preview
```

---

© 2025 Encaixa Vaga — Inteligência que conecta você às oportunidades certas
