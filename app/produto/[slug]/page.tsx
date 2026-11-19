'use client'

import { use, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Heart, Minus, Plus, ShoppingCart, ChevronLeft, ChevronRight, ChevronDown, Info } from 'lucide-react'
import Header from '@/components/Header'
import ChatWidget from '@/components/ChatWidget'
import ProductCarousel from '@/components/ProductCarousel'
import { mockProducts } from '@/lib/mockData'
import { useCartStore, useWishlistStore } from '@/lib/store'

interface ProductDescData {
  sku: string
  breadcrumb: string[]
  short: string
  intro?: string
  conheca?: string
  oQueE?: { title: string; text: string }
  caracteristicas?: { title: string; items: { label: string; text: string }[] }
  sabor?: string
  detalhes?: string[]
  pq: string
  extraFinal?: string
  tags?: string[]
}

const detailedDescriptions: Record<string, ProductDescData> = {
  'caixa-tabletes-pelucia-livro-monstros-harry-potter-160g': {
    sku: '1004243',
    breadcrumb: ['HOME', 'NATAL', 'PRESENTES QUE ENCANTAM', 'HARRY POTTER DE NATAL'],
    short: 'Caixa com tabletes de chocolate ao leite acompanhada de uma divertida pelúcia do Livro dos Monstros de Harry Potter.',
    intro: 'Uma experiência mágica para os fãs do universo de Harry Potter! A caixa reúne deliciosos tabletes de chocolate ao leite com uma pelúcia inspirada no icônico Livro dos Monstros de Harry Potter, trazendo um toque divertido e colecionável para esse lançamento especial.',
    conheca: 'Conheça a Caixa de Tabletes com Pelúcia Livro dos Monstros Harry Potter 160g da Cacau Show',
    sabor: 'Os tabletes de chocolate ao leite proporcionam uma combinação cremosa e deliciosa, enquanto a pelúcia do Livro dos Monstros torna o presente ainda mais especial. Com 24 cm, ela faz barulho quando apertada, trazendo uma experiência divertida para os fãs da saga.',
    detalhes: [
      'Tabletes de chocolate ao leite.',
      'Acompanha pelúcia do Livro dos Monstros.',
      'Pelúcia com 24 cm.',
      'A pelúcia faz barulho quando apertada.',
      'Inspirada no universo de Harry Potter.',
    ],
    pq: 'A Caixa de Tabletes com Pelúcia Livro dos Monstros Harry Potter combina chocolate e diversão em um presente que vai encantar crianças e adultos apaixonados pela saga de Harry Potter.',
  },
  'tablete-miau-de-chocolate-ao-leite-70g': {
    sku: '1003632',
    breadcrumb: ['HOME', 'CHOCOLATE', 'TABLETES E BARRAS'],
    short: 'Delicie-se com o Chocolate Miau 70g da Cacau Show, nosso irresistível chocolate no formato de Língua de Gato!',
    intro: 'O Chocolate Miau da Cacau Show é uma verdadeira obra de arte em formato de Língua de Gato. Com 70g de puro sabor, esse chocolate é perfeito para quem ama chocolate ao leite com textura macia e sabor inconfundível.',
    oQueE: {
      title: 'O que é o Chocolate Miau?',
      text: 'O Chocolate Miau é um dos produtos mais queridos da linha de chocolates da Cacau Show. Ele é conhecido por seu formato divertido de Língua de Gato. Feito com ingredientes selecionados e o tradicional cuidado da Cacau Show, o Chocolate Miau traz a cremosidade e a doçura na medida certa.',
    },
    caracteristicas: {
      title: 'Características do Chocolate Miau Língua de Gato',
      items: [
        {
          label: 'Formato Único:',
          text: 'O Chocolate Miau tem o famoso formato de Língua de Gato, que é perfeito para quem procura um presente ou quer apreciar num momento de descontração;',
        },
        {
          label: 'Textura Cremosa:',
          text: 'Com a qualidade que só a Cacau Show oferece, o Chocolate Miau derrete na boca, proporcionando uma experiência única;',
        },
        {
          label: 'Ingredientes de Qualidade:',
          text: 'Produzido com os melhores ingredientes, o Chocolate Miau da Cacau Show é sinônimo de excelência em sabor;',
        },
        {
          label: 'Acompanhe com um Café:',
          text: 'A combinação do Chocolate Miau com um bom café faz com que os sabores se complementem, tornando a experiência ainda mais prazerosa.',
        },
      ],
    },
    pq: 'Se você é apaixonado por chocolates e está em busca de uma experiência diferente, o Chocolate Miau é a escolha perfeita. Ele une o sabor clássico do chocolate ao leite da Cacau Show com a diversão e sofisticação do formato de Língua de Gato. Além disso, é um produto que agrada a todas as idades, de crianças até adultos que apreciam um bom chocolate.',
    extraFinal: 'O Chocolate Miau da Cacau Show é muito mais do que um simples chocolate. Com seu formato icônico de Língua de Gato e seu sabor irresistível, ele conquista corações e paladares de todos que o experimentam. Adquira já o seu e descubra por que esse chocolate é um dos mais adorados da Cacau Show.',
    tags: ['#CacauShow', '#Miau', '#LínguaDeGato', '#Presente'],
  },
}

