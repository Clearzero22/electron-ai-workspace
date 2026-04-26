interface CompetitorProduct {
  image: string;
  name: string;
  price: string;
  reviews: string;
  rating: number;
}

export default function CompetitorAnalysis() {
  const competitors: CompetitorProduct[] = [
    {
      image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=300&h=200&fit=crop',
      name: 'Modern Sofa Couch',
      price: '$199.99',
      reviews: '1,234',
      rating: 4
    },
    {
      image: 'https://images.unsplash.com/photo-1550226891-ef816aed4a98?w=300&h=200&fit=crop',
      name: 'Sectional Sofa Set',
      price: '$249.00',
      reviews: '856',
      rating: 5
    },
    {
      image: 'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=300&h=200&fit=crop',
      name: 'Luxury Velvet Sofa',
      price: '$189.99',
      reviews: '432',
      rating: 4
    }
  ];

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }).map((_, i) => (
      <svg
        key={i}
        className={`w-3 h-3 ${i < rating ? 'text-yellow-400' : 'text-gray-300'}`}
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    ));
  };

  return (
    <div className="w-72 flex-shrink-0 bg-white rounded-xl border border-gray-200 p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-gray-900">竞品分析（Amazon）</h3>
        <button className="text-gray-400 hover:text-gray-600">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>
      <div className="space-y-3">
        {competitors.map((product, index) => (
          <div key={index} className="border border-gray-100 rounded-lg p-2">
            <div className="aspect-video rounded-lg bg-gray-100 overflow-hidden mb-2">
              <img src={product.image} className="w-full h-full object-cover" alt={product.name} />
            </div>
            <div className="text-xs font-medium text-gray-900 truncate">{product.name}</div>
            <div className="flex items-center gap-1 mt-1">
              <span className="text-xs text-gray-900 font-bold">{product.price}</span>
              <span className="text-xs text-gray-400">({product.reviews})</span>
            </div>
            <div className="flex items-center gap-0.5 mt-1">{renderStars(product.rating)}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
