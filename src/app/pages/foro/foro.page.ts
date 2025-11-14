import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { Post } from 'src/app/interfaces/interfaces';
import { Foro } from 'src/app/services/foro';


@Component({
  standalone: false,
  selector: 'app-foro',
  templateUrl: './foro.page.html',
  styleUrls: ['./foro.page.scss'],
})
export class ForoPage implements OnInit {

  // Creamos una variable Observable.
  // El $ al final es una convención para indicar que es un Observable.
  public posts$!: Observable<Post[]>;

  constructor(
    private foroService: Foro,
    private navCtrl: NavController
  ) { }

  ngOnInit() {
    // En lugar de suscribirnos, solo asignamos el observable
    this.posts$ = this.foroService.getPosts();
  }

  // Función para el botón de "Crear Post"
  goToCreatePost() {
    // Navega a la ruta que definiste en tu routing
    this.navCtrl.navigateForward('/foro/create');
  }

  // (Opcional) Función para ver el detalle de un post
  openPost(postId: string) {
    // Aún no hemos creado esta página, pero así es como navegarías
    console.log('Navegar al post con ID:', postId);
    // this.navCtrl.navigateForward(`/foro/post/${postId}`);
  }
}