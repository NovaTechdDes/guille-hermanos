export interface Usuario {
  id_usuario: string;
  usuario: string;
  password?: string;
  rol: 'admin' | 'empleado' | 'superAdmin';
}
