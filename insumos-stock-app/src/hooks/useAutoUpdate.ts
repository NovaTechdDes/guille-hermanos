import * as Updates from 'expo-updates';
import { useEffect } from 'react';

export function useAutoUpdate() {
  useEffect(() => {
    async function runUpdateCheck() {
      try {
        if (__DEV__) return;

        if (!Updates.isEnabled) return;

        const update = await Updates.checkForUpdateAsync();

        if (update.isAvailable) {
          //Descarga silenciosa

          await Updates.fetchUpdateAsync();
          //Lo deja descargado, listo para usar
        }
      } catch (error) {
        console.log('Update check error: ', error);
      }
    }
    runUpdateCheck();
  }, []);
}
