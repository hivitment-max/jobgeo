// Telegram Web App ტიპების განსაზღვრა
export {};

declare global {
  interface Window {
    Telegram?: {
      WebApp?: {
        // ძირითადი მეთოდები
        ready: () => void;
        expand: () => void;
        close: () => void;
        setHeaderColor: (color: string) => void;
        setBackgroundColor: (color: string) => void;
        
        // Fullscreen მეთოდები (Bot API 8.0+)
        requestFullscreen: () => void;
        exitFullscreen: () => void;
        isFullscreen: boolean;
        
        // ვერსიის შემოწმება
        isVersionAtLeast: (version: string) => boolean;
        version: string;
        platform: string;
        
        // ივენთები
        onEvent: (eventType: string, eventHandler: (eventData?: any) => void) => void;
        offEvent: (eventType: string, eventHandler: (eventData?: any) => void) => void;
        
        // ინიციალიზაციის მონაცემები
        initData: string;
        initDataUnsafe: {
          user?: {
            id: number;
            username?: string;
            first_name: string;
            last_name?: string;
            language_code?: string;
            photo_url?: string;
            is_premium?: boolean;
          };
          chat?: any;
          chat_type?: string;
          auth_date?: number;
          hash?: string;
        };
        
        // Main Button
        MainButton: {
          text: string;
          color: string;
          textColor: string;
          isVisible: boolean;
          isActive: boolean;
          isProgressVisible: boolean;
          setText: (text: string) => void;
          onClick: (callback: () => void) => void;
          offClick: (callback: () => void) => void;
          show: () => void;
          hide: () => void;
          enable: () => void;
          disable: () => void;
          showProgress: (leaveActive?: boolean) => void;
          hideProgress: () => void;
          setParams: (params: {
            text?: string;
            color?: string;
            text_color?: string;
            is_active?: boolean;
            is_visible?: boolean;
          }) => void;
        };
        
        // Haptic Feedback
        HapticFeedback?: {
          impactOccurred: (style: 'light' | 'medium' | 'heavy' | 'rigid' | 'soft') => void;
          notificationOccurred: (type: 'error' | 'success' | 'warning') => void;
          selectionChanged: () => void;
        };
      };
    };
  }
}