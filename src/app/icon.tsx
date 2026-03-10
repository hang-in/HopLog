import { ImageResponse } from 'next/og';
import { getConfig } from '@/lib/config';

export const runtime = 'nodejs';
export const size = { width: 32, height: 32 };
export const contentType = 'image/png';

export default function Icon() {
  const config = getConfig();
  const { text, color, textColor, accentColor } = config.branding.favicon;

  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 20,
          background: color,
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: textColor,
          fontWeight: 900,
          borderRadius: '8px',
          position: 'relative',
          paddingBottom: '2px', // 이모지 수직 중앙 정렬 보정
        }}
      >
        {text}
        <div
          style={{
            position: 'absolute',
            right: 2,
            bottom: 2,
            width: 5,
            height: 5,
            background: accentColor,
            borderRadius: '50%',
            border: `1.5px solid ${color}`, // 포인트가 배경과 섞이지 않도록 보더 추가
          }}
        />
      </div>
    ),
    { ...size }
  );
}
