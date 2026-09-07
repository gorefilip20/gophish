export default function PromoBar() {
  return (
    <div className="bg-brand-500/10 border-b border-brand-500/20">
      <div className="max-w-7xl mx-auto px-4 py-2.5 text-center">
        <p className="text-xs sm:text-sm text-brand-300 tracking-wide">
          Free shipping on all orders over $100 | Use code <span className="font-semibold text-brand-200">LUMIERE15</span> for 15% off your first order
        </p>
      </div>
    </div>
  );
}
