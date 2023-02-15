import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-aside',
  templateUrl: './aside.component.html',
})
export class AsideComponent {
  @Output() generalfixedAside = new EventEmitter<Boolean>();
  fixedAside = true;
  menuList = [
    // {
    //   id: 1,
    //   code: 'GES',
    //   text: 'REPORTES',
    //   order: 1,
    //   icon: 'query_stats',
    //   type: 'PAREN',
    //   link: 'evento',
    //   enable: false,
    //   module: 'Reporte',
    //   displayed: false,
    //   submenus: [
    //     {
    //       code: 'MAN-001',
    //       text: 'Reporte Evento',
    //       order: 0,
    //       icon: 'bar_chart',
    //       type: 'ALONE',
    //       link: 'evento/reporte',
    //       enable: false,
    //       module: 'MAN',
    //       displayed: false,
    //     },
    //   ],
    // },
    // {
    //   id: 2,
    //   code: 'MAN',
    //   text: 'MANTENIMIENTO',
    //   order: 1,
    //   icon: 'settings_suggest',
    //   type: 'PAREN',
    //   link: 'mantenimiento',
    //   enable: false,
    //   module: 'administrador',
    //   displayed: false,
    //   // roles: PERMISSION.MENU_MANTENIMIENTO,
    //   submenus: [
    //     {
    //       code: 'PAS-001',
    //       text: 'Entidad',
    //       order: 3,
    //       icon: 'dashboard_customize',
    //       type: 'PAREN',
    //       link: 'mantenimiento/entidad',
    //       enable: false,
    //       module: 'PAS',
    //       displayed: false,
    //       // roles: PERMISSION.SUBMENU_ENTIDAD,
    //     },
    //   ],
    // },
    {
      id: 2,
      code: 'PRO',
      text: 'SCORE',
      order: 1,
      icon: 'timer',
      type: 'PAREN',
      link: 'score',
      enable: false,
      module: 'score',
      displayed: false,
      submenus: [
        {
          code: 'PAS-001',
          text: 'Lista Score',
          order: 3,
          icon: 'pending_actions',
          type: 'PAREN',
          link: 'score/lista',
          enable: false,
          module: 'PAS',
          displayed: false,
        },
      ],
    },
  ];

  clickLinkMenu() {
    this.menuList.forEach((item) => {
      item.displayed = false;
    });
  }

  clickToggleMenu(item: any) {
    const final = !item.displayed;
    if (!(this.fixedAside == false && final == false)) {
      this.menuList.map((item) => {
        item.displayed = false;
      });
      item.displayed = final;
    }
    this.toggleAside(true);
  }

  toggleAside(e: boolean) {
    this.fixedAside = e;
    this.generalfixedAside.emit(this.fixedAside);
  }
}

