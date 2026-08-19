import * as Location from 'expo-location';
import type { LocalizacaoPonto } from '../types';

/**
 * RF-007: captura de localização no registro de ponto.
 * Distingue os estados que devem BLOQUEAR o registro (permissão negada, GPS desligado,
 * falha após retries) para a tela tratar cada caso.
 */
export type GpsResult =
  | { status: 'ok'; loc: LocalizacaoPonto }
  | { status: 'denied' }
  | { status: 'disabled' }
  | { status: 'error' };

export async function obterLocalizacao(): Promise<GpsResult> {
  try {
    const servicesOn = await Location.hasServicesEnabledAsync();
    if (!servicesOn) return { status: 'disabled' };
  } catch {
    // Em algumas plataformas (web) o check pode não existir — segue para a permissão.
  }

  const { status } = await Location.requestForegroundPermissionsAsync();
  if (status !== 'granted') return { status: 'denied' };

  // RF-007: retenta automaticamente até 3 vezes.
  for (let tentativa = 0; tentativa < 3; tentativa++) {
    try {
      const pos = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });
      const { latitude, longitude, accuracy } = pos.coords;

      let logradouro = 'Localização capturada';
      let complemento = `${latitude.toFixed(5)}, ${longitude.toFixed(5)}`;
      try {
        const [g] = await Location.reverseGeocodeAsync({ latitude, longitude });
        if (g) {
          const rua = [g.street, g.streetNumber].filter(Boolean).join(', ');
          logradouro = rua || g.name || logradouro;
          const cidadeUf = [g.subregion || g.city, g.region].filter(Boolean).join(' – ');
          complemento = [g.district, cidadeUf].filter(Boolean).join(', ') || complemento;
        }
      } catch {
        // reverseGeocode pode não estar disponível (ex.: web) — mantém coordenadas.
      }

      return {
        status: 'ok',
        loc: { latitude, longitude, precisao: accuracy ?? null, logradouro, complemento },
      };
    } catch {
      // tenta novamente
    }
  }
  return { status: 'error' };
}
