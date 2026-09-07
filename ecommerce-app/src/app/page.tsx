import HeroSection from '@/components/HeroSection';
import FeaturedProducts from '@/components/FeaturedProducts';
import CategoryGrid from '@/components/CategoryGrid';
import BestSellers from '@/components/BestSellers';
import Newsletter from '@/components/Newsletter';
import PromoBar from '@/components/PromoBar';

export default function Home() {
  return (
    <>
      <PromoBar />
      <HeroSection />
      <FeaturedProducts />
      <CategoryGrid />
      <BestSellers />
      <Newsletter />
    </>
  );
}
