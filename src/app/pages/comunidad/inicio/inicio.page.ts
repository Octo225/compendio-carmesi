import { Component, OnInit } from '@angular/core';
// Definición de interfaces para guías y posts del foro
interface Guia {
  titulo: string;
  subtitulo: string;
  imagen: string;
}

interface PostForo {
  titulo: string;
  meta: string;
}
@Component({
  standalone: false,
  selector: 'app-inicio',
  templateUrl: './inicio.page.html',
  styleUrls: ['./inicio.page.scss'],
})
export class InicioPage implements OnInit {

  ultimasGuias: Guia[] = [];
  foroPopular: PostForo[] = [];

  constructor() { }
// Inicializar datos de ejemplo
  ngOnInit() {
    this.ultimasGuias = [
      {
        titulo: 'Derrotar al Charro negro',
        subtitulo: 'Estrategias y puntos débiles.',
        imagen: 'https://placehold.co/80x80/c94a4a/ffffff?text=Jefe'
      },
      {
        titulo: 'El Enigma del codice',
        subtitulo: 'Solución al puzzle de la Biblioteca Prohibida.',
        imagen: 'https://placehold.co/80x80/e57373/ffffff?text=Puzzle'
      }
    ];

    this.foroPopular = [
      {
        titulo: '¿Cuál es su Glifo Carmesí favorito?',
        meta: '24 respuestas - por @Erudito22'
      },
      {
        titulo: 'Teoría: El secreto de la primera página',
        meta: '15 respuestas - por @LectorNocturno'
      }
    ];
  }

  abrirGuia(guia: Guia) {
  }

  abrirPost(post: PostForo) {
  }

}
