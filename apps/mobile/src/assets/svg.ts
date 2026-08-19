/**
 * Assets SVG oficiais importados do projeto de design (claude.ai/design "Protótipo Saquetti"):
 * - rhexa-logo-new.svg  (wordmark RHEXA — letras claras + "X" azul, para fundo escuro)
 * - avatar-laura.svg    (avatar do usuário de demonstração)
 * Renderizados via react-native-svg <SvgXml>.
 */

export const rhexaLogoXml = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 285 82">
  <g>
    <g>
      <path fill="#e3e5e8" d="M235.94.2h11.12c.86,0,1.77,1.49,2.75,4.47.34.52,8.73,19.34,25.16,56.47-.09.46-.54.69-1.37.69h-10.78c-.94,0-1.98-1.77-3.09-5.33-2.06-4.47-8.12-18.32-18.17-41.57h-.17c-9.82,22.87-16.66,38.45-20.53,46.72l-.86.17h-10.61c-.63,0-1.09-.17-1.37-.52C222.63,28.12,231.65,7.81,235.09.37l.86-.17Z"></path>
      <text fill="#a3a7ad" font-family="'Poppins', 'Montserrat', sans-serif" font-size="10.4" font-weight="600" letter-spacing="0.08em" transform="translate(120.74 79.35)"><tspan x="0" y="0">JORNADA INTELIGENTE</tspan></text>
      <path fill="#e3e5e8" d="M24.36,1.03c9.86,3.26,14.8,9.86,14.8,19.82,0,2.83-.72,5.97-2.16,9.43-2.31,3.84-5.57,6.46-9.78,7.87v.52c9.2,15.32,13.8,23.16,13.8,23.54h-13.63c-.46-.14-1.8-2.22-4.02-6.23-10.1-17.59-15.2-26.67-15.32-27.21v-.17h8.26c7.07,0,10.6-2.64,10.6-7.92v-.48c0-1.39-.35-2.68-1.04-3.89-1.7-2.8-4.89-4.2-9.56-4.2H.52c-.35-.17-.52-.33-.52-.48V.68C.17.33.35.16.52.16h16.79c1.93,0,4.28.29,7.05.87Z"></path>
      <path fill="#e3e5e8" d="M47.16.16h11.42c.14,0,.32.17.52.52v24.36h24.93c.17,0,.35.17.52.52v11.08c0,.17-.17.35-.52.52h-24.93v24.53c0,.17-.17.35-.52.52h-11.42c-.17,0-.35-.17-.52-.52V.68c0-.17.17-.35.52-.52ZM86.32.16h11.08c.17,0,.35.17.52.52v61.01c0,.17-.17.35-.52.52h-11.08c-.17,0-.35-.17-.52-.52V.68c0-.17.17-.35.52-.52Z"></path>
      <path fill="#3d6fb5" d="M182.77,31.07s0,0,.01-.01l-7.76-10.14-.02.03-.03.04s0,0,0,0c-.15-.08-3.45-4.38-9.92-12.93-.82-1.2-1.56-2.25-2.24-3.17-.75-1.02-1.4-1.87-1.97-2.55-1.18-1.42-1.99-2.13-2.43-2.13h-14.5c-.08,0-.14.03-.19.07.54,1.04,2.89,4.19,7.07,9.47,9.85,12.72,15.28,19.89,16.32,21.53l-23.48,30.66c-.08.16-.12.27-.12.33h14.86c.27,0,.49-.06.67-.18l15.89-20.55.05-.06s0,0,0,0l.03-.04,7.84-10.24s-.05-.08-.07-.11Z"></path>
      <path fill="#2f5b9c" d="M185.47,30.99s-.05-.08-.07-.11c0,0,0,0,.01-.01l-1.16-1.51-1.4,1.83c.21.33.61.9,1.18,1.69l1.44-1.89Z"></path>
      <path fill="#3d6fb5" d="M175.51,7.86c-.82-1.2-1.56-2.25-2.24-3.17-.75-1.02-1.4-1.87-1.97-2.55-1.18-1.42-1.99-2.13-2.43-2.13h-7.84c.44,0,1.25.72,2.43,2.13.57.69,1.23,1.54,1.97,2.55.68.92,1.42,1.97,2.24,3.17,4.27,5.64,7.15,9.42,8.66,11.37l3.94-5.09c-1.33-1.75-2.91-3.83-4.76-6.27Z"></path>
      <path fill="#3d6fb5" d="M161.64,61.88c-.18.12-.4.18-.67.18h7.84c.27,0,.49-.06.67-.18l10.64-13.76c-1.74-2.29-3.04-3.99-3.9-5.09l-14.58,18.85Z"></path>
      <path fill="#3d6fb5" d="M185.4,30.86s0,0-.01.01c.02.03.05.08.07.11l-1.44,1.89c.87,1.2,2.16,2.93,3.87,5.18l5.41-7.07s-.05-.08-.07-.11c0,0,0,0,.01-.01l-5.08-6.63-3.92,5.12,1.16,1.51Z"></path>
      <path fill="#e3e5e8" d="M191.58.2c-.27,0-.49.06-.67.18l-10.64,13.76-3.94,5.09-1.31,1.7,7.76,10.14s0,0-.01.01c.02.03.05.08.07.11l1.4-1.83,3.92-5.12L206.32.52c.08-.16.12-.27.12-.33h-14.86Z"></path>
      <path fill="#e3e5e8" d="M199.16,52.72c-4.81-6.21-8.56-11.09-11.26-14.66-1.71-2.26-3-3.98-3.87-5.18-.57-.79-.97-1.36-1.18-1.69l-7.84,10.24v.07c.11.11.52.62,1.22,1.53.86,1.1,2.16,2.81,3.9,5.09,1.33,1.75,2.91,3.83,4.76,6.27.82,1.2,1.56,2.25,2.24,3.17l1.97,2.55c1.18,1.42,1.99,2.13,2.43,2.13h14.5c.08,0,.14-.03.19-.07-.54-1.04-2.89-4.19-7.07-9.47Z"></path>
      <path fill="#e3e5e8" d="M137.89,12.19c.35-.2.52-.38.52-.52V.55c-.17-.35-.35-.52-.52-.52h-33.83c-.35.17-.52.35-.52.52v11.12s0,.02.01.02v13.73s-.01.03-.01.05v11.12s0,.02.01.02v13.91s-.01.03-.01.05v11.12c.17.35.35.52.52.52h33.83c.35-.17.52-.35.52-.52v-11.12c-.17-.32-.35-.48-.52-.48h-22.23v-12.98h22.23c.35-.17.52-.35.52-.52v-11.12c-.17-.35-.35-.52-.52-.52h-22.23v-12.76h22.23Z"></path>
    </g>
  </g>
