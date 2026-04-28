export interface Mov_insumo {
  id_mov?: string;
  fecha: string;
  insumo_id: string;
  observacion: string;
  bodega_id: string;
  destino_id?: string;
  provedor_id?: string;
  cantidad: number;
  usuario_id: string;
  tipo: 'INGRESO' | 'EGRESO';
  insumo?: { id: string; nombre: string; unidad: string };
  bodega?: { id: string; nombre: string };
  destino?: { id: string; nombre: string };
  provedor?: { id: string; nombre: string };
}
