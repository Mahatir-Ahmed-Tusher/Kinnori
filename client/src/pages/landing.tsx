import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { LanguageToggle } from "@/components/ui/language-toggle";
import { useLanguage } from "@/hooks/useLanguage";
import { Heart, Brain, Shield, Clock, Globe, Palette, Play } from "lucide-react";

export default function Landing() {
  const { t } = useLanguage();

  const handleLogin = () => {
    window.location.href = '/api/login';
  };

  const features = [
    {
      icon: <Brain className="h-6 w-6" />,
      title: t('features.personalized.title'),
      description: t('features.personalized.description'),
      gradient: 'from-indigo-50 to-purple-50',
      iconGradient: 'from-indigo-500 to-purple-600',
    },
    {
      icon: <Globe className="h-6 w-6" />,
      title: t('features.multilingual.title'),
      description: t('features.multilingual.description'),
      gradient: 'from-pink-50 to-rose-50',
      iconGradient: 'from-pink-500 to-rose-600',
    },
    {
      icon: <Palette className="h-6 w-6" />,
      title: t('features.themes.title'),
      description: t('features.themes.description'),
      gradient: 'from-emerald-50 to-teal-50',
      iconGradient: 'from-emerald-500 to-teal-600',
    },
    {
      icon: <Shield className="h-6 w-6" />,
      title: t('features.safe.title'),
      description: t('features.safe.description'),
      gradient: 'from-amber-50 to-orange-50',
      iconGradient: 'from-amber-500 to-orange-600',
    },
    {
      icon: <Clock className="h-6 w-6" />,
      title: t('features.available.title'),
      description: t('features.available.description'),
      gradient: 'from-violet-50 to-purple-50',
      iconGradient: 'from-violet-500 to-purple-600',
    },
    {
      icon: <Heart className="h-6 w-6" />,
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
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-pink-50">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-pink-500 rounded-lg flex items-center justify-center">
                <Heart className="text-white" size={16} />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-pink-600 bg-clip-text text-transparent">
                {t('app.name')}
              </span>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="hidden md:flex items-center space-x-6">
                <a href="#features" className="text-gray-600 hover:text-indigo-600 transition-colors">
                  {t('nav.features')}
                </a>
                <a href="#themes" className="text-gray-600 hover:text-indigo-600 transition-colors">
                  {t('nav.themes')}
                </a>
              </div>
              
              <LanguageToggle />
              
              <Button 
                onClick={handleLogin}
                className="bg-gradient-to-r from-indigo-500 to-pink-500 text-white rounded-full font-medium hover:shadow-lg transform hover:scale-105 transition-all duration-200"
              >
                <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                {t('nav.get-started')}
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-20 pb-16 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              {t('hero.title')}<br />
              <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                {t('hero.subtitle')}
              </span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
              {t('hero.description')}
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <Button 
                onClick={handleLogin}
                size="lg"
                className="bg-gradient-to-r from-indigo-500 to-pink-500 text-white px-8 py-4 rounded-2xl font-semibold text-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
              >
                <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                {t('hero.start-journey')}
              </Button>
              <Button 
                variant="outline"
                size="lg"
                className="px-8 py-4 rounded-2xl font-semibold text-lg border-2 border-gray-200 hover:border-indigo-300 hover:shadow-lg transition-all duration-200"
              >
                <Play className="mr-3 text-indigo-500" />
                {t('hero.watch-demo')}
              </Button>
            </div>
          </motion.div>

          {/* Hero Image */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative max-w-4xl mx-auto"
          >
            <div className="relative rounded-3xl overflow-hidden shadow-2xl">
              <img 
                src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1200&h=600" 
                alt="Emotional support therapy session" 
                className="w-full h-auto" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
            </div>
            
            {/* Floating Elements */}
            <motion.div 
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -top-4 -right-4 bg-white rounded-2xl p-4 shadow-xl"
            >
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-gray-700">{t('common.online')}</span>
              </div>
            </motion.div>
            
            <motion.div 
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              className="absolute -bottom-4 -left-4 bg-white rounded-2xl p-4 shadow-xl"
            >
              <div className="flex items-center space-x-2">
                <Heart className="text-pink-500" size={18} />
                <span className="text-sm font-medium text-gray-700">{t('common.emotionally-intelligent')}</span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {t('features.title')}
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              {t('features.subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className={`bg-gradient-to-br ${feature.gradient} rounded-3xl p-8 hover:shadow-xl transition-all duration-300 transform hover:scale-105 border-0`}>
                  <CardContent className="p-0">
                    <div className={`w-16 h-16 bg-gradient-to-br ${feature.iconGradient} rounded-2xl flex items-center justify-center mb-6 text-white`}>
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

      {/* Themes Showcase */}
      <section id="themes" className="py-20 bg-gradient-to-br from-gray-50 to-indigo-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {t('themes.title')}
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              {t('themes.subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {themes.map((theme, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="rounded-3xl shadow-xl overflow-hidden transform hover:scale-105 transition-all duration-300 border-0">
                  <div className={`bg-gradient-to-br ${theme.gradient} p-6 text-center ${theme.isDark ? 'text-white' : 'text-gray-900'}`}>
                    <div className={`w-16 h-16 bg-gradient-to-br ${theme.iconGradient} rounded-2xl flex items-center justify-center mx-auto mb-4`}>
                      <span className="text-2xl">{theme.emoji}</span>
                    </div>
                    <h3 className="text-2xl font-bold mb-2">{theme.emoji} {theme.name}</h3>
                    <p className={theme.isDark ? 'text-gray-300' : 'text-gray-600'}>
                      {theme.description}
                    </p>
                  </div>
                  <div className={`p-6 bg-gradient-to-br ${theme.gradient} ${theme.isDark ? '' : 'bg-opacity-20'}`}>
                    {/* Mock chat preview */}
                    <div className="space-y-3">
                      <div className="flex justify-end">
                        <div className={`bg-gradient-to-r ${theme.userBg} text-white px-4 py-2 rounded-2xl rounded-br-md max-w-xs text-sm`}>
                          Hi there! 💕
                        </div>
                      </div>
                      <div className="flex justify-start">
                        <div className={`${theme.botBg} ${theme.isDark ? 'text-gray-100' : 'text-gray-700'} px-4 py-2 rounded-2xl rounded-bl-md max-w-xs shadow-sm border text-sm`}>
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

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="absolute inset-0 opacity-20">
          <img 
            src="https://images.unsplash.com/photo-1559526324-4b87b5e36e44?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1920&h=800" 
            alt="Beautiful sunset representing hope and support" 
            className="w-full h-full object-cover" 
          />
        </div>
        
        <div className="relative max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 leading-tight">
              {t('cta.title')}
            </h2>
            <p className="text-xl text-white/90 mb-8 leading-relaxed">
              {t('cta.description')}
            </p>
            
            <Button 
              onClick={handleLogin}
              size="lg"
              className="bg-white text-indigo-600 px-10 py-5 rounded-2xl font-bold text-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-200"
            >
              <svg className="w-6 h-6 mr-3" viewBox="0 0 24 24">
                <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              {t('cta.begin')}
            </Button>
            
            <p className="text-white/80 text-sm mt-4">
              {t('cta.footer')}
            </p>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
