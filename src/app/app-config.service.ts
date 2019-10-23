import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {

  apiConfig = null;

  constructor(private httpclient: HttpClient) { }

  /**
   * 从配置文件中读取请求数据的URL
   */
  getRequestUrl() {
    const item = localStorage.getItem('apiConfig');
    if (item === null) {
      return '';
    } else {
      return JSON.parse(item)['requestUrl'];
    }
  }

  /**
   * 从配置文件中读取基站选择器的URL
   */
  getBtsSelectUrl() {
    const item = localStorage.getItem('apiConfig');
    if (item === null) {
      return '';
    } else {
      return JSON.parse(item)['btsSelectUrl'];
    }
  }

  /**
   * 从配置文件中读取基站信息管理微应用的URL
   */
  getBtsInfoManageUrl() {
    const item = localStorage.getItem('apiConfig');
    if (item === null) {
      return '';
    } else {
      return JSON.parse(item)['btsInfoManageUrl'];
    }
  }

  /**
   * 从配置文件中读取neg登录首页的URL
   */
  getNegLoginUrl() {
    const item = localStorage.getItem('apiConfig');
    if (item === null) {
      return '';
    } else {
      return JSON.parse(item)['negLoginUrl'];
    }
  }

  /**
    * 从配置文件中读取配置内容
    */
  getConfig() {
    this.httpclient.get('assets/api-config.json').subscribe(result => {
      localStorage.setItem('apiConfig', JSON.stringify(result));
      this.apiConfig = JSON.parse(localStorage.getItem('apiConfig'));
    });
  }

  /**
   * 获取GeoJson数据
   */
  getGeoJson() {
    this.httpclient.get('assets/geo.json').subscribe(result => {
      localStorage.setItem('geoJson', JSON.stringify(result));
    });
  }

  getGeoJsonData() {
    const item = localStorage.getItem('geoJson');
    if (item === null) {
      return '';
    } else {
      return JSON.parse(item);
    }
  }

  /**
   * 从配置文件中读取请求数据的URL
   */
  getMapUrl() {
    const item = localStorage.getItem('apiConfig');
    if (item === null) {
      return '';
    } else {
      return JSON.parse(item)['mapUrl'];
    }
  }

}
