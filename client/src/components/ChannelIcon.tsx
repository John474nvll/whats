import { cn } from '@/lib/utils';

interface ChannelIconProps {
  channel: string;
  className?: string;
}

export function ChannelIcon({ channel, className }: ChannelIconProps) {
  // Map simplified channel names to branding colors/icons if we had specific SVGs
  // For now using simple colored circles or indicators could work, but let's do something simpler with text or lucide icons for now if generic

  // Actually, let's make nice colored indicators using FontAwesome-like logic or just colored divs
  // In a real project I'd import specific brand icons (WhatsApp, Messenger, Instagram)

  if (channel === 'whatsapp') {
    return (
      <div
        className={cn(
          'rounded-full bg-green-500 flex items-center justify-center text-white font-bold text-[10px]',
          className,
        )}
      >
        WA
      </div>
    );
  }

  if (channel === 'facebook') {
    return (
      <div
        className={cn(
          'rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-[10px]',
          className,
        )}
      >
        FB
      </div>
    );
  }

  if (channel === 'instagram') {
    return (
      <div
        className={cn(
          'rounded-full bg-pink-600 flex items-center justify-center text-white font-bold text-[10px]',
          className,
        )}
      >
        IG
      </div>
    );
  }

  return (
    <div
      className={cn(
        'rounded-full bg-gray-400 flex items-center justify-center text-white font-bold text-[10px]',
        className,
      )}
    >
      ??
    </div>
  );
}
