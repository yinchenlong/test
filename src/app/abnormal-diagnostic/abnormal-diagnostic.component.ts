import { Component, OnInit } from '@angular/core';
import { Http, Jsonp } from '@angular/http';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { Router } from '@angular/router';
import { ConfigService } from '../app-config.service';
import * as L from 'leaflet';

@Component({
  selector: 'app-abnormal-diagnostic',
  templateUrl: './abnormal-diagnostic.component.html',
  styleUrls: ['./abnormal-diagnostic.component.css']
})
export class AbnormalDiagnosticComponent implements OnInit {
  // 数据请求的地址
  url = '';

  // 异常诊断仪表盘
  btsAnbormalDiagChartOptions = {};

  // 基站总数
  btsTotalCount = 0;
  // 激活告警异常基站数
  alarmCount = 0;
  // 基站退服异常基站数
  outageCount = 0;
  // 休眠基站异常基站数
  sleepcellCount = 0;
  // 最大评估时间
  maxCheckTime = '';
  // 当日待执行预约唤醒数
  bookingWakeUpCount = 0;
  // 当日待上站处理数
  landingStationCount = 0;
  // 当日已成功上站数
  successLandingStationCount = 0;
  // 当日自动唤醒成功基站数
  successWakeUpCount = 0;
  // 【即时自动唤醒】成功基站数
  instantSuccessWakeUpCount = 0;
  // 【延时自动唤醒】成功基站数
  delayedSuccessWakeUpCount = 0;
  // 【预约手动唤醒】成功基站数
  bookingSuccessWakeUpCount = 0;

  // 成功唤醒基站数详细显示标志
  isShow = false;

  // 地图相关
  // 地图瓦片服务地址
  mapUrl = '';
  // 地图
  map = null;
  // 地图右上角信息
  info = null;
  // 行政区域加载组件
  geojson = null;
  // 行政区域信息数组
  geoData = {};

  // 构造函数
  constructor(private http: Http, private jsonp: Jsonp, private message: NzMessageService,
    private configService: ConfigService, private router: Router, private modalService: NzModalService) {
    // 获取后台访问地址
    this.url = configService.getRequestUrl();
    // 获取地址瓦片服务地址
    this.mapUrl = configService.getMapUrl();
    // 获取行政区域geojson数据
    this.geoData = configService.getGeoJsonData();
  }

  ngOnInit() {
    const userName = sessionStorage.getItem('userName') === null ? '' : sessionStorage.getItem('userName');
    const token = sessionStorage.getItem('token') === null ? '' : sessionStorage.getItem('token');
    if (userName === '' || token === '') {
      this.router.navigate(['']);
      return;
    }
    // 加载左侧仪表盘等相关数据
    this.getTodayAbnormalInfo();
    // 加载右侧地图相关数据
    this.getMapData();
  }

  // 分三个维度获取当日异常基站信息
  getTodayAbnormalInfo(): void {
    const _that = this;
    this.jsonp.get(this.url + '/abnormalDiagnostic/getTodayAbnormalInfo?callback=JSONP_CALLBACK')
      .subscribe(
        function (data) {
          const result = data['_body'];
          if (result['success']) {
            // 最大评估时间
            _that.maxCheckTime = result['maxCheckTime'];
            _that.bookingWakeUpCount = result['bookingWakeUpCount'];
            _that.landingStationCount = result['landingStationCount'];
            _that.successLandingStationCount = result['successLandingStationCount'];
            _that.successWakeUpCount = result['successWakeUpCount'];
            _that.instantSuccessWakeUpCount = result['instantSuccessWakeUpCount'];
            _that.delayedSuccessWakeUpCount = result['delayedSuccessWakeUpCount'];
            _that.bookingSuccessWakeUpCount = result['bookingSuccessWakeUpCount'];
            // 加载仪表盘
            _that.buildBtsAnbormalDiagChart(result);
          } else {
            _that.router.navigate(['']);
            return;
          }
        },
        function (err) {
          const obj = document.getElementById('abnormalBtsGetFailed').innerText;
          _that.message.error(obj);
        }
      );
  }

  // 当日异常基站诊断仪表盘
  buildBtsAnbormalDiagChart(item: any): void {
    // 监控的基站总数
    this.btsTotalCount = item['btsTotalCount'];
    // 激活告警异常基站数
    this.alarmCount = item['alarmCount'];
    // 基站退服异常基站数
    this.outageCount = item['outageCount'];
    // 休眠基站异常基站数
    this.sleepcellCount = item['sleepcellCount'];
    // 异常基站总数
    let abnormalBtsCount = 0;
    abnormalBtsCount = item['abnormalBtsTotalCount'] * 1;
    // 异常数量对应的异常程度
    let degree = '';
    // 仪表盘数据数组
    const abnormalBtsData = [];
    // 根据异常基站数量判断当前异常程度
    if (abnormalBtsCount >= 0 && abnormalBtsCount <= 5) {
      degree = document.getElementById('degreeLight').innerText;
    } else if (abnormalBtsCount > 5 && abnormalBtsCount <= 20) {
      degree = document.getElementById('degreeModerate').innerText;
    } else if (abnormalBtsCount > 20 && abnormalBtsCount <= 35) {
      degree = document.getElementById('degreeSerious').innerText;
    } else if (abnormalBtsCount > 35) {
      degree = document.getElementById('degreeDisaster').innerText;
    }
    // 设置仪表盘数据数组
    abnormalBtsData.push({
      value: abnormalBtsCount,
      name: degree + ' ' + abnormalBtsCount + '/' + this.btsTotalCount
    });

    // 仪表盘样式设定
    this.btsAnbormalDiagChartOptions = {
      tooltip: {
        show: false
      },
      title: {
        show: true,
        x: 'center',
        y: '75%',
        text: document.getElementById('chartTitleTxt').innerText + ':' + abnormalBtsCount,
        textStyle: {
          fontSize: 14,
          color: 'green'
        }
      },
      toolbox: { // 可视化的工具箱
        show: false
      },
      series: [{
        name: '',
        type: 'gauge',
        min: 0,
        max: 50,
        splitNumber: 10,
        radius: '80%',
        pointer: {
          width: 5 // 指针宽度
        },
        data: abnormalBtsData,
        axisLabel: {
          show: true,
          textStyle: {
            fontSize: 14,
            fontWeight: 'bolder'
          }
        },
        axisLine: { // 坐标轴线
          lineStyle: {
            color: [[0.1, '#68B34B'], [0.40, '#FEFE56'], [0.70, '#FEB74C'], [1, '#ff4500']],
            width: 15,
            shadowColor: '#9EC3BB', // 默认透明
            shadowBlur: 10
          }
        },
        axisTick: { // 坐标轴小标记
          length: 20,
          lineStyle: {
            color: 'auto'
          }
        },
        splitLine: { // 分隔线
          length: 25,
          lineStyle: {
            color: 'auto'
          }
        },
        title: {
          offsetCenter: [0, '-20%'],
          textStyle: {
            fontWeight: 'bold',
            fontSize: 16,
            color: '#000',
            shadowColor: '#fff', // 默认透明
            shadowBlur: 10
          },
          show: true,
        },
        detail: {
          formatter: '{value}',
          offsetCenter: ['45%', '80%'],
          textStyle: {
            fontSize: 20,
            fontFamily: 'Impact',
            color: 'green'
          },
          show: false
        }
      }]
    };
  }

  // 显示详细的唤醒成功基站
  showDetail(): void {
    this.isShow = true;
  }

  // 隐藏详细的唤醒成功基站
  hideDetail(): void {
    this.isShow = false;
  }

  // 获取地图数据
  getMapData(): void {
    const _that = this;
    let regionIds = '';
    // 从geojson中取出区域编号
    for (let i = 0; i < _that.geoData['features'].length; i++) {
      regionIds += _that.geoData['features'][i].id + ',';
    }
    regionIds = regionIds.substring(0, regionIds.length - 1);
    // 后台请求每个区域的三个维度的异常基站信息
    this.jsonp.get(this.url + '/abnormalDiagnostic/getMapTodayAbnormalInfo?regionIds=' + regionIds + '&callback=JSONP_CALLBACK')
      .subscribe(
        function (data) {
          const result = data['_body'];
          if (result['success']) {
            // 在geojson中添加三个维度的异常基站数属性
            for (let i = 0; i < _that.geoData['features'].length; i++) {
              _that.geoData['features'][i]['alarmCount'] = result[_that.geoData['features'][i].id]['alarmCount'];
              _that.geoData['features'][i]['outageCount'] = result[_that.geoData['features'][i].id]['outageCount'];
              _that.geoData['features'][i]['sleepcellCount'] = result[_that.geoData['features'][i].id]['sleepcellCount'];
              _that.geoData['features'][i]['abnormalBtsTotalCount'] = result[_that.geoData['features'][i].id]['abnormalBtsTotalCount'];
            }
            // 加载地图
            _that.loadMap();
          } else {
            _that.router.navigate(['']);
            return;
          }
        },
        function (err) {
          const obj = document.getElementById('mapDataGetFailed').innerText;
          _that.message.error(obj);
        }
      );
  }

  // 地图加载
  loadMap(): void {
    const _that = this;
    // 地图中心点坐标
    const myCenter = [31.2748715, 121.431197];
    // 离线地图后台瓦片服务地址
    const osmUrl = _that.mapUrl + '/{z}/{x}/{y}.png';
    const osmAttrib = 'NOKIA';
    // 加载地图
    const osm = L.tileLayer(osmUrl, { minZoom: 8, maxZoom: 9, attribution: osmAttrib });
    const bounds = new L.LatLngBounds(new L.LatLng(31.9289, 121.0309), new L.LatLng(30.6710, 122.1103));
    this.map = L.map('mapDiv', {
      center: bounds.getCenter(),
      maxBounds: bounds,
      attributionControl: false,
      zoomControl: false
    }).setView(myCenter, 8);
    osm.addTo(this.map);
    this.map.setMaxBounds(bounds);

    // 在地图上添加右上角区域异常基站信息控件
    this.info = L.control();
    this.info.onAdd = function (m: any) {
      this._div = L.DomUtil.create('div', 'info');
      this.update();
      return this._div;
    };

    const detailStr = document.getElementById('detail').innerText;
    const activeAlarmStr = document.getElementById('activeAlarm').innerText;
    const btsOutageStr = document.getElementById('btsOutage').innerText;
    const sleepingBtsStr = document.getElementById('sleepingBts').innerText;
    const oneStr = document.getElementById('one').innerText;

    // 设置区域异常信息面板信息
    this.info.update = function (props: any) {
      this._div.innerHTML = (props ?
        '<h4>' + props.properties.name + detailStr + '</h4>'
        + '<b>' + activeAlarmStr + ':' + '</b>   ' + props.alarmCount + oneStr
        + '<br /><b>' + btsOutageStr + ':' + '</b>   ' + props.outageCount + oneStr
        + '<br /><b>' + sleepingBtsStr + ':' + '</b>   ' + props.sleepcellCount + oneStr
        : '');
    };

    this.info.addTo(this.map);
    // 加载geojson数据
    this.geojson = L.geoJson(this.geoData, {
      // 根据异常基站数量设置区域覆盖颜色
      style: function (feature: any) {
        const abnormalBtsCount = feature.abnormalBtsTotalCount;
        if (abnormalBtsCount >= 0 && abnormalBtsCount <= 5) {
          return {
            weight: 2,
            opacity: 1,
            color: 'white',
            dashArray: '3',
            fillOpacity: 0.7,
            fillColor: '#68B34B'
          };
        } else if (abnormalBtsCount > 5 && abnormalBtsCount <= 20) {
          return {
            weight: 2,
            opacity: 1,
            color: 'white',
            dashArray: '3',
            fillOpacity: 0.7,
            fillColor: '#FEFE56'
          };
        } else if (abnormalBtsCount > 20 && abnormalBtsCount <= 35) {
          return {
            weight: 2,
            opacity: 1,
            color: 'white',
            dashArray: '3',
            fillOpacity: 0.7,
            fillColor: '#FEB74C'
          };
        } else if (abnormalBtsCount > 35) {
          return {
            weight: 2,
            opacity: 1,
            color: 'white',
            dashArray: '3',
            fillOpacity: 0.7,
            fillColor: '#ff4500'
          };
        }
      },
      onEachFeature: function (feature: any, layer: any) {
        // 设置鼠标事件
        layer.on({
          mouseover: function (e: any): void {
            layer = e.target;
            layer.setStyle({
              weight: 3,
              color: '#FF9500',
              dashArray: '',
              fillOpacity: 0.7
            });
            layer.bringToFront();
            infoTemp.update(layer.feature);
          },
          mouseout: function (e: any): void {
            geo.resetStyle(e.target);
            infoTemp.update();
          }
        });
      }
    }
    ).addTo(this.map);
    const geo = this.geojson;
    const infoTemp = this.info;
  }

}
