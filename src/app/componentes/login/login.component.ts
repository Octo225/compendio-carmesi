// src/app/components/login/login.component.ts
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { IonicModule, ToastController, LoadingController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { AuthService } from 'src/app/services/auth';

@Component({
  selector: 'app-login-form',
  standalone: true,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  imports: [CommonModule, IonicModule, ReactiveFormsModule] // Importante importar esto
})
export class LoginComponent {

  loginForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authSvc: AuthService,
    private toastCtrl: ToastController,
    private loadingCtrl: LoadingController
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  async onLogin() {
    if (this.loginForm.invalid) return;

    const loading = await this.loadingCtrl.create({ message: 'Iniciando sesión...' });
    await loading.present();

    const { email, password } = this.loginForm.value;

    try {
      await this.authSvc.login(email, password); // Asegúrate que tu servicio tenga este método
      await loading.dismiss();
      // No necesitamos navegar, el PerfilPage detectará el cambio de usuario automáticamente
    } catch (error) {
      await loading.dismiss();
      this.presentToast('Credenciales incorrectas', 'danger');
    }
  }

  async presentToast(message: string, color: string) {
    const toast = await this.toastCtrl.create({ message, color, duration: 2000, position: 'top' });
    toast.present();
  }
}