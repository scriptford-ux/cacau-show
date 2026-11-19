import Header from '@/components/Header'
import HeroCarousel from '@/components/HeroCarousel'
import ProductCarousel from '@/components/ProductCarousel'
import PromoBannerCarousel from '@/components/PromoBannerCarousel'
import VideoStoriesCarousel from '@/components/VideoStoriesCarousel'
import BrandsSection from '@/components/BrandsSection'
import RevendaBanner from '@/components/RevendaBanner'
import DiscoverWorldSection from '@/components/DiscoverWorldSection'
import Footer from '@/components/Footer'
import ChatWidget from '@/components/ChatWidget'
import { mockProducts, mockBanners } from '@/lib/mockData'

export default function HomePage() {
  // 1. O encanto do Natal (Harry Potter em 1º lugar garantido conforme a foto do usuário)
  const harryPotter = mockProducts.find((p) => p.id === '4')
  const otherNatal = mockProducts.filter((p) => p.id !== '4' && p.featured && (p.category_id === '1' || p.category_id === '5'))
  const natalProducts = [harryPotter, ...otherNatal].filter(Boolean) as typeof mockProducts

  // 2. Cremosidade em Dobro (Tablete Miau em 1º lugar garantido conforme a foto do usuário)
  const miauProduct = mockProducts.find((p) => p.id === '10')
  const otherCremosidade = mockProducts.filter((p) => p.id !== '10' && p.brand === 'laCreme' && p.category_id === '4')
  const cremosidadeProducts = [miauProduct, ...otherCremosidade].filter(Boolean) as typeof mockProducts

  // 3. Irresistíveis em cada detalhe (Caixas de bombons Mini Show com 2 CACAUS e Desconto Progressivo)
  const irresistiveisProducts = mockProducts.filter((p) => p.category_id === '3' && p.brand === 'laCreme')

  // Promo banners (Choco Friday)
  const promoBanners = mockBanners.slice(0, 2)

  return (
    <div className="min-h-screen bg-cs-cream-light">
      <Header />

      <main className="max-w-2xl mx-auto pb-16">
        {/* 1. Hero carousel (CHOCO FRIDAY Tag e Panettones) */}
        <div className="p-4 pb-0">
          <HeroCarousel />
        </div>

        <div className="h-4" />

        {/* 2. Chocofriday promo section */}
        <PromoBannerCarousel
          title="Chocofriday Cacau Show até 40% OFF!"
          subtitle="Aproveite já!"
        />

        {/* 3. O encanto do Natal em cada escolha (Vídeos Stories / Reels com play) */}
        <VideoStoriesCarousel />

        {/* 4. Escolha o Presente Ideal em Menos de 1 Minuto (Carrossel com Harry Potter e produtos de Natal) */}
        <ProductCarousel
          title="Escolha o Presente Ideal em Menos de 1 Minuto"
          subtitle="Todos os Momentos Combinam com Cacau Show"
          products={natalProducts}
        />

        {/* 5. Cremosidade em Dobro: Pague R$10 no segundo laCreme */}
        <ProductCarousel
          title="Cremosidade em Dobro: Pague R$10 no segundo laCreme"
          products={cremosidadeProducts}
        />

        {/* 6. Nossas Marcas (Lifestyle, laCreme, Bendito Cacao) */}
        <BrandsSection />

        {/* 7. Irresistíveis em cada detalhe */}
        <ProductCarousel
          title="Irresistíveis em cada detalhe"
          products={irresistiveisProducts}
        />

        {/* 8. Revenda Cacau Show - Concorra a R$ 1 Milhão */}
        <RevendaBanner />

        {/* 9. Descubra o Mundo Cacau Show */}
        <DiscoverWorldSection />
      </main>

      {/* 10. Rodapé Oficial Cacau Show (100% fiel ao print) */}
      <Footer />
    </div>
  )
}
