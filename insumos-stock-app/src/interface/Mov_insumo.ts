export interface Mov_insumo {
  id_mov: string;
  fecha: string;
  insumo_id: string;
  observacion: string;
  bodega_id: string;
  destino_id?: string;
  provedor_id?: string;
  cantidad: number;
  usuario_id: string;
  tipo: "Ingreso" | "Egreso";
}
