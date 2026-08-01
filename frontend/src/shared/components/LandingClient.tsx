"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { motion, useScroll, useTransform, useInView, AnimatePresence } from "framer-motion";
import { TiltCard } from "./TiltCard";
import { InkDivider } from "./InkDivider";
import { GeometricPattern } from "./GeometricPattern";
import { HeroFlourish } from "./HeroFlourish";
import { BookOpen, User, ChevronDown, Phone, MessageCircle, Star } from "lucide-react";
import { siteConfig } from "@/config/site.config";

const fadeUpVariant = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { type: "spring", stiffness: 100, damping: 20 } 
  }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2
    }
  }
};

function useCountUp(end: number, duration: number = 2000) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (end === 0) return;
    let startTime: number | null = null;
    let animationFrame: number;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = timestamp - startTime;
      const percentage = Math.min(progress / duration, 1);
      
      const easeOut = percentage === 1 ? 1 : 1 - Math.pow(2, -10 * percentage);
      setCount(Math.floor(end * easeOut));

      if (percentage < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [end, duration]);

  return count;
}

function StatBlock({ label, value, suffix = "" }: { label: string, value: number, suffix?: string }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const count = useCountUp(isInView ? value : 0);

  return (
    <div ref={ref} className="flex flex-col items-center justify-center p-6 border-primary/10 border-b md:border-b-0 md:border-l last:border-0 md:flex-1">
      <span className="h2 text-accent mb-2" dir="ltr">
        {count}{suffix}
      </span>
      <span className="small-label text-secondary">{label}</span>
    </div>
  );
}

function FAQItem({ question, answer, isOpen, onClick }: { question: string, answer: string, isOpen: boolean, onClick: () => void }) {
  return (
    <div className="border border-primary/5 rounded-[18px] bg-surface shadow-sm overflow-hidden mb-4 hover:shadow-md transition-shadow">
      <button 
        onClick={onClick}
        className="w-full flex items-center justify-between p-6 text-start font-ui font-semibold text-lg hover:bg-gold/5 transition-colors outline-none"
      >
        <span className="text-primary pr-2">{question}</span>
        <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
          <ChevronDown size={20} className="text-accent flex-shrink-0" />
        </motion.div>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="px-6 pb-6 pt-2 border-t border-primary/5 text-secondary body-text">
              {answer}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function LandingClient({ 
  grades, 
  settings, 
  studentCount = 0, 
  courseCount = 0,
  user,
  freeCourses = [],
  freeExams = [],
  reviews = [], faqs = []
}: { 
  grades: any[], 
  settings: any,
  studentCount?: number,
  courseCount?: number,
  user?: any,
  freeCourses?: any[],
  freeExams?: any[],
  reviews?: any[], faqs?: any[]
}) {
  const { scrollYProgress } = useScroll();
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  
  // Parallax effects
  const bgPatternY = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const heroImageY = useTransform(scrollYProgress, [0, 1], ["0%", "15%"]);
  const blurCircle1Y = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const blurCircle2Y = useTransform(scrollYProgress, [0, 1], ["0%", "-30%"]);

  return (
    <main className="min-h-screen bg-background text-primary overflow-hidden relative selection:bg-gold selection:text-background">
      
      {/* Global Geometric Background */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <GeometricPattern opacity={0.03} />
        <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-gold rounded-full blur-[150px] opacity-10" />
      </div>

      {/* Navbar */}
      <motion.nav 
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative z-10 flex items-center justify-between px-8 py-6 max-w-7xl mx-auto"
      >
        <div className="flex items-center gap-8">
          <motion.div 
            whileHover={{ rotate: 180 }}
            transition={{ duration: 0.5, type: "spring" }}
            className="text-accent font-display text-2xl cursor-pointer"
          >
            {/* Logo placeholder */}
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>
          </motion.div>
          <div className="hidden md:flex items-center gap-6 font-ui text-sm">
            <Link href="#about" className="flex items-center gap-2 hover:text-accentLight transition-colors">
              <span>عن المعلم</span>
              <BookOpen size={16} className="text-accent" />
            </Link>
            <Link href="#grades" className="flex items-center gap-2 hover:text-accentLight transition-colors">
              <span>استعراض الدورات</span>
              <BookOpen size={16} className="text-accent" />
            </Link>
          </div>
        </div>
        <div>
          {user ? (
            <div className="flex items-center gap-4">
              <span className="small-label hidden md:inline text-accent">مرحباً، {user.user_metadata?.full_name?.split(" ")[0] || "المستخدم"}</span>
              <Link href="/dashboard" className="btn btn-outline btn-sm">
                لوحة التحكم
              </Link>
            </div>
          ) : (
            <Link href="/login" className="btn btn-outline btn-sm">
              دخول
            </Link>
          )}
        </div>
      </motion.nav>

      {/* Hero Section */}
      <section className="relative px-6 md:px-10 min-h-[85vh] flex flex-col justify-center max-w-5xl mx-auto text-center z-10 pt-10 pb-20">
        
        {/* Optional Flourish moved behind the text as a subtle decoration */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full flex justify-center items-center pointer-events-none opacity-[0.03] -z-10">
          <HeroFlourish className="w-full max-w-[800px] text-primary" />
        </div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="flex flex-col items-center w-full relative z-10"
        >
          <motion.p variants={fadeUpVariant} className="small-label tracking-widest text-gold font-bold mb-4 uppercase">
            {siteConfig.hero.eyebrow || "مرحباً بك في منصتنا"}
          </motion.p>

          <motion.h1 variants={fadeUpVariant} className="h1 text-primary mb-8 leading-[1.2] md:leading-[1.3] drop-shadow-sm">
            {settings?.hero_title || siteConfig.hero.headline}
          </motion.h1>

          <motion.div variants={fadeUpVariant} className="flex justify-center w-full mb-8">
            <InkDivider />
          </motion.div>

          <motion.p variants={fadeUpVariant} className="subtitle text-xl md:text-2xl text-secondary max-w-2xl mx-auto mb-12 leading-relaxed">
            {settings?.hero_subtitle || siteConfig.hero.subheadline}
          </motion.p>

          <motion.div variants={fadeUpVariant} className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto">
            <Link
              href={user ? "/dashboard" : "/register"}
              className="btn btn-primary btn-lg shadow-[0_8px_30px_rgba(193,155,108,0.3)] hover:shadow-[0_12px_40px_rgba(193,155,108,0.5)] hover:-translate-y-1 hover:scale-105 transition-all duration-300 focus:ring-4 focus:ring-gold/50 focus:outline-none w-full sm:w-auto"
            >
              {siteConfig.hero.ctaLabel} ←
            </Link>
            <Link
              href="#grades"
              className="btn btn-outline btn-lg bg-background w-full sm:w-auto"
            >
              تصفح الدورات
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* Stats Band */}
      <section className="relative z-10 max-w-5xl mx-auto px-6 md:px-10 mb-24">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="bg-surface shadow-lg border border-primary/5 rounded-[24px] flex flex-col md:flex-row overflow-hidden"
        >
          <StatBlock label="عدد الطلاب" value={studentCount} suffix="+" />
          <StatBlock label="عدد الدورات" value={courseCount} />
          <StatBlock label="سنوات الخبرة" value={siteConfig.stats.yearsExperience} suffix="+" />
          <StatBlock label="نسبة الرضا" value={parseInt(siteConfig.stats.satisfactionRate)} suffix="%" />
        </motion.div>
      </section>

      {/* Animated Ink Stroke Section Divider */}
      <div className="flex justify-center items-center py-10 opacity-60 overflow-hidden">
        <motion.div 
          initial={{ width: 0 }}
          whileInView={{ width: "8rem" }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="h-[1px] bg-gradient-to-l from-transparent to-gold" 
        />
        <motion.div 
          initial={{ scale: 0 }}
          whileInView={{ scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.5, type: "spring" }}
          className="w-2 h-2 rounded-full bg-gold mx-2" 
        />
        <motion.div 
          initial={{ width: 0 }}
          whileInView={{ width: "8rem" }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="h-[1px] bg-gradient-to-r from-transparent to-gold" 
        />
      </div>

      {/* Grades Section */}
      <section id="grades" className="relative z-10 max-w-7xl mx-auto px-6 md:px-10 py-16 mb-24">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-16"
        >
          <h2 className="h2 text-primary">المراحل الدراسية</h2>
        </motion.div>

        <motion.div 
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {grades.map((grade: any, idx) => (
            <motion.div key={grade.id} variants={fadeUpVariant}>
              <TiltCard className="group h-full bg-primary border border-gold border-opacity-20 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl hover:shadow-gold/10 transition-all duration-300">
                <div className="absolute inset-0 bg-gradient-to-br from-gold from-opacity-10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                <div className="relative p-8 flex flex-col h-full z-10 text-center items-center">
                  <div className="w-20 h-20 bg-gold bg-opacity-10 rounded-full flex items-center justify-center text-4xl mb-6 shadow-inner border border-gold border-opacity-20 group-hover:scale-110 transition-transform duration-300 text-accent">
                    {grade.icon || "📘"}
                  </div>
                  
                  <h3 className="h3 text-inverse mb-3">{grade.name}</h3>
                  <p className="body-text text-inverse text-opacity-70 mb-8">{grade.description}</p>
                  
                  <div className="w-full grid grid-cols-2 gap-2 mb-8 border-y border-gold border-opacity-20 py-5">
                    <div className="flex flex-col items-center">
                      <span className="h3 text-accent">{grade.stats?.courses || 0}</span>
                      <span className="caption text-inverse text-opacity-60">دورات</span>
                    </div>
                    <div className="flex flex-col items-center border-r border-gold border-opacity-20">
                      <span className="h3 text-accent">{grade.stats?.teachers || 0}</span>
                      <span className="caption text-inverse text-opacity-60">معلمين</span>
                    </div>
                  </div>
                  
                  <Link href={`/grades/${grade.slug}`} className="btn btn-primary w-full mt-auto">
                    تصفح المرحلة
                  </Link>
                </div>
              </TiltCard>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Free Courses Section */}
      {freeCourses.length > 0 && (
        <section className="relative z-10 max-w-7xl mx-auto px-6 md:px-10 py-16 mb-24 bg-surface rounded-3xl border border-primary/5">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-12"
          >
            <div>
              <h2 className="h2 text-primary mb-2">دورات مجانية</h2>
              <p className="text-secondary">اكتشف المحتوى المجاني وابدأ رحلة التعلم الآن.</p>
            </div>
          </motion.div>

          <motion.div 
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {freeCourses.map((course: any) => (
              <motion.div key={course.id} variants={fadeUpVariant} className="flex h-full">
                <Link href={user ? `/dashboard/student/courses/${course.id}` : "/register"} className="block w-full">
                  <TiltCard className="h-full bg-background border border-primary/10 hover:border-gold/30 rounded-2xl p-6 transition-all shadow-sm hover:shadow-md flex flex-col group">
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-4">
                        <span className="small-label px-3 py-1 bg-gold/10 text-accent rounded-full">مجاني</span>
                      </div>
                      <h3 className="text-xl font-display text-primary mb-3 group-hover:text-accent transition-colors">
                        {course.title}
                      </h3>
                      {course.description && (
                        <p className="text-secondary text-sm line-clamp-2">{course.description}</p>
                      )}
                    </div>
                  </TiltCard>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </section>
      )}

      {/* Free Exams Section */}
      {freeExams.length > 0 && (
        <section className="relative z-10 max-w-7xl mx-auto px-6 md:px-10 py-16 mb-24">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-12"
          >
            <div>
              <h2 className="h2 text-primary mb-2">اختبارات مجانية</h2>
              <p className="text-secondary">اختبر معلوماتك وقيم مستواك مجاناً.</p>
            </div>
          </motion.div>

          <motion.div 
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {freeExams.map((exam: any) => (
              <motion.div key={exam.id} variants={fadeUpVariant} className="flex h-full">
                <Link href={user ? `/dashboard/student/exams/${exam.id}` : "/register"} className="block w-full">
                  <TiltCard className="h-full bg-primary border border-primary-light rounded-2xl p-6 transition-all shadow-sm hover:shadow-md hover:shadow-gold/10 flex flex-col group relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-gold/5 rounded-bl-full -z-10 group-hover:scale-110 transition-transform" />
                    <div className="flex-1 z-10">
                      <div className="flex justify-between items-start mb-4">
                        <span className="small-label px-3 py-1 bg-gold text-primary rounded-full">اختبار مجاني</span>
                      </div>
                      <h3 className="text-xl font-display text-inverse mb-3 group-hover:text-gold transition-colors">
                        {exam.title}
                      </h3>
                    </div>
                  </TiltCard>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </section>
      )}

      {/* NEW: About the Teacher */}
      <section id="about" className="relative z-10 max-w-7xl mx-auto px-6 md:px-10 py-16 mb-24">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="flex flex-col md:flex-row items-center gap-12 bg-primary/5 p-8 md:p-16 rounded-2xl border border-primary/10 relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-islamic-pattern opacity-5 mix-blend-overlay pointer-events-none" />
          
          <div className="flex-1 order-2 md:order-1">
            <span className="small-label bg-gold/10 text-accent px-4 py-1.5 rounded-full inline-block mb-4">
              {siteConfig.teacher.subject}
            </span>
            <h2 className="h2 text-primary mb-6">تعرف على {siteConfig.teacher.name}</h2>
            <p className="body-text text-secondary mb-8">
              {siteConfig.teacher.bio}
            </p>
            
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center gap-2 bg-background px-6 py-3 rounded-lg border border-primary/10 shadow-sm">
                <span className="h3 text-accent">{siteConfig.stats.yearsExperience}+</span>
                <span className="small-label text-primary">سنوات خبرة</span>
              </div>
              <div className="flex items-center gap-2 bg-background px-6 py-3 rounded-lg border border-primary/10 shadow-sm">
                <span className="h3 text-accent">{studentCount}+</span>
                <span className="small-label text-primary">طالب مستفيد</span>
              </div>
            </div>
          </div>
          
          <div className="flex-1 order-1 md:order-2 flex justify-center">
            <div className="relative w-64 h-64 md:w-80 md:h-80">
              <div className="absolute inset-0 bg-gold rounded-3xl rotate-6 opacity-20" />
              <div className="absolute inset-0 bg-background rounded-3xl -rotate-3 border border-primary/10 flex items-center justify-center overflow-hidden z-10 shadow-xl">
                {/* Fallback to illustration if photoUrl is empty or placeholder */}
                <img 
                  src={settings?.teacher_image || siteConfig.teacher.photoUrl || "/teacher-illustration.png"} 
                  alt={settings?.teacher_name || siteConfig.teacher.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const current = e.currentTarget.src;
                    if (!current.includes("/teacher-illustration.png") && !current.includes("/teacher-photo.jpeg")) {
                      e.currentTarget.src = "/teacher-illustration.png";
                    } else if (current.includes("/teacher-illustration.png")) {
                      e.currentTarget.src = "/teacher-photo.jpeg";
                    }
                  }}
                />
              </div>
            </div>
          </div>
        </motion.div>
      </section>



      {/* Reviews Section */}
      <section id="testimonials" className="relative z-10 max-w-7xl mx-auto px-6 md:px-10 mb-32 pt-20 border-t border-primary/5">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <span className="small-label text-gold uppercase tracking-widest mb-4 block">آراء ومراجعات</span>
          <h2 className="h2 text-primary mb-6">ماذا يقول طلابنا</h2>
          <div className="flex justify-center mb-6">
            <InkDivider />
          </div>
        </motion.div>

        {reviews && reviews.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {reviews.map((review: any, i: number) => (
                <motion.div
                  key={review.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="bg-surface border border-primary/5 p-6 rounded-[24px] shadow-sm hover:shadow-soft transition-all duration-300"
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 rounded-full bg-gold/10 text-gold flex items-center justify-center shrink-0 font-ui font-bold text-xl">
                      {review.student.fullName ? review.student.fullName.charAt(0) : "T"}
                    </div>
                    <div>
                      <h4 className="font-ui font-bold text-primary">{review.student.fullName}</h4>
                      <p className="text-xs text-muted font-ui">{review.course?.title}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 mb-3 text-gold">
                    {Array.from({ length: 5 }).map((_, idx) => (
                      <Star key={idx} size={14} fill={idx < review.rating ? "currentColor" : "none"} />
                    ))}
                  </div>
                  <p className="font-body text-sm text-secondary/90 leading-relaxed italic">
                    "{review.comment}"
                  </p>
                </motion.div>
              ))}
            </div>
            <div className="text-center">
              <Link href="/reviews" className="btn btn-outline btn-lg inline-flex items-center gap-2">
                عرض كل الآراء
              </Link>
            </div>
          </>
        ) : (
          <div className="text-center py-12 bg-surface/50 rounded-[24px] border border-primary/5">
            <Star size={48} className="mx-auto text-gold/30 mb-4" />
            <p className="text-muted font-body">لا توجد مراجعات حالياً. كن أول من يضيف تقييماً!</p>
          </div>
        )}
      </section>

      {/* NEW: FAQ Section */}
      <section id="faq" className="relative z-10 max-w-4xl mx-auto px-6 md:px-10 py-16 mb-24">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="h2 text-primary mb-4">الأسئلة الشائعة</h2>
          <p className="subtitle">كل ما تحتاج لمعرفته عن المنصة والاشتراكات.</p>
        </motion.div>

        <motion.div 
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {(faqs && faqs.length > 0 ? faqs : siteConfig.faq).map((faq, idx) => (
            <motion.div key={idx} variants={fadeUpVariant}>
              <FAQItem 
                question={faq.question} 
                answer={faq.answer} 
                isOpen={openFaqIndex === idx}
                onClick={() => setOpenFaqIndex(openFaqIndex === idx ? null : idx)}
              />
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* NEW: Final CTA */}
      <section className="relative z-10 bg-primary dark:bg-surface-alt py-24 overflow-hidden border-y border-gold/10">
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <GeometricPattern opacity={0.03} />
        </div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gold rounded-full blur-[200px] opacity-10 pointer-events-none" />
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto px-8 text-center relative z-10"
        >
          <h2 className="h1 text-inverse dark:text-primary mb-6">جاهز تبدأ رحلتك التعليمية؟</h2>
          <p className="subtitle text-inverse/80 dark:text-secondary mb-12 max-w-2xl mx-auto">انضم لمئات الطلاب وحقق أهدافك مع أفضل محتوى تعليمي متاح لك في أي وقت.</p>
          <Link href="/register" className="btn btn-gold btn-lg">
            سجل حسابك الآن
          </Link>
        </motion.div>
      </section>

      {/* NEW: Footer */}
      <footer className="relative z-10 bg-primary dark:bg-background pt-20 pb-8 border-t border-gold border-opacity-20 text-inverse dark:text-primary dark:text-primary">
        <div className="max-w-7xl mx-auto px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-16">
            
            {/* Column 1 */}
            <div>
              <div className="flex items-center gap-3 mb-6">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" className="text-accent" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>
                <span className="font-display text-3xl text-inverse dark:text-primary font-bold">{siteConfig.teacher.name}</span>
              </div>
              <p className="body-text text-inverse dark:text-primary text-opacity-70 mb-8 max-w-sm">
                {settings?.hero_eyebrow || siteConfig.hero.eyebrow} - {siteConfig.hero.headline}
              </p>
              <div className="flex items-center gap-4">
                {settings?.facebook && (
                  <a href={settings.facebook} target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-full bg-inverse bg-opacity-5 flex items-center justify-center text-inverse dark:text-primary hover:bg-gold hover:text-primary hover:border-gold transition-colors border border-inverse border-opacity-10">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
                    </svg>
                  </a>
                )}
                {settings?.whatsapp && (
                  <a href={`https://wa.me/${settings.whatsapp}`} target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-full bg-inverse bg-opacity-5 flex items-center justify-center text-inverse dark:text-primary hover:bg-gold hover:text-primary hover:border-gold transition-colors border border-inverse border-opacity-10">
                    <MessageCircle size={20} />
                  </a>
                )}
              </div>
            </div>

            {/* Column 2 */}
            <div>
              <h3 className="font-ui font-semibold text-lg text-inverse dark:text-primary mb-6 border-b border-gold border-opacity-20 pb-3 inline-block">روابط سريعة</h3>
              <ul className="space-y-4 font-body text-base">
                <li><Link href="#grades" className="text-inverse dark:text-primary text-opacity-70 hover:text-accent transition-colors">الدورات المتاحة</Link></li>
                <li><Link href="#about" className="text-inverse dark:text-primary text-opacity-70 hover:text-accent transition-colors">عن المعلم</Link></li>
                <li><Link href="#testimonials" className="text-inverse dark:text-primary text-opacity-70 hover:text-accent transition-colors">آراء الطلاب</Link></li>
                <li><Link href="#faq" className="text-inverse dark:text-primary text-opacity-70 hover:text-accent transition-colors">الأسئلة الشائعة</Link></li>
              </ul>
            </div>

            {/* Column 3 */}
            <div>
              <h3 className="font-ui font-semibold text-lg text-inverse dark:text-primary mb-6 border-b border-gold border-opacity-20 pb-3 inline-block">تواصل معنا</h3>
              <ul className="space-y-4 font-body text-base">
                {settings?.contact_phone && (
                  <li>
                    <a href={`tel:${settings.contact_phone}`} className="flex items-center gap-3 text-inverse dark:text-primary text-opacity-70 hover:text-accent transition-colors">
                      <Phone size={18} />
                      <span dir="ltr">{settings.contact_phone}</span>
                    </a>
                  </li>
                )}
                {settings?.whatsapp && (
                  <li>
                    <a href={`https://wa.me/${settings.whatsapp}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-inverse dark:text-primary text-opacity-70 hover:text-accent transition-colors">
                      <MessageCircle size={18} />
                      <span dir="ltr">{settings.whatsapp}</span>
                    </a>
                  </li>
                )}
                {!settings?.contact_phone && !settings?.whatsapp && (
                  <li className="text-inverse dark:text-primary text-opacity-70 italic">لا توجد بيانات اتصال متاحة.</li>
                )}
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-inverse border-opacity-10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="caption text-inverse dark:text-primary text-opacity-60">
              &copy; {new Date().getFullYear()} {siteConfig.teacher.name}. جميع الحقوق محفوظة.
            </p>
            {siteConfig.poweredByCredit && (
              <p className="caption text-inverse dark:text-primary text-opacity-40">
                صُنع بواسطة نظام إدارة التعلم
              </p>
            )}
          </div>
        </div>
      </footer>

    </main>
  );
}
