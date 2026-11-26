import { WebApp } from '@twa-dev/sdk';

export interface TelegramUser {
  id: number;
  username?: string;
  firstName: string;
  lastName?: string;
  languageCode: string;
}

export function initTelegram() {
  if (typeof window === 'undefined') return null;
  
  // Fullscreen კონფიგურაცია
  WebApp.ready();
  WebApp.expand();
  
  // Header და Background თეთრად გავხადოთ (როგორც ჩვენი დიზაინი)
  WebApp.setHeaderColor('#ffffff');
  WebApp.setBackgroundColor('#ffffff');
  
  // Safe area insets გამოვიყენოთ
  if ('setParams' in WebApp) {
    (WebApp as any).setParams({
      is_fullscreen: true,
    });
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
  WebApp.MainButton.hide();
}

export function showTelegramButton(text: string, onClick: () => void) {
  WebApp.MainButton.setText(text);
  WebApp.MainButton.show();
  WebApp.MainButton.onClick(onClick);
}

export function closeTelegramApp() {
  WebApp.close();
}

export function isTelegramAvailable(): boolean {
  return typeof window !== 'undefined' && WebApp.initData !== '';
}

export function hapticFeedback(type: 'light' | 'medium' | 'heavy' = 'light') {
  if ('HapticFeedback' in WebApp) {
    (WebApp as any).HapticFeedback.impactOccurred(type);
  }
}