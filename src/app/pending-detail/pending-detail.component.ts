import { Component, OnInit } from '@angular/core';
import { Http, Jsonp, Headers } from '@angular/http';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { Router } from '@angular/router';

import { ConfigService } from '../app-config.service';

@Component({
    selector: 'app-pending-detail',
    templateUrl: './pending-detail.component.html',
    styleUrls: ['./pending-detail.component.css']
})
export class PendingDetailComponent implements OnInit {

    // 数据请求的地址
    url = '';
    // 异常基站序号
    index = 0;
    // 异常基站总数
    tableTotal = 0;
    // 基站编号
    neCode = '';
    // 检测时间
    operationTime = '';
    // 基站名称
    neName = '';
    // 所属城市
    city = '';
    // 所属地区
    area = '';
    // 基站IP
    ip = '';
    // 制式
    mode = '';
    // 基站级别
    btsLevel = '';
    // 基站类型
    sbtsOrLte = '';
    // 异常持续时长趋势图
    abnormalChartOptions = {};
    // 基站编号结果集
    neCodeList = [];

    private header = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded' });

    // 构造函数
    constructor(private http: Http, private jsonp: Jsonp, private message: NzMessageService,
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
        this.queryBtsInfo('');
        this.index = 1;
    }

    // 查询基站基础数据
    queryBtsInfo(neCode: string): void {
        const _that = this;
        this.jsonp.get(this.url + '/wakeUpBts/getPendingDetailList?neCode=' + neCode + '&callback=JSONP_CALLBACK')
            .subscribe(
                function (data) {
                    const result = data['_body'];
                    if (result['success']) {
                        _that.neCode = result['content']['neCode'];
                        _that.operationTime = result['content']['operationTime'];
                        _that.neName = result['content']['neName'];
                        _that.city = result['content']['cityName'];
                        _that.area = result['content']['regionName'];
                        _that.ip = result['content']['neIp'];
                        _that.mode = result['content']['mode'];
                        _that.btsLevel = result['content']['stationType'];
                        _that.sbtsOrLte = result['content']['sbtsOrLte'];
                        if (neCode === '') {
                            _that.tableTotal = result['totalElements'];
                            _that.neCodeList = result['neCodeList'];
                        }
                        _that.queryBarChartDataFun(_that.neCode);
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
                    const pendingDetailFailed = document.getElementById('pendingDetailFailed').innerText;
                    _that.message.error(pendingDetailFailed);
                }
            );
    }

    // 上一个按钮
    prevFun(): void {
        if (this.index > 1) {
            this.index = this.index - 1;
            this.neCode = this.neCodeList[this.index - 1];
            this.queryBtsInfo(this.neCode);
        } else {
            const prevFailed = document.getElementById('prevFailed').innerText;
            this.message.error(prevFailed);
        }
    }

    // 下一个按钮
    nextFun(): void {
        if (this.index < this.tableTotal) {
            this.index = this.index + 1;
            this.neCode = this.neCodeList[this.index - 1];
            this.queryBtsInfo(this.neCode);
        } else {
            const nextFailed = document.getElementById('nextFailed').innerText;
            this.message.error(nextFailed);
        }
    }

    // 查询趋势图数据
    queryBarChartDataFun(neCode: string): void {
        const _that = this;
        this.jsonp.get(this.url + '/wakeUpBts/getAbnormalChartList?neCode=' + neCode + '&callback=JSONP_CALLBACK')
            .subscribe(
                function (data) {
                    const result = data['_body'];
                    if (result['success']) {
                        _that.buildAbnormalCharsFun(result);
                    }
                },
                function (err) {
                    const obj = document.getElementById('barChartFailed');
                    _that.message.error(obj.innerText);
                }
            );
    }

    // 生成异常持续时长趋势图
    buildAbnormalCharsFun(item: any): void {
        // 图例名称，固定为激活告警、基站退服、休眠基站
        const legendAlarm = document.getElementById('activeAlarm').innerText;
        const legendOutage = document.getElementById('btsOutage').innerText;
        const legendSleeping = document.getElementById('sleepingCell').innerText;
        // Y轴名称：异常持续时长
        const yAxisName = document.getElementById('abnormalLast').innerText;
        // x轴数据
        const xAxisData = item['xAxis'];
        // y轴数据
        const yAxisAlarmData = item['alarmYAxis'];
        const yAxisOutageData = item['btsOutageYAxis'];
        const yAxisSleepingData = item['sleepingCellYAxis'];

        this.abnormalChartOptions = {

            title: {
                text: '',
            },
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'shadow'
                },
            },
            color: ['#F0AD4E', '#92D050', '#7030A0'],
            toolbox: {
                show: false
            },
            legend: {
                data: [legendAlarm, legendOutage, legendSleeping],
                show: true,
                top: 0
            },
            grid: {
                x: 60,
                x2: 60,
                y: 30,
                y2: 50
            },
            calculable: true,
            xAxis: {
                type: 'category',
                data: xAxisData,
                axisLabel: {
                    interval: 0
                    // rotate:-30
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
            series: [
                {
                    name: legendAlarm,
                    type: 'bar',
                    barWidth: 25,
                    data: yAxisAlarmData
                },
                {
                    name: legendOutage,
                    type: 'bar',
                    barWidth: 25,
                    data: yAxisOutageData
                },
                {
                    name: legendSleeping,
                    type: 'bar',
                    barWidth: 25,
                    data: yAxisSleepingData
                }
            ]
        };
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
                    _that.queryBtsInfo('');
                    _that.index = 1;
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

}
