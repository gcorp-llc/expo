# 09. Native Android Mapping — راهنمای نگاشت کامل به Kotlin و Jetpack Compose

این مستند راهنمای فنی دقیق برای مهندس توسعه‌دهنده Android است تا تمام اجزای React Native / Expo پروژه کوتیک را با بالاترین شباهت به **Kotlin** و **Jetpack Compose** پیاده‌سازی کند.

---

## 🏗️ نگاشت کتابخانه‌ها و کامپوننت‌های پایه

| بخش / قابلیت | React Native / Expo | معادل دقیق در Native Android (Kotlin) |
| :--- | :--- | :--- |
| **فریم‌ورک UI** | React Native JSX | **Jetpack Compose** (Compose UI 1.7+) |
| **طراحی و تم** | NativeWind / Tailwind | **Material 3 Design Tokens** (`MaterialTheme`) |
| **ناوبری** | Expo Router (Stack/Tabs) | **Navigation Compose** (`NavHost`, `composable`) |
| **مدیریت State** | Zustand | **ViewModel** + **StateFlow** / `mutableStateOf` |
| **تصاویر** | Expo Image (`expo-image`) | **Coil 3.x for Compose** (`AsyncImage`) |
| **بارگذاری فونت** | Expo Font | Compose `FontFamily(Font(R.font.vazirmatn))` |
| **افکت شیشه** | Expo Blur (`expo-blur`) | `Modifier.blur()` / `RenderEffect` |
| **بازخورد لمسی** | `expo-haptics` | `LocalHapticFeedback.current.performHapticFeedback` |
| **ذخیره‌سازی** | MMKV / AsyncStorage | **DataStore Preferences** / **Room Database** |
| **ارتباط با شبکه** | Fetch / Axios | **Ktor Client** یا **Retrofit 2** |

---

## 🎨 پیاده‌سازی تم و رنگ‌ها در Jetpack Compose

```kotlin
// ui/theme/Color.kt
val LightPrimary = Color(0xFF3A93E6)
val LightBackground = Color(0xFFEDF2F8)
val LightSurface = Color(0xFFFFFFFF)
val LightTextPrimary = Color(0xFF262F38)

val DarkPrimary = Color(0xFF68B5F5)
val DarkBackground = Color(0xFF1A2029)
val DarkSurface = Color(0xFF212730)
val DarkTextPrimary = Color(0xFFC6CEDB)

// ui/theme/Theme.kt
@Composable
fun KutikTheme(
    darkTheme: Boolean = isSystemInDarkTheme(),
    content: @Composable () -> Unit
) {
    val colorScheme = if (darkTheme) {
        darkColorScheme(
            primary = DarkPrimary,
            background = DarkBackground,
            surface = DarkSurface,
            onBackground = DarkTextPrimary,
            onSurface = DarkTextPrimary
        )
    } else {
        lightColorScheme(
            primary = LightPrimary,
            background = LightBackground,
            surface = LightSurface,
            onBackground = LightTextPrimary,
            onSurface = LightTextPrimary
        )
    }

    CompositionLocalProvider(LocalLayoutDirection provides LayoutDirection.Rtl) {
        MaterialTheme(
            colorScheme = colorScheme,
            typography = KutikTypography,
            content = content
        )
    }
}
```

---

## 🔘 پیاده‌سازی FloatingIconButton در Jetpack Compose

```kotlin
@Composable
fun FloatingIconButton(
    icon: Painter,
    contentDescription: String?,
    onClick: () -> Unit,
    modifier: Modifier = Modifier
) {
    Surface(
        onClick = onClick,
        shape = RoundedCornerShape(14.dp),
        color = MaterialTheme.colorScheme.surface,
        border = BorderStroke(1.dp, MaterialTheme.colorScheme.outline.copy(alpha = 0.2f)),
        shadowElevation = 2.dp,
        modifier = modifier.size(42.dp)
    ) {
        Box(contentAlignment = Alignment.Center) {
            Icon(
                painter = icon,
                contentDescription = contentDescription,
                tint = MaterialTheme.colorScheme.onSurface,
                modifier = Modifier.size(20.dp)
            )
        }
    }
}
```

---

## 📱 ناوبری و نوار وضعیت (Status Bar & System Bars)
- **StatusBar & NavigationBar Colors:**
  با استفاده از `enableEdgeToEdge()` در Activity اصلی، رنگ Status Bar و Navigation Bar به صورت شفاف با آیکن‌های متناسب با تم روشن/تاریک تنظیم می‌گردد.
- **RTL Layout:**
  تنظیم `LocalLayoutDirection provides LayoutDirection.Rtl` در ریشه برنامه جهت چیدمان صحیح راست به چپ.
- **تأییدیه بررسی:** `SOURCE_VERIFIED`
