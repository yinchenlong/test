import { Component, OnInit } from '@angular/core';
import { Http, Jsonp, Headers } from '@angular/http';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { ActivatedRoute, Router } from '@angular/router';

import { ConfigService } from '../app-config.service';

@Component({
  selector: 'app-pending-booking-reset',
  templateUrl: './pending-booking-reset.component.html',
  styleUrls: ['./pending-booking-reset.component.css']
})
export class PendingBookingResetComponent implements OnInit {
  // 数据请求的地址
  url = '';

  // 异常快照-所属城市下拉框数据集
  cityList = [];
  // 异常快照-所属地区下拉框数据集
  areaList = [];
  // 所属城市下拉框选择值
  cityCode = '';
  // 所属地区下拉框选择值
  regionCode = '';
  // 基站名称输入框中的值
  neName = '';
  // 版本
  version = '';
  // 开始时间
  startTime: Date;
  // 结束时间
  endTime: Date;
  // 数据列表加载loading
  tableLoading = false;
  // 数据列表
  tableDataList = [];
  // 数据总量
  tableTotal = 0;
  // 数据列表当前页数索引
  tablePage = 1;
  // 数据列表每页显示数据量
  tablePageSize = 10;

  // 窗体的标题
  windowTitle = '';
  // 激活告警窗体是否显示
  windowGridVisible = false;
  // 窗体中列表类型，用于区分显示哪一种异常明细列表
  windowType = '';

  // 异常信息-激活告警数据结果集
  activeAlarmTableDataList = [];
  // 异常信息-激活告警列表加载loading
  activeAlarmTableLoading = false;
  // 异常信息-激活告警列表数据总量
  activeAlarmTotal = 0;
  // 异常信息-激活告警列表当前页数
  activeAlarmPage = 1;
  // 异常信息-激活告警列表每页显示数据量
  activeAlarmPageSize = 10;
  // 异常信息-激活告警列表基站编号
  activeAlarmNeCode = '';
  // 异常信息-激活告警列表开始时间
  activeAlarmStartTime = '';
  // 异常信息-激活告警列表结束时间
  activeAlarmEndTime = '';

  // 异常信息-基站退服数据结果集
  btsOutageTableDataList = [];
  // 异常信息-基站退服列表加载loading
  btsOutageTableLoading = false;
  // 异常信息-基站退服列表数据总量
  btsOutageTotal = 0;
  // 异常信息-基站退服列表当前页数
  btsOutagePage = 1;
  // 异常信息-基站退服列表每页显示数据量
  btsOutagePageSize = 10;
  // 异常信息-基站退服列表基站编号
  btsOutageNeCode = '';
  // 异常信息-基站退服列表开始时间
  btsOutageStartTime = '';
  // 异常信息-基站退服列表结束时间
  btsOutageEndTime = '';

  // 异常信息-休眠小区数据结果集
  sleepingCellTableDataList = [];
  // 异常信息-休眠小区列表加载loading
  sleepingCellTableLoading = false;
  // 异常信息-休眠小区列表数据总量
  sleepingCellTotal = 0;
  // 异常信息-休眠小区列表当前页数
  sleepingCellPage = 1;
  // 异常信息-休眠小区列表每页显示数据量
  sleepingCellPageSize = 10;
  // 异常信息-休眠小区列表基站编号
  sleepingCellNeCode = '';
  // 异常信息-休眠小区列表开始时间
  sleepingCellStartTime = '';
  // 异常信息-休眠小区列表结束时间
  sleepingCellEndTime = '';

  constructor(private http: Http, private jsonp: Jsonp, private message: NzMessageService, private routeInfo: ActivatedRoute,
    private configService: ConfigService, private router: Router, private modalService: NzModalService) {
    this.url = configService.getRequestUrl();
  }

  ngOnInit() {
    const userName = sessionStorage.getItem('userName') === null ? '' : sessionStorage.getItem('userName');
    const token = sessionStorage.getItem('token') === null ? '' : sessionStorage.getItem('token');

    if (userName === '' || token === '') {
      this.router.navigate(['']);
      return;
    }
    this.getTimeFun();
    this.getCityList();
    this.queryTableDataList();
  }

