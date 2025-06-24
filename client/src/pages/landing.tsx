import { motion } from "framer-motion";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { LanguageToggle } from "@/components/ui/language-toggle";
import { useLanguage } from "@/hooks/useLanguage";
import { Heart, Brain, Shield, Clock, Globe, Palette, Play, ArrowRight, Sparkles, Star, Zap } from "lucide-react";

export default function Landing() {
  const { t } = useLanguage();
  const [, setLocation] = useLocation();

  const handleGetStarted = () => {
    setLocation('/dashboard');
  };

  const features = [
    {
      icon: <Brain className="h-7 w-7" />,
      title: t('features.personalized.title'),
      description: t('features.personalized.description'),
      gradient: 'from-indigo-50 to-purple-50',
      iconGradient: 'from-indigo-500 to-purple-600',
    },
    {
      icon: <Globe className="h-7 w-7" />,
      title: t('features.multilingual.title'),
      description: t('features.multilingual.description'),
      gradient: 'from-pink-50 to-rose-50',
      iconGradient: 'from-pink-500 to-rose-600',
    },
    {
      icon: <Palette className="h-7 w-7" />,
      title: t('features.themes.title'),
      description: t('features.themes.description'),
      gradient: 'from-emerald-50 to-teal-50',
      iconGradient: 'from-emerald-500 to-teal-600',
    },
    {
      icon: <Shield className="h-7 w-7" />,
      title: t('features.safe.title'),
      description: t('features.safe.description'),
      gradient: 'from-amber-50 to-orange-50',
      iconGradient: 'from-amber-500 to-orange-600',
    },
    {
      icon: <Clock className="h-7 w-7" />,
      title: t('features.available.title'),
      description: t('features.available.description'),
      gradient: 'from-violet-50 to-purple-50',
      iconGradient: 'from-violet-500 to-purple-600',
    },
    {
      icon: <Heart className="h-7 w-7" />,
      title: t('features.intelligent.title'),
      description: t('features.intelligent.description'),
      gradient: 'from-cyan-50 to-blue-50',
      iconGradient: 'from-cyan-500 to-blue-600',
    },
  ];

  const themes = [
    {
      name: 'Wallflower',
      emoji: '🌸',
      description: t('theme.wallflower.description'),
      gradient: 'from-pink-100 to-rose-100',
      iconGradient: 'from-pink-400 to-rose-500',
      userBg: 'from-pink-400 to-rose-500',
      botBg: 'bg-white border-pink-200',
    },
    {
      name: 'ComicPal',
      emoji: '🎉',
      description: t('theme.comic.description'),
      gradient: 'from-yellow-100 to-orange-100',
      iconGradient: 'from-yellow-400 to-orange-500',
      userBg: 'from-yellow-400 to-orange-500',
      botBg: 'bg-white border-yellow-200',
    },
    {
      name: 'NeutralNight',
      emoji: '🌙',
      description: t('theme.neutral.description'),
      gradient: 'from-gray-800 to-slate-900',
      iconGradient: 'from-gray-600 to-slate-700',
      userBg: 'from-indigo-500 to-purple-600',
      botBg: 'bg-gray-700 border-gray-600',
      isDark: true,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{ 
            rotate: 360,
            scale: [1, 1.1, 1],
          }}
          transition={{ 
            duration: 20, 
            repeat: Infinity, 
            ease: "linear" 
          }}
          className="absolute -top-20 -right-20 w-96 h-96 bg-gradient-to-br from-purple-200/30 to-pink-200/30 rounded-full blur-3xl"
        />
        <motion.div
          animate={{ 
            rotate: -360,
            scale: [1, 1.2, 1],
          }}
          transition={{ 
            duration: 25, 
            repeat: Infinity, 
            ease: "linear" 
          }}
          className="absolute -bottom-20 -left-20 w-96 h-96 bg-gradient-to-br from-indigo-200/30 to-purple-200/30 rounded-full blur-3xl"
        />
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-xl border-b border-white/20 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <motion.div 
                whileHover={{ scale: 1.05, rotate: 5 }}
                className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg"
              >
                <Heart className="text-white" size={20} />
              </motion.div>
              <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                {t('app.name')}
              </span>
            </div>
            
            <div className="flex items-center space-x-6">
              <div className="hidden md:flex items-center space-x-8">
                <a href="#features" className="text-gray-700 hover:text-purple-600 transition-colors font-medium">
                  {t('nav.features')}
                </a>
                <a href="#themes" className="text-gray-700 hover:text-purple-600 transition-colors font-medium">
                  {t('nav.themes')}
                </a>
              </div>
              
              <LanguageToggle />
              
              <Button 
                onClick={handleGetStarted}
                className="bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full font-semibold hover:shadow-xl transform hover:scale-105 transition-all duration-200 px-6"
              >
                <ArrowRight className="w-4 h-4 mr-2" />
                {t('nav.get-started')}
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section - Enhanced */}
      <section className="relative pt-24 pb-20 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="inline-flex items-center space-x-2 bg-purple-100 text-purple-700 px-4 py-2 rounded-full text-sm font-medium mb-6"
            >
              <Sparkles className="w-4 h-4" />
              <span>AI-Powered Emotional Support</span>
            </motion.div>

            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-8 leading-tight">
              {t('hero.title')}<br />
              <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600 bg-clip-text text-transparent">
                {t('hero.subtitle')}
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-600 mb-10 max-w-4xl mx-auto leading-relaxed">
              {t('hero.description')}
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
              <Button 
                onClick={handleGetStarted}
                size="lg"
                className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-10 py-5 rounded-2xl font-bold text-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
              >
                <Heart className="w-6 h-6 mr-3" />
                {t('hero.start-journey')}
              </Button>
              <Button 
                variant="outline"
                size="lg"
                className="px-10 py-5 rounded-2xl font-bold text-xl border-2 border-gray-300 hover:border-purple-400 hover:shadow-xl transition-all duration-300"
              >
                <Play className="mr-3 text-purple-500" />
                {t('hero.watch-demo')}
              </Button>
            </div>

            {/* Trust indicators */}
            <div className="flex flex-wrap justify-center items-center gap-8 text-gray-500 text-sm">
              <div className="flex items-center space-x-2">
                <Star className="w-4 h-4 text-yellow-500" />
                <span>Trusted by thousands</span>
              </div>
              <div className="flex items-center space-x-2">
                <Shield className="w-4 h-4 text-green-500" />
                <span>100% Private & Secure</span>
              </div>
              <div className="flex items-center space-x-2">
                <Zap className="w-4 h-4 text-blue-500" />
                <span>Instant AI Responses</span>
              </div>
            </div>
          </motion.div>

          {/* Hero Image */}
            <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.4 }}
            className="relative max-w-5xl mx-auto mt-16"
            >
            <div className="relative rounded-3xl overflow-hidden shadow-2xl">
              <img 
              src="/kinnori-banner.png" 
              alt="Emotional support therapy session" 
              className="w-full h-auto" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
            </div>
            
            {/* Floating Elements */}
            <motion.div 
              animate={{ y: [0, -15, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -top-6 -right-6 bg-white/95 backdrop-blur-sm rounded-2xl p-4 shadow-xl border border-white/20"
            >
              <div className="flex items-center space-x-3">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-semibold text-gray-700">{t('common.online')}</span>
              </div>
            </motion.div>
            
            <motion.div 
              animate={{ y: [0, -15, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 2 }}
              className="absolute -bottom-6 -left-6 bg-white/95 backdrop-blur-sm rounded-2xl p-4 shadow-xl border border-white/20"
            >
              <div className="flex items-center space-x-3">
              <Heart className="text-pink-500" size={20} />
              <span className="text-sm font-semibold text-gray-700">{t('common.emotionally-intelligent')}</span>
              </div>
            </motion.div>
            </motion.div>
        </div>
      </section>

      {/* Features Section - Enhanced */}
      <section id="features" className="py-24 bg-white/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center space-x-2 bg-purple-100 text-purple-700 px-4 py-2 rounded-full text-sm font-medium mb-6"
            >
              <Sparkles className="w-4 h-4" />
              <span>Powerful Features</span>
            </motion.div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              {t('features.title')}
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {t('features.subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -10, scale: 1.02 }}
              >
                <Card className={`bg-gradient-to-br ${feature.gradient} rounded-3xl p-8 hover:shadow-2xl transition-all duration-300 border-0 h-full`}>
                  <CardContent className="p-0">
                    <div className={`w-18 h-18 bg-gradient-to-br ${feature.iconGradient} rounded-2xl flex items-center justify-center mb-6 text-white shadow-lg`}>
                      {feature.icon}
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-4">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Themes Showcase - Enhanced */}
      <section id="themes" className="py-24 bg-gradient-to-br from-gray-50 to-purple-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center space-x-2 bg-purple-100 text-purple-700 px-4 py-2 rounded-full text-sm font-medium mb-6"
            >
              <Palette className="w-4 h-4" />
              <span>Beautiful Themes</span>
            </motion.div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              {t('themes.title')}
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {t('themes.subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {themes.map((theme, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.05, y: -10 }}
              >
                <Card className="rounded-3xl shadow-2xl overflow-hidden transition-all duration-300 border-0">
                  <div className={`bg-gradient-to-br ${theme.gradient} p-8 text-center ${theme.isDark ? 'text-white' : 'text-gray-900'}`}>
                    <div className={`w-20 h-20 bg-gradient-to-br ${theme.iconGradient} rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg`}>
                      <span className="text-3xl">{theme.emoji}</span>
                    </div>
                    <h3 className="text-2xl font-bold mb-3">{theme.emoji} {theme.name}</h3>
                    <p className={`${theme.isDark ? 'text-gray-300' : 'text-gray-600'} leading-relaxed`}>
                      {theme.description}
                    </p>
                  </div>
                  <div className={`p-8 bg-gradient-to-br ${theme.gradient} ${theme.isDark ? '' : 'bg-opacity-20'}`}>
                    {/* Mock chat preview */}
                    <div className="space-y-4">
                      <div className="flex justify-end">
                        <div className={`bg-gradient-to-r ${theme.userBg} text-white px-4 py-3 rounded-2xl rounded-br-md max-w-xs text-sm shadow-lg`}>
                          Hi there! 💕
                        </div>
                      </div>
                      <div className="flex justify-start">
                        <div className={`${theme.botBg} ${theme.isDark ? 'text-gray-100' : 'text-gray-700'} px-4 py-3 rounded-2xl rounded-bl-md max-w-xs shadow-lg border text-sm`}>
                          Hello! How are you feeling today? ✨
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section - Enhanced */}
      <section className="py-24 bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="absolute inset-0 opacity-30">
          <img 
            src="https://images.unsplash.com/photo-1559526324-4b87b5e36e44?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1920&h=800" 
            alt="Beautiful sunset representing hope and support" 
            className="w-full h-full object-cover" 
          />
        </div>
        
        <div className="relative max-w-5xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-6xl font-bold text-white mb-8 leading-tight">
              {t('cta.title')}
            </h2>
            <p className="text-xl md:text-2xl text-white/90 mb-10 leading-relaxed max-w-3xl mx-auto">
              {t('cta.description')}
            </p>
            
            <Button 
              onClick={handleGetStarted}
              size="lg"
              className="bg-white text-purple-600 px-12 py-6 rounded-2xl font-bold text-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
            >
              <Heart className="w-6 h-6 mr-3" />
              {t('cta.begin')}
            </Button>
            
            <p className="text-white/80 text-sm mt-6">
              {t('cta.footer')}
            </p>
          </motion.div>
        </div>
      </section>
    </div>
  );
}