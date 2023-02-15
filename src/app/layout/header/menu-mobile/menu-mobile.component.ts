import { Component, OnInit } from '@angular/core';
import { Router, UrlTree } from '@angular/router';
import { Menu } from 'src/app/core/models/menu.models';
import { MenuService } from 'src/app/core/services/menu.service';

@Component({
  selector: 'app-menu-mobile',
  templateUrl: './menu-mobile.component.html',
  styles: [],
})
export class MenuMobileComponent implements OnInit {
  subMenus: Menu[] = [];
  subMenuActive: boolean = false;
  subMenuTitle: string = '';
  active: boolean = false;
  headerLogo = './assets/images/logos/log2.svg';

  menuList = [
    {
      id: 1,
      code: 'GES',
      text: 'REPORTES',
      order: 1,
      icon: 'query_stats',
      type: 'PAREN',
      link: 'evento',
      enable: false,
      module: 'Reporte',
      displayed: false,
      submenus: [
        {
          code: 'MAN-001',
          text: 'Reporte Evento',
          order: 0,
          icon: 'bar_chart',
          type: 'ALONE',
          link: 'evento/reporte',
          enable: false,
          module: 'MAN',
          displayed: false,
        },
      ],
    },
    {
      id: 2,
      code: 'EVE',
      text: 'EVENTO',
      order: 1,
      icon: 'timer',
      type: 'PAREN',
      link: 'evento',
      enable: false,
      module: 'evento',
      displayed: false,
      submenus: [
        {
          code: 'PAS-001',
          text: 'Lista Eventos',
          order: 3,
          icon: 'pending_actions',
          type: 'PAREN',
          link: 'evento/lista',
          enable: false,
          module: 'PAS',
          displayed: false,
        },
      ],
    },
  ];

  constructor(private menuService: MenuService, private router: Router) {}

  ngOnInit(): void {
    this.menuService.activeMenuMobile.subscribe((e) => (this.active = e));
  }

  close() {
    this.menuService.activeMenuMobile.emit(false);
  }

  closeSubMenu() {
    this.subMenuActive = false;
    this.subMenuTitle = '';
    this.subMenus = [];
  }
  showSubMenu(item: Menu) {
    this.subMenuActive = true;
    this.subMenus = item.submenus;
    this.subMenuTitle = item.text;
  }
  gotoPage(link: string | UrlTree) {
    this.subMenuActive = false;
    this.active = false;
    this.router.navigateByUrl(link);
  }
}
