import { Component, Input, OnInit } from '@angular/core';
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'app-user-section',
  templateUrl: './user-section.component.html',
})
export class UserSectionComponent implements OnInit {
  @Input('nameini')  nameini: string='';
  @Input('photouri') photouri:string = 'NONE';

  hasphoto = false;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    if (this.photouri != 'NONE') {
      this.hasphoto = true;
    }
  }

  openPanel() {
    this.authService.toggleUserPanel.emit(true);
  }
}
