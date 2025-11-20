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

export interface personajesFirebase{
  apellido:string;
  nombre:string;
}

export interface EntradaLore {
  id: string;
  titulo: string;
  subtitulo: string;
  tipo: 'Personaje' | 'Enemigo' | 'Leyenda' | 'Lugar';
  descripcion: string;
  imagen: string;
}

export interface Post {
  id: string;
  title: string;
  content: string;
  authorId: string;
  authorName: string;
  createdAt: any;
}