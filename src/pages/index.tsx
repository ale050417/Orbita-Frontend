import Head from 'next/head';
import { Navbar }               from '@/components/layout/Navbar';
import { Footer }               from '@/components/layout/Footer';
import { Hero }                 from '@/components/sections/Hero';
import { ScrollSequence }       from '@/components/sections/ScrollSequence';
import { PresentationSections } from '@/components/sections/PresentationSections';
import { SectionDivider }       from '@/components/ui/SectionDivider';
import { ScrollToTop }          from '@/components/ui/ScrollToTop';

export default function Home() {
  return (
    <>
      <Head>
        <title>Órbita — Gestión para pequeñas empresas</title>
        <meta name="description" content="Turnos, ventas, catálogo y clientes en un solo lugar. La plataforma de gestión diseñada para emprendedores argentinos." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="min-h-screen">
        <Navbar />
        <main>
          <Hero />
          <ScrollSequence />
          <SectionDivider variant="wide" />
          <PresentationSections />
        </main>
        <Footer />
        <ScrollToTop />
      </div>
    </>
  );
}
