import * as LocalAuthentication from 'expo-local-authentication';

export async function autenticarUsuario() {
  try {
    const compatible = await LocalAuthentication.hasHardwareAsync();
    const enrolled = await LocalAuthentication.isEnrolledAsync();

    if (!compatible || !enrolled) {
      return true;
    }

    const result = await LocalAuthentication.authenticateAsync({
      promptMessage: 'Desbloquear aplicacion',
      cancelLabel: 'Cancelar',
      disableDeviceFallback: false,
    });

    return result.success;
  } catch (error) {
    console.error(error);
    return false;
  }
}
