import { Component, OnInit } from '@angular/core';
import { Route, Router } from '@angular/router';

@Component({
  selector: 'app-not-found',
  templateUrl: './not-found.component.html',
  styleUrls: ['./not-found.component.scss']
})

export class NotFoundComponent implements OnInit {
  year = new Date().getFullYear();

  constructor( private router: Router) { }

  ngOnInit(): void {
  }

  regresarHome(){
    this.router.navigateByUrl('/home')
  }

}
