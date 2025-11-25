// src/app/components/registro/registro.component.ts
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from 'src/app/services/auth';
import { IonicModule, ToastController, LoadingController } from '@ionic/angular';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-registro-form',
  standalone: true,
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.scss'],
  imports: [CommonModule, IonicModule, ReactiveFormsModule]
})
export class RegistroComponent {

  registroForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authSvc: AuthService,
    private toastCtrl: ToastController,
    private loadingCtrl: LoadingController
  ) {
    this.registroForm = this.fb.group({
      // Nuevo campo Username
      username: ['', [Validators.required, Validators.minLength(4)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  async onRegister() {
    if (this.registroForm.invalid) return;

    const loading = await this.loadingCtrl.create({ message: 'Creando cuenta...' });
    await loading.present();

    // Extraemos los tres valores
    const { email, password, username } = this.registroForm.value;

    try {
      // Llamamos al método actualizado
      await this.authSvc.register(email, password, username);
      
      await loading.dismiss();
      this.presentToast(`¡Bienvenido, ${username}!`, 'success');
      
    } catch (error) {
      console.error(error);
      await loading.dismiss();
      this.presentToast('Error al registrar. Intenta nuevamente.', 'danger');
    }
  }

  async presentToast(message: string, color: string) {
    const toast = await this.toastCtrl.create({ message, color, duration: 2000, position: 'top' });
    toast.present();
  }
}