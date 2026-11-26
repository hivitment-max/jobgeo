// Telegram SDK-ის დინამიური იმპორტი (SSR-ის თავიდან ასაცილებლად)
let WebApp: any = null;

if (typeof window !== 'undefined') {
  // მხოლოდ ბრაუზერში ჩაიტვირთება
  const sdk = require('@twa-dev/sdk');
  WebApp = sdk.WebApp;
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
  
  // Fullscreen კონფიგურაცია
  WebApp.ready();
  WebApp.expand();
  
  // Header და Background თეთრად
  try {
    WebApp.setHeaderColor('#ffffff');
    WebApp.setBackgroundColor('#ffffff');
  } catch (e) {
    // ზოგიერთ ვერსიაში ეს მეთოდები არ არის
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
    WebApp.HapticFeedback.impactOccurred(type);
  } catch (e) {
    // HapticFeedback ყოველთვის არ არის ხელმისაწვდომი
  }
}