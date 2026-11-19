# 🍫 CacauShow Clone

E-commerce completo inspirado no Cacau Show, construído com **Next.js 15**, **Supabase** e pronto para deploy na **Vercel**.

## 🚀 Stack

- **Frontend**: Next.js 15 (App Router) + TypeScript
- **Estilização**: Tailwind CSS
- **Banco de dados**: Supabase (PostgreSQL)
- **State management**: Zustand
- **Deploy**: Vercel

## ✨ Funcionalidades

### Loja
- 🏠 Home com hero carousel, seções promocionais
- 🛒 Carrinho lateral com gestão de quantidade
- ❤️ Lista de favoritos (wishlist)
- 🏷️ Badges de pontos Cacaus
- 💬 Widget de chat flutuante
- 🔍 Busca de produtos
- 📦 Página de produto individual
- 💳 Checkout

### Painel Admin (`/admin`)
- 📊 Dashboard com métricas
- 📦 CRUD de Produtos
- 🖼️ CRUD de Banners
- 🏷️ CRUD de Categorias
- 📋 Gestão de Pedidos (com status)
- 🔐 Login protegido

## 🛠️ Configuração Local

### 1. Clone e instale dependências

```bash
git clone <repo>
cd cacaushow-clone
npm install
```

### 2. Configure as variáveis de ambiente

```bash
cp .env.local.example .env.local
```

Edite `.env.local` com suas credenciais do Supabase.

### 3. Configure o Supabase

1. Acesse [supabase.com](https://supabase.com) e crie um projeto
2. No **SQL Editor**, execute o arquivo:
   ```
   supabase/migrations/001_initial.sql
   ```
3. Copie a **URL** e a **Anon Key** do projeto em Settings → API

### 4. Rode localmente

```bash
npm run dev
```

Acesse: **http://localhost:3000**

Admin: **http://localhost:3000/admin**
- Email: `admin@cacaushow.com`
- Senha: `admin123`

## 📁 Estrutura

```
cacaushow-clone/
├── app/
│   ├── page.tsx              # Home
│   ├── admin/
│   │   ├── page.tsx          # Dashboard
│   │   ├── produtos/         # Gestão de produtos
│   │   ├── banners/          # Gestão de banners
│   │   ├── categorias/       # Gestão de categorias
│   │   ├── pedidos/          # Gestão de pedidos
│   │   └── login/            # Login admin
│   └── produto/[slug]/       # Página de produto
├── components/
│   ├── Header.tsx            # Cabeçalho
│   ├── HeroCarousel.tsx      # Carrossel principal
│   ├── ProductCard.tsx       # Card de produto
│   ├── ProductCarousel.tsx   # Carrossel de produtos
│   ├── CartSidebar.tsx       # Carrinho lateral
│   ├── ChatWidget.tsx        # Chat flutuante
│   └── admin/
│       └── AdminSidebar.tsx  # Menu admin
├── lib/
│   ├── types.ts              # TypeScript types
│   ├── supabase.ts           # Cliente Supabase
│   ├── store.ts              # Zustand store (carrinho)
│   ├── mockData.ts           # Dados de demo
│   └── utils.ts              # Utilitários
└── supabase/
    └── migrations/
        └── 001_initial.sql   # Schema do banco
```

## 🌐 Deploy na Vercel

1. Push o código para o GitHub
2. Acesse [vercel.com](https://vercel.com) → "New Project"
3. Importe o repositório
4. Configure as variáveis de ambiente:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
5. Deploy! 🚀

## 🔧 Variáveis de Ambiente

| Variável | Descrição |
|----------|-----------|
| `NEXT_PUBLIC_SUPABASE_URL` | URL do projeto Supabase |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Chave pública do Supabase |
| `SUPABASE_SERVICE_ROLE_KEY` | Chave service role (apenas server-side) |
| `NEXT_PUBLIC_APP_URL` | URL da aplicação |

## 🎨 Cores da Marca

| Nome | Hex | Uso |
|------|-----|-----|
| Marrom | `#3d1a0a` | Header, elementos primários |
| Laranja | `#f5a623` | Botões, destaques |
| Vermelho | `#8b1a1a` | Badge Cacaus |
| Creme | `#f5e6d3` | Background |

---

Desenvolvido com ❤️ pela Antigravity AI
