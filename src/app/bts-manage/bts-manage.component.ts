import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { ConfigService } from '../app-config.service';

@Component({
  selector: 'app-bts-manage',
  templateUrl: './bts-manage.component.html',
  styleUrls: ['./bts-manage.component.css']
})
export class BtsManageComponent implements OnInit {

  constructor(private configService: ConfigService, private router: Router) {

  }

  ngOnInit() {

  }

  // 基站信息维护按钮，弹窗打开
  handleBtsMng(): void {
    const userName = sessionStorage.getItem('userName') === null ? '' : sessionStorage.getItem('userName');
    const token = sessionStorage.getItem('token') === null ? '' : sessionStorage.getItem('token');
    if (userName === '' || token === '') {
        this.router.navigate(['']);
        return;
    }
    const btsInfoManageUrl = this.configService.getBtsInfoManageUrl();
    window.open(btsInfoManageUrl + '?token=' + token, '_blank');
  }

}
