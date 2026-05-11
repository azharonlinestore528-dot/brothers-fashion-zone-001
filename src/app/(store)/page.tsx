import { HeroSection } from '@/components/home/HeroSection';
import { CategoryCircles } from '@/components/home/CategoryCircles';
import { TrustBar } from '@/components/home/TrustBar';
import { FeaturedProducts } from '@/components/home/FeaturedProducts';
import { SaleAlertBanner } from '@/components/home/SaleAlertBanner';
import { AestheticShowcase } from '@/components/home/AestheticShowcase';
import { FloatingClothesSection } from '@/components/home/FloatingClothesSection';
import { WhyIndiaTrustsUs } from '@/components/home/WhyIndiaTrustsUs';
import { MarketplaceSection } from '@/components/home/MarketplaceSection';
import { ReviewsSection } from '@/components/home/ReviewsSection';
import { GuidesSection } from '@/components/home/GuidesSection';
import { InstagramSection } from '@/components/home/InstagramSection';
import { FAQSection } from '@/components/home/FAQSection';
import { Footer } from '@/components/layout/Footer';

export default function HomePage() {
  return (
    <main>
      <HeroSection />
      <CategoryCircles />
      <TrustBar />
      <FeaturedProducts />
      <SaleAlertBanner />
      <AestheticShowcase />
      <FloatingClothesSection />
      <WhyIndiaTrustsUs />
      <MarketplaceSection />
      <ReviewsSection />
      <GuidesSection />
      <InstagramSection />
      <FAQSection />
      <Footer />
    </main>
  );
}