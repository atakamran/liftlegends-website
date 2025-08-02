import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { 
  Target, 
  Calendar, 
  TrendingUp, 
  Award, 
  Clock, 
  Scale,
  Activity,
  Heart,
  Trophy,
  User,
  Apple,
  Dumbbell,
  Star
} from 'lucide-react';

const AthletePanel = () => {
  const [activeTab, setActiveTab] = useState('dashboard');

  const athleteStats = [
    { label: 'وزن فعلی', value: '75 کیلو', target: '72 کیلو', icon: Scale, color: 'text-blue-500' },
    { label: 'درصد چربی', value: '12%', target: '10%', icon: Activity, color: 'text-green-500' },
    { label: 'ضربان قلب', value: '65 bpm', target: '60 bpm', icon: Heart, color: 'text-red-500' },
    { label: 'روزهای فعالیت', value: '125', target: '150', icon: Trophy, color: 'text-yellow-500' },
  ];

  const weeklySchedule = [
    { day: 'شنبه', exercise: 'سینه و سه‌سر', time: '18:00', duration: '90 دقیقه', status: 'completed' },
    { day: 'یکشنبه', exercise: 'پشت و دوسر', time: '18:00', duration: '90 دقیقه', status: 'completed' },
    { day: 'دوشنبه', exercise: 'پا', time: '18:00', duration: '120 دقیقه', status: 'today' },
    { day: 'سه‌شنبه', exercise: 'شانه', time: '18:00', duration: '75 دقیقه', status: 'upcoming' },
    { day: 'چهارشنبه', exercise: 'استراحت', time: '-', duration: '-', status: 'rest' },
    { day: 'پنج‌شنبه', exercise: 'کارتدیو', time: '19:00', duration: '45 دقیقه', status: 'upcoming' },
    { day: 'جمعه', exercise: 'استراحت', time: '-', duration: '-', status: 'rest' },
  ];

  const nutritionPlan = [
    { meal: 'صبحانه', calories: '450', protein: '25g', carbs: '45g', fat: '18g', time: '07:00' },
    { meal: 'میان‌وعده صبح', calories: '200', protein: '20g', carbs: '15g', fat: '8g', time: '10:00' },
    { meal: 'نهار', calories: '600', protein: '40g', carbs: '60g', fat: '22g', time: '13:00' },
    { meal: 'میان‌وعده عصر', calories: '300', protein: '25g', carbs: '20g', fat: '12g', time: '16:00' },
    { meal: 'شام', calories: '550', protein: '35g', carbs: '40g', fat: '25g', time: '20:00' },
  ];

  const achievements = [
    { title: 'اولین ماه', description: '30 روز متوالی تمرین', icon: '🏆', date: '1403/09/15' },
    { title: 'کاهش وزن', description: '5 کیلو کاهش وزن', icon: '📉', date: '1403/10/20' },
    { title: 'قدرت بیشتر', description: 'افزایش 20% در قدرت', icon: '💪', date: '1403/11/10' },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-500/20 text-green-400">انجام شده</Badge>;
      case 'today':
        return <Badge className="bg-primary/20 text-primary">امروز</Badge>;
      case 'upcoming':
        return <Badge className="bg-gray-500/20 text-gray-400">آینده</Badge>;
      case 'rest':
        return <Badge className="bg-orange-500/20 text-orange-400">استراحت</Badge>;
      default:
        return null;
    }
  };

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
                  <AvatarImage src="/placeholder-athlete.jpg" />
                  <AvatarFallback>ورزشکار</AvatarFallback>
                </Avatar>
                <div>
                  <h1 className="text-3xl font-bold text-gradient">پنل ورزشکار</h1>
                  <p className="text-white/70">خوش آمدید، علی محمدی</p>
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gold-500">روز 125</div>
                <div className="text-white/70 text-sm">از مسیر تناسب اندام</div>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 pb-20">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-5 bg-gray-800/50">
              <TabsTrigger value="dashboard">داشبورد</TabsTrigger>
              <TabsTrigger value="workout">تمرینات</TabsTrigger>
              <TabsTrigger value="nutrition">تغذیه</TabsTrigger>
              <TabsTrigger value="progress">پیشرفت</TabsTrigger>
              <TabsTrigger value="trainer">مربی من</TabsTrigger>
            </TabsList>

            <TabsContent value="dashboard" className="space-y-6 mt-6">
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {athleteStats.map((stat, index) => (
                  <Card key={index} className="bg-gray-900/80 border-white/10">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <p className="text-white/70 text-sm">{stat.label}</p>
                          <p className="text-2xl font-bold text-gold-500">{stat.value}</p>
                        </div>
                        <stat.icon className={`h-8 w-8 ${stat.color}`} />
                      </div>
                      <div className="text-xs text-white/60">هدف: {stat.target}</div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Today's Goal */}
                <Card className="bg-gray-900/80 border-white/10">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Target className="h-5 w-5" />
                      هدف امروز
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <Dumbbell className="h-8 w-8 text-primary" />
                          <div>
                            <h3 className="font-semibold">تمرین پا</h3>
                            <p className="text-white/70 text-sm">120 دقیقه • 18:00</p>
                          </div>
                        </div>
                        <Button size="sm">شروع تمرین</Button>
                      </div>
                      
                      <div className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <Apple className="h-8 w-8 text-green-500" />
                          <div>
                            <h3 className="font-semibold">کالری امروز</h3>
                            <p className="text-white/70 text-sm">1,850 / 2,100 کالری</p>
                          </div>
                        </div>
                        <div className="text-left">
                          <div className="text-green-500 font-semibold">88%</div>
                          <Progress value={88} className="w-16 h-2" />
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <Activity className="h-8 w-8 text-blue-500" />
                          <div>
                            <h3 className="font-semibold">قدم‌های امروز</h3>
                            <p className="text-white/70 text-sm">8,500 / 10,000 قدم</p>
                          </div>
                        </div>
                        <div className="text-left">
                          <div className="text-blue-500 font-semibold">85%</div>
                          <Progress value={85} className="w-16 h-2" />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Recent Achievements */}
                <Card className="bg-gray-900/80 border-white/10">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Award className="h-5 w-5" />
                      دستاوردهای اخیر
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {achievements.map((achievement, index) => (
                        <div key={index} className="flex items-center gap-4 p-4 bg-gray-800/50 rounded-lg">
                          <div className="text-2xl">{achievement.icon}</div>
                          <div className="flex-1">
                            <h3 className="font-semibold">{achievement.title}</h3>
                            <p className="text-white/70 text-sm">{achievement.description}</p>
                            <p className="text-gold-500 text-xs mt-1">{achievement.date}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="workout" className="space-y-6 mt-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">برنامه تمرینی هفته</h2>
                <Button variant="outline">دانلود برنامه</Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {weeklySchedule.map((day, index) => (
                  <Card 
                    key={index} 
                    className={`bg-gray-900/80 border-white/10 ${
                      day.status === 'today' ? 'ring-2 ring-primary' : ''
                    }`}
                  >
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <h3 className="font-bold text-lg">{day.day}</h3>
                        {getStatusBadge(day.status)}
                      </div>
                      <div className="space-y-2">
                        <p className="font-medium">{day.exercise}</p>
                        {day.time !== '-' && (
                          <>
                            <p className="text-white/70 text-sm flex items-center gap-2">
                              <Clock className="h-4 w-4" />
                              {day.time}
                            </p>
                            <p className="text-white/70 text-sm">مدت: {day.duration}</p>
                          </>
                        )}
                      </div>
                      {day.status === 'today' && (
                        <Button className="w-full mt-4">شروع تمرین</Button>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="nutrition" className="space-y-6 mt-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">برنامه تغذیه امروز</h2>
                <div className="text-center">
                  <div className="text-lg font-bold text-gold-500">2,100 کالری</div>
                  <div className="text-white/70 text-sm">هدف روزانه</div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {nutritionPlan.map((meal, index) => (
                  <Card key={index} className="bg-gray-900/80 border-white/10">
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <h3 className="font-bold text-lg">{meal.meal}</h3>
                        <span className="text-gold-500 font-semibold">{meal.time}</span>
                      </div>
                      <div className="space-y-3">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-primary">{meal.calories}</div>
                          <div className="text-white/70 text-sm">کالری</div>
                        </div>
                        <div className="grid grid-cols-3 gap-2 text-center text-sm">
                          <div>
                            <div className="font-semibold text-blue-400">{meal.protein}</div>
                            <div className="text-white/70">پروتئین</div>
                          </div>
                          <div>
                            <div className="font-semibold text-green-400">{meal.carbs}</div>
                            <div className="text-white/70">کربوهیدرات</div>
                          </div>
                          <div>
                            <div className="font-semibold text-yellow-400">{meal.fat}</div>
                            <div className="text-white/70">چربی</div>
                          </div>
                        </div>
                      </div>
                      <Button variant="outline" className="w-full mt-4">
                        مشاهده جزئیات
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="progress" className="space-y-6 mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="bg-gray-900/80 border-white/10">
                  <CardHeader>
                    <CardTitle>تغییرات وزن</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span>وزن شروع:</span>
                        <span className="font-bold">95 کیلو</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>وزن فعلی:</span>
                        <span className="font-bold text-gold-500">75 کیلو</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>هدف:</span>
                        <span className="font-bold text-green-500">72 کیلو</span>
                      </div>
                      <Progress value={87} className="w-full" />
                      <div className="text-center text-sm text-white/70">
                        20 کیلو کاهش وزن (87% پیشرفت)
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gray-900/80 border-white/10">
                  <CardHeader>
                    <CardTitle>آمار عملکرد</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span>جلسات تمرین:</span>
                        <span className="font-bold text-blue-500">125 جلسه</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>کالری سوزانده شده:</span>
                        <span className="font-bold text-red-500">185,000</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>میانگین ضربان قلب:</span>
                        <span className="font-bold text-green-500">145 bpm</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>درصد چربی:</span>
                        <span className="font-bold text-yellow-500">12%</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="trainer" className="space-y-6 mt-6">
              <Card className="bg-gray-900/80 border-white/10">
                <CardContent className="p-6">
                  <div className="flex items-center gap-6">
                    <Avatar className="h-20 w-20">
                      <AvatarImage src="/placeholder-trainer.jpg" />
                      <AvatarFallback>مربی</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold mb-2">محمد رضایی</h3>
                      <p className="text-white/70 mb-4">مربی تناسب اندام و تغذیه • 8 سال تجربه</p>
                      <div className="flex gap-4">
                        <Button>پیام به مربی</Button>
                        <Button variant="outline">رزرو جلسه</Button>
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center gap-1 mb-2">
                        <Star className="h-4 w-4 text-yellow-500 fill-current" />
                        <span className="font-bold">4.9</span>
                      </div>
                      <div className="text-white/70 text-sm">امتیاز مربی</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="bg-gray-900/80 border-white/10">
                  <CardHeader>
                    <CardTitle>برنامه‌های فعال</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="p-3 bg-gray-800/50 rounded-lg">
                        <h4 className="font-semibold">برنامه کاهش وزن</h4>
                        <p className="text-white/70 text-sm">شروع: 1403/08/01</p>
                      </div>
                      <div className="p-3 bg-gray-800/50 rounded-lg">
                        <h4 className="font-semibold">برنامه تغذیه شخصی</h4>
                        <p className="text-white/70 text-sm">شروع: 1403/08/15</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gray-900/80 border-white/10">
                  <CardHeader>
                    <CardTitle>جلسات آینده</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center p-3 bg-gray-800/50 rounded-lg">
                        <div>
                          <h4 className="font-semibold">مشاوره تغذیه</h4>
                          <p className="text-white/70 text-sm">فردا 16:00</p>
                        </div>
                        <Badge>تایید شده</Badge>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-gray-800/50 rounded-lg">
                        <div>
                          <h4 className="font-semibold">بررسی پیشرفت</h4>
                          <p className="text-white/70 text-sm">هفته آینده</p>
                        </div>
                        <Badge variant="secondary">برنامه‌ریزی</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </Layout>
  );
};

export default AthletePanel;