import { Platform } from 'react-native';
import { useStore, AppFontFamily } from '@/hooks/use-store';

// Synchronized with Frontend OKLCH colors (Converted to Hex)
const defaultTintColorLight = '#3a93e6';
const defaultTintColorDark = '#68b5f5';

export interface IranianColor {
  id: string;
  nameFa: string;
  nameEn: string;
  hex: string;
}

export const IRANIAN_TRADITIONAL_COLORS: IranianColor[] = [
  { id: 'lazevardi', nameFa: 'لاجوردی', nameEn: 'Lapis Lazuli', hex: '#26619C' },
  { id: 'firoozehi', nameFa: 'فیروزه‌ای', nameEn: 'Turquoise', hex: '#30BFBF' },
  { id: 'nili', nameFa: 'نیلی', nameEn: 'Indigo', hex: '#2E3A87' },
  { id: 'kashiei', nameFa: 'کاشی‌ای', nameEn: 'Tile Blue', hex: '#1E6FB8' },
  { id: 'asemani', nameFa: 'آسمانی', nameEn: 'Sky Blue', hex: '#87CEEB' },
  { id: 'shangarf', nameFa: 'شنگرف', nameEn: 'Cinnabar', hex: '#E34234' },
  { id: 'anari', nameFa: 'اناری', nameEn: 'Pomegranate', hex: '#C0392B' },
  { id: 'ghermez_danehi', nameFa: 'قرمز دانه‌ای', nameEn: 'Crimson', hex: '#A6122D' },
  { id: 'annabi', nameFa: 'عنابی', nameEn: 'Jujube', hex: '#6E1F2A' },
  { id: 'lali', nameFa: 'لعلی', nameEn: 'Ruby', hex: '#D2263E' },
  { id: 'zafarani', nameFa: 'زعفرانی', nameEn: 'Saffron', hex: '#F2A900' },
  { id: 'kahrabayi', nameFa: 'کهربایی', nameEn: 'Amber', hex: '#E0A030' },
  { id: 'talayi', nameFa: 'طلایی', nameEn: 'Gold', hex: '#D4AF37' },
  { id: 'nokodi', nameFa: 'نخودی', nameEn: 'Chickpea', hex: '#E8D3A2' },
  { id: 'zomorrodi', nameFa: 'زمردی', nameEn: 'Emerald', hex: '#0B8A5B' },
  { id: 'pestehi', nameFa: 'پسته‌ای', nameEn: 'Pistachio', hex: '#93C572' },
  { id: 'yashmi', nameFa: 'یشمی', nameEn: 'Jade', hex: '#00A86B' },
  { id: 'sabz_shirazi', nameFa: 'سبز شیرازی', nameEn: 'Shiraz Green', hex: '#1E7F5C' },
  { id: 'hanayi', nameFa: 'حنایی', nameEn: 'Henna', hex: '#C8683C' },
  { id: 'gerdoyi', nameFa: 'گردویی', nameEn: 'Walnut', hex: '#5C4033' },
  { id: 'khakastari', nameFa: 'خاکستری', nameEn: 'Grey', hex: '#808080' },
  { id: 'noghrei', nameFa: 'نقره‌ای', nameEn: 'Silver', hex: '#B8BCC2' },
  { id: 'arghavani', nameFa: 'ارغوانی', nameEn: 'Purple', hex: '#B0448C' },
  { id: 'banafsh_shaghayegi', nameFa: 'بنفش شقایقی', nameEn: 'Poppy Violet', hex: '#7B4FA0' },
  { id: 'golgon', nameFa: 'گلگون', nameEn: 'Rose Pink', hex: '#F4A6B8' },
  { id: 'shiri', nameFa: 'شیری', nameEn: 'Cream', hex: '#F5EFE0' },
  { id: 'sormei', nameFa: 'سرمه‌ای', nameEn: 'Navy Blue', hex: '#1B2A49' },
  { id: 'meshki', nameFa: 'مشکی', nameEn: 'Black', hex: '#1A1A1A' },
];

export interface FontOption {
  id: AppFontFamily;
  nameFa: string;
  nameEn: string;
  descFa: string;
  descEn: string;
  sampleFa: string;
  fontFamilyStyle?: string;
}

export const APP_FONT_OPTIONS: FontOption[] = [
  {
    id: 'vazir',
    nameFa: 'وزیرمتن',
    nameEn: 'Vazirmatn',
    descFa: 'خوانا، مدرن و استاندارد وب و موبایل',
    descEn: 'Legible, modern and standard font for web and mobile',
    sampleFa: 'گاه‌شمار اصیل ایرانی سرو • ۲۵۸۵ شاهنشاهی (نمونه خط)',
    fontFamilyStyle: Platform.select({
      web: "'Vazirmatn', system-ui, sans-serif",
      default: 'Vazirmatn, sans-serif',
    }),
  },
  {
    id: 'shabnam',
    nameFa: 'شبنم',
    nameEn: 'Shabnam',
    descFa: 'طراحی شیک و روان، مناسب محیط‌های دیجیتال',
    descEn: 'Sleek and smooth design, ideal for digital interfaces',
    sampleFa: 'گاه‌شمار اصیل ایرانی سرو • ۲۵۸۵ شاهنشاهی (نمونه خط)',
    fontFamilyStyle: Platform.select({
      web: "'Shabnam', 'Vazirmatn', sans-serif",
      default: 'Shabnam, sans-serif',
    }),
  },
  {
    id: 'sahel',
    nameFa: 'ساحل',
    nameEn: 'Sahel',
    descFa: 'فونت هندسی و مدرن با خوانایی بالا',
    descEn: 'Geometric modern font with high legibility',
    sampleFa: 'گاه‌شمار اصیل ایرانی سرو • ۲۵۸۵ شاهنشاهی (نمونه خط)',
    fontFamilyStyle: Platform.select({
      web: "'Sahel', 'Vazirmatn', sans-serif",
      default: 'Sahel, sans-serif',
    }),
  },
  {
    id: 'system',
    nameFa: 'پیش‌فرض سیستم',
    nameEn: 'System Default',
    descFa: 'پیروی از قلم استاندارد دستگاه',
    descEn: 'Follow device system default font',
    sampleFa: 'گاه‌شمار اصیل ایرانی سرو • ۲۵۸۵ شاهنشاهی (نمونه خط)',
    fontFamilyStyle: Platform.select({
      ios: 'System',
      android: 'sans-serif',
      web: 'system-ui, -apple-system, sans-serif',
    }),
  },
];

const getActiveTint = (defaultTint: string) => {
  try {
    const selectedColor = useStore.getState?.()?.selectedColorTheme;
    return selectedColor || defaultTint;
  } catch {
    return defaultTint;
  }
};

export const Colors = {
  get light() {
    const tint = getActiveTint(defaultTintColorLight);
    return {
      text: '#262f38',
      textSecondary: '#5b646f',
      background: '#edf2f8',
      secondaryBackground: '#e0e5eb',

      surface: 'rgba(255, 255, 255, 0.8)',
      surfaceStrong: '#ffffff',

      tint,
      icon: '#262f38',
      tabIconDefault: '#5b646f',
      tabIconSelected: tint,

      border: '#d9dfe5',
      headerBackground: 'rgba(237, 242, 248, 0.95)',
      chatBackground: '#ffffff',

      success: '#10B981',
      destructive: '#d74745',
      warning: '#F59E0B',

      shadow: 'rgba(38, 47, 56, 0.06)',
      card: '#ffffff',
      cardTransparent: 'rgba(255, 255, 255, 0.9)',
      statusBarBackground: '#d0dceb',
    };
  },

  get dark() {
    const tint = getActiveTint(defaultTintColorDark);
    return {
      text: '#c6cedb',
      textSecondary: '#88909c',
      background: '#1a2029',
      secondaryBackground: '#2d333d',

      surface: 'rgba(33, 39, 48, 0.8)',
      surfaceStrong: '#212730',

      tint,
      icon: '#c6cedb',
      tabIconDefault: '#88909c',
      tabIconSelected: tint,

      border: 'rgba(52, 59, 69, 0.3)',
      headerBackground: 'rgba(26, 32, 41, 0.95)',
      chatBackground: '#1a2029',

      success: '#10B981',
      destructive: '#d74745',
      warning: '#FBBF24',

      shadow: 'rgba(0, 0, 0, 0.4)',
      card: '#212730',
      cardTransparent: 'rgba(33, 39, 48, 0.9)',
      statusBarBackground: '#121720',
    };
  },
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
  xxxl: 48,
};

export const Fonts = {
  sans: Platform.select({
    ios: 'System',
    android: 'sans-serif',
    web: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
  }),
  fa: Platform.select({
    ios: 'System',
    android: 'sans-serif',
    web: "'Vazirmatn', system-ui, sans-serif",
  }),
};
