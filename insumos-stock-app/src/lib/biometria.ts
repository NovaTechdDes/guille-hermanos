import * as LocalAuthentication from 'expo-local-authentication';
import * as SecureStore from 'expo-secure-store';

const KEY = 'biometric_config';

export interface BiometricConfig {
  userId: string;
  enabled: boolean;
}

export async function canUseBiometrics() {
  const hasHardware = await LocalAuthentication.hasHardwareAsync();

  if (!hasHardware) return false;

  const enrolled = await LocalAuthentication.isEnrolledAsync();

  if (!enrolled) return false;

  return true;
}

export async function saveBiometricConfig(config: BiometricConfig) {
  await SecureStore.setItemAsync(KEY, JSON.stringify(config));
}

export async function getBiometricConfig(): Promise<BiometricConfig | null> {
  const value = await SecureStore.getItemAsync(KEY);

  if (!value) return null;

  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
}

export async function removeBiometricConfig() {
  await SecureStore.deleteItemAsync(KEY);
}

export async function authenticateBiometric() {
  return await LocalAuthentication.authenticateAsync({
    promptMessage: 'Desbloquear Aplicacion',
    cancelLabel: 'Cancelar',
    fallbackLabel: 'Usar Código del Teléfono',
    disableDeviceFallback: false,
  });
}
