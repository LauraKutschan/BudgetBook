import {Component, SimpleChanges} from '@angular/core';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.css']
})
export class OverviewComponent {

  constructor() {}

  navigate(): void {
    const navItems = document.getElementsByClassName('nav-item');

    for (let i = 0; i < navItems.length; i++) {
      navItems[i].addEventListener('click', () => {
        for(let j = 0; j < navItems.length; j++)
          navItems[j].classList.remove('active');

        navItems[i].classList.add('active');
      });
    }
  }
}
