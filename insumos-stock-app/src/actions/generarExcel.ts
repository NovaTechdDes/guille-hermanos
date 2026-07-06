import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { documentDirectory, writeAsStringAsync } from 'expo-file-system/legacy';
import * as Sharing from 'expo-sharing';
import { Platform } from 'react-native';
import * as XLSX from 'xlsx';
import { Mov_insumo } from '../interface/Mov_insumo';

dayjs.extend(utc);

export async function generarExcel(movimientos: Mov_insumo[]) {
  const data = movimientos.map((movimiento) => {
    const isIngreso = movimiento.tipo.toUpperCase() === 'INGRESO';

    // Formatear fecha y hora
    const fechaFormateada = new Date(movimiento.fecha).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
    const horaFormateada = dayjs.utc(movimiento.created_at).local().format('HH:mm');

    const destinoOProveedor = movimiento.destino?.nombre ? `Destino: ${movimiento.destino.nombre}` : movimiento.provedor?.nombre ? `Proveedor: ${movimiento.provedor.nombre}` : 'N/A';

    return {
      Fecha: fechaFormateada,
      Hora: horaFormateada,
      Insumo: movimiento.insumo?.nombre || 'Insumo Desconocido',
      Bodega: movimiento.bodega?.nombre || 'N/A',
      'Destino / Prov.': destinoOProveedor,
      Cantidad: `${isIngreso ? '+' : '-'}${movimiento.cantidad} ${movimiento.insumo?.unidad || ''}`,
      Tipo: movimiento.tipo,
      Observación: movimiento.observacion || '-',
      Vendedor: movimiento.usuarios?.nombre || 'N/A',
    };
  });

  const worksheet = XLSX.utils.json_to_sheet(data);

  // Ajustar ancho de columnas automáticamente para que quede bien presentado
  const maxLengths = data.reduce(
    (acc, row) => {
      Object.keys(row).forEach((key) => {
        const val = row[key as keyof typeof row] || '';
        acc[key] = Math.max(acc[key] || key.length, val.toString().length);
      });
      return acc;
    },
    {} as Record<string, number>
  );

  worksheet['!cols'] = Object.keys(maxLengths).map((key) => ({
    wch: maxLengths[key] + 3,
  }));

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Movimientos');

  const wbout = XLSX.write(workbook, {
    type: 'base64',
    bookType: 'xlsx',
  });

  const filename = `movimientos_${dayjs().format('YYYYMMDD_HHmmss')}.xlsx`;
  const fileUri = `${documentDirectory}${filename}`;

  await writeAsStringAsync(fileUri, wbout, {
    encoding: 'base64',
  });

  let shareUri = fileUri;
  if (Platform.OS === 'android' && !shareUri.startsWith('file:///')) {
    shareUri = shareUri.replace('file:/', 'file:///');
  }

  if (await Sharing.isAvailableAsync()) {
    await Sharing.shareAsync(shareUri, {
      mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      dialogTitle: 'Compartir Excel',
      UTI: 'com.microsoft.excel.xlsx',
    });
  }
}
