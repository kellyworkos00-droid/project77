export type Theme = 'midnight' | 'ocean' | 'forest' | 'sunset' | 'nord' | 'highcontrast'

export const THEMES: Record<Theme, { name: string; bg: string; accent: string; description: string }> = {
  midnight: {
    name: 'Midnight',
    bg: 'radial-gradient(circle_at_20%_20%,rgba(124,58,237,0.18),transparent_32%),radial-gradient(circle_at_80%_0%,rgba(34,211,238,0.2),transparent_30%),linear-gradient(145deg,#0a0f1f,#0c1126_50%,#0a0e1c)',
    accent: 'sky-400',
    description: 'Dark with purple and sky accents'
  },
  ocean: {
    name: 'Ocean',
    bg: 'radial-gradient(circle_at_40%_20%,rgba(6,182,212,0.15),transparent_40%),radial-gradient(circle_at_80%_100%,rgba(34,211,238,0.15),transparent_50%),linear-gradient(145deg,#001f2e,#003d5c_50%,#001a2e)',
    accent: 'cyan-400',
    description: 'Deep ocean blues'
  },
  forest: {
    name: 'Forest',
    bg: 'radial-gradient(circle_at_20%_30%,rgba(34,197,94,0.12),transparent_40%),radial-gradient(circle_at_80%_10%,rgba(59,130,246,0.1),transparent_35%),linear-gradient(145deg,#0a1f0a,#0d2e1a_50%,#0a1a0f)',
    accent: 'emerald-400',
    description: 'Natural green tones'
  },
  sunset: {
    name: 'Sunset',
    bg: 'radial-gradient(circle_at_20%_20%,rgba(234,88,12,0.12),transparent_40%),radial-gradient(circle_at_80%_80%,rgba(190,24,93,0.1),transparent_50%),linear-gradient(145deg,#1f0a0a,#2e1a0d_50%,#1a0f0a)',
    accent: 'orange-400',
    description: 'Warm orange and rose tones'
  },
  nord: {
    name: 'Nord',
    bg: 'radial-gradient(circle_at_20%_20%,rgba(136,192,208,0.1),transparent_40%),radial-gradient(circle_at_80%_80%,rgba(143,188,187,0.08),transparent_50%),linear-gradient(145deg,#0d1117,#1a2332_50%,#0d1117)',
    accent: 'slate-300',
    description: 'Cool Nordic palette'
  },
  highcontrast: {
    name: 'High Contrast',
    bg: 'linear-gradient(145deg,#000000,#111111)',
    accent: 'yellow-300',
    description: 'Maximum contrast and accessibility'
  }
}

export function getThemeStyles(theme: Theme) {
  return THEMES[theme]
}
