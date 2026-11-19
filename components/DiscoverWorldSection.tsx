'use client'

import Link from 'next/link'

export default function DiscoverWorldSection() {
  return (
    <section className="mb-6 px-4">
      {/* Card Descubra o Mundo Cacau Show (100% idêntico ao modelo oficial enviado) */}
      <div className="bg-[#f5efe6] rounded-3xl p-6 sm:p-8 border border-[#e8dfd3] shadow-xs">
        {/* Título com ícone do chocolate */}
        <div className="flex items-center gap-2.5 mb-5">
          <span className="text-2xl" role="img" aria-label="Chocolate">
            🍫
          </span>
          <h2 className="text-2xl sm:text-[26px] font-black text-[#1a1a1a] tracking-tight">
            Descubra o Mundo Cacau Show
          </h2>
        </div>

        {/* Textos oficiais com links e destaques em negrito */}
        <div className="space-y-4 text-sm sm:text-[15px] text-[#2c2c2c] leading-relaxed">
          <p>
            Na <strong className="font-bold text-[#1a1a1a]">Cacau Show</strong>, cada chocolate é
            feito para transformar momentos simples em experiências especiais. São{' '}
            <Link href="/categoria/trufas" className="underline hover:text-[#5c2a18] font-medium">
              Trufas
            </Link>{' '}
            irresistíveis,{' '}
            <Link href="/categoria/tabletes" className="underline hover:text-[#5c2a18] font-medium">
              Tabletes
            </Link>{' '}
            cremosos,{' '}
            <Link href="/categoria/bombons" className="underline hover:text-[#5c2a18] font-medium">
              Bombons
            </Link>{' '}
            artesanais e{' '}
            <Link href="/categoria/presentes" className="underline hover:text-[#5c2a18] font-medium">
              Presentes de chocolate
            </Link>{' '}
            que combinam qualidade, sabor e muito carinho. Além disso, nossa sessão de{' '}
            <Link href="/categoria/lifestyle" className="underline hover:text-[#5c2a18] font-medium">
              Mesa e Cozinha
            </Link>{' '}
            conta com opções únicas, unindo funcionalidade e estilo.
          </p>

          <p>
            Aqui, o amor pelo cacau se transforma em produtos imperdíveis: do clássico{' '}
            <strong className="font-bold text-[#1a1a1a]">chocolate ao leite</strong>, aos{' '}
            <strong className="font-bold text-[#1a1a1a]">intensos</strong> e{' '}
            <strong className="font-bold text-[#1a1a1a]">recheados</strong>. Tudo preparado com
            ingredientes selecionados e o cuidado que só quem entende de chocolate, pode oferecer.
          </p>

          <p>
            Quer surpreender alguém ou dar um presente? Na{' '}
            <strong className="font-bold text-[#1a1a1a]">Cacau Show</strong>, você encontra opções
            para todos os gostos e ocasiões. Somos apaixonados por criar experiências. Afinal,
            acreditar no poder de um pedacinho de felicidade é o que nos move todos os dias.
          </p>

          <p>
            Descubra o mundo <strong className="font-bold text-[#1a1a1a]">Cacau Show</strong> e viva
            momentos doces, cheio de sabor, afeto e boas lembranças.
          </p>
        </div>
      </div>
    </section>
  )
}
