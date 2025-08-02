import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { 
  Brain, 
  MessageSquare, 
  Target, 
  TrendingUp, 
  Zap,
  Send,
  User,
  Bot,
  Clock,
  Award,
  Calculator,
  Calendar
} from 'lucide-react';

const AICoach = () => {
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const features = [
    {
      icon: Brain,
      title: 'تحلیل هوشمند',
      description: 'تحلیل وضعیت جسمانی و ارائه بهترین راهکارها'
    },
    {
      icon: Target,
      title: 'هدف‌گذاری دقیق',
      description: 'تعیین اهداف واقع‌بینانه و قابل دستیابی'
    },
    {
      icon: TrendingUp,
      title: 'پیگیری پیشرفت',
      description: 'نظارت مستمر بر روند پیشرفت و تنظیم برنامه‌ها'
    },
    {
      icon: Zap,
      title: 'پاسخ فوری',
      description: 'دریافت پاسخ‌های سریع و دقیق در هر زمان'
    }
  ];

  const chatHistory = [
    {
      type: 'user',
      message: 'سلام، می‌خواهم برنامه‌ای برای کاهش وزن داشته باشم',
      time: '14:30'
    },
    {
      type: 'ai',
      message: 'سلام! خوشحالم که می‌خواهید سفر کاهش وزن خود را شروع کنید. برای ارائه بهترین برنامه، لطفاً اطلاعات زیر را با من به اشتراک بگذارید:\n\n• وزن و قد فعلی\n• سن و جنسیت\n• وزن هدف\n• سطح فعالیت روزانه\n• محدودیت‌های غذایی یا پزشکی',
      time: '14:31'
    },
    {
      type: 'user',
      message: 'وزنم 85 کیلو، قدم 175 سانتی‌متر، 28 ساله مرد هستم. می‌خواهم به 75 کیلو برسم. فعالیت متوسط دارم',
      time: '14:35'
    },
    {
      type: 'ai',
      message: 'بر اساس اطلاعات شما:\n\n📊 BMI فعلی: 27.8 (اضافه وزن)\n🎯 BMI هدف: 24.5 (طبیعی)\n⏱️ زمان پیشنهادی: 10-12 هفته\n🔥 کالری روزانه: 2000-2200 کالری\n\n✅ برنامه پیشنهادی:\n• 4 جلسه تمرین هفتگی (ترکیب کارتدیو و قدرت)\n• رژیم غذایی متعادل با کسری کالری 500\n• 8 لیوان آب روزانه\n• خواب 7-8 ساعته\n\nآیا مایلید جزئیات بیشتری ارائه دهم؟',
      time: '14:36'
    }
  ];

  const quickQuestions = [
    'چطور می‌تونم عضله‌سازی کنم؟',
    'برنامه غذایی برای افزایش وزن',
    'بهترین تمرین برای شکم',
    'چطور انگیزه‌ام رو حفظ کنم؟'
  ];

  const aiStats = [
    { label: 'مشاوره انجام شده', value: '25,000+', icon: MessageSquare },
    { label: 'برنامه شخصی‌سازی شده', value: '12,500+', icon: Target },
    { label: 'نرخ موفقیت', value: '94%', icon: Award },
    { label: 'پاسخ‌گویی', value: '< 5 ثانیه', icon: Clock },
  ];

  const handleSendMessage = () => {
    if (!message.trim()) return;
    setIsLoading(true);
    // Simulate AI response
    setTimeout(() => {
      setIsLoading(false);
      setMessage('');
    }, 2000);
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
                  <Brain className="h-16 w-16 text-primary" />
                </div>
              </div>
              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                <span className="text-gradient">مربی هوشمند AI</span>
              </h1>
              <p className="text-xl text-white/80 max-w-3xl mx-auto">
                مربی شخصی هوش مصنوعی شما، آماده ارائه مشاوره تخصصی 24 ساعته
              </p>
            </div>

            {/* AI Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
              {aiStats.map((stat, index) => (
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
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Chat Interface */}
            <div className="lg:col-span-2">
              <Card className="bg-gray-900/80 border-white/10 h-[600px] flex flex-col">
                <CardHeader className="border-b border-white/10">
                  <CardTitle className="flex items-center gap-3">
                    <div className="p-2 bg-primary/20 rounded-lg">
                      <Bot className="h-6 w-6 text-primary" />
                    </div>
                    مربی AI لیفت لجندز
                    <Badge className="bg-green-500/20 text-green-400 mr-auto">آنلاین</Badge>
                  </CardTitle>
                </CardHeader>
                
                <CardContent className="flex-1 p-0 overflow-hidden">
                  {/* Chat Messages */}
                  <div className="h-full flex flex-col">
                    <div className="flex-1 overflow-y-auto p-6 space-y-4">
                      {chatHistory.map((chat, index) => (
                        <div key={index} className={`flex ${chat.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                          <div className={`flex gap-3 max-w-[80%] ${chat.type === 'user' ? 'flex-row-reverse' : ''}`}>
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                              chat.type === 'user' ? 'bg-primary' : 'bg-gray-700'
                            }`}>
                              {chat.type === 'user' ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                            </div>
                            <div className={`p-4 rounded-2xl ${
                              chat.type === 'user' 
                                ? 'bg-primary text-white' 
                                : 'bg-gray-800 text-white'
                            }`}>
                              <p className="whitespace-pre-line">{chat.message}</p>
                              <p className="text-xs opacity-70 mt-2">{chat.time}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                      
                      {isLoading && (
                        <div className="flex justify-start">
                          <div className="flex gap-3 max-w-[80%]">
                            <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center">
                              <Bot className="h-4 w-4" />
                            </div>
                            <div className="p-4 rounded-2xl bg-gray-800">
                              <div className="flex space-x-1">
                                <div className="w-2 h-2 bg-white/50 rounded-full animate-bounce"></div>
                                <div className="w-2 h-2 bg-white/50 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                                <div className="w-2 h-2 bg-white/50 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                    
                    {/* Quick Questions */}
                    <div className="p-4 border-t border-white/10">
                      <div className="flex flex-wrap gap-2 mb-4">
                        {quickQuestions.map((question, index) => (
                          <Button
                            key={index}
                            variant="outline"
                            size="sm"
                            onClick={() => setMessage(question)}
                            className="text-xs"
                          >
                            {question}
                          </Button>
                        ))}
                      </div>
                      
                      {/* Message Input */}
                      <div className="flex gap-2">
                        <Input
                          value={message}
                          onChange={(e) => setMessage(e.target.value)}
                          placeholder="پیام خود را تایپ کنید..."
                          onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                          className="flex-1"
                        />
                        <Button 
                          onClick={handleSendMessage}
                          disabled={isLoading || !message.trim()}
                          size="icon"
                        >
                          <Send className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Side Panel */}
            <div className="space-y-6">
              {/* Features */}
              <Card className="bg-gray-900/80 border-white/10">
                <CardHeader>
                  <CardTitle>قابلیت‌های مربی AI</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {features.map((feature, index) => (
                    <div key={index} className="flex gap-3">
                      <div className="p-2 bg-primary/20 rounded-lg flex-shrink-0">
                        <feature.icon className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-semibold mb-1">{feature.title}</h4>
                        <p className="text-white/70 text-sm">{feature.description}</p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Quick Tools */}
              <Card className="bg-gray-900/80 border-white/10">
                <CardHeader>
                  <CardTitle>ابزارهای سریع</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button variant="outline" className="w-full justify-start">
                    <Calculator className="h-4 w-4 ml-2" />
                    محاسبه BMI
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Target className="h-4 w-4 ml-2" />
                    تعیین هدف کالری
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Calendar className="h-4 w-4 ml-2" />
                    برنامه‌ریزی تمرین
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <TrendingUp className="h-4 w-4 ml-2" />
                    تحلیل پیشرفت
                  </Button>
                </CardContent>
              </Card>

              {/* Subscription */}
              <Card className="bg-gradient-to-br from-primary/20 to-gold-500/20 border-primary/30">
                <CardContent className="p-6 text-center">
                  <Brain className="h-12 w-12 text-primary mx-auto mb-4" />
                  <h3 className="font-bold text-lg mb-2">نسخه پریمیوم</h3>
                  <p className="text-white/80 text-sm mb-4">
                    دسترسی نامحدود به مربی AI و ویژگی‌های پیشرفته
                  </p>
                  <Button className="w-full">ارتقا حساب</Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AICoach;