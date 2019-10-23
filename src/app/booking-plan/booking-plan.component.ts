import { Component, OnInit, Input } from '@angular/core';
import { Http, Jsonp } from '@angular/http';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { Router } from '@angular/router';

import { ConfigService } from '../app-config.service';

@Component({
  selector: 'app-booking-plan',
  templateUrl: './booking-plan.component.html',
  styleUrls: ['./booking-plan.component.css']
})
export class BookingPlanComponent implements OnInit {

  // 数据请求的地址
  url = '';
  // 是否显示预约唤醒方案窗口
  visible = false;
  // 查询条件-预约方案
  planName = '';
  // 查询条件-预约开始时间
  startTime: Date;
  // 查询条件-预约结束时间
  endTime: Date;
  // 预约方案列表
  bookingPlanList = [];
  // 数据列表加载loading
  tableLoading = false;
  // 数据总量
  tableTotal = 0;
  // 数据列表当前页数索引
  tablePage = 1;
  // 数据列表每页显示数据量
  tablePageSize = 10;

  // 传入参数-基站编号
  @Input() btsNo: string;
  // 操作类型
  @Input() operationState: number;

  constructor(private http: Http, private jsonp: Jsonp, private message: NzMessageService,
    private configService: ConfigService, private router: Router, private modalService: NzModalService) {
    this.url = configService.getRequestUrl();
  }

  ngOnInit() {
  }

  bookingPlan(): void {
    if (!this.checkToken()) {
      this.router.navigate(['']);
      return;
    }
    const _that = this;
    if (_that.startTime != null && _that.endTime != null) {
      if (_that.startTime > _that.endTime) {
        const timeLimitInfo = document.getElementById('timeLimitInfo').innerText;
        _that.message.warning(timeLimitInfo);
        return;
      }
    }
    _that.tableLoading = true;
    _that.bookingPlanList = [];
    const sTime = _that.dateToStringFun(_that.startTime);
    const eTime = _that.dateToStringFun(_that.endTime);
    this.jsonp.get(this.url + '/bookingPlan/getBookingPlan?planName=' + _that.planName +
      '&startTime=' + sTime + '&endTime=' + eTime + '&page=' + _that.tablePage + '&pageSize='
      + _that.tablePageSize + '&callback=JSONP_CALLBACK')
      .subscribe(
        function (objData) {
          const result = objData['_body'];
          if (result['success']) {
            for (let i = 0; i < result['bookingPlanList'].length; i++) {
              _that.bookingPlanList.push({
                checkValue: false,
                id: result['bookingPlanList'][i].id,
                plan_name: result['bookingPlanList'][i].plan_name,
                booking_reset_time: _that.stringToDateFun(result['bookingPlanList'][i].booking_reset_time),
                btsNum: result['bookingPlanList'][i].btsNum
              });
            }
            _that.tableTotal = result['totalElements'];
            _that.visible = true;
          } else {
            const userInvalid = document.getElementById('userInvalid').innerText;
            _that.modalService.warning({
              nzTitle: userInvalid,
              nzContent: result['msg']
            });
          }
          _that.tableLoading = false;
        },
        function (err) {
          console.log(err);
          const resetPlanFailed = document.getElementById('dataListFailed').innerText;
          _that.message.error(resetPlanFailed);
        }
      );
  }

  handleBookingCancel(): void {
    this.visible = false;
  }

  // 重置按钮事件
  queryReset(): void {
    this.planName = '';
    this.startTime = null;
    this.endTime = null;
  }

  // 数据清除
  dataClear(): void {
    this.queryReset();
    this.bookingPlanList = [];
  }

  selected(id: number): void {
    for (let i = 0; i < this.bookingPlanList.length; i++) {
      if (this.bookingPlanList[i].id !== id) {
        this.bookingPlanList[i].checkValue = false;
      }
    }
  }

