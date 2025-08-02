import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Users, 
  DollarSign, 
  Calendar, 
  Star, 
  Plus, 
  FileText, 
  TrendingUp,
  MessageSquare,
  Award,
  Clock
} from 'lucide-react';

const TrainerPanel = () => {
  const [activeTab, setActiveTab] = useState('dashboard');

  const trainerStats = [
    { label: 'کل مشتریان', value: '45', icon: Users, color: 'text-blue-500' },
    { label: 'درآمد ماهانه', value: '45,000,000 تومان', icon: DollarSign, color: 'text-green-500' },
    { label: 'جلسات هفته', value: '28', icon: Calendar, color: 'text-purple-500' },
    { label: 'امتیاز مشتریان', value: '4.9/5', icon: Star, color: 'text-yellow-500' },
  ];

  const todayClients = [
    { name: 'علی محمدی', time: '08:00', type: 'تمرین قدرت', status: 'confirmed' },
    { name: 'مریم احمدی', time: '10:30', type: 'برنامه غذایی', status: 'pending' },
    { name: 'حسن رضایی', time: '16:00', type: 'کارتدیو', status: 'confirmed' },
  ];

  const clientProgress = [
    { name: 'علی محمدی', progress: 85, goal: 'کاهش وزن', startWeight: '95 کیلو', currentWeight: '78 کیلو' },
    { name: 'سارا کریمی', progress: 70, goal: 'افزایش عضله', startWeight: '55 کیلو', currentWeight: '62 کیلو' },
    { name: 'محمد نوری', progress: 90, goal: 'آمادگی جسمانی', startWeight: '80 کیلو', currentWeight: '75 کیلو' },
  ];

  const recentEarnings = [
    { client: 'علی محمدی', amount: '2,500,000 تومان', date: '1403/11/15', type: 'برنامه ماهانه' },
    { client: 'مریم احمدی', amount: '1,800,000 تومان', date: '1403/11/14', type: 'مشاوره تغذیه' },
    { client: 'حسن رضایی', amount: '3,000,000 تومان', date: '1403/11/13', type: 'پکیج کامل' },
  ];

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black text-white">
        {/* Header */}
        <div className="relative pt-20 pb-8">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-gold-500/20 opacity-30"></div>
          <div className="relative max-w-7xl mx-auto px-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src="/placeholder-trainer.jpg" />
                  <AvatarFallback>مربی</AvatarFallback>
                </Avatar>
                <div>
                  <h1 className="text-3xl font-bold text-gradient">پنل مربی</h1>
                  <p className="text-white/70">خوش آمدید، محمد رضایی</p>
                </div>
              </div>
              <Badge className="bg-green-500/20 text-green-400 border-green-500/50">
                آنلاین
              </Badge>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 pb-20">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-5 bg-gray-800/50">
              <TabsTrigger value="dashboard">داشبورد</TabsTrigger>
              <TabsTrigger value="clients">مشتریان</TabsTrigger>
              <TabsTrigger value="programs">برنامه‌ها</TabsTrigger>
              <TabsTrigger value="earnings">درآمد</TabsTrigger>
              <TabsTrigger value="profile">پروفایل</TabsTrigger>
            </TabsList>

            <TabsContent value="dashboard" className="space-y-6 mt-6">
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {trainerStats.map((stat, index) => (
                  <Card key={index} className="bg-gray-900/80 border-white/10">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-white/70 text-sm">{stat.label}</p>
                          <p className="text-2xl font-bold text-gold-500">{stat.value}</p>
                        </div>
                        <stat.icon className={`h-8 w-8 ${stat.color}`} />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Today's Schedule */}
                <Card className="bg-gray-900/80 border-white/10">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Clock className="h-5 w-5" />
                      برنامه امروز
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {todayClients.map((client, index) => (
                        <div key={index} className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg">
                          <div className="flex items-center gap-3">
                            <Avatar className="h-10 w-10">
                              <AvatarFallback>{client.name.split(' ')[0][0]}</AvatarFallback>
                            </Avatar>
                            <div>
                              <h3 className="font-semibold">{client.name}</h3>
                              <p className="text-white/70 text-sm">{client.type}</p>
                            </div>
                          </div>
                          <div className="text-left">
                            <p className="text-gold-500 font-semibold">{client.time}</p>
                            <Badge 
                              variant={client.status === 'confirmed' ? 'default' : 'secondary'}
                              className="text-xs"
                            >
                              {client.status === 'confirmed' ? 'تایید شده' : 'در انتظار'}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Client Progress */}
                <Card className="bg-gray-900/80 border-white/10">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="h-5 w-5" />
                      پیشرفت مشتریان
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {clientProgress.map((client, index) => (
                        <div key={index} className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="font-medium">{client.name}</span>
                            <span className="text-gold-500">{client.progress}%</span>
                          </div>
                          <div className="w-full bg-gray-700 rounded-full h-2">
                            <div 
                              className="bg-gradient-to-r from-primary to-gold-500 h-2 rounded-full transition-all duration-300"
                              style={{ width: `${client.progress}%` }}
                            ></div>
                          </div>
                          <div className="flex justify-between text-sm text-white/70">
                            <span>{client.goal}</span>
                            <span>{client.startWeight} → {client.currentWeight}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Quick Actions */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {[
                  { icon: Plus, label: 'مشتری جدید', color: 'bg-blue-500/20 text-blue-400' },
                  { icon: FileText, label: 'برنامه جدید', color: 'bg-green-500/20 text-green-400' },
                  { icon: MessageSquare, label: 'پیام‌ها', color: 'bg-purple-500/20 text-purple-400' },
                  { icon: Award, label: 'گواهینامه‌ها', color: 'bg-yellow-500/20 text-yellow-400' },
                ].map((action, index) => (
                  <Card key={index} className="bg-gray-900/80 border-white/10 hover:border-primary/50 transition-all cursor-pointer">
                    <CardContent className="p-6 text-center">
                      <action.icon className={`h-8 w-8 mx-auto mb-3 ${action.color.split(' ')[1]}`} />
                      <p className="font-medium">{action.label}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="clients" className="space-y-6 mt-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">لیست مشتریان</h2>
                <Button className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  مشتری جدید
                </Button>
              </div>
              
              <Card className="bg-gray-900/80 border-white/10">
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="border-b border-white/10">
                        <tr>
                          <th className="text-right p-4">نام</th>
                          <th className="text-right p-4">هدف</th>
                          <th className="text-right p-4">پیشرفت</th>
                          <th className="text-right p-4">آخرین جلسه</th>
                          <th className="text-right p-4">وضعیت</th>
                        </tr>
                      </thead>
                      <tbody>
                        {clientProgress.map((client, index) => (
                          <tr key={index} className="border-b border-white/5 hover:bg-gray-800/30">
                            <td className="p-4">
                              <div className="flex items-center gap-3">
                                <Avatar className="h-8 w-8">
                                  <AvatarFallback>{client.name.split(' ')[0][0]}</AvatarFallback>
                                </Avatar>
                                {client.name}
                              </div>
                            </td>
                            <td className="p-4">{client.goal}</td>
                            <td className="p-4">
                              <div className="flex items-center gap-2">
                                <div className="w-16 bg-gray-700 rounded-full h-2">
                                  <div 
                                    className="bg-gradient-to-r from-primary to-gold-500 h-2 rounded-full"
                                    style={{ width: `${client.progress}%` }}
                                  ></div>
                                </div>
                                <span className="text-sm">{client.progress}%</span>
                              </div>
                            </td>
                            <td className="p-4 text-white/70">2 روز پیش</td>
                            <td className="p-4">
                              <Badge className="bg-green-500/20 text-green-400">فعال</Badge>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="earnings" className="space-y-6 mt-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="bg-gray-900/80 border-white/10">
                  <CardContent className="p-6 text-center">
                    <h3 className="text-2xl font-bold text-green-500">45,000,000</h3>
                    <p className="text-white/70">درآمد این ماه</p>
                  </CardContent>
                </Card>
                <Card className="bg-gray-900/80 border-white/10">
                  <CardContent className="p-6 text-center">
                    <h3 className="text-2xl font-bold text-blue-500">380,000,000</h3>
                    <p className="text-white/70">کل درآمد</p>
                  </CardContent>
                </Card>
                <Card className="bg-gray-900/80 border-white/10">
                  <CardContent className="p-6 text-center">
                    <h3 className="text-2xl font-bold text-purple-500">28</h3>
                    <p className="text-white/70">مشتری فعال</p>
                  </CardContent>
                </Card>
              </div>

              <Card className="bg-gray-900/80 border-white/10">
                <CardHeader>
                  <CardTitle>آخرین درآمدها</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentEarnings.map((earning, index) => (
                      <div key={index} className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg">
                        <div>
                          <h3 className="font-semibold">{earning.client}</h3>
                          <p className="text-white/70 text-sm">{earning.type}</p>
                        </div>
                        <div className="text-left">
                          <p className="text-green-500 font-semibold">{earning.amount}</p>
                          <p className="text-white/70 text-sm">{earning.date}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="programs" className="space-y-6 mt-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">برنامه‌های من</h2>
                <Button className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  برنامه جدید
                </Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                  { name: 'برنامه کاهش وزن', clients: 12, price: '2,500,000 تومان' },
                  { name: 'برنامه افزایش عضله', clients: 8, price: '3,000,000 تومان' },
                  { name: 'برنامه آمادگی عمومی', clients: 15, price: '2,000,000 تومان' },
                ].map((program, index) => (
                  <Card key={index} className="bg-gray-900/80 border-white/10">
                    <CardContent className="p-6">
                      <h3 className="font-bold text-lg mb-2">{program.name}</h3>
                      <div className="space-y-2 text-sm text-white/70">
                        <p>تعداد مشتریان: {program.clients}</p>
                        <p>قیمت: {program.price}</p>
                      </div>
                      <Button className="w-full mt-4" variant="outline">
                        ویرایش برنامه
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="profile" className="space-y-6 mt-6">
              <Card className="bg-gray-900/80 border-white/10">
                <CardHeader>
                  <CardTitle>اطلاعات پروفایل</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">نام و نام خانوادگی</label>
                      <Input placeholder="محمد رضایی" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">تخصص</label>
                      <Input placeholder="مربی بدنسازی و تغذیه" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">تجربه</label>
                      <Input placeholder="5 سال" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">شماره تماس</label>
                      <Input placeholder="09123456789" />
                    </div>
                  </div>
                  <Button className="w-full">ذخیره تغییرات</Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </Layout>
  );
};

export default TrainerPanel;