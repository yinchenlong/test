import { Component, OnInit } from '@angular/core';
import { Http, Jsonp, Headers } from '@angular/http';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { ActivatedRoute, Router } from '@angular/router';

import { ConfigService } from '../app-config.service';

@Component({
    selector: 'app-abnormal-showed-expet',
    templateUrl: './abnormal-showed-expet.component.html',
    styleUrls: ['./abnormal-showed-expet.component.css']
})
export class AbnormalShowedExpetComponent implements OnInit {
    // 数据请求的地址
    url = '';

    // 基站编号
    neCode = '';
    // 专家建议
    recommend = '';
    // 添加到预约方案按钮图片
    imgAdd = '';
    // 上站按钮图片
    imgUp = '';

    // 维度下拉列表
    dimensionList = [];
    // 维度选择值
    dimensionValue = '';

    // 是否显示激活告警数据列表
    activeAlarm = false;
    // 是否显示退服基站数据列表
    brokenBts = false;
    // 是否显示休眠小区数据列表
    sleepCell = false;

    // 激活告警维度下的异常趋势图
    activeAlarmLineChartOptions = {};
    // 基站退服维度下的异常趋势图
    brokenBtsLineChartOptions = {};
    // 休眠小区维度下的异常趋势图
    sleepCellLineChartOptions = {};

    // 激活告警维度下的异常快照-所属城市下拉框数据集
    activeAlarmCityList = [];
    // 激活告警维度下的异常快照-所属地区下拉框数据集
    activeAlarmAreaList = [];
    // 激活告警维度下的异常快照-所属城市下拉框选择值
    activeAlarmCityCode = '';
    // 激活告警维度下的异常快照-所属地区下拉框选择值
    activeAlarmAreaCode = '';
    // 激活告警维度下的异常快照-基站名称输入值
    activeAlarmNeName = '';
    // 激活告警维度下的异常快照-基站版本输入值
    activeAlarmNeVersion = '';
    // 激活告警维度下的异常快照-开始时间选择值
    activeAlarmStartTime: Date;
    // 激活告警维度下的异常快照-结束时间选择值
    activeAlarmEndTime: Date;
    // 激活告警维度下的异常快照-数据列表当前显示页数
    activeAlarmPage = 1;
    // 激活告警维度下的异常快照-数据列表每页显示数据量
    activeAlarmPageSize = 10;
    // 激活告警维度下的异常快照-数据列表数据总量
    activeAlarmTotal = 0;
    // 激活告警维度下的异常快照-数据列表是否显示加载loading
    activeAlarmTableLoding = false;
    // 激活告警维度下的异常快照-列表数据集合
    activeAlarmTableDataList = [];

    // 基站退服维度下的异常快照-所属城市下拉框数据集
    btsOutageCityList = [];
    // 基站退服维度下的异常快照-所属地区下拉框数据集
    btsOutageAreaList = [];
    // 基站退服维度下的异常快照-所属城市下拉框选择值
    btsOutageCityCode = '';
    // 基站退服维度下的异常快照-所属地区下拉框选择值
    btsOutageAreaCode = '';
    // 基站退服维度下的异常快照-基站名称输入值
    btsOutageNeName = '';
    // 基站退服维度下的异常快照-基站版本输入值
    btsOutageNeVersion = '';
    // 基站退服维度下的异常快照-开始时间选择值
    btsOutageStartTime: Date;
    // 基站退服维度下的异常快照-结束时间选择值
    btsOutageEndTime: Date;
    // 基站退服维度下的异常快照-数据列表当前显示页数
    btsOutagePage = 1;
    // 基站退服维度下的异常快照-数据列表每页显示数据量
    btsOutagePageSize = 10;
    // 基站退服维度下的异常快照-数据列表数据总量
    btsOutageTotal = 0;
    // 基站退服维度下的异常快照-数据列表是否显示加载loading
    btsOutageTableLoding = false;
    // 基站退服维度下的异常快照-列表数据集合
    btsOutageTableDataList = [];