  // 删除当前预约方案
  delBookingPlan(id: string): void {
    if (!this.checkToken()) {
      this.router.navigate(['']);
      return;
    }
    let btsNum = 0;
    for (let i = 0; i < this.bookingPlanList.length; i++) {
      if (this.bookingPlanList[i].id === id) {
        btsNum = this.bookingPlanList[i].btsNum;
        break;
      }
    }
    if (btsNum > 0) {
      const tips = document.getElementById('tips').innerText;
      const delBookingPlanTips = document.getElementById('delBookingPlanTips').innerText;
      this.modalService.confirm({
        nzTitle: '<i>' + tips + '</i>',
        nzContent: delBookingPlanTips,
        nzOnOk: () => this.delPlan(id)
      });
    } else {
      this.delPlan(id);
    }

  }

  delPlan(planId: string): void {
    const _that = this;
    this.jsonp.get(this.url + '/bookingPlan/delBookingPlan?showFlg=1&planId=' + planId + '&callback=JSONP_CALLBACK')
      .subscribe(
        function (objData) {
          const result = objData['_body'];
          if (result['success']) {
            _that.bookingPlan();
            const del = document.getElementById('del').innerText;
            const delSuccess = document.getElementById('delSuccess').innerText;
            _that.modalService.info({
              nzTitle: del,
              nzContent: delSuccess
            });
          } else {
            const userInvalid = document.getElementById('userInvalid').innerText;
            _that.modalService.warning({
              nzTitle: userInvalid,
              nzContent: result['msg']
            });
          }
        },
        function (err) {
          console.log(err);
          const resetPlanFailed = document.getElementById('dataListFailed').innerText;
          _that.message.error(resetPlanFailed);
        }
      );
  }

  // 添加方案按钮事件
  bookingPlanAddFun(): void {
    if (!this.checkToken()) {
      this.router.navigate(['']);
      return;
    }
    const _that = this;
    const defaultTime = new Date();
    defaultTime.setHours(defaultTime.getHours() + 1);
    this.jsonp.get(this.url + '/bookingPlan/addBookingPlan?planName=default&planTime='
      + this.dateToStringFun(defaultTime) + '&callback=JSONP_CALLBACK')
      .subscribe(
        function (objData) {
          const result = objData['_body'];
          if (result['success']) {
            _that.bookingPlan();
          } else {
            const userInvalid = document.getElementById('userInvalid').innerText;
            _that.modalService.warning({
              nzTitle: userInvalid,
              nzContent: result['msg']
            });
          }
        },
        function (err) {
          console.log(err);
          const resetPlanFailed = document.getElementById('dataListFailed').innerText;
          _that.message.error(resetPlanFailed);
        }
      );
  }

  // 确定添加基站到选中的方案
  addBtsToBookingPlan(): void {
    if (!this.checkToken()) {
      this.router.navigate(['']);
      return;
    }
    // 获取选中的方案编号
    let hasCheck = false;
    let selectedId: string;
    for (let i = 0; i < this.bookingPlanList.length; i++) {
      if (this.bookingPlanList[i].checkValue) {
        hasCheck = true;
        selectedId = this.bookingPlanList[i].id;
        break;
      }
    }
    // 判断是否选中一个方案
    if (!hasCheck) {
      const tips = document.getElementById('tips').innerText;
      const selectBookinPlan = document.getElementById('selectBookinPlan').innerText;
      this.modalService.warning({
        nzTitle: tips,
        nzContent: selectBookinPlan
      });
      return;
    }
    const _that = this;
    this.jsonp.get(this.url + '/bookingPlan/addBtsToBookingPlan?planId=' + selectedId
      + '&neCode=' + this.btsNo + '&operationState=' + this.operationState + '&callback=JSONP_CALLBACK')
      .subscribe(
        function (objData) {
          const result = objData['_body'];
          if (result['success']) {
            _that.bookingPlan();
            const tips = document.getElementById('tips').innerText;
            const addSuccess = document.getElementById('addSuccess').innerText;
            _that.modalService.info({
              nzTitle: tips,
              nzContent: addSuccess
            });
          } else {
            const userInvalid = document.getElementById('userInvalid').innerText;
            _that.modalService.warning({
              nzTitle: userInvalid,
              nzContent: result['msg']
            });
          }
          _that.tableLoading = false;
        },
        function (err) {
          console.log(err);
          const resetPlanFailed = document.getElementById('dataListFailed').innerText;
          _that.message.error(resetPlanFailed);
        }
      );
  }

  // 修改预约名称
  planNameChange(event: any, id: string): void {
    if (!this.checkToken()) {
      this.router.navigate(['']);
      return;
    }
    const name = event.target.value;
    const _that = this;
    this.jsonp.get(this.url + '/bookingPlan/updateBookingPlan?planTime=&showFlg=&planName='
      + name + '&id=' + id + '&callback=JSONP_CALLBACK')
      .subscribe(
        function (objData) {
          const result = objData['_body'];
          if (result['success']) {
            const tips = document.getElementById('tips').innerText;
            const motifySuccess = document.getElementById('motifySuccess').innerText;
            _that.modalService.info({
              nzTitle: tips,
              nzContent: motifySuccess
            });
          } else {
            const userInvalid = document.getElementById('userInvalid').innerText;
            _that.modalService.warning({
              nzTitle: userInvalid,
              nzContent: result['msg']
            });
          }
        },
        function (err) {
          console.log(err);
          const resetPlanFailed = document.getElementById('dataListFailed').innerText;
          _that.message.error(resetPlanFailed);
        }
      );
  }

  // 修改预约时间
  planTimeChange(date: Date, id: string): void {
    if (!this.checkToken()) {
      this.router.navigate(['']);
      return;
    }
    // 检查时间是否在当前时间~当天23:59:59范围内
    const startTime = new Date();
    const endTime = new Date();
    endTime.setHours(23, 59, 59);
    if (date >= startTime && date <= endTime) {
      const _that = this;
      this.jsonp.get(this.url + '/bookingPlan/updateBookingPlan?showFlg=&planName=&planTime=' + this.dateToStringFun(date)
        + '&id=' + id + '&callback=JSONP_CALLBACK')
        .subscribe(
          function (objData) {
            const result = objData['_body'];
            if (result['success']) {
              const tips = document.getElementById('tips').innerText;
              const motifySuccess = document.getElementById('motifySuccess').innerText;
              _that.modalService.info({
                nzTitle: tips,
                nzContent: motifySuccess
              });
            } else {
              if (result['msg'].indexOf('exists') > 0) {
                const tips = document.getElementById('tips').innerText;
                const bookingPlanIsExist = document.getElementById('bookingPlanIsExist').innerText;
                _that.modalService.warning({
                  nzTitle: tips,
                  nzContent: bookingPlanIsExist
                });
              } else {
                const userInvalid = document.getElementById('userInvalid').innerText;
                _that.modalService.warning({
                  nzTitle: userInvalid,
                  nzContent: result['msg']
                });
              }
            }
          },
          function (err) {
            console.log(err);
            const resetPlanFailed = document.getElementById('dataListFailed').innerText;
            _that.message.error(resetPlanFailed);
          }
        );
    } else {
      const tips = document.getElementById('tips').innerText;
      const timeIsNotRight = document.getElementById('timeIsNotRight').innerText;
      this.modalService.warning({
        nzTitle: tips,
        nzContent: timeIsNotRight
      });
    }
  }

  // 检查token有效性
  checkToken(): boolean {
    const userName = sessionStorage.getItem('userName') === null ? '' : sessionStorage.getItem('userName');
    const token = sessionStorage.getItem('token') === null ? '' : sessionStorage.getItem('token');
    if (userName === '' || token === '') {
      return false;
    }
    return true;
  }

  // 把Date型的日期转换成字符串型
  dateToStringFun(date: Date): String {
    if (date != null) {
      const y = date.getFullYear();
      const m = date.getMonth() + 1;
      const month = m < 10 ? ('0' + m) : m;
      const d = date.getDate();
      const day = d < 10 ? ('0' + d) : d;
      const h = date.getHours();
      const hour = h < 10 ? ('0' + h) : h;
      const mi = date.getMinutes();
      const minute = mi < 10 ? ('0' + mi) : mi;
      const s = date.getSeconds();
      const second = s < 10 ? ('0' + s) : s;
      return y + '-' + month + '-' + day + ' ' + hour + ':' + minute + ':' + second;
    } else {
      return '';
    }
  }

  // 把字符串型的日期转换成Date型
  stringToDateFun(dateStr: string): Date {
    if (dateStr != null && dateStr !== '') {
      return new Date(dateStr);
    }
  }
}
