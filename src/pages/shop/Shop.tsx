import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  ShoppingBag, 
  Search, 
  Filter, 
  Star, 
  Heart,
  ShoppingCart,
  Package,
  Truck,
  Shield
} from 'lucide-react';

const Shop = () => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [sortBy, setSortBy] = useState('popular');

  const categories = [
    { id: 'all', name: 'همه محصولات', count: 156 },
    { id: 'supplements', name: 'مکمل‌ها', count: 45 },
    { id: 'equipment', name: 'تجهیزات', count: 32 },
    { id: 'clothing', name: 'پوشاک', count: 28 },
    { id: 'accessories', name: 'لوازم جانبی', count: 51 },
  ];

  const products = [
    {
      id: 1,
      name: 'پروتئین وی گلد استاندارد',
      brand: 'Optimum Nutrition',
      price: 3500000,
      originalPrice: 4000000,
      discount: 12,
      rating: 4.8,
      reviews: 245,
      image: '/placeholder-protein.jpg',
      category: 'supplements',
      tags: ['پرفروش', 'تخفیف ویژه'],
      inStock: true
    },
    {
      id: 2,
      name: 'دمبل قابل تنظیم 40 کیلویی',
      brand: 'PowerBlock',
      price: 12500000,
      originalPrice: 15000000,
      discount: 17,
      rating: 4.9,
      reviews: 89,
      image: '/placeholder-dumbbell.jpg',
      category: 'equipment',
      tags: ['کیفیت بالا'],
      inStock: true
    },
    {
      id: 3,
      name: 'تی‌شرت ورزشی DriFit',
      brand: 'Nike',
      price: 850000,
      originalPrice: 1200000,
      discount: 29,
      rating: 4.6,
      reviews: 156,
      image: '/placeholder-shirt.jpg',
      category: 'clothing',
      tags: ['جدید'],
      inStock: false
    },
    {
      id: 4,
      name: 'کراتین مونوهیدرات',
      brand: 'Creatine Monohydrate',
      price: 1800000,
      originalPrice: null,
      discount: 0,
      rating: 4.7,
      reviews: 320,
      image: '/placeholder-creatine.jpg',
      category: 'supplements',
      tags: ['پرفروش'],
      inStock: true
    },
    {
      id: 5,
      name: 'کفش تمرین Air Max',
      brand: 'Nike',
      price: 4200000,
      originalPrice: 5000000,
      discount: 16,
      rating: 4.8,
      reviews: 78,
      image: '/placeholder-shoes.jpg',
      category: 'accessories',
      tags: ['محبوب'],
      inStock: true
    },
    {
      id: 6,
      name: 'شیکر پروتئین BlenderBottle',
      brand: 'BlenderBottle',
      price: 350000,
      originalPrice: null,
      discount: 0,
      rating: 4.5,
      reviews: 267,
      image: '/placeholder-shaker.jpg',
      category: 'accessories',
      tags: ['ضروری'],
      inStock: true
    }
  ];

  const formatPrice = (price: number) => {
    return price.toLocaleString('fa-IR') + ' تومان';
  };

  const getTagColor = (tag: string) => {
    switch (tag) {
      case 'پرفروش': return 'bg-blue-500/20 text-blue-400';
      case 'تخفیف ویژه': return 'bg-red-500/20 text-red-400';
      case 'جدید': return 'bg-green-500/20 text-green-400';
      case 'محبوب': return 'bg-purple-500/20 text-purple-400';
      case 'کیفیت بالا': return 'bg-gold-500/20 text-gold-400';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  const filteredProducts = activeCategory === 'all' 
    ? products 
    : products.filter(product => product.category === activeCategory);

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black text-white">
        {/* Hero Section */}
        <div className="relative pt-20 pb-16">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-gold-500/20 opacity-30"></div>
          <div className="relative max-w-7xl mx-auto px-4">
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                <span className="text-gradient">فروشگاه ورزشی</span>
              </h1>
              <p className="text-xl text-white/80 max-w-3xl mx-auto">
                بهترین محصولات ورزشی با کیفیت برتر و قیمت مناسب
              </p>
            </div>

            {/* Search and Filter */}
            <div className="flex flex-col md:flex-row gap-4 justify-center items-center mb-8">
              <div className="relative w-full md:w-96">
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/50 h-5 w-5" />
                <Input 
                  placeholder="جستجو در محصولات..." 
                  className="pr-12 bg-gray-800/50 border-white/20"
                />
              </div>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-full md:w-48 bg-gray-800/50 border-white/20">
                  <SelectValue placeholder="مرتب‌سازی" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="popular">محبوب‌ترین</SelectItem>
                  <SelectItem value="price-low">ارزان‌ترین</SelectItem>
                  <SelectItem value="price-high">گران‌ترین</SelectItem>
                  <SelectItem value="newest">جدیدترین</SelectItem>
                  <SelectItem value="rating">بیشترین امتیاز</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 pb-20">
          {/* Categories */}
          <div className="mb-8">
            <div className="flex flex-wrap gap-4 justify-center">
              {categories.map((category) => (
                <Button
                  key={category.id}
                  variant={activeCategory === category.id ? "default" : "outline"}
                  onClick={() => setActiveCategory(category.id)}
                  className="flex items-center gap-2"
                >
                  {category.name}
                  <Badge variant="secondary" className="text-xs">
                    {category.count}
                  </Badge>
                </Button>
              ))}
            </div>
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
            {[
              { icon: Package, title: 'کیفیت تضمینی', desc: 'محصولات اصل و با گارانتی' },
              { icon: Truck, title: 'ارسال رایگان', desc: 'برای خریدهای بالای 2 میلیون' },
              { icon: Shield, title: 'پشتیبانی 24/7', desc: 'مشاوره و راهنمایی رایگان' },
              { icon: Star, title: 'امتیاز 4.8', desc: 'رضایت بیش از 10,000 مشتری' },
            ].map((feature, index) => (
              <Card key={index} className="bg-gray-900/50 border-white/10 text-center">
                <CardContent className="p-6">
                  <feature.icon className="h-8 w-8 text-primary mx-auto mb-3" />
                  <h3 className="font-semibold mb-2">{feature.title}</h3>
                  <p className="text-white/70 text-sm">{feature.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProducts.map((product) => (
              <Card key={product.id} className="bg-gray-900/80 border-white/10 hover:border-primary/50 transition-all group overflow-hidden">
                <div className="relative">
                  <div className="aspect-square bg-gray-800/50 flex items-center justify-center">
                    <Package className="h-16 w-16 text-white/30" />
                  </div>
                  
                  {/* Tags */}
                  <div className="absolute top-3 right-3 flex flex-col gap-2">
                    {product.tags.map((tag, index) => (
                      <Badge key={index} className={`text-xs ${getTagColor(tag)}`}>
                        {tag}
                      </Badge>
                    ))}
                    {product.discount > 0 && (
                      <Badge className="bg-red-500 text-white text-xs">
                        {product.discount}% تخفیف
                      </Badge>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="absolute top-3 left-3 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button size="sm" variant="outline" className="bg-white/10 backdrop-blur">
                      <Heart className="h-4 w-4" />
                    </Button>
                  </div>

                  {!product.inStock && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <Badge variant="destructive">ناموجود</Badge>
                    </div>
                  )}
                </div>

                <CardContent className="p-6">
                  <div className="mb-3">
                    <h3 className="font-bold text-lg mb-1 line-clamp-2">{product.name}</h3>
                    <p className="text-white/70 text-sm">{product.brand}</p>
                  </div>

                  <div className="flex items-center gap-2 mb-4">
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 text-yellow-500 fill-current" />
                      <span className="font-semibold">{product.rating}</span>
                    </div>
                    <span className="text-white/50 text-sm">({product.reviews} نظر)</span>
                  </div>

                  <div className="mb-4">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl font-bold text-primary">
                        {formatPrice(product.price)}
                      </span>
                      {product.originalPrice && (
                        <span className="text-white/50 text-sm line-through">
                          {formatPrice(product.originalPrice)}
                        </span>
                      )}
                    </div>
                  </div>

                  <Button 
                    className="w-full" 
                    disabled={!product.inStock}
                  >
                    <ShoppingCart className="h-4 w-4 ml-2" />
                    {product.inStock ? 'افزودن به سبد' : 'ناموجود'}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Load More */}
          <div className="text-center mt-12">
            <Button variant="outline" size="lg">
              نمایش محصولات بیشتر
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Shop;