</svg>`;

/** Selo/QR de validação decorativo (carimbo da assinatura), do design. */
export const qrSeloXml = `<svg width="78" height="78" viewBox="0 0 84 84" shape-rendering="crispEdges" xmlns="http://www.w3.org/2000/svg"><rect width="84" height="84" fill="#fff"></rect><g fill="#0D1B2A"><rect x="4" y="4" width="24" height="24"></rect><rect x="56" y="4" width="24" height="24"></rect><rect x="4" y="56" width="24" height="24"></rect></g><g fill="#fff"><rect x="10" y="10" width="12" height="12"></rect><rect x="62" y="10" width="12" height="12"></rect><rect x="10" y="62" width="12" height="12"></rect></g><g fill="#0D1B2A"><rect x="36" y="4" width="6" height="6"></rect><rect x="48" y="10" width="6" height="6"></rect><rect x="36" y="16" width="6" height="6"></rect><rect x="42" y="22" width="6" height="6"></rect><rect x="56" y="36" width="6" height="6"></rect><rect x="68" y="36" width="6" height="6"></rect><rect x="62" y="42" width="6" height="6"></rect><rect x="74" y="48" width="6" height="6"></rect><rect x="4" y="36" width="6" height="6"></rect><rect x="16" y="36" width="6" height="6"></rect><rect x="10" y="42" width="6" height="6"></rect><rect x="36" y="36" width="6" height="6"></rect><rect x="48" y="42" width="6" height="6"></rect><rect x="36" y="48" width="6" height="6"></rect><rect x="56" y="56" width="6" height="6"></rect><rect x="68" y="62" width="6" height="6"></rect><rect x="42" y="62" width="6" height="6"></rect><rect x="56" y="74" width="6" height="6"></rect><rect x="74" y="68" width="6" height="6"></rect></g></svg>`;

export const avatarLauraXml = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="200" height="200">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#EDE9FE"></stop>
      <stop offset="1" stop-color="#DDE6FB"></stop>
    </linearGradient>
  </defs>
  <rect width="200" height="200" fill="url(#bg)"></rect>
  <path d="M52 96 C46 52 76 28 100 28 C124 28 154 52 148 96 C151 126 144 156 134 168 L150 200 L50 200 L66 168 C56 156 49 126 52 96 Z" fill="#4A3120"></path>
  <path d="M38 200 C42 166 70 150 100 150 C130 150 158 166 162 200 Z" fill="#324377"></path>
  <path d="M100 150 L100 200" stroke="#3A4E89" stroke-width="3"></path>
  <path d="M88 126 C88 142 88 148 100 152 C112 148 112 142 112 126 Z" fill="#E3AC82"></path>
  <ellipse cx="100" cy="96" rx="33" ry="39" fill="#F0C39C"></ellipse>
  <circle cx="67" cy="100" r="6" fill="#E3AC82"></circle>
  <circle cx="133" cy="100" r="6" fill="#E3AC82"></circle>
  <path d="M64 100 C58 60 80 38 100 38 C120 38 142 60 136 100 C133 80 128 64 100 64 C72 64 67 80 64 100 Z" fill="#5C3D27"></path>
  <path d="M64 100 C60 124 63 146 70 156 C58 146 55 120 60 98 Z" fill="#4A3120"></path>
  <path d="M136 100 C140 124 137 146 130 156 C142 146 145 120 140 98 Z" fill="#4A3120"></path>
  <path d="M82 88 q7 -4.5 14 0" stroke="#5C3D27" stroke-width="2.4" fill="none" stroke-linecap="round"></path>
  <path d="M104 88 q7 -4.5 14 0" stroke="#5C3D27" stroke-width="2.4" fill="none" stroke-linecap="round"></path>
  <ellipse cx="89" cy="97" rx="3.4" ry="4" fill="#3A2A1F"></ellipse>
  <ellipse cx="111" cy="97" rx="3.4" ry="4" fill="#3A2A1F"></ellipse>
  <circle cx="90.2" cy="95.6" r="1" fill="#fff"></circle>
  <circle cx="112.2" cy="95.6" r="1" fill="#fff"></circle>
  <path d="M100 100 l-2.5 8 q2.5 2 5 0" stroke="#D79A72" stroke-width="1.8" fill="none" stroke-linecap="round" stroke-linejoin="round"></path>
  <path d="M90 117 q10 8 20 0" stroke="#C2694A" stroke-width="2.6" fill="none" stroke-linecap="round"></path>
  <ellipse cx="79" cy="109" rx="5.5" ry="3.2" fill="#EE9D7C" opacity="0.45"></ellipse>
  <ellipse cx="121" cy="109" rx="5.5" ry="3.2" fill="#EE9D7C" opacity="0.45"></ellipse>
</svg>`;