    // 休眠小区维度下的异常快照-所属城市下拉框数据集
    sleepingCellCityList = [];
    // 休眠小区维度下的异常快照-所属地区下拉框数据集
    sleepingCellAreaList = [];
    // 休眠小区维度下的异常快照-所属城市下拉框选择值
    sleepingCellCityCode = '';
    // 休眠小区维度下的异常快照-所属地区下拉框选择值
    sleepingCellAreaCode = '';
    // 休眠小区维度下的异常快照-基站名称输入值
    sleepingCellNeName = '';
    // 休眠小区维度下的异常快照-基站版本输入值
    sleepingCellNeVersion = '';
    // 休眠小区维度下的异常快照-开始时间选择值
    sleepingCellStartTime: Date;
    // 休眠小区维度下的异常快照-结束时间选择值
    sleepingCellEndTime: Date;
    // 休眠小区维度下的异常快照-数据列表当前显示页数
    sleepingCellPage = 1;
    // 休眠小区维度下的异常快照-数据列表每页显示数据量
    sleepingCellPageSize = 10;
    // 休眠小区维度下的异常快照-数据列表数据总量
    sleepingCellTotal = 0;
    // 休眠小区维度下的异常快照-数据列表是否显示加载loading
    sleepingCellTableLoding = false;
    // 休眠小区维度下的异常快照-列表数据集合
    sleepingCellTableDataList = [];


    private header = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded' });
    // 构造函数
    constructor(private http: Http, private jsonp: Jsonp, private message: NzMessageService, private routeInfo: ActivatedRoute,
        private configService: ConfigService, private router: Router, private modalService: NzModalService) {
        this.url = configService.getRequestUrl();
    }

