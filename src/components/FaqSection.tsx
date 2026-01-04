import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { HelpCircle, Download, MessageCircle, Dumbbell, Utensils, Shield, Brain, Calendar, User } from "lucide-react";
import { useState } from "react";

const faqs = [
  {
    category: "general",
    question: "Is Lift Legends free to use?",
    answer: "Yes, Lift Legends offers a free tier with core features including general workout programs. For advanced features like personalized nutrition plans and AI coaching, premium subscriptions are available."
  },
  {
    category: "ai",
    question: "How do I connect with the AI coach?",
    answer: "After subscribing to the Ultimate plan, you'll find the 'AI Coach' option in your profile. Simply tap it to ask questions and get personalized guidance. Our AI coach is available 24/7 to answer your fitness questions."
  },
  {
    category: "training",
    question: "How does the AI training program work?",
    answer: "Our AI analyzes your profile data—age, weight, height, experience level, goals, and physical limitations—to create a fully personalized training program. It includes appropriate exercises, sets, reps, and rest periods, and adapts as you progress."
  },
  {
    category: "training",
    question: "Can I customize my training programs?",
    answer: "Absolutely. With Pro and Ultimate subscriptions, training programs are fully customized based on your goals, experience level, available equipment, and physical limitations. Our AI designs the optimal program for your specific situation."
  },
  {
    category: "diet",
    question: "How do I get a nutrition plan?",
    answer: "With a Pro or Ultimate subscription, complete your body profile and answer questions about your dietary preferences. You'll receive a personalized meal plan including daily meals, calories, protein, carbs, and fats—plus supplement recommendations."
  },
  {
    category: "supplement",
    question: "What's included in the supplement and PED guide?",
    answer: "The supplement and PED section provides expert guidance on various supplements and performance enhancers tailored to your physique goals. This includes dosage recommendations, timing protocols, cycle planning, and safety information including potential side effects."
  },
  {
    category: "general",
    question: "Can I cancel my subscription anytime?",
    answer: "Yes, you can cancel anytime from your account settings. You'll retain access to premium features until the end of your billing period. No cancellation fees apply."
  },
  {
    category: "general",
    question: "Is Lift Legends suitable for beginners?",
    answer: "Absolutely! The platform is designed for all fitness levels—from complete beginners to advanced athletes. Beginners get detailed video tutorials and safety tips for every exercise, plus programs with appropriate intensity and gradual progression."
  },
  {
    category: "app",
    question: "Can I track my progress?",
    answer: "Yes, Lift Legends includes comprehensive progress tracking. Log your weight, body measurements, personal records, and before/after photos. Interactive charts visualize your transformation over time."
  },
  {
    category: "app",
    question: "Does the app work offline?",
    answer: "Yes, core features like viewing your training and nutrition programs, logging workouts, and watching tutorials work offline. However, you'll need internet connectivity for new programs and AI coach features."
  },
  {
    category: "ai",
    question: "How does AI improve my training?",
    answer: "Our AI analyzes your workout data, progress patterns, and logged records to identify strengths and weaknesses. It then adjusts your program to focus on weak points while preventing injury, and intelligently scales intensity based on your progress."
  },
  {
    category: "supplement",
    question: "Is the steroid guidance legal?",
    answer: "Lift Legends provides educational and scientific information about supplements and performance enhancers. Usage is the user's responsibility and must comply with local laws. We always recommend consulting with a healthcare professional before using any supplements or PEDs."
  }
];

const faqCategories = [
  { id: "all", name: "All", icon: <HelpCircle size={18} /> },
  { id: "training", name: "Training", icon: <Dumbbell size={18} /> },
  { id: "diet", name: "Nutrition", icon: <Utensils size={18} /> },
  { id: "supplement", name: "Supplements", icon: <Shield size={18} /> },
  { id: "ai", name: "AI Coach", icon: <Brain size={18} /> },
  { id: "app", name: "App", icon: <Download size={18} /> },
  { id: "general", name: "General", icon: <User size={18} /> }
];