  // 城市下拉框选择事件
  cityChange(value: string): void {
    if (value === null) {
      value = '';
    }
    this.getAreaList(value);
    this.cityCode = value;
  }
  areaChange(value: string): void {
    if (value === null) {
      value = '';
    }
    this.regionCode = value;
  }
  // 获取城市下拉框数据列表
  getCityList(): void {
    const _that = this;
    this.jsonp.get(this.url + '/wakeUpBts/getCityList?areaLevel=2&areaCode=&callback=JSONP_CALLBACK')
      .subscribe(
        function (data) {
          const result = data['_body'];
          _that.cityList = result['data'];
        },
        function (err) {
          const obj = document.getElementById('citySelectFailed');
          _that.message.error(obj.innerText);
        }
      );
  }
  // 获取城市下拉框数据列表
  getAreaList(cityCode: string): void {
    const _that = this;
    this.jsonp.get(this.url + '/wakeUpBts/getCityList?areaLevel=3&areaCode=' + cityCode + '&callback=JSONP_CALLBACK')
      .subscribe(
        function (data) {
          const result = data['_body'];
          _that.areaList = result['data'];
        },
        function (err) {
          const obj = document.getElementById('areaSelectFailed');
          _that.message.error(obj.innerText);
        }
      );
  }

  // 初始化开始时间和结束时间的默认值
  getTimeFun(): void {
    this.startTime = new Date();
    // 画面类型为当日则当天23点59分59秒
    this.endTime = new Date();
    this.endTime.setHours(23, 59, 59);
  }

