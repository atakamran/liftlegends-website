import React from 'react';
import { useParams } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  MapPin, 
  Phone, 
  Clock, 
  Star, 
  Users, 
  Dumbbell,
  Calendar,
  CreditCard,
  CheckCircle
} from 'lucide-react';

const GymDetail = () => {
  const { id } = useParams();

  // Mock data for a specific gym
  const gym = {
    id: 1,
    name: 'باشگاه قهرمان',
    description: 'باشگاه بدنسازی مدرن با تجهیزات کامل و مربیان حرفه‌ای',
    address: 'تبریز، خیابان ولیعصر، پلاک 123',
    phone: '041-33445566',
    rating: 4.8,
    reviews: 156,
    members: 245,
    facilities: ['تجهیزات کاردیو', 'وزنه آزاد', 'سالن گروهی', 'سونا', 'پارکینگ'],
    workingHours: {
      weekdays: '6:00 - 23:00',
      weekends: '8:00 - 22:00'
    },
    membershipPlans: [
      { name: 'ماهانه', price: 2500000, duration: '1 ماه' },
      { name: 'سه ماهه', price: 6500000, duration: '3 ماه', discount: 13 },
      { name: 'سالانه', price: 20000000, duration: '12 ماه', discount: 33 }
    ],
    trainers: [
      { name: 'علی احمدی', specialty: 'بدنسازی', experience: '5 سال' },
      { name: 'سارا کریمی', specialty: 'فیتنس', experience: '3 سال' }
    ]
  };

  const formatPrice = (price: number) => {
    return price.toLocaleString('fa-IR') + ' تومان';
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black text-white">
        <div className="relative pt-20 pb-16">
          <div className="max-w-7xl mx-auto px-4">
            {/* Header */}
            <div className="mb-12">
              <div className="flex flex-col md:flex-row justify-between items-start gap-6">
                <div>
                  <h1 className="text-4xl md:text-5xl font-bold mb-4">
                    <span className="text-gradient">{gym.name}</span>
                  </h1>
                  <p className="text-xl text-white/80 mb-6 max-w-2xl">
                    {gym.description}
                  </p>
                  
                  <div className="flex flex-wrap gap-4 mb-6">
                    <div className="flex items-center gap-2 bg-gray-800/50 px-4 py-2 rounded-lg">
                      <Star className="h-5 w-5 text-yellow-500 fill-current" />
                      <span className="font-semibold">{gym.rating}</span>
                      <span className="text-white/70">({gym.reviews} نظر)</span>
                    </div>
                    <div className="flex items-center gap-2 bg-gray-800/50 px-4 py-2 rounded-lg">
                      <Users className="h-5 w-5 text-primary" />
                      <span>{gym.members} عضو فعال</span>
                    </div>
                  </div>
                </div>
                
                <Button size="lg" className="bg-gradient-to-r from-primary to-gold-500">
                  <CreditCard className="h-5 w-5 ml-2" />
                  خرید اشتراک
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main Content */}
              <div className="lg:col-span-2 space-y-8">
                {/* Contact Info */}
                <Card className="bg-gray-900/80 border-white/10">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MapPin className="h-5 w-5 text-primary" />
                      اطلاعات تماس
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center gap-3">
                      <MapPin className="h-5 w-5 text-white/70" />
                      <span>{gym.address}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Phone className="h-5 w-5 text-white/70" />
                      <span>{gym.phone}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Clock className="h-5 w-5 text-white/70" />
                      <div>
                        <div>روزهای هفته: {gym.workingHours.weekdays}</div>
                        <div>آخر هفته: {gym.workingHours.weekends}</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Facilities */}
                <Card className="bg-gray-900/80 border-white/10">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Dumbbell className="h-5 w-5 text-primary" />
                      امکانات
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {gym.facilities.map((facility, index) => (
                        <div key={index} className="flex items-center gap-2 bg-gray-800/50 px-3 py-2 rounded-lg">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span className="text-sm">{facility}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Trainers */}
                <Card className="bg-gray-900/80 border-white/10">
                  <CardHeader>
                    <CardTitle>مربیان</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {gym.trainers.map((trainer, index) => (
                        <div key={index} className="bg-gray-800/50 p-4 rounded-lg">
                          <h4 className="font-semibold mb-2">{trainer.name}</h4>
                          <p className="text-white/70 text-sm">تخصص: {trainer.specialty}</p>
                          <p className="text-white/70 text-sm">سابقه: {trainer.experience}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Membership Plans */}
                <Card className="bg-gray-900/80 border-white/10">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Calendar className="h-5 w-5 text-primary" />
                      پلان‌های عضویت
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {gym.membershipPlans.map((plan, index) => (
                      <div key={index} className="border border-white/10 rounded-lg p-4 hover:border-primary/50 transition-colors">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-semibold">{plan.name}</h4>
                          {plan.discount && (
                            <Badge variant="destructive" className="text-xs">
                              {plan.discount}% تخفیف
                            </Badge>
                          )}
                        </div>
                        <p className="text-white/70 text-sm mb-3">{plan.duration}</p>
                        <div className="flex items-center justify-between">
                          <span className="text-xl font-bold text-primary">
                            {formatPrice(plan.price)}
                          </span>
                          <Button size="sm">انتخاب</Button>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                {/* Quick Stats */}
                <Card className="bg-gray-900/80 border-white/10">
                  <CardHeader>
                    <CardTitle>آمار سریع</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-white/70">تعداد اعضا:</span>
                      <span className="font-semibold">{gym.members}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/70">امتیاز:</span>
                      <span className="font-semibold">{gym.rating}/5</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/70">نظرات:</span>
                      <span className="font-semibold">{gym.reviews}</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default GymDetail;