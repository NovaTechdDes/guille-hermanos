export interface Usuario {
  id_usuario: number;
  usuario: string;
  nombre: string;
  password?: string;
  rol: 'ADMIN' | 'EMPLEADO' | 'SUPERADMIN';
  activo: boolean;
}

export interface Session {
  access_token: string;
  refresh_token: string;
  user: {
    id: string;
    email?: string;
  };
}
