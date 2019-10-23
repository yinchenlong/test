import { Component, OnInit } from '@angular/core';
import { Http, Jsonp, Headers } from '@angular/http';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { Router } from '@angular/router';

import { ConfigService } from '../app-config.service';

@Component({
    selector: 'app-manual-reset',
    templateUrl: './manual-reset.component.html',
    styleUrls: ['./manual-reset.component.css']
})
export class ManualResetComponent implements OnInit {
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
    // 异常下拉框数据列表
    exceptionList = [];
    // 异常下拉框选择值
    exceptionValue = '';

    // 条件全选-所属城市下拉框选择值-用于判断是否改变查询条件
    cityCodeParam = '';
    // 条件全选-所属地区下拉框选择值-用于判断是否改变查询条件
    regionCodeParam = '';
    // 条件全选-基站名称输入框中的值-用于判断是否改变查询条件
    neNameParam = '';
    // 条件全选-版本输入框中的值-用于判断是否改变查询条件
    versionParam = '';
    // 条件全选-异常下拉框选择值-用于判断是否改变查询条件
    exceptionValueParam = '';

    // 数据列表加载loading
    tableLoading = false;
    // 数据列表
    tableDataList = [];
    // 数据总量
    tableTotal = 0;
    // 数据列表当前页数索引
    page = 1;
    // 数据列表每页显示数据量
    pageSize = 10;

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

    private header = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded' });

    constructor(private http: Http, private jsonp: Jsonp, private message: NzMessageService,
        private modalService: NzModalService, private configService: ConfigService, private router: Router) {
        this.url = configService.getRequestUrl();
    }