export default function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = use(params)
  const product = mockProducts.find((p) => p.slug === resolvedParams.slug) || mockProducts[0]
  const [quantity, setQuantity] = useState(1)
  const [imageIndex, setImageIndex] = useState(0)
  const [moreInfoOpen, setMoreInfoOpen] = useState(false)
  const { addItem } = useCartStore()
  const { toggleWishlist, isWishlisted } = useWishlistStore()
  const wishlisted = isWishlisted(product.id)

  const images = (product.images && product.images.length > 0)
    ? product.images
    : [product.image_url, product.image_url]

  const priceParts = product.price.toFixed(2).split('.')
  const intPart = priceParts[0]
  const decPart = priceParts[1]

  const handleAddToCart = () => {
    addItem(product, quantity)
  }

  const desc = detailedDescriptions[product.slug]
  const breadcrumb = desc?.breadcrumb || ['HOME', product.name.split(' ').slice(0, 3).join(' ').toUpperCase()]
  const skuNumber = desc?.sku || String(100 * parseInt(product.id) + 4243).padStart(7, '1')

  // "Compre também" - related products (com Tablete Duo Intense em 1º conforme a foto)
  const duoIntense = mockProducts.find((p) => p.slug === 'tablete-lacreme-duo-intense-100g')
  const otherRelated = mockProducts.filter(
    (p) => p.id !== product.id && p.slug !== 'tablete-lacreme-duo-intense-100g'
  )
  const compretambem = [duoIntense, ...otherRelated].filter(Boolean) as typeof mockProducts

  return (
    <div className="min-h-screen bg-[#fdf5ec]">
      <Header />

      <main className="max-w-2xl mx-auto pb-24">
        {/* Breadcrumb (Ex: HOME > CHOCOLATE > TABLETES E BARRAS) */}
        <nav className="px-4 py-3 flex flex-wrap items-center gap-x-1.5 gap-y-0.5">
          {breadcrumb.map((crumb, idx) => (
            <span key={idx} className="flex items-center gap-1.5">
              {idx < breadcrumb.length - 1 ? (
                <>
                  <Link
                    href={idx === 0 ? '/' : '#'}
                    className="text-[11px] text-gray-500 font-medium hover:text-[#8b2f10] transition-colors uppercase tracking-wide"
                  >
                    {crumb}
                  </Link>
                  <ChevronRight size={11} className="text-gray-400 flex-shrink-0" />
                </>
              ) : (
                <span className="text-[11px] font-black text-[#1a1a1a] uppercase tracking-wide">
                  {crumb}
                </span>
              )}
            </span>
          ))}
        </nav>

        {/* Gallery Card (Card Branco Arredondado) */}
        <div className="mx-4 bg-white rounded-2xl border border-gray-100 shadow-xs overflow-hidden mb-0">
          <div className="relative">
            {/* Imagem Principal */}
            <div className="relative w-full aspect-square max-h-[380px] bg-white flex items-center justify-center px-6 py-6">
              <Image
                src={images[imageIndex]}
                alt={product.name}
                fill
                priority
                className="object-contain p-6"
                sizes="(max-width: 768px) 100vw, 600px"
              />

              {/* Coração Dourado para Favoritar */}
              <button
                onClick={() => toggleWishlist(product.id)}
                className="absolute top-4 right-4 z-10 p-1 cursor-pointer"
                aria-label="Favoritar"
              >
                <Heart
                  size={30}
                  className={wishlisted ? 'text-red-500 fill-red-500' : 'text-[#e5a020]'}
                  strokeWidth={1.8}
                />
              </button>

              {/* Seta Esquerda (Fina sem fundo, exatamente como no screenshot) */}
              <button
                onClick={() => setImageIndex((prev) => (prev - 1 + images.length) % images.length)}
                className="absolute left-2 top-1/2 -translate-y-1/2 z-20 w-10 h-10 flex items-center justify-center text-gray-800 hover:text-black cursor-pointer transition-transform active:scale-90"
                aria-label="Imagem anterior"
              >
                <ChevronLeft size={34} strokeWidth={1.8} />
              </button>

              {/* Seta Direita (Fina sem fundo, exatamente como no screenshot) */}
              <button
                onClick={() => setImageIndex((prev) => (prev + 1) % images.length)}
                className="absolute right-2 top-1/2 -translate-y-1/2 z-20 w-10 h-10 flex items-center justify-center text-gray-800 hover:text-black cursor-pointer transition-transform active:scale-90"
                aria-label="Próxima imagem"
              >
                <ChevronRight size={34} strokeWidth={1.8} />
              </button>
            </div>

            {/* Dots em Cápsula Branca */}
            <div className="flex justify-center pb-4">
              <div className="bg-white border border-[#e5d8cb] rounded-full px-4 py-1.5 shadow-xs flex items-center gap-2">
                {images.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setImageIndex(idx)}
                    className={`rounded-full transition-all cursor-pointer ${
                      idx === imageIndex
                        ? 'w-2.5 h-2.5 bg-[#851926]'
                        : 'w-2 h-2 bg-[#edd5da] hover:bg-[#d8bac0]'
                    }`}
                    aria-label={`Imagem ${idx + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Informações do Produto (Fundo Creme) */}
        <div className="px-4 pt-5 pb-4 bg-[#fdf5ec]">
          {/* Título (Extra-negrito) */}
          <h1 className="text-[26px] sm:text-3xl font-black text-[#2a1309] leading-tight mb-2">
            {product.name}
          </h1>

          {/* SKU */}
          <p className="text-sm text-gray-400 font-medium mb-4">
            SKU # {skuNumber}
          </p>

          {/* Preço e Seletor de Quantidade lado a lado */}
          <div className="flex items-end justify-between mb-5">
            <div className="flex flex-col">
              {product.original_price && (
                <span className="text-sm text-gray-400 line-through font-medium mb-0.5">
                  R$ {product.original_price.toFixed(2).replace('.', ',')}
                </span>
              )}
              <div className="flex items-baseline gap-0.5">
                <span className="text-base font-black text-[#2a1309]">R$</span>
                <span className="text-[38px] font-black text-[#2a1309] tracking-tight leading-none">
                  {intPart}
                </span>
                <span className="text-xl font-black text-[#2a1309] mb-0.5">,{decPart}</span>
                <span className="text-xs text-gray-500 ml-1 font-medium">/un</span>
              </div>
            </div>

            {/* Seletor de Quantidade */}
            <div className="flex items-center bg-white border border-gray-200 rounded-xl px-3 py-2 shadow-xs gap-3">
              <button
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-700 cursor-pointer"
              >
                <Minus size={18} strokeWidth={2.5} />
              </button>
              <span className="w-6 text-center text-base font-bold text-gray-900">{quantity}</span>
              <button
                onClick={() => setQuantity((q) => q + 1)}
                className="w-8 h-8 flex items-center justify-center text-[#f5a623] hover:text-[#d48914] cursor-pointer"
              >
                <Plus size={18} strokeWidth={2.5} />
              </button>
            </div>
          </div>

          {/* Botão ADICIONAR AO CARRINHO (Âmbar) */}
          <button
            onClick={handleAddToCart}
            className="w-full bg-[#f5a623] hover:bg-[#e69715] text-[#2c1408] font-black text-sm py-4 rounded-xl flex items-center justify-center gap-3 transition-colors active:scale-[0.99] uppercase tracking-widest shadow-sm mb-4 cursor-pointer"
          >
            <span>ADICIONAR AO CARRINHO</span>
            <ShoppingCart size={20} strokeWidth={2.2} />
          </button>

          {/* Selo Cacaus (se houver) */}
          {product.cacaus_points > 0 && (
            <div className="flex items-center gap-2 mb-5">
              <span className="inline-flex items-center gap-2 bg-[#7a1622] text-white text-sm font-black px-4 py-1.5 rounded-full">
                🍫 {product.cacaus_points} CACAUS
              </span>
              <button className="text-gray-400 hover:text-gray-600 cursor-pointer">
                <Info size={16} />
              </button>
            </div>
          )}

          {/* Descrição Detalhada Formatada Fiel às Fotos */}
          <div className="text-[15px] text-gray-700 leading-relaxed space-y-4 pt-2">
            {/* Parágrafo 1 */}
            <p className="font-medium text-[#1a1a1a]">
              {desc?.short || product.description}
            </p>

            {/* Intro */}
            {desc?.intro && (
              <p>
                {desc.intro}
              </p>
            )}

            {/* Conheça */}
            {desc?.conheca && (
              <p>
                <strong className="text-[#2a1309]">{desc.conheca}</strong>
              </p>
            )}

            {/* O que é */}
            {desc?.oQueE && (
              <div>
                <p className="font-bold text-[#2a1309] mb-1">{desc.oQueE.title}</p>
                <p>{desc.oQueE.text}</p>
              </div>
            )}

            {/* Características */}
            {desc?.caracteristicas && (
              <div>
                <p className="font-bold text-[#2a1309] mb-2">{desc.caracteristicas.title}</p>
                <ul className="space-y-2">
                  {desc.caracteristicas.items.map((item, i) => (
                    <li key={i}>
                      <span className="font-bold text-[#2a1309]">• {item.label}</span>
                      <br />
                      <span>{item.text}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Sabor */}
            {desc?.sabor && (
              <div>
                <p className="font-bold text-[#2a1309] mb-1">Sabor inigualável</p>
                <p>{desc.sabor}</p>
              </div>
            )}

            {/* Detalhes simples */}
            {desc?.detalhes && desc.detalhes.length > 0 && (
              <div>
                <p className="font-bold text-[#2a1309] mb-2">Detalhes</p>
                <ul className="space-y-1">
                  {desc.detalhes.map((d, i) => (
                    <li key={i}>• {d}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Por que escolher */}
            {desc?.pq && (
              <div>
                <p className="font-bold text-[#2a1309] mb-1">
                  Por que escolher o {product.name.includes('Miau') ? 'Chocolate Miau da Cacau Show' : product.name}?
                </p>
                <p>{desc.pq}</p>
              </div>
            )}

            {/* Texto final extra */}
            {desc?.extraFinal && (
              <p>{desc.extraFinal}</p>
            )}

            {/* Tags hashtags */}
            {desc?.tags && (
              <p className="text-sm text-gray-500 font-semibold pt-2">
                {desc.tags.join(' ')}
              </p>
            )}

            {/* Fallback genérico para outros produtos */}
            {!desc && (
              <>
                <p><strong className="text-[#2a1309]">Conheça o(a) {product.name} da Cacau Show</strong></p>
                <p>{product.description}</p>
                <div>
                  <p className="font-bold text-[#2a1309] mb-2">Detalhes</p>
                  <ul className="space-y-1">
                    <li>• Produto artesanal Cacau Show de qualidade premium.</li>
                    <li>• Feito com ingredientes selecionados.</li>
                    <li>• Ideal para presentear ou saborear.</li>
                  </ul>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Seção "Compre também" */}
        <div className="mt-4">
          <ProductCarousel
            title="Compre também"
            products={compretambem}
          />
        </div>

        {/* MAIS INFORMAÇÕES - Accordion em chocolate escuro */}
        <div className="mt-2">
          <button
            onClick={() => setMoreInfoOpen(!moreInfoOpen)}
            className="w-full bg-[#2a1309] text-white font-black text-xs sm:text-sm py-4 px-4 flex items-center justify-center gap-2 uppercase tracking-widest cursor-pointer"
          >
            <span>MAIS INFORMAÇÕES</span>
            <ChevronDown
              size={18}
              className={`transition-transform duration-300 ${moreInfoOpen ? 'rotate-180' : ''}`}
            />
          </button>
          {moreInfoOpen && (
            <div className="bg-white px-4 py-4 text-sm text-gray-600 leading-relaxed space-y-1">
              <p><strong>Peso:</strong> {product.name.includes('70g') ? '70g' : product.name.includes('650g') ? '650g' : product.name.includes('160g') ? '160g' : '100g'}</p>
              <p><strong>Código:</strong> SKU #{skuNumber}</p>
              <p><strong>Marca:</strong> Cacau Show</p>
              <p><strong>Conservação:</strong> Manter em local fresco e seco, protegido da luz solar.</p>
            </div>
          )}
        </div>

        {/* Rodapé Oficial Cacau Show (100% igual ao screenshot) */}
        <footer className="bg-[#2a1309] pt-8 pb-10 px-4 text-center">
          <div className="flex justify-center mb-2">
            <span className="logo-font text-3xl text-[#FEE9D8] select-none">CacauShow</span>
          </div>
          <p className="logo-font text-2xl text-[#f5a623] italic tracking-wide mb-4">
            feliz hoje!
          </p>
          <p className="text-[10px] text-[#cfbea9]/80 leading-relaxed max-w-lg mx-auto">
            © Copyright 2023. Todos os direitos reservados. | Cacau Comércio Eletrônico LTDA 32.143.933/0002-05. | Endereço: Avenida Helio Ossamu Daikuara, 1445 Bairro Jardim Vista Alegre Município Embu das Artes - SP CEP: 06807-000
          </p>
        </footer>
      </main>
    </div>
  )
}
