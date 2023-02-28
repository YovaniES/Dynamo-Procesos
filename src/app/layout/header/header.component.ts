import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/core/services/auth.service';
import { MenuService } from 'src/app/core/services/menu.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
})
export class HeaderComponent implements OnInit {
  fullName: string = '';
  nameini!: string;
  userAbbreviation = '';
  fixedAside: boolean = true;
  phtouri = "NONE";
  rolUser:string = 'Solicitante';
  userLogueado: any;

  constructor(
    private authService: AuthService,
    private menuService: MenuService,
  ) {}

  ngOnInit(): void {
    this.initializeUser();
    this.userFullName();
    // this.getRolName();

    // this.userLogueado = JSON.parse(localStorage.getItem('currentUser'))

  }

  userRolName: string = '';
  currentUser: string = ''
  userFullName() {
    this.authService.getCurrentUser().subscribe((resp) => {
          this.currentUser = resp.user.nombres + ' '+ resp.user.apellidoPaterno ;
          this.userRolName = resp.user.rolName
          // console.log('USER-NEW', this.currentUser);
        })
      }

  initializeUser() {
    this.fullName = this.authService.getUsername();

    const names:string[] = this.fullName.split(" ");
    if (names.length > 1){
      this.nameini = names[0].charAt(0) + names[1].charAt(0);
    }else{
      this.nameini = names[0].substr(0,2).toUpperCase();
    }
  }

  // getRolName(x:any){
  //   // this.authService.getUserNameByRol().subscribe( (resp: any) => {
  //   //   console.log('=====>', resp);

  //   // })
  //   this.authService.login_score(x).subscribe(resp => {
  //     console.log('<>', resp);
  //   })
  // }

  openMobileMenu() {
    this.menuService.activeMenuMobile.emit(true);
  }

  logOut() {
    this.authService.logout();
  }
}
