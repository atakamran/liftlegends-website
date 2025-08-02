import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { 
  Handshake, 
  Building2, 
  Users, 
  Trophy,
  TrendingUp,
  Target,
  Award,
  CheckCircle,
  Mail,
  Phone,
  MapPin,
  Globe
} from 'lucide-react';

const Partnerships = () => {
  const [formData, setFormData] = useState({
    companyName: '',
    contactPerson: '',
    email: '',
    phone: '',
    companyType: '',
    partnershipType: '',
    message: ''
  });

  const partnershipTypes = [
    {
      type: 'gym',
      title: 'باشگاه‌های ورزشی',
      description: 'همکاری با باشگاه‌ها برای ارائه خدمات دیجیتال',
      benefits: [
        'سیستم مدیریت اعضا',
        'پرداخت آنلاین شهریه',
        'برنامه‌ریزی کلاس‌ها',
        'گزارش‌گیری پیشرفته'
      ],
      icon: Building2,
      color: 'blue'
    },
    {
      type: 'trainer',
      title: 'مربیان حرفه‌ای',
      description: 'پلتفرم اختصاصی برای مربیان و درآمدزایی',
      benefits: [
        'پنل مربی اختصاصی',
        'مدیریت مشتریان',
        'فروش برنامه‌های آنلاین',
        'درآمد ثابت ماهانه'
      ],
      icon: Users,
      color: 'green'
    },
    {
      type: 'brand',
      title: 'برندهای ورزشی',
      description: 'همکاری در فروش محصولات ورزشی',
      benefits: [
        'فروشگاه آنلاین اختصاصی',
        'بازاریابی هدفمند',
        'تحلیل فروش دقیق',
        'دسترسی به مشتریان فعال'
      ],
      icon: Trophy,
      color: 'purple'
    },
    {
      type: 'corporate',
      title: 'شرکت‌های بزرگ',
      description: 'ارائه خدمات ورزشی به کارکنان',
      benefits: [
        'برنامه‌های سازمانی',
        'تخفیفات ویژه کارکنان',
        'گزارش‌گیری سلامت',
        'مشاوره تخصصی'
      ],
      icon: Building2,
      color: 'orange'
    }
  ];

  const successStories = [
    {
      partner: 'باشگاه آتلتیک',
      type: 'باشگاه ورزشی',
      result: '40% افزایش اعضا',
      description: 'با استفاده از سیستم مدیریت ما، باشگاه آتلتیک توانست اعضای خود را 40% افزایش دهد.'
    },
    {
      partner: 'مربی علی رضایی',
      type: 'مربی شخصی',
      result: '150% افزایش درآمد',
      description: 'علی رضایی با پلتفرم ما توانست درآمد ماهانه‌اش را بیش از دو برابر کند.'
    },
    {
      partner: 'برند فیت پرو',
      type: 'برند مکمل',
      result: '200% افزایش فروش',
      description: 'فیت پرو با استفاده از فروشگاه ما فروش محصولاتش را سه برابر کرد.'
    }
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log('Partnership form submitted:', formData);
  };

  const getColorClasses = (color: string) => {
    const colors = {
      blue: 'bg-blue-500/20 text-blue-400 border-blue-500/50',
      green: 'bg-green-500/20 text-green-400 border-green-500/50',
      purple: 'bg-purple-500/20 text-purple-400 border-purple-500/50',
      orange: 'bg-orange-500/20 text-orange-400 border-orange-500/50'
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black text-white">
        {/* Hero Section */}
        <div className="relative pt-20 pb-16">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-gold-500/20 opacity-30"></div>
          <div className="relative max-w-7xl mx-auto px-4">
            <div className="text-center mb-12">
              <div className="flex justify-center mb-6">
                <div className="p-4 bg-primary/20 rounded-2xl">
                  <Handshake className="h-16 w-16 text-primary" />
                </div>
              </div>
              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                <span className="text-gradient">همکاری و شراکت</span>
              </h1>
              <p className="text-xl text-white/80 max-w-3xl mx-auto">
                با LiftLegends همکاری کنید و در آینده صنعت ورزش ایران سهیم باشید
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[
                { label: 'باشگاه همکار', value: '250+', icon: Building2 },
                { label: 'مربی فعال', value: '500+', icon: Users },
                { label: 'ورزشکار', value: '10,000+', icon: Trophy },
                { label: 'رشد ماهانه', value: '25%', icon: TrendingUp },
              ].map((stat, index) => (
                <Card key={index} className="bg-gray-900/50 border-white/10 text-center">
                  <CardContent className="p-6">
                    <stat.icon className="h-8 w-8 text-primary mx-auto mb-3" />
                    <div className="text-2xl font-bold text-gold-500 mb-1">{stat.value}</div>
                    <div className="text-white/70 text-sm">{stat.label}</div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 pb-20">
          {/* Partnership Types */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-center mb-12">انواع همکاری</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {partnershipTypes.map((partnership, index) => (
                <Card key={index} className="bg-gray-900/80 border-white/10 hover:border-primary/50 transition-all">
                  <CardHeader>
                    <div className="flex items-center gap-4">
                      <div className={`p-3 rounded-xl ${getColorClasses(partnership.color)}`}>
                        <partnership.icon className="h-6 w-6" />
                      </div>
                      <div>
                        <CardTitle className="text-xl">{partnership.title}</CardTitle>
                        <p className="text-white/70 text-sm mt-1">{partnership.description}</p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {partnership.benefits.map((benefit, benefitIndex) => (
                        <div key={benefitIndex} className="flex items-center gap-3">
                          <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                          <span className="text-white/80">{benefit}</span>
                        </div>
                      ))}
                    </div>
                    <Button className="w-full mt-6" variant="outline">
                      اطلاعات بیشتر
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Success Stories */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-center mb-12">داستان‌های موفقیت</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {successStories.map((story, index) => (
                <Card key={index} className="bg-gray-900/80 border-white/10">
                  <CardContent className="p-6">
                    <div className="text-center mb-4">
                      <Award className="h-12 w-12 text-gold-500 mx-auto mb-3" />
                      <h3 className="font-bold text-lg">{story.partner}</h3>
                      <Badge className="mt-2">{story.type}</Badge>
                    </div>
                    <div className="text-center mb-4">
                      <div className="text-3xl font-bold text-green-500 mb-2">{story.result}</div>
                    </div>
                    <p className="text-white/70 text-sm text-center">{story.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Partnership Form */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <h2 className="text-3xl font-bold mb-6">درخواست همکاری</h2>
              <p className="text-white/70 mb-8">
                فرم زیر را پر کنید تا در اسرع وقت با شما تماس بگیریم و جزئیات همکاری را بررسی کنیم.
              </p>
              
              <Card className="bg-gray-900/80 border-white/10">
                <CardContent className="p-6">
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">نام شرکت/سازمان</label>
                        <Input
                          name="companyName"
                          value={formData.companyName}
                          onChange={handleInputChange}
                          placeholder="نام شرکت خود را وارد کنید"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">نام و نام خانوادگی</label>
                        <Input
                          name="contactPerson"
                          value={formData.contactPerson}
                          onChange={handleInputChange}
                          placeholder="نام فرد تماس‌گیرنده"
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">ایمیل</label>
                        <Input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          placeholder="example@company.com"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">شماره تماس</label>
                        <Input
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          placeholder="09123456789"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">نوع فعالیت</label>
                      <Input
                        name="companyType"
                        value={formData.companyType}
                        onChange={handleInputChange}
                        placeholder="باشگاه، برند، مربی، شرکت و..."
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">نوع همکاری مورد نظر</label>
                      <Input
                        name="partnershipType"
                        value={formData.partnershipType}
                        onChange={handleInputChange}
                        placeholder="نوع همکاری که دنبال آن هستید"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">توضیحات</label>
                      <Textarea
                        name="message"
                        value={formData.message}
                        onChange={handleInputChange}
                        placeholder="توضیحات بیشتر درباره درخواست همکاری..."
                        rows={4}
                        required
                      />
                    </div>

                    <Button type="submit" className="w-full">
                      ارسال درخواست همکاری
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-8">
              {/* Contact Info */}
              <Card className="bg-gray-900/80 border-white/10">
                <CardHeader>
                  <CardTitle>اطلاعات تماس</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Mail className="h-5 w-5 text-primary" />
                    <span>partnership@liftlegends.ir</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="h-5 w-5 text-primary" />
                    <span>021-12345678</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <MapPin className="h-5 w-5 text-primary" />
                    <span>تهران، ایران</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Globe className="h-5 w-5 text-primary" />
                    <span>www.liftlegends.ir</span>
                  </div>
                </CardContent>
              </Card>

              {/* Why Partner */}
              <Card className="bg-gradient-to-br from-primary/20 to-gold-500/20 border-primary/30">
                <CardHeader>
                  <CardTitle>چرا با ما همکاری کنید؟</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {[
                      'پلتفرم پیشرفته و به‌روز',
                      'پشتیبانی 24/7',
                      'مدل درآمد منصفانه',
                      'رشد سریع و پایدار',
                      'تیم متخصص و باتجربه',
                      'نوآوری مستمر'
                    ].map((item, index) => (
                      <li key={index} className="flex items-center gap-3">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              {/* Call to Action */}
              <Card className="bg-gray-900/80 border-white/10 text-center">
                <CardContent className="p-6">
                  <Target className="h-12 w-12 text-primary mx-auto mb-4" />
                  <h3 className="font-bold text-lg mb-2">آماده شروع هستید؟</h3>
                  <p className="text-white/70 text-sm mb-4">
                    همین امروز با ما تماس بگیرید و مسیر رشد خود را شروع کنید
                  </p>
                  <Button>تماس فوری</Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Partnerships;