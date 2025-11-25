import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router'; // Para leer la URL
import { Foro } from 'src/app/services/foro';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-post-detail',
  templateUrl: './post-detail.page.html',
  styleUrls: ['./post-detail.page.scss'],
  standalone: false
})
export class PostDetailPage implements OnInit {

  post$: Observable<any> | undefined;
  comments$: Observable<any[]> | undefined;
  postId: string | null = null;
  newComment = ''; // Para el input del formulario

  constructor(
    private route: ActivatedRoute,
    private foroService: Foro
  ) { }

  ngOnInit() {
    // 1. Capturar el ID de la URL
    this.postId = this.route.snapshot.paramMap.get('id');

    if (this.postId) {
      // 2. Cargar el post
      this.post$ = this.foroService.getPostById(this.postId);
      // 3. Cargar los comentarios
      this.comments$ = this.foroService.getComments(this.postId);
    }
  }

  async sendComment() {
    if (!this.newComment.trim() || !this.postId) return;

    try {
      await this.foroService.addComment(this.postId, this.newComment);
      this.newComment = ''; // Limpiar input
    } catch (error) {
      console.error('Error al comentar', error);
    }
  }
}
