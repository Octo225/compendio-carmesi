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
    private foroService: Foro,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController,
    private navCtrl: NavController
  ) {
    this.postForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(5)]],
      content: ['', [Validators.required, Validators.minLength(10)]],
      // Nuevo campo con valor por defecto 'foro'
      category: ['foro', [Validators.required]]
    });
  }

  ngOnInit() { }

  // Getter para acceso fácil
  get f() {
    return this.postForm.controls;
  }

 async onSubmit() {
    if (this.postForm.invalid) return;

    const loading = await this.loadingCtrl.create({ message: 'Publicando...' });
    await loading.present();

    try {
      // Extraemos también la categoría
      const { title, content, category } = this.postForm.value;

      // La pasamos al servicio
      await this.foroService.createPost(title, content, category);

      await loading.dismiss();
      this.presentToast('¡Publicación creada con éxito!');
      this.postForm.reset();
      this.navCtrl.back();

    } catch (error) {
      await loading.dismiss();
      this.presentToast('Error al crear la publicación', 'danger');
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
