import { Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  @ViewChild('menuMinisterios') menuMinisterios?: ElementRef<HTMLDetailsElement>;

  @HostListener('document:click', ['$event'])
  fecharMenuMinisteriosAoClicarFora(event: MouseEvent): void {
    const elementoMenu = this.menuMinisterios?.nativeElement;

    // Mantem o submenu aberto apenas quando o clique aconteceu dentro dele.
    if (elementoMenu && !elementoMenu.contains(event.target as Node)) {
      elementoMenu.open = false;
    }
  }

  fecharMenuMinisterios(): void {
    if (this.menuMinisterios) {
      this.menuMinisterios.nativeElement.open = false;
    }
  }
}
