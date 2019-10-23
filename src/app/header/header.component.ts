import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { ConfigService } from '../app-config.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  isCollapsed = false;

  loginFlag = false;

  username = '';

  password = '';

  constructor(private router: Router, private configService: ConfigService) {

  }

  ngOnInit() {
    this.username = sessionStorage.getItem('userName') === null ? '' : sessionStorage.getItem('userName');
    if (this.username === '') {
      this.username = '未登录';
    }
    this.validateToken();
  }

  login() {
    const negUrl = this.configService.getNegLoginUrl();
    window.open(negUrl, '_blank');
  }

  validateToken() {

  }

  logout() {
    sessionStorage.clear();
    const negUrl = this.configService.getNegLoginUrl();
    window.open(negUrl, '_blank');
    this.router.navigate(['']);
  }

  opemMenu() {
    this.isCollapsed = true;
  }

}
