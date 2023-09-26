import {Component, OnInit, SimpleChanges} from '@angular/core';
import {ActivatedRoute, NavigationEnd, Router} from "@angular/router";

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.css']
})
export class OverviewComponent implements OnInit{

  constructor(private router: Router){
  }

  ngOnInit(): void {
    const navItems = document.getElementsByClassName('nav-item');

    if(window.location.pathname == '/') {
      navItems[0].classList.add('active');
      navItems[1].classList.remove('active');
      navItems[2].classList.remove('active');
      navItems[3].classList.remove('active');
    } else if(window.location.pathname == '/map') {
      navItems[1].classList.add('active');
      navItems[0].classList.remove('active');
      navItems[2].classList.remove('active');
      navItems[3].classList.remove('active');
    } else if(window.location.pathname == '/upload') {
      navItems[2].classList.add('active');
      navItems[0].classList.remove('active');
      navItems[1].classList.remove('active');
      navItems[3].classList.remove('active');
    } else if(window.location.pathname == '/profile') {
      navItems[3].classList.add('active');
      navItems[0].classList.remove('active');
      navItems[2].classList.remove('active');
      navItems[1].classList.remove('active');
    }
  }

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