  // 唤醒结果列表查询按钮事件
  resetResultQueryFun(): void {
    this.tablePage = 1;
    this.queryTableDataList();
  }
  // 获取唤醒结果列表数据
  queryTableDataList(): void {
    const userName = sessionStorage.getItem('userName') === null ? '' : sessionStorage.getItem('userName');
    const token = sessionStorage.getItem('token') === null ? '' : sessionStorage.getItem('token');
    if (userName === '' || token === '') {
      this.router.navigate(['']);
      return;
    }
    const _that = this;
    if (_that.startTime > _that.endTime) {
      const timeLimitInfo = document.getElementById('timeLimitInfo').innerText;
      _that.message.warning(timeLimitInfo);
      return;
    }
    const sTime = _that.dateToStringFun(_that.startTime);
    const eTime = _that.dateToStringFun(_that.endTime);

    _that.tableLoading = true;
    this.jsonp.get(this.url + '/pendingBooking/getPendingBookingList?cityCode=' + _that.cityCode +
      '&areaCode=' + _that.regionCode + '&neName=' + _that.neName + '&neVersion=' + _that.version + '&startTime=' + sTime +
      '&endTime=' + eTime + '&page=' + _that.tablePage + '&pageSize=' + _that.tablePageSize +
      '&callback=JSONP_CALLBACK')
      .subscribe(
        function (data) {
          const result = data['_body'];
          if (result['success']) {
            _that.tableDataList = result['content'];
            _that.tableTotal = result['totalElements'];
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
          _that.tableLoading = false;
          const dataListFailed = document.getElementById('dataListFailed').innerText;
          _that.message.error(dataListFailed);
        }
      );
  }
  // 重置按钮事件
  queryReset(): void {
    this.cityCode = '';
    this.regionCode = '';
    this.neName = '';
    this.version = '';
    this.getTimeFun();
  }

  // 显示窗口
  showActiveAlarmWindow(exceptionType: string, neCode: string, startTime: string, endTime: string): void {
    this.windowGridVisible = true;
    this.windowType = exceptionType;
    if (exceptionType === 'activeAlarm') {
      // 激活告警异常
      const activeAlarm = document.getElementById('activeAlarm').innerText;
      this.windowTitle = neCode + '_' + activeAlarm;
      this.queryActiveAlarmTableListFun(neCode, startTime, endTime);
    } else if (exceptionType === 'btsOutage') {
      // 基站退服异常
      const btsOutage = document.getElementById('btsOutage').innerText;
      this.windowTitle = neCode + '_' + btsOutage;
      this.queryBtsOutageListTableListFun(neCode, startTime, endTime);
    } else if (exceptionType === 'sleepingCell') {
      // 休眠小区异常
      const sleepingCell = document.getElementById('sleepingCell').innerText;
      this.windowTitle = neCode + '_' + sleepingCell;
      this.querySleepingCellListTableListFun(neCode, startTime, endTime);
    }
  }
  // 关闭窗体
  closeWindowGrid(): void {
    this.windowGridVisible = false;
  }
  // 查询激活告警异常明细数据
  queryActiveAlarmTableListFun(neCode: string, startTime: string, endTime: string): void {
    const userName = sessionStorage.getItem('userName') === null ? '' : sessionStorage.getItem('userName');
    const token = sessionStorage.getItem('token') === null ? '' : sessionStorage.getItem('token');
    if (userName === '' || token === '') {
      this.router.navigate(['']);
      return;
    }
    if (neCode === '') {
      neCode = this.activeAlarmNeCode;
    } else {
      this.activeAlarmNeCode = neCode;
    }
    if (startTime === '') {
      startTime = this.activeAlarmStartTime;
    } else {
      this.activeAlarmStartTime = startTime;
    }
    if (endTime === '') {
      endTime = this.activeAlarmEndTime;
    } else {
      this.activeAlarmEndTime = endTime;
    }
    this.activeAlarmTableLoading = true;
    const _that = this;
    _that.activeAlarmTableDataList = [];
    _that.activeAlarmTotal = 0;
    this.jsonp.get(this.url + '/wakeUpBts/getActiveAlarmList?neCode=' + neCode + '&startTime=' + startTime +
      '&endTime=' + endTime + '&page=' + _that.activeAlarmPage + '&pageSize=' + _that.activeAlarmPageSize + '&callback=JSONP_CALLBACK')
      .subscribe(
        function (data) {
          const result = data['_body'];
          if (result['success']) {
            _that.activeAlarmTableDataList = result['content'];
            _that.activeAlarmTotal = result['totalElements'];
          } else {
            const userInvalid = document.getElementById('userInvalid').innerText;
            _that.modalService.warning({
              nzTitle: userInvalid,
              nzContent: result['msg']
            });
          }
          _that.activeAlarmTableLoading = false;
        },
        function (err) {
          _that.activeAlarmTableLoading = false;
          const dataListFailed = document.getElementById('dataListFailed').innerText;
          _that.message.error(dataListFailed);
        }
      );
  }
  // 查询基站退服异常明细数据
  queryBtsOutageListTableListFun(neCode: string, startTime: string, endTime: string): void {
    const userName = sessionStorage.getItem('userName') === null ? '' : sessionStorage.getItem('userName');
    const token = sessionStorage.getItem('token') === null ? '' : sessionStorage.getItem('token');
    if (userName === '' || token === '') {
      this.router.navigate(['']);
      return;
    }
    if (neCode === '') {
      neCode = this.btsOutageNeCode;
    } else {
      this.btsOutageNeCode = neCode;
    }
    if (startTime === '') {
      startTime = this.btsOutageStartTime;
    } else {
      this.btsOutageStartTime = startTime;
    }
    if (endTime === '') {
      endTime = this.btsOutageEndTime;
    } else {
      this.btsOutageEndTime = endTime;
    }
    this.btsOutageTableLoading = true;
    const _that = this;
    _that.btsOutageTableDataList = [];
    _that.btsOutageTotal = 0;
    this.jsonp.get(this.url + '/wakeUpBts/getBtsOutageList?neCode=' + neCode + '&startTime=' + startTime +
      '&endTime=' + endTime + '&page=' + _that.btsOutagePage + '&pageSize=' + _that.btsOutagePageSize + '&callback=JSONP_CALLBACK')
      .subscribe(
        function (data) {
          const result = data['_body'];
          if (result['success']) {
            _that.btsOutageTableDataList = result['content'];
            _that.btsOutageTotal = result['totalElements'];
          } else {
            const userInvalid = document.getElementById('userInvalid').innerText;
            _that.modalService.warning({
              nzTitle: userInvalid,
              nzContent: result['msg']
            });
          }
          _that.btsOutageTableLoading = false;
        },
        function (err) {
          _that.btsOutageTableLoading = false;
          const dataListFailed = document.getElementById('dataListFailed').innerText;
          _that.message.error(dataListFailed);
        }
      );
  }
  // 查询休眠小区异常明细数据
  querySleepingCellListTableListFun(neCode: string, startTime: string, endTime: string): void {
    const userName = sessionStorage.getItem('userName') === null ? '' : sessionStorage.getItem('userName');
    const token = sessionStorage.getItem('token') === null ? '' : sessionStorage.getItem('token');
    if (userName === '' || token === '') {
      this.router.navigate(['']);
      return;
    }
    if (neCode === '') {
      neCode = this.sleepingCellNeCode;
    } else {
      this.sleepingCellNeCode = neCode;
    }
    if (startTime === '') {
      startTime = this.sleepingCellStartTime;
    } else {
      this.sleepingCellStartTime = startTime;
    }
    if (endTime === '') {
      endTime = this.sleepingCellEndTime;
    } else {
      this.sleepingCellEndTime = endTime;
    }
    this.sleepingCellTableLoading = true;
    const _that = this;
    _that.sleepingCellTableDataList = [];
    _that.sleepingCellTotal = 0;
    this.jsonp.get(this.url + '/wakeUpBts/getSleepingCellList?neCode=' + neCode + '&startTime=' + startTime +
      '&endTime=' + endTime + '&page=' + _that.sleepingCellPage +
      '&pageSize=' + _that.sleepingCellPageSize + '&callback=JSONP_CALLBACK')
      .subscribe(
        function (data) {
          const result = data['_body'];
          if (result['success']) {
            _that.sleepingCellTableDataList = result['content'];
            _that.sleepingCellTotal = result['totalElements'];
          } else {
            const userInvalid = document.getElementById('userInvalid').innerText;
            _that.modalService.warning({
              nzTitle: userInvalid,
              nzContent: result['msg']
            });
          }
          _that.sleepingCellTableLoading = false;
        },
        function (err) {
          _that.sleepingCellTableLoading = false;
          const dataListFailed = document.getElementById('dataListFailed').innerText;
          _that.message.error(dataListFailed);
        }
      );
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

  // 隐藏按钮事件
  // 取消事件
  unbinding(neCode: string): void {
    const tips = document.getElementById('tips').innerText;
    const bookingCancelTips = document.getElementById('bookingCancelTips').innerText;
    this.modalService.confirm({
      nzTitle: '<i>' + tips + '</i>',
      nzContent: bookingCancelTips,
      nzOnOk: () => this.cancelHandleOk(neCode)
    });
  }

  cancelHandleOk(neCode: string): void {
    const userName = sessionStorage.getItem('userName') === null ? '' : sessionStorage.getItem('userName');
    const token = sessionStorage.getItem('token') === null ? '' : sessionStorage.getItem('token');
    if (userName === '' || token === '') {
      this.router.navigate(['']);
      return;
    }
    const _that = this;
    _that.tableLoading = true;
    this.jsonp.get(this.url + '/pendingBooking/unbindBookingPlan?neCode=' + neCode + '&callback=JSONP_CALLBACK')
      .subscribe(
        function (data) {
          const result = data['_body'];
          if (result['success']) {
            const unbindSuccess = document.getElementById('unbindSuccess').innerText;
            _that.message.info(unbindSuccess);
            _that.queryTableDataList();
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
          _that.tableLoading = false;
          const dataListFailed = document.getElementById('dataListFailed').innerText;
          _that.message.error(dataListFailed);
        }
      );
  }

}
