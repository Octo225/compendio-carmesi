export interface RespuestaBD {
  page: number;
  per_page: number;
  total: number;
  total_pages: number;
  data: Personajes[];
}
export interface Personajes {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  avatar: string;
}
export interface RespuestaDetalle {
  data: Detalle;
  support: InfGeneral;
}

export interface Detalle {
  apellido:string;
  nombre:string;
  id:string;
  armas:number;
  dano:number;
  descripcion:string;
  imagen:string;
  salud:number;
  velocidad:number;
}

export interface InfGeneral {
  url: string;
  text: string;
}

export interface personajesFirebase{
  apellido:string;
  nombre:string;
  id:string;
  armas:number;
  dano:number;
  descripcion:string;
  imagen:string;
  salud:number;
  velocidad:number;
}