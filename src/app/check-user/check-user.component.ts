import { Component, OnInit } from '@angular/core';
import { Http, Jsonp } from '@angular/http';
import { Router, ActivatedRoute } from '@angular/router';
import { NzModalService } from 'ng-zorro-antd';
import { HttpClient } from '@angular/common/http';
import { ConfigService } from '../app-config.service';

@Component({
  selector: 'app-check-user',
  templateUrl: './check-user.component.html',
  styleUrls: ['./check-user.component.css']
})
export class CheckUserComponent implements OnInit {

  // 数据请求的地址
  url = '';

  constructor(private http: Http, private jsonp: Jsonp, private router: Router, private configService: ConfigService,
    private route: ActivatedRoute, private modalService: NzModalService, private httpclient: HttpClient) {
    this.url = configService.getRequestUrl();
  }

  ngOnInit(): void {
    const userName = this.route.snapshot.queryParams['user'];
    const token = this.route.snapshot.queryParams['token'];
    if ((userName === undefined || userName === 'undefined') ||
      (token === undefined || token === 'undefined')) {
      this.modalService.warning({
        nzTitle: '错误',
        nzContent: '请重新登录'
      });
      return;
    }
    if (this.url === null || this.url === '') {
      const _that = this;
      this.httpclient.get('assets/api-config.json').subscribe(result => {
        localStorage.setItem('apiConfig', JSON.stringify(result));
        const item = localStorage.getItem('apiConfig');
        _that.url = JSON.parse(item)['requestUrl'];
        _that.checkToken(this, this.url, token, userName);
      });
    } else {
      this.checkToken(this, this.url, token, userName);
    }
  }

  checkToken(object: any, url: string, token: string, userName: string) {
    const _that = object;
    this.jsonp.get(this.url + '/wakeUpBts/checkToken?token=' + token + '&userName=' + userName + '&callback=JSONP_CALLBACK')
      .subscribe(
        function (data) {
          const result = data['_body'];
          if (result['success'] === '0') {
            sessionStorage.setItem('userName', result['userName']);
            sessionStorage.setItem('token', token);
            _that.router.navigate(['/abnormalDiagnostic']);
          } else {
            _that.modalService.warning({
              nzTitle: '用户失效',
              nzContent: result['msg']
            });
          }
        },
        function (err) {
          _that.modalService.warning({
            nzTitle: '错误',
            nzContent: '请重新登录'
          });
        }
      );
  }

}
