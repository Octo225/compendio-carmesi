import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Personajes } from 'src/app/services/personajes';
import { EntradaLore } from 'src/app/interfaces/interfaces';

@Component({
  standalone: false,
  selector: 'app-lore-detalle',
  templateUrl: './lore-detalle.page.html',
  styleUrls: ['./lore-detalle.page.scss'],
})
export class LoreDetallePage implements OnInit {

  idEntrada!: string;

  detalleLore: EntradaLore = {} as EntradaLore; 

  constructor(
    private activatedRoute: ActivatedRoute,
    private servicioPersonajes: Personajes,
    private router: Router
  ) { }

  ngOnInit() {
    this.idEntrada = this.activatedRoute.snapshot.paramMap.get('id') ?? '';
    
    if (!this.idEntrada) {
      this.router.navigate(['/lore']);
      return; 
    }
    this.servicioPersonajes.getLoreDetalle(this.idEntrada).subscribe(respuesta => {
      this.detalleLore = respuesta as EntradaLore;

    });
  }

}