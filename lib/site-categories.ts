export const ALL_CATEGORY = 'الكل';

export const SITE_CATEGORIES = [
  'مقاولات عامة وبناء',
  'هناجر ومستودعات',
  'مظلات',
  'سواتر',
  'برجولات وجلسات',
  'واجهات كلادنج',
  'بيوت شعر',
  'شبوك',
  'قرميد وديكور',
  'أعمال متنوعة',
] as const;

export const GALLERY_FILTERS = [ALL_CATEGORY, ...SITE_CATEGORIES] as const;

export const CATEGORY_COLORS: Record<string, string> = {
  'مقاولات عامة وبناء': 'bg-blue-600',
  'هناجر ومستودعات': 'bg-emerald-600',
  'مظلات': 'bg-purple-600',
  'سواتر': 'bg-rose-600',
  'برجولات وجلسات': 'bg-teal-600',
  'واجهات كلادنج': 'bg-orange-600',
  'بيوت شعر': 'bg-yellow-600',
  'شبوك': 'bg-cyan-600',
  'قرميد وديكور': 'bg-amber-600',
  'أعمال متنوعة': 'bg-neutral-600',
};