const FaqSection = () => {
  const [activeCategory, setActiveCategory] = useState("all");
  
  const filteredFaqs = activeCategory === "all" 
    ? faqs 
    : faqs.filter(faq => faq.category === activeCategory);

  return (
    <section id="faq" className="py-20 px-4 bg-black relative">
      <div className="absolute -z-10 top-1/3 left-1/4 w-64 h-64 bg-gold-500 rounded-full blur-[120px] opacity-5"></div>
      <div className="absolute -z-10 bottom-1/4 right-1/4 w-48 h-48 bg-gold-400 rounded-full blur-[100px] opacity-5"></div>
      
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <span className="inline-block bg-gold-500/10 text-gold-400 text-sm px-4 py-1.5 rounded-full border border-gold-500/20 mb-4">
            Got Questions?
          </span>
          <h2 className="text-3xl md:text-5xl font-bold mb-6 text-gradient">Frequently Asked Questions</h2>
          <p className="text-white/70 max-w-2xl mx-auto text-lg">
            Everything you need to know about <span className="text-gold-400">AI training programs</span>, <span className="text-gold-400">nutrition plans</span>, and <span className="text-gold-400">supplement guidance</span>
          </p>
        </div>

        {/* FAQ category tabs */}
        <div className="flex flex-wrap justify-center gap-3 mb-10 overflow-x-auto pb-2">
          {faqCategories.map((category) => (
            <button 
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`px-5 py-2 rounded-full border transition-all flex items-center gap-2 ${
                activeCategory === category.id 
                  ? "bg-gold-500/20 text-gold-400 border-gold-500/40" 
                  : "bg-gray-800/50 text-white/80 border-white/10 hover:border-gold-500/30 hover:text-gold-400"
              }`}
            >
              {category.icon}
              <span>{category.name}</span>
            </button>
          ))}
        </div>

        {/* FAQ accordion */}
        <Accordion type="single" collapsible className="w-full space-y-4">
          {filteredFaqs.map((faq, index) => (
            <AccordionItem 
              key={index} 
              value={`item-${index}`}
              className="bg-gradient-to-br from-gray-900 to-black rounded-xl border border-white/10 hover:border-gold-500/20 transition-all overflow-hidden group shadow-sm hover:shadow-[0_0_15px_rgba(255,215,0,0.1)]"
            >
              <AccordionTrigger className="px-6 py-4 hover:text-gold-400 transition-colors font-medium text-left group-hover:bg-gray-800/30">
                <div className="flex items-center gap-2">
                  {faq.category === "training" && <Dumbbell size={16} className="text-gold-500" />}
                  {faq.category === "diet" && <Utensils size={16} className="text-gold-500" />}
                  {faq.category === "supplement" && <Shield size={16} className="text-gold-500" />}
                  {faq.category === "ai" && <Brain size={16} className="text-gold-500" />}
                  {faq.category === "app" && <Download size={16} className="text-gold-500" />}
                  {faq.category === "general" && <User size={16} className="text-gold-500" />}
                  <span>{faq.question}</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-6 pt-2 text-white/70 leading-relaxed">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
        
        {/* Additional help section */}
        <div className="mt-16 bg-gradient-to-r from-gray-900 to-black p-8 rounded-2xl border border-gold-500/20 text-center relative overflow-hidden group hover:border-gold-500/30 transition-all">
          <div className="absolute -z-10 top-0 right-0 w-48 h-48 bg-gold-500 rounded-full blur-[100px] opacity-5 group-hover:opacity-10 transition-opacity"></div>
          
          <h3 className="text-xl font-semibold mb-4 text-white">Still have questions?</h3>
          <p className="text-white/70 mb-6">
            Our support team is ready to help with any questions about <span className="text-gold-400">AI training</span> and <span className="text-gold-400">premium features</span>
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <a 
              href="mailto:support@liftlegends.io" 
              className="bg-gray-800 hover:bg-gold-500/20 text-white hover:text-gold-400 px-6 py-3 rounded-xl transition-all inline-flex items-center justify-center gap-2 border border-transparent hover:border-gold-500/30"
            >
              <MessageCircle size={18} />
              Contact Support
            </a>
            <button 
              type="button" 
              className="bg-gray-800 hover:bg-gold-500/20 text-white hover:text-gold-400 px-6 py-3 rounded-xl transition-all inline-flex items-center justify-center gap-2 border border-transparent hover:border-gold-500/30"
            >
              <Download size={18} />
              Download User Guide
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FaqSection;