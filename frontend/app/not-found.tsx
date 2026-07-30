import Link from "next/link";
import { siteConfig } from "@/config/site.config";
import { Home } from "lucide-react";

export default function NotFound() {
  return (
    <main className="min-h-screen bg-background text-primary flex flex-col items-center justify-center px-6 text-center relative overflow-hidden">
      {/* Background Ornaments */}
      <div className="absolute top-[-10%] right-[-5%] w-[40%] h-[40%] bg-primary rounded-full blur-[100px] opacity-20 pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-5%] w-[30%] h-[30%] bg-gold/10 rounded-full blur-[80px] opacity-20 pointer-events-none" />

      <div className="relative z-10 flex flex-col items-center">
        <p className="font-display text-accent text-6xl md:text-8xl mb-4 font-bold drop-shadow-[0_0_15px_rgba(197,160,89,0.5)]">404</p>
        <h1 className="font-display text-3xl md:text-4xl mb-4 text-primary">الصفحة مش موجودة</h1>
        <p className="font-body text-muted mb-10 max-w-md text-lg">
          يبدو أنك ضللت الطريق. الرابط الذي تبحث عنه غير موجود أو تم نقله.
        </p>
        
        <Link
          href="/"
          className="flex items-center gap-2 bg-gradient-to-r from-gold to-gold-soft text-background font-ui font-bold px-8 py-3.5 rounded-[10px] hover:scale-[1.05] transition-transform shadow-[0_4px_20px_rgba(197,160,89,0.3)]"
        >
          <Home size={18} />
          العودة للرئيسية
        </Link>
        
        <p className="mt-12 font-ui text-sm text-muted/50">
          {siteConfig.teacher.name}
        </p>
      </div>
    </main>
  );
}