    ngOnInit() {
        const userName = sessionStorage.getItem('userName') === null ? '' : sessionStorage.getItem('userName');
        const token = sessionStorage.getItem('token') === null ? '' : sessionStorage.getItem('token');
        if (userName === '' || token === '') {
            this.router.navigate(['']);
            return;
        }
        this.getCityList();
        this.getExceptionList();
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
    // 获取异常下拉框列表数据
    getExceptionList(): void {
        const _that = this;
        this.jsonp.get(this.url + '/wakeUpBts/getDimensionList?callback=JSONP_CALLBACK')
            .subscribe(
                function (data) {
                    const result = data['_body'];
                    _that.exceptionList = result['data'];
                },
                function (err) {
                    const obj = document.getElementById('exceptionSelectFailed');
                    _that.message.error(obj.innerText);
                }
            );
    }
    // 异常下拉框选择事件
    exceptionChange(value: string): void {
        this.exceptionValue = value;
    }
    // 查询按钮点击事件
    queryFun(): void {
        this.cityCodeParam = this.cityCode;
        this.regionCodeParam = this.regionCode;
        this.exceptionValueParam = this.exceptionValue;
        this.neNameParam = this.neName;
        this.versionParam = this.versionParam;
        this.page = 1;
        this.queryTableDataList();
    }
    // 查询列表数据
    queryTableDataList(): void {
        const userName = sessionStorage.getItem('userName') === null ? '' : sessionStorage.getItem('userName');
        const token = sessionStorage.getItem('token') === null ? '' : sessionStorage.getItem('token');
        if (userName === '' || token === '') {
            this.router.navigate(['']);
            return;
        }
        const _that = this;
        _that.tableLoading = true;
        this.jsonp.get(this.url + '/wakeUpBts/getManualResetList?exceptionType=' + _that.exceptionValue +
            '&cityCode=' + _that.cityCode + '&areaCode=' + _that.regionCode + '&neName=' + _that.neName + '&neVersion=' + _that.version +
            '&page=' + _that.page + '&pageSize=' + _that.pageSize + '&callback=JSONP_CALLBACK')
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
        this.exceptionValue = '';
    }
    // 显示异常信息窗体
    showWindow(exceptionType: string, neCode: string): void {
        this.windowGridVisible = true;
        this.windowType = exceptionType;
        if (exceptionType === 'activeAlarm') {
            // 激活告警异常
            const activeAlarm = document.getElementById('activeAlarm').innerText;
            this.windowTitle = neCode + '_' + activeAlarm;
            this.queryActiveAlarmTableListFun(neCode);
        } else if (exceptionType === 'btsOutage') {
            // 基站退服异常
            const btsOutage = document.getElementById('btsOutage').innerText;
            this.windowTitle = neCode + '_' + btsOutage;
            this.queryBtsOutageListTableListFun(neCode);
        } else if (exceptionType === 'sleepingCell') {
            // 休眠小区异常
            const sleepingCell = document.getElementById('sleepingCell').innerText;
            this.windowTitle = neCode + '_' + sleepingCell;
            this.querySleepingCellListTableListFun(neCode);
        }
    }
    // 关闭异常信息窗体
    closeWindowGrid(): void {
        this.windowGridVisible = false;
    }
    // 查询激活告警异常明细数据
    queryActiveAlarmTableListFun(neCode: string): void {
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
        this.activeAlarmTableLoading = true;
        const _that = this;
        _that.activeAlarmTableDataList = [];
        _that.activeAlarmTotal = 0;
        this.jsonp.get(this.url + '/wakeUpBts/getActiveAlarmList?neCode=' + neCode +
            '&startTime=&endTime=&page=' + _that.activeAlarmPage + '&pageSize=' + _that.activeAlarmPageSize +
            '&callback=JSONP_CALLBACK')
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
    queryBtsOutageListTableListFun(neCode: string): void {
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
        this.btsOutageTableLoading = true;
        const _that = this;
        _that.btsOutageTableDataList = [];
        _that.btsOutageTotal = 0;
        this.jsonp.get(this.url + '/wakeUpBts/getBtsOutageList?neCode=' + neCode +
            '&startTime=&endTime=&page=' + _that.btsOutagePage + '&pageSize=' + _that.btsOutagePageSize + '&callback=JSONP_CALLBACK')
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
    querySleepingCellListTableListFun(neCode: string): void {
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
        this.sleepingCellTableLoading = true;
        const _that = this;
        _that.sleepingCellTableDataList = [];
        _that.sleepingCellTotal = 0;
        this.jsonp.get(this.url + '/wakeUpBts/getSleepingCellList?neCode=' + neCode +
            '&startTime=&endTime=&page=' + _that.sleepingCellPage + '&pageSize=' + _that.sleepingCellPageSize +
            '&callback=JSONP_CALLBACK')
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
    // 上站处理事件
    onBtsFun(neCode: string, neIp: string, sbtsOrLte: string, overdueTime: string): void {
        const neInfo = { neCode: neCode, neIp: neIp, sbtsOrLte: sbtsOrLte, overdueTime: overdueTime };
        const neInfoList = [];
        neInfoList.push(neInfo);
        const tips = document.getElementById('tips').innerText;
        const onBtsOpeartionQuestion = document.getElementById('onBtsOpeartionQuestion').innerText;
        this.modalService.confirm({
            nzTitle: '<i>' + tips + '</i>',
            nzContent: onBtsOpeartionQuestion,
            nzOnOk: () => this.onBtsHandleOk(neInfoList)
        });
    }
    // 上站处理确定事件
    onBtsHandleOk(neInfoList: Array<string>): void {
        const userName = sessionStorage.getItem('userName') === null ? '' : sessionStorage.getItem('userName');
        const token = sessionStorage.getItem('token') === null ? '' : sessionStorage.getItem('token');
        if (userName === '' || token === '') {
            this.router.navigate(['']);
            return;
        }
        const _that = this;
        this.http.post(this.url + '/wakeUpBts/operationOnBts',
            JSON.stringify({ userName: userName, token: token, neInfo: JSON.stringify(neInfoList) }),
            { headers: this.header }).subscribe(function (data) {
                const result = data['_body'];
                const resultJson = JSON.parse(result);
                if (resultJson['success'] === '0') {
                    _that.queryTableDataList();
                } else if (resultJson['success'] === '1') {
                    const onBtsOpeartionFailed = document.getElementById('onBtsOpeartionFailed').innerText;
                    _that.modalService.warning({
                        nzTitle: onBtsOpeartionFailed,
                        nzContent: result['msg']
                    });
                }
            }, function (error) {
                const onBtsOpeartionFailed = document.getElementById('onBtsOpeartionFailed').innerText;
                _that.message.error(onBtsOpeartionFailed);
            });
    }

    // 专家建议点击事件
    expertsRecommend(neCode: string): void {
        const _that = this;
        this.jsonp.get(this.url + '/wakeUpBts/getExpertsRecommend?neCode=' + neCode + '&callback=JSONP_CALLBACK')
            .subscribe(
                function (data) {
                    const result = data['_body'];
                    if (result['success']) {
                        _that.router.navigate(['/abnormalShowedExpet'],
                            { queryParams: { neCode: neCode, recommend: result['recommend'] } });
                    }
                },
                function (err) {
                    const obj = document.getElementById('barChartFailed');
                    _that.message.error(obj.innerText);
                }
            );
    }

}
