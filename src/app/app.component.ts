import { Component } from '@angular/core';

@Component({
  standalone: false,
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor() {}
  toggleTheme(event: any) {
  if (event.detail.checked) {
    document.body.classList.add('dark');
  } else {
    document.body.classList.remove('dark');
  }
}
}