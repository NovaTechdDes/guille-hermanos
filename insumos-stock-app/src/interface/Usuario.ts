export interface Usuario {
  id_usuario: string;
  usuario: string;
  password?: string;
  rol: 'ADMIN' | 'EMPLEADO' | 'SUPERADMIN';
  activo: boolean;
}
