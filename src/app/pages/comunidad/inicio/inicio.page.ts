import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { Post } from 'src/app/interfaces/interfaces'; // Ajusta tu ruta de interfaz
import { Foro } from 'src/app/services/foro';

@Component({
  standalone: false,
  selector: 'app-inicio',
  templateUrl: './inicio.page.html',
  styleUrls: ['./inicio.page.scss'],
})
export class InicioPage implements OnInit {

  public guiasRecientes$!: Observable<Post[]>;
  public comunidadReciente$!: Observable<Post[]>;

  constructor(
    private foroService: Foro,
    private navCtrl: NavController
  ) { }

  ngOnInit() {
    // 1. Traer las 2 guías más recientes
    this.guiasRecientes$ = this.foroService.getRecentPostsByCategory('guia', 2);

    // 2. Traer los 2 posts generales más recientes
    this.comunidadReciente$ = this.foroService.getRecentPostsByCategory('foro', 2);
  }

  // Función para abrir el detalle
  openPost(postId: string) {
    this.navCtrl.navigateForward(['/tabs/foro/post', postId]);
  }
  
  // Función para ir al foro completo
  goToForo() {
    this.navCtrl.navigateForward('/tabs/foro');
  }
}