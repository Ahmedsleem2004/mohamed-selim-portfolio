import dmax2026 from '../assets/dmax-2026.png'

/**
 * Official 2024–2026 Isuzu D-Max double-cab (MHEV) studio still.
 * Flipped so the vehicle faces right for a left-to-right drive.
 */
export const DMAX_SRC = dmax2026
export const DMAX_ASPECT = 598 / 897
export const DMAX_GROUND = 0.86

export default function IsuzuFront({ className = '' }) {
  return (
    <img
      src={dmax2026}
      alt=""
      draggable={false}
      className={className}
      style={{
        display: 'block',
        width: '100%',
        height: '100%',
        objectFit: 'contain',
        transform: 'scaleX(-1)',
        transformOrigin: 'center center',
        userSelect: 'none',
        pointerEvents: 'none',
      }}
    />
  )
}
