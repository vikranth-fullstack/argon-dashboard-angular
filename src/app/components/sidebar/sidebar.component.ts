import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

declare interface RouteInfo {
  path: string;
  title: string;
  icon: string;
  class: string;
}
export const ROUTES: RouteInfo[] = [
  { path: '/dashboard', title: 'Urban Rider', icon: 'ni-settings', class: '' },
  { path: '/dashboard', title: 'Catalogue', icon: 'fa fa-sitemap', class: '' },

  { path: '/dashboard', title: 'Scratch Cards', icon: 'fa fa-qrcode', class: '' },
  { path: '/register', title: 'Create', icon: 'fa fa-plus-square', class: '', }
];


@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {

  public menuItems: any[];
  public isCollapsed = true;
  result: any = [];
  openSidebar: boolean = true;

  constructor(private router: Router) {
    
  }

  menuSidebar = [
    {
      link_name: 'Urban Rider',
      link: '/dashboard',
      icon: 'fa fa-gear',
      sub_menu: [],
    },
    {
      link_name: 'Catalogue',
      link: '/catalog',
      icon: 'fa fa-sitemap',
      sub_menu: [
      ],
    },
    {
      link_name: 'Scratch Cards',
      link: '/tables',
      icon: 'fa fa-qrcode',
      sub_menu: [

      ],
    },

    {
      link_name: 'Create',
      link: null,
      icon: 'fa fa-plus-square',
      sub_menu: [
        {
          link_name: 'New Catalogue',
          link: '/register',
        },
        {
          link_name: 'New Scratch Card',
          link: '/maps',
        }
      ],
    }

  ];

  ngOnInit() {
    
    this.router.events.subscribe((event) => {
      this.isCollapsed = true;
    });
  }
  showSubmenu(itemEl: HTMLElement) {
    itemEl.classList.toggle('showMenu');
  }
  logout() {
    localStorage.clear();
    //this.authService.logout(); // Assuming you have a logout method in your AuthService
    this.router.navigate(['/login']); // Redirect to login page
  }
}
