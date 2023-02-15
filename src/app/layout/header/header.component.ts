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

  constructor(
    private authService: AuthService,
    private menuService: MenuService,
  ) {}

  ngOnInit(): void {
    this.initializeUser();
    this.userFullName();
  }

  currentUser: string = ''
  userFullName() {
    this.authService.getCurrentUser()
        .subscribe((resp) => {
          this.currentUser = resp.user.nombres + ' '+ resp.user.apellidoPaterno ;
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

    // if (this.fullName) {
    //   const fullNameToArray = this.fullName.split(' ').map((item: string) => {
    //     return item.substring(0, 1).toUpperCase();
    //   });
    //   this.userAbbreviation = fullNameToArray.join('');
    // }
  }

  openMobileMenu() {
    this.menuService.activeMenuMobile.emit(true);
  }

  logOut() {
    this.authService.logout();
  }
}