    // 初始化方法
    ngOnInit(): void {
        const userName = sessionStorage.getItem('userName') === null ? '' : sessionStorage.getItem('userName');
        const token = sessionStorage.getItem('token') === null ? '' : sessionStorage.getItem('token');
        if (userName === '' || token === '') {
            this.router.navigate(['']);
            return;
        }
        this.neCode = this.routeInfo.snapshot.queryParams['neCode'];
        this.recommend = this.routeInfo.snapshot.queryParams['recommend'];
        if (this.recommend === 'onSite') {
            this.imgUp = '/neg-bts-auto-reset-web-agl/assets/images/up-advice.png';
            this.imgAdd = '/neg-bts-auto-reset-web-agl/assets/images/add.png';
        } else {
            this.imgUp = '/neg-bts-auto-reset-web-agl/assets/images/up.png';
            this.imgAdd = '/neg-bts-auto-reset-web-agl/assets/images/add-advice.png';
        }
        this.getDimensionListFun();
    }
    // 获取维度下拉框列表数据
    getDimensionListFun(): void {
        const _that = this;
        this.jsonp.get(this.url + '/wakeUpBts/getDimensionList?callback=JSONP_CALLBACK')
            .subscribe(
                function (data) {
                    const result = data['_body'];
                    _that.dimensionList = result['data'];
                    _that.dimensionValue = _that.dimensionList[0]['code'];
                    // 根据维度编号生成异常趋势折线图
                    _that.queryLineChartData(_that.dimensionValue);
                    if (_that.dimensionValue === 'slb_001') {
                        // 激活告警维度显示激活告警的折线图和数据列表
                        _that.activeAlarm = true;
                        _that.brokenBts = false;
                        _that.sleepCell = false;
                        // 初始化城市下拉框数据
                        _that.getActiveAlarmCityList();
                        // 初始化开始时间和结束时间的默认值
                        _that.activeAlarmEndTime = _that.getParamDateTime('end');
                        _that.activeAlarmStartTime = _that.getParamDateTime('start');
                        // 查询激活告警数据列表
                        _that.queryAcitveAlarmTableDataList(_that.dimensionValue);
                    } else if (_that.dimensionValue === 'slb_002') {
                        // 基站退服维度显示基站退服的折线图和数据列表
                        _that.activeAlarm = false;
                        _that.brokenBts = true;
                        _that.sleepCell = false;
                        // 初始化城市下拉框数据
                        _that.getBtsOutageCityList();
                        // 初始化开始时间和结束时间的默认值
                        _that.btsOutageEndTime = _that.getParamDateTime('end');
                        _that.btsOutageStartTime = _that.getParamDateTime('start');
                        // 查询基站退服数据列表
                        _that.queryBtsOutageTableDataList(_that.dimensionValue);
                    } else if (_that.dimensionValue === 'slb_003') {
                        // 休眠基站维度显示休眠小区的折线图和数据列表
                        _that.activeAlarm = false;
                        _that.brokenBts = false;
                        _that.sleepCell = true;
                        // 初始化城市下拉框数据
                        _that.getSleepingCellCityList();
                        // 初始化开始时间和结束时间的默认值
                        _that.sleepingCellEndTime = _that.getParamDateTime('end');
                        _that.sleepingCellStartTime = _that.getParamDateTime('start');
                        // 查询休眠基站数据列表
                        _that.querySleepingCellTableDataList(_that.dimensionValue);
                    }
                },
                function (err) {
                    const obj = document.getElementById('dimensionSelectFailed');
                    _that.message.error(obj.innerText);
                }
            );
    }
    // 改变维度下拉框值后切换显示折线图和数据列表
    dimensionChange(code: string): void {
        const userName = sessionStorage.getItem('userName') === null ? '' : sessionStorage.getItem('userName');
        const token = sessionStorage.getItem('token') === null ? '' : sessionStorage.getItem('token');
        if (userName === '' || token === '') {
            this.router.navigate(['']);
            return;
        }
        if (code === 'slb_001') {
            // 激活告警维度显示激活告警的折线图和数据列表
            this.activeAlarm = true;
            this.brokenBts = false;
            this.sleepCell = false;
            // 初始化城市下拉框数据
            this.getActiveAlarmCityList();
            // 初始化开始时间和结束时间的默认值
            this.activeAlarmEndTime = this.getParamDateTime('end');
            this.activeAlarmStartTime = this.getParamDateTime('start');
            // 查询激活告警数据列表
            this.queryAcitveAlarmTableDataList(code);
        } else if (code === 'slb_002') {
            // 基站退服维度显示基站退服的折线图和数据列表
            this.activeAlarm = false;
            this.brokenBts = true;
            this.sleepCell = false;
            // 初始化城市下拉框数据
            this.getBtsOutageCityList();
            // 初始化开始时间和结束时间的默认值
            this.btsOutageEndTime = this.getParamDateTime('end');
            this.btsOutageStartTime = this.getParamDateTime('start');
            // 查询激活告警数据列表
            this.queryBtsOutageTableDataList(code);
        } else if (code === 'slb_003') {
            // 休眠小区维度显示休眠小区的折线图和数据列表
            this.activeAlarm = false;
            this.brokenBts = false;
            this.sleepCell = true;
            // 初始化城市下拉框数据
            this.getSleepingCellCityList();
            // 初始化开始时间和结束时间的默认值
            this.sleepingCellEndTime = this.getParamDateTime('end');
            this.sleepingCellStartTime = this.getParamDateTime('start');
            // 查询激活告警数据列表
            this.querySleepingCellTableDataList(code);
        }
        this.queryLineChartData(code);
    }
    // 查询折线图数据
    queryLineChartData(dimensionValue: string): void {
        const _that = this;
        this.jsonp.get(this.url + '/wakeUpBts/getLineChartData?neCode=' + this.neCode + '&dimensionType=' + dimensionValue +
            '&callback=JSONP_CALLBACK')
            .subscribe(
                function (data) {
                    const result = data['_body'];
                    if (result['success']) {
                        if (dimensionValue === 'slb_001') {
                            // 激活告警维度-生成激活告警趋势图
                            _that.buildActiveAlarmLineChart(result);
                        } else if (dimensionValue === 'slb_002') {
                            // 基站退服维度-生成基站退服趋势图
                            _that.buildBtsOutageLineChart(result);
                        } else if (dimensionValue === 'slb_003') {
                            // 休眠小区维度-生成休眠小区趋势图
                            _that.buildSleepingCellLineChart(result);
                        }
                    }
                },
                function (err) {
                    const obj = document.getElementById('lineChartFailed');
                    _that.message.error(obj.innerText);
                }
            );
    }
    // 激活告警维度下-异常趋势图
    buildActiveAlarmLineChart(item: any): void {
        const yAxisName = document.getElementById('abnormalLast').innerText;
        const activeAlarmSeriesData = item['yAxis'];
        const activeAlarmSeries = [];

        if (activeAlarmSeriesData !== undefined && activeAlarmSeriesData !== []) {
            activeAlarmSeries.push({
                name: this.neCode,
                data: activeAlarmSeriesData,
                type: 'bar',
                barWidth: 30,
                color: 'orange'
            });
        }
        this.activeAlarmLineChartOptions = {
            title: {
                text: '',
            },
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'shadow'
                },
            },
            color: '#F0AD4E',
            toolbox: {
                show: false
            },
            grid: {
                x: 60,
                x2: 60,
                y: 30,
                y2: 30
            },
            calculable: true,
            xAxis: {
                type: 'category',
                data: item['xAxis'],
                axisLabel: {
                    interval: 0
                }
            },
            yAxis: {
                type: 'value',
                name: yAxisName,
                nameTextStyle: {
                    color: '#888'
                },
                splitLine: {
                    show: true,
                    lineStyle: {
                        width: 1,
                        color: '#e9e9e9'
                    }
                },
                axisTick: {
                    show: true,
                    lineStyle: {
                        color: '#999'
                    }
                },
                axisLine: {
                    show: true,
                    lineStyle: {
                        width: 1,
                        color: '#aaa'
                    }
                }
            },
            series: activeAlarmSeries
        };
    }
    // 基站退服维度下-异常趋势图
    buildBtsOutageLineChart(item: any): void {
        const yAxisName = document.getElementById('abnormalLast').innerText;
        const btsOutageSeriesData = item['yAxis'];
        const btsOutageSeries = [];

        if (btsOutageSeriesData !== undefined && btsOutageSeriesData !== []) {
            btsOutageSeries.push({
                name: this.neCode,
                data: btsOutageSeriesData,
                type: 'bar',
                barWidth: 30,
                color: 'green'
            });
        }

        this.brokenBtsLineChartOptions = {
            title: {
                text: '',
            },
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'shadow'
                },
            },
            color: '#F0AD4E',
            toolbox: {
                show: false
            },
            grid: {
                x: 60,
                x2: 60,
                y: 30,
                y2: 30
            },
            calculable: true,
            xAxis: {
                type: 'category',
                data: item['xAxis'],
                axisLabel: {
                    interval: 0
                }
            },
            yAxis: {
                type: 'value',
                name: yAxisName,
                nameTextStyle: {
                    color: '#888'
                },
                splitLine: {
                    show: true,
                    lineStyle: {
                        width: 1,
                        color: '#e9e9e9'
                    }
                },
                axisTick: {
                    show: true,
                    lineStyle: {
                        color: '#999'
                    }
                },
                axisLine: {
                    show: true,
                    lineStyle: {
                        width: 1,
                        color: '#aaa'
                    }
                }
            },
            series: btsOutageSeries
        };
    }
    // 异常小区维度下-异常趋势图
    buildSleepingCellLineChart(item: any): void {
        const yAxisName = document.getElementById('abnormalLast').innerText;
        const sleepingCellSeriesData = item['yAxis'];
        const sleepingCellSeries = [];

        if (sleepingCellSeriesData !== undefined && sleepingCellSeriesData !== []) {
            sleepingCellSeries.push({
                name: this.neCode,
                data: sleepingCellSeriesData,
                type: 'bar',
                barWidth: 30,
                color: 'purple'
            });
        }

        this.sleepCellLineChartOptions = {
            title: {
                text: '',
            },
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'shadow'
                },
            },
            color: '#F0AD4E',
            toolbox: {
                show: false
            },
            grid: {
                x: 60,
                x2: 60,
                y: 30,
                y2: 30
            },
            calculable: true,
            xAxis: {
                type: 'category',
                data: item['xAxis'],
                axisLabel: {
                    interval: 0
                }
            },
            yAxis: {
                type: 'value',
                name: yAxisName,
                nameTextStyle: {
                    color: '#888'
                },
                splitLine: {
                    show: true,
                    lineStyle: {
                        width: 1,
                        color: '#e9e9e9'
                    }
                },
                axisTick: {
                    show: true,
                    lineStyle: {
                        color: '#999'
                    }
                },
                axisLine: {
                    show: true,
                    lineStyle: {
                        width: 1,
                        color: '#aaa'
                    }
                }
            },
            series: sleepingCellSeries
        };
    }

    // 激活告警维度下-城市下拉框选择事件
    activeAlarmCityChange(value: string): void {
        if (value === null) {
            value = '';
        }
        this.getActiveAlarmAreaList(value);
        this.activeAlarmCityCode = value;
    }
    // 激活告警维度下-地区下拉框选择事件
    activeAlarmAreaChange(value: string): void {
        if (value === null) {
            value = '';
        }
        this.activeAlarmAreaCode = value;
    }
    // 激活告警维度下-获取城市下拉框数据列表
    getActiveAlarmCityList(): void {
        const _that = this;
        _that.activeAlarmCityList = [];
        this.jsonp.get(this.url + '/wakeUpBts/getCityList?areaLevel=2&areaCode=&callback=JSONP_CALLBACK')
            .subscribe(
                function (data) {
                    const result = data['_body'];
                    _that.activeAlarmCityList = result['data'];
                },
                function (err) {
                    const obj = document.getElementById('citySelectFailed');
                    _that.message.error(obj.innerText);
                }
            );
    }
    // 激活告警维度下-获取地区下拉框数据列表
    getActiveAlarmAreaList(cityCode: string): void {
        const _that = this;
        if (cityCode === '') {
            _that.activeAlarmAreaList = [];
            return;
        }
        this.jsonp.get(this.url + '/wakeUpBts/getCityList?areaLevel=3&areaCode=' + cityCode + '&callback=JSONP_CALLBACK')
            .subscribe(
                function (data) {
                    const result = data['_body'];
                    _that.activeAlarmAreaList = result['data'];
                },
                function (err) {
                    const obj = document.getElementById('areaSelectFailed');
                    _that.message.error(obj.innerText);
                }
            );
    }
    // 激活告警维度下-查询按钮事件
    acitveAlarmQueryFun(dimensionValue: string): void {
        this.activeAlarmPage = 1;
        this.queryAcitveAlarmTableDataList(dimensionValue);
    }
    // 激活告警维度下-查询数据列表的数据
    queryAcitveAlarmTableDataList(dimensionValue: string): void {
        const userName = sessionStorage.getItem('userName') === null ? '' : sessionStorage.getItem('userName');
        const token = sessionStorage.getItem('token') === null ? '' : sessionStorage.getItem('token');
        if (userName === '' || token === '') {
            this.router.navigate(['']);
            return;
        }
        const _that = this;
        _that.activeAlarmTableDataList = [];
        _that.activeAlarmTotal = 0;
        if (_that.activeAlarmStartTime > _that.activeAlarmEndTime) {
            const timeLimitInfo = document.getElementById('timeLimitInfo').innerText;
            _that.message.warning(timeLimitInfo);
            return;
        }
        _that.activeAlarmTableLoding = true;
        const sTime = _that.dateToStringFun(_that.activeAlarmStartTime);
        const eTime = _that.dateToStringFun(_that.activeAlarmEndTime);
        this.jsonp.get(this.url + '/wakeUpBts/getAbnormalDataList?type=' + dimensionValue + '&cityCode=' + _that.activeAlarmCityCode +
            '&areaCode=' + _that.activeAlarmAreaCode + '&neName=' + _that.activeAlarmNeName + '&neVersion=' + _that.activeAlarmNeVersion +
            '&startTime=' + sTime + '&endTime=' + eTime + '&page=' + _that.activeAlarmPage + '&neCode=' + _that.neCode +
            '&pageSize=' + _that.activeAlarmPageSize + '&callback=JSONP_CALLBACK')
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
                    _that.activeAlarmTableLoding = false;
                },
                function (err) {
                    _that.activeAlarmTableLoding = false;
                    const dataListFailed = document.getElementById('dataListFailed').innerText;
                    _that.message.error(dataListFailed);
                }
            );
    }
    // 激活告警维度下-重置按钮事件
    activeAlarmResetForm(): void {
        this.activeAlarmCityCode = '';
        this.activeAlarmAreaCode = '';
        this.activeAlarmNeName = '';
        this.activeAlarmNeVersion = '';
        this.activeAlarmStartTime = this.getParamDateTime('start');
        this.activeAlarmEndTime = this.getParamDateTime('end');
    }

    // 基站退服维度下-城市下拉框选择事件
    btsOutageCityChange(value: string): void {
        if (value === null) {
            value = '';
        }
        this.getBtsOutageAreaList(value);
        this.btsOutageCityCode = value;
    }
    // 基站退服维度下-地区下拉框选择事件
    btsOutageAreaChange(value: string): void {
        if (value === null) {
            value = '';
        }
        this.btsOutageAreaCode = value;
    }
    // 基站退服维度下-获取城市下拉框数据列表
    getBtsOutageCityList(): void {
        const _that = this;
        _that.btsOutageCityList = [];
        this.jsonp.get(this.url + '/wakeUpBts/getCityList?areaLevel=2&areaCode=&callback=JSONP_CALLBACK')
            .subscribe(
                function (data) {
                    const result = data['_body'];
                    _that.btsOutageCityList = result['data'];
                },
                function (err) {
                    const obj = document.getElementById('citySelectFailed');
                    _that.message.error(obj.innerText);
                }
            );
    }
    // 基站退服维度下-获取地区下拉框数据列表
    getBtsOutageAreaList(cityCode: string): void {
        const _that = this;
        if (cityCode === '') {
            _that.btsOutageAreaList = [];
            return;
        }
        this.jsonp.get(this.url + '/wakeUpBts/getCityList?areaLevel=3&areaCode=' + cityCode + '&callback=JSONP_CALLBACK')
            .subscribe(
                function (data) {
                    const result = data['_body'];
                    _that.btsOutageAreaList = result['data'];
                },
                function (err) {
                    const obj = document.getElementById('areaSelectFailed');
                    _that.message.error(obj.innerText);
                }
            );
    }
    // 基站退服维度下-查询按钮事件
    btsOutageQueryFun(dimensionValue: string): void {
        this.btsOutagePage = 1;
        this.queryBtsOutageTableDataList(dimensionValue);
    }
    // 基站退服维度下-查询数据列表的数据
    queryBtsOutageTableDataList(dimensionValue: string): void {
        const userName = sessionStorage.getItem('userName') === null ? '' : sessionStorage.getItem('userName');
        const token = sessionStorage.getItem('token') === null ? '' : sessionStorage.getItem('token');
        if (userName === '' || token === '') {
            this.router.navigate(['']);
            return;
        }
        const _that = this;
        _that.btsOutageTableDataList = [];
        _that.btsOutageTotal = 0;
        if (_that.btsOutageStartTime > _that.btsOutageEndTime) {
            const timeLimitInfo = document.getElementById('timeLimitInfo').innerText;
            _that.message.warning(timeLimitInfo);
            return;
        }
        _that.btsOutageTableLoding = true;
        const sTime = _that.dateToStringFun(_that.btsOutageStartTime);
        const eTime = _that.dateToStringFun(_that.btsOutageEndTime);
        this.jsonp.get(this.url + '/wakeUpBts/getAbnormalDataList?type=' + dimensionValue + '&cityCode=' + _that.btsOutageCityCode +
            '&areaCode=' + _that.btsOutageAreaCode + '&neName=' + _that.btsOutageNeName + '&neVersion=' + _that.btsOutageNeVersion +
            '&startTime=' + sTime + '&endTime=' + eTime + '&page=' + _that.btsOutagePage + '&neCode=' + _that.neCode +
            '&pageSize=' + _that.btsOutagePageSize + '&callback=JSONP_CALLBACK')
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
                    _that.btsOutageTableLoding = false;
                },
                function (err) {
                    _that.btsOutageTableLoding = false;
                    const dataListFailed = document.getElementById('dataListFailed').innerText;
                    _that.message.error(dataListFailed);
                }
            );
    }
    // 基站退服维度下-重置按钮事件
    btsOutageResetForm(): void {
        this.btsOutageCityCode = '';
        this.btsOutageAreaCode = '';
        this.btsOutageNeName = '';
        this.btsOutageNeVersion = '';
        this.btsOutageStartTime = this.getParamDateTime('start');
        this.btsOutageEndTime = this.getParamDateTime('end');
    }

    // 休眠小区维度下-城市下拉框选择事件
    sleepingCellCityChange(value: string): void {
        if (value === null) {
            value = '';
        }
        this.getSleepingCellAreaList(value);
        this.sleepingCellCityCode = value;
    }
    // 休眠小区维度下-地区下拉框选择事件
    sleepingCellAreaChange(value: string): void {
        if (value === null) {
            value = '';
        }
        this.sleepingCellAreaCode = value;
    }
    // 休眠小区维度下-获取城市下拉框数据列表
    getSleepingCellCityList(): void {
        const _that = this;
        _that.sleepingCellCityList = [];
        this.jsonp.get(this.url + '/wakeUpBts/getCityList?areaLevel=2&areaCode=&callback=JSONP_CALLBACK')
            .subscribe(
                function (data) {
                    const result = data['_body'];
                    _that.sleepingCellCityList = result['data'];
                },
                function (err) {
                    const obj = document.getElementById('citySelectFailed');
                    _that.message.error(obj.innerText);
                }
            );
    }
    // 休眠小区维度下-获取地区下拉框数据列表
    getSleepingCellAreaList(cityCode: string): void {
        const _that = this;
        if (cityCode === '') {
            _that.sleepingCellAreaList = [];
            return;
        }
        this.jsonp.get(this.url + '/wakeUpBts/getCityList?areaLevel=3&areaCode=' + cityCode + '&callback=JSONP_CALLBACK')
            .subscribe(
                function (data) {
                    const result = data['_body'];
                    _that.sleepingCellAreaList = result['data'];
                },
                function (err) {
                    const obj = document.getElementById('areaSelectFailed');
                    _that.message.error(obj.innerText);
                }
            );
    }
    sleepingCellQueryFun(dimensionValue: string): void {
        this.sleepingCellPage = 1;
        this.querySleepingCellTableDataList(dimensionValue);
    }
    // 休眠小区维度下-查询数据列表的数据
    querySleepingCellTableDataList(dimensionValue: string): void {
        const userName = sessionStorage.getItem('userName') === null ? '' : sessionStorage.getItem('userName');
        const token = sessionStorage.getItem('token') === null ? '' : sessionStorage.getItem('token');
        if (userName === '' || token === '') {
            this.router.navigate(['']);
            return;
        }
        const _that = this;
        _that.sleepingCellTableDataList = [];
        _that.sleepingCellTotal = 0;
        if (_that.sleepingCellStartTime > _that.sleepingCellEndTime) {
            const timeLimitInfo = document.getElementById('timeLimitInfo').innerText;
            _that.message.warning(timeLimitInfo);
            return;
        }
        _that.sleepingCellTableLoding = true;
        const sTime = _that.dateToStringFun(_that.sleepingCellStartTime);
        const eTime = _that.dateToStringFun(_that.sleepingCellEndTime);
        this.jsonp.get(this.url + '/wakeUpBts/getAbnormalDataList?type=' + dimensionValue + '&cityCode=' + _that.sleepingCellCityCode +
            '&areaCode=' + _that.sleepingCellAreaCode + '&neName=' + _that.sleepingCellNeName + '&neVersion='
            + _that.sleepingCellNeVersion + '&startTime=' + sTime + '&endTime=' + eTime + '&page='
            + _that.sleepingCellPage + '&neCode=' + _that.neCode +
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
                    _that.sleepingCellTableLoding = false;
                },
                function (err) {
                    _that.sleepingCellTableLoding = false;
                    const dataListFailed = document.getElementById('dataListFailed').innerText;
                    _that.message.error(dataListFailed);
                }
            );
    }
    // 休眠小区维度下-重置按钮事件
    sleepingCellResetForm(): void {
        this.sleepingCellCityCode = '';
        this.sleepingCellAreaCode = '';
        this.sleepingCellNeName = '';
        this.sleepingCellNeVersion = '';
        this.sleepingCellStartTime = this.getParamDateTime('start');
        this.sleepingCellEndTime = this.getParamDateTime('end');
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
                    _that.getDimensionListFun();
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

    getParamDateTime(type: string): Date {
        if (type === 'start') {
            return new Date(new Date(new Date().toLocaleDateString()).getTime()
                - 5 * 24 * 60 * 60 * 1000);
        } else {
            return new Date(new Date(new Date().toLocaleDateString()).getTime() + 24 * 60 * 60 * 1000 - 1000);
        }
    }

}
