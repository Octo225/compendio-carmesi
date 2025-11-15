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
  public posts$!: Observable<Post[]>;

  constructor(
    private foroService: Foro,
    private navCtrl: NavController
  ) { }

  ngOnInit() {
    this.posts$ = this.foroService.getPosts();
  }

  // Función para el botón de "Crear Post"
  goToCreatePost() {
    this.navCtrl.navigateForward('/foro/create');
  }

  openPost(postId: string) {
    console.log('Navegar al post con ID:', postId);
    // this.navCtrl.navigateForward(`/foro/post/${postId}`);
  }
}