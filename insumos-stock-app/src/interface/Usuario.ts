export interface Usuario {
  usuario: string;
  password?: string;
  rol: "admin" | "empleado" | "superAdmin";
}
