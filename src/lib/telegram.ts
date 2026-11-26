let WebApp: any = null;

if (typeof window !== 'undefined') {
  try {
    const sdk = require('@twa-dev/sdk');
    WebApp = sdk.WebApp;
  } catch (e) {
    console.log('Telegram SDK not available:', e);
  }
}

export interface TelegramUser {
  id: number;
  username?: string;
  firstName: string;
  lastName?: string;
  languageCode: string;
}

export function initTelegram() {
  if (typeof window === 'undefined' || !WebApp) return null;
  
  try {
    // 1. ძირითადი ინიციალიზაცია
    WebApp.ready();
    WebApp.expand(); // fallback - სრული სიმაღლე
    
    // 2. Fullscreen მხოლოდ Bot API 8.0+ და მობილურზე
    if (WebApp.isVersionAtLeast && WebApp.isVersionAtLeast('8.0')) {
      const platform = WebApp.platform?.toLowerCase() || '';
      if (['android', 'ios'].includes(platform)) {
        try {
          WebApp.requestFullscreen();
          console.log('Fullscreen requested successfully');
        } catch (e) {
          console.log('requestFullscreen failed:', e);
        }
      }
    }
    
    // 3. Fullscreen ივენთების მოსმენა
    WebApp.onEvent('fullscreenChanged', () => {
      console.log('isFullscreen:', WebApp.isFullscreen);
    });
    
    WebApp.onEvent('fullscreenFailed', (e: any) => {
      console.warn('Fullscreen failed:', e?.error);
    });
    
    // 4. Header და Background ფერები
    WebApp.setHeaderColor('#ffffff');
    WebApp.setBackgroundColor('#ffffff');
    
    // 5. ვიბრაცია
    if (WebApp.HapticFeedback) {
      WebApp.HapticFeedback.impactOccurred('light');
    }
  } catch (e) {
    console.log('Telegram init error:', e);
  }
  
  const user = WebApp.initDataUnsafe?.user;
  
  if (!user) return null;
  
  return {
    id: user.id,
    username: user.username,
    firstName: user.first_name,
    lastName: user.last_name,
    languageCode: user.language_code || 'ka',
  } as TelegramUser;
}

export function hideTelegramButton() {
  if (!WebApp) return;
  WebApp.MainButton.hide();
}

export function showTelegramButton(text: string, onClick: () => void) {
  if (!WebApp) return;
  WebApp.MainButton.setText(text);
  WebApp.MainButton.show();
  WebApp.MainButton.onClick(onClick);
}

export function closeTelegramApp() {
  if (!WebApp) return;
  WebApp.close();
}

export function isTelegramAvailable(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    return WebApp?.initData !== '';
  } catch {
    return false;
  }
}

export function hapticFeedback(type: 'light' | 'medium' | 'heavy' = 'light') {
  if (!WebApp) return;
  try {
    if (WebApp.HapticFeedback) {
      WebApp.HapticFeedback.impactOccurred(type);
    }
  } catch (e) {
    // HapticFeedback ყოველთვის არ არის ხელმისაწვდომი
  }
}

// ახალი ფუნქციები fullscreen მართვისთვის
export function requestFullscreen() {
  if (!WebApp) return;
  try {
    if (WebApp.isVersionAtLeast && WebApp.isVersionAtLeast('8.0')) {
      const platform = WebApp.platform?.toLowerCase() || '';
      if (['android', 'ios'].includes(platform)) {
        WebApp.requestFullscreen();
      }
    }
  } catch (e) {
    console.log('requestFullscreen error:', e);
  }
}

export function exitFullscreen() {
  if (!WebApp) return;
  try {
    if (WebApp.isVersionAtLeast && WebApp.isVersionAtLeast('8.0')) {
      WebApp.exitFullscreen();
    }
  } catch (e) {
    console.log('exitFullscreen error:', e);
  }
}

export function isFullscreen(): boolean {
  if (!WebApp) return false;
  return WebApp.isFullscreen === true;
}