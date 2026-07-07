export interface Medal {
  title: string;
  description: string;
  emoji: string;
}

export function getMedalForScore(score: number): Medal | null {
  if (score >= 20) {
    return {
      title: "قهرمان مصرف درست",
      description: "مسیر ۲۵ درجه را مثل یک حرفه‌ای حفظ کردی",
      emoji: "🏆",
    };
  }

  if (score >= 10) {
    return {
      title: "همیار ۲۵ درجه",
      description: "انتخاب درست را بارها تکرار کردی",
      emoji: "⭐",
    };
  }

  if (score >= 5) {
    return {
      title: "دوست روشنایی",
      description: "شروع خوبی برای حفظ روشنایی شهر داشتی",
      emoji: "💡",
    };
  }

  return null;
}
