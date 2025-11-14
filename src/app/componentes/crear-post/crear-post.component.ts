// src/app/componentes/crear-post/crear-post.component.ts
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { LoadingController, ToastController, NavController, IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common'; // <-- Necesario para *ngIf, etc.
import { Foro } from 'src/app/services/foro';

@Component({
  selector: 'app-crear-post',
  templateUrl: './crear-post.component.html',
  styleUrls: ['./crear-post.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonicModule,
    ReactiveFormsModule
  ]
})
export class CrearPostComponent implements OnInit {
  
 postForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private foro: Foro,
    private loadingCtrl: LoadingController, // Para mostrar un spinner
    private toastCtrl: ToastController,   // Para mostrar un mensaje de éxito/error
    private navCtrl: NavController          // Para navegar hacia atrás
  ) {
    this.postForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(5)]],
      content: ['', [Validators.required, Validators.minLength(10)]]
    });
  }

  ngOnInit() { }

  // Getter para acceso fácil
  get f() {
    return this.postForm.controls;
  }

  async onSubmit() {
    if (this.postForm.invalid) {
      return; // Detiene si el formulario es inválido
    }

    // 1. Muestra el "Loading"
    const loading = await this.loadingCtrl.create({
      message: 'Publicando...',
    });
    await loading.present();

    try {
      const { title, content } = this.postForm.value;
      await this.foro.createPost(title, content);
      
      // 2. Oculta el loading y muestra el "Toast" de éxito
      await loading.dismiss();
      this.presentToast('¡Publicación creada con éxito!');
      
      this.postForm.reset(); // Limpia el formulario
      this.navCtrl.back();   // Regresa a la página anterior
      
    } catch (error) {
      // 3. Oculta el loading y muestra el "Toast" de error
      await loading.dismiss();
      this.presentToast('Error al crear la publicación', 'danger');
      console.error('Error al crear el post:', error);
    }
  }

  // Helper para mostrar Toasts
  async presentToast(message: string, color: string = 'success') {
    const toast = await this.toastCtrl.create({
      message: message,
      duration: 3000,
      color: color,
      position: 'top'
    });
    toast.present();
  }
}