import { Component, OnInit } from '@angular/core';
import { Personajes } from 'src/app/services/personajes';
import { EntradaLore } from 'src/app/interfaces/interfaces';
import { Router } from '@angular/router';

@Component({
  standalone: false,
  selector: 'app-lore-lista',
  templateUrl: './lore-lista.page.html',
  styleUrls: ['./lore-lista.page.scss'],
})
export class LoreListaPage implements OnInit {

  entradasLore: EntradaLore[] = [];

  constructor(
    private servicioPersonajes: Personajes,
    private router: Router
    ) { }

  ngOnInit() {
    this.servicioPersonajes.getLore().subscribe(respuesta => {
      this.entradasLore = []; 
      respuesta.forEach(entrada => {
        this.entradasLore.push(entrada as EntradaLore);
      });
    });
  }


  verDetalle(id: string) {
    this.router.navigate(['/lore', id]);
  }

}