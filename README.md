# پرواز ۲۵ درجه

بازی موبایلی آموزشی با الهام از Flappy Bird — برای کمپین مصرف برق.

**مخزن GitHub:** [github.com/Milad0647/parvaz-25-degree](https://github.com/Milad0647/parvaz-25-degree)

## اجرای محلی

```bash
npm install
npm run dev
```

بازی روی [http://localhost:3000](http://localhost:3000) باز می‌شود.

## Deploy آنلاین (Vercel)

1. به [vercel.com](https://vercel.com) برو و با GitHub لاگین کن
2. **Add New Project** → ریپوی `parvaz-25-degree` را انتخاب کن
3. روی **Deploy** بزن — بدون تنظیم اضافه کار می‌کند

یا با CLI:

```bash
npx vercel --prod
```

## تکنولوژی

- **Next.js 15** — فریم‌ورک
- **TypeScript** — تایپ‌اسکریپت
- **Canvas API** — رندر بازی
- **Framer Motion** — انیمیشن UI
- **GSAP** — افکت لمس
- **Tailwind CSS** — استایل

## گیم‌پلی

- لمس صفحه = پرواز به بالا
- از شکاف **۲۵°** در دماسنج‌ها عبور کن
- آیتم‌های مثبت را جمع کن
- به برچسب‌های پرمصرف برخورد نکن
- با افزایش امتیاز، فاز سخت‌تر می‌شود
- مدال‌ها: دوست روشنایی (۵+)، همیار ۲۵ درجه (۱۰+)، قهرمان مصرف درست (۲۰+)

## ساختار

```
src/
├── app/              # Next.js App Router
├── components/game/  # UI و کانتینر بازی
└── lib/game/         # موتور، رندر، ثابت‌ها
```

## CI

هر push به `main` به‌صورت خودکار build می‌شود (GitHub Actions).
