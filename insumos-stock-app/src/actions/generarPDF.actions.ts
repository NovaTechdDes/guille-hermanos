import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import { Platform } from 'react-native';
import { Mov_insumo } from '../interface/Mov_insumo';

dayjs.extend(utc);

export async function generarPDF(movimientos: Mov_insumo[]) {
  const filas = movimientos.map((movimiento) => {
    const isIngreso = movimiento.tipo.toUpperCase() === 'INGRESO';
    const badgeClass = isIngreso ? 'badge-ingreso' : 'badge-egreso';

    // Formatear fecha y hora
    const fechaFormateada = new Date(movimiento.fecha).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
    const horaFormateada = dayjs.utc(movimiento.created_at).local().format('HH:mm');

    const destinoOProveedor = movimiento.destino?.nombre ? `Destino: ${movimiento.destino.nombre}` : movimiento.provedor?.nombre ? `Proveedor: ${movimiento.provedor.nombre}` : 'N/A';

    return `<tr>
                <td style="white-space: nowrap;">${fechaFormateada}<br/><small style="color: #666;">${horaFormateada}</small></td>
                <td><strong>${movimiento.insumo?.nombre || 'Insumo Desconocido'}</strong></td>
                <td>${movimiento.bodega?.nombre || 'N/A'}</td>
                <td>${destinoOProveedor}</td>
                <td style="text-align: right; font-weight: bold; white-space: nowrap;">
                  ${isIngreso ? '+' : '-'}${movimiento.cantidad} ${movimiento.insumo?.unidad || ''}
                </td>
                <td style="text-align: center;"><span class="badge ${badgeClass}">${movimiento.tipo}</span></td>
                <td><small>${movimiento.observacion || '-'}</small></td>
                <td>${movimiento.usuarios?.nombre || 'N/A'}</td>
            </tr>`;
  });

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body {
            font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
            color: #333;
            padding: 20px;
            margin: 0;
          }
          h1 {
            color: #1f2937;
            font-size: 24px;
            margin-bottom: 5px;
          }
          .subtitle {
            color: #4b5563;
            font-size: 14px;
            margin-bottom: 25px;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 15px;
            font-size: 12px;
          }
          th {
            background-color: #f3f4f6;
            color: #374151;
            font-weight: 700;
            text-align: left;
            padding: 10px 8px;
            border-bottom: 2px solid #e5e7eb;
            text-transform: uppercase;
            font-size: 10px;
            letter-spacing: 0.5px;
          }
          td {
            padding: 10px 8px;
            border-bottom: 1px solid #e5e7eb;
            vertical-align: middle;
          }
          tr:nth-child(even) {
            background-color: #f9fafb;
          }
          .badge {
            display: inline-block;
            padding: 4px 8px;
            border-radius: 4px;
            font-size: 9px;
            font-weight: bold;
            text-transform: uppercase;
            text-align: center;
          }
          .badge-ingreso {
            background-color: #dcfce7;
            color: #15803d;
          }
          .badge-egreso {
            background-color: #ffedd5;
            color: #c2410c;
          }
          .footer {
            margin-top: 30px;
            font-size: 10px;
            color: #9ca3af;
            text-align: center;
            border-top: 1px solid #e5e7eb;
            padding-top: 10px;
          }
        </style>
      </head>
      <body>
        <h1>Historial de Movimientos de Insumos</h1>
        <div class="subtitle">Reporte generado el ${new Date().toLocaleDateString('es-ES')} - Cantidad de registros: ${movimientos.length}</div>
        <table>
            <thead>
                <tr>
                    <th>Fecha / Hora</th>
                    <th>Insumo</th>
                    <th>Bodega</th>
                    <th>Destino / Prov.</th>
                    <th style="text-align: right;">Cantidad</th>
                    <th style="text-align: center;">Tipo</th>
                    <th>Observación</th>
                    <th>Vendedor</th>
                </tr>
            </thead>
            <tbody>
                ${filas.join('')}
            </tbody>
        </table>
        <div class="footer">
          Novatech - Guille Hermanos &copy; ${new Date().getFullYear()}
        </div>
      </body>
    </html>
  `;

  const { uri } = await Print.printToFileAsync({
    html,
  });

  // Solución al error 'Not allowed to read file under given URL' de Expo Sharing en Android
  let fileUri = uri;
  if (Platform.OS === 'android' && !fileUri.startsWith('file:///')) {
    fileUri = fileUri.replace('file:/', 'file:///');
  }

  if (await Sharing.isAvailableAsync()) {
    await Sharing.shareAsync(fileUri, {
      mimeType: 'application/pdf',
      dialogTitle: 'Compartir PDF',
      UTI: 'com.adobe.pdf',
    });
  }
}
