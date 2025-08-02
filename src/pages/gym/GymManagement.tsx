import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Building2, Users, CreditCard, Calendar, Plus, Star, MapPin } from 'lucide-react';

const GymManagement = () => {
  const [activeTab, setActiveTab] = useState('overview');

  const gymStats = [
    { label: 'تعداد اعضا', value: '1,250', icon: Users },
    { label: 'درآمد ماهانه', value: '125,000,000 تومان', icon: CreditCard },
    { label: 'کلاس‌های فعال', value: '28', icon: Calendar },
    { label: 'امتیاز رضایت', value: '4.8/5', icon: Star },
  ];

  const upcomingClasses = [
    { name: 'کراسفیت صبحگاهی', time: '07:00', trainer: 'احمد رضایی', members: 12 },
    { name: 'یوگا تنفس', time: '09:30', trainer: 'مریم احمدی', members: 8 },
    { name: 'بدنسازی عمومی', time: '18:00', trainer: 'علی محمدی', members: 20 },
  ];

  const gymFeatures = [
    'مدیریت اعضا و شهریه',
    'برنامه‌ریزی کلاس‌ها',
    'گزارش‌گیری مالی',
    'سیستم حضور و غیاب',
    'مدیریت مربیان',
    'فروش اشتراک آنلاین'
  ];

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black text-white">
        {/* Hero Section */}
        <div className="relative pt-20 pb-16">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-gold-500/20 opacity-30"></div>
          <div className="relative max-w-7xl mx-auto px-4">
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                <span className="text-gradient">مدیریت باشگاه‌ها</span>
              </h1>
              <p className="text-xl text-white/80 max-w-3xl mx-auto">
                سیستم جامع مدیریت باشگاه‌های ورزشی با امکانات پیشرفته
              </p>
            </div>

            {/* Navigation Tabs */}
            <div className="flex justify-center mb-8">
              <div className="bg-gray-800/50 p-2 rounded-xl">
                {['overview', 'features', 'pricing'].map((tab) => (
                  <Button
                    key={tab}
                    variant={activeTab === tab ? "default" : "ghost"}
                    onClick={() => setActiveTab(tab)}
                    className="mx-1"
                  >
                    {tab === 'overview' && 'نمای کلی'}
                    {tab === 'features' && 'ویژگی‌ها'}
                    {tab === 'pricing' && 'تعرفه‌ها'}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Content Based on Active Tab */}
        <div className="max-w-7xl mx-auto px-4 pb-20">
          {activeTab === 'overview' && (
            <div className="space-y-8">
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {gymStats.map((stat, index) => (
                  <Card key={index} className="bg-gray-900/80 border-white/10">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-white/70 text-sm">{stat.label}</p>
                          <p className="text-2xl font-bold text-gold-500">{stat.value}</p>
                        </div>
                        <stat.icon className="h-8 w-8 text-primary" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Upcoming Classes */}
              <Card className="bg-gray-900/80 border-white/10">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    کلاس‌های امروز
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {upcomingClasses.map((cls, index) => (
                      <div key={index} className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg">
                        <div>
                          <h3 className="font-semibold">{cls.name}</h3>
                          <p className="text-white/70 text-sm">مربی: {cls.trainer}</p>
                        </div>
                        <div className="text-left">
                          <p className="text-gold-500 font-semibold">{cls.time}</p>
                          <p className="text-white/70 text-sm">{cls.members} نفر</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="bg-gray-900/80 border-white/10 hover:border-primary/50 transition-all cursor-pointer">
                  <CardContent className="p-6 text-center">
                    <Plus className="h-8 w-8 text-primary mx-auto mb-4" />
                    <h3 className="font-semibold mb-2">عضو جدید</h3>
                    <p className="text-white/70 text-sm">افزودن عضو جدید به باشگاه</p>
                  </CardContent>
                </Card>
                
                <Card className="bg-gray-900/80 border-white/10 hover:border-primary/50 transition-all cursor-pointer">
                  <CardContent className="p-6 text-center">
                    <Calendar className="h-8 w-8 text-gold-500 mx-auto mb-4" />
                    <h3 className="font-semibold mb-2">کلاس جدید</h3>
                    <p className="text-white/70 text-sm">برنامه‌ریزی کلاس جدید</p>
                  </CardContent>
                </Card>
                
                <Card className="bg-gray-900/80 border-white/10 hover:border-primary/50 transition-all cursor-pointer">
                  <CardContent className="p-6 text-center">
                    <CreditCard className="h-8 w-8 text-green-500 mx-auto mb-4" />
                    <h3 className="font-semibold mb-2">پرداخت شهریه</h3>
                    <p className="text-white/70 text-sm">مدیریت پرداخت‌ها</p>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {activeTab === 'features' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {gymFeatures.map((feature, index) => (
                <Card key={index} className="bg-gray-900/80 border-white/10">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3">
                      <div className="h-2 w-2 bg-primary rounded-full"></div>
                      <p className="font-medium">{feature}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {activeTab === 'pricing' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { name: 'پایه', price: '2,500,000', features: ['تا 100 عضو', 'پشتیبانی ایمیل', 'گزارش‌های پایه'] },
                { name: 'حرفه‌ای', price: '5,000,000', features: ['تا 500 عضو', 'پشتیبانی تلفنی', 'گزارش‌های پیشرفته', 'اپلیکیشن موبایل'] },
                { name: 'سازمانی', price: 'تماس', features: ['اعضای نامحدود', 'پشتیبانی 24/7', 'سفارشی‌سازی کامل', 'یکپارچه‌سازی'] }
              ].map((plan, index) => (
                <Card key={index} className={`bg-gray-900/80 border-white/10 ${index === 1 ? 'ring-2 ring-primary' : ''}`}>
                  <CardHeader>
                    <CardTitle className="text-center">
                      {plan.name}
                      {index === 1 && <Badge className="mr-2 bg-primary">محبوب</Badge>}
                    </CardTitle>
                    <div className="text-center">
                      <span className="text-3xl font-bold text-gold-500">{plan.price}</span>
                      {plan.price !== 'تماس' && <span className="text-white/70"> تومان/ماه</span>}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {plan.features.map((feature, idx) => (
                        <li key={idx} className="flex items-center gap-2">
                          <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                          {feature}
                        </li>
                      ))}
                    </ul>
                    <Button className="w-full mt-6" variant={index === 1 ? "default" : "outline"}>
                      {plan.price === 'تماس' ? 'تماس با فروش' : 'شروع رایگان'}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default GymManagement;