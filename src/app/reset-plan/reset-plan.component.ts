import { Component, OnInit, DoCheck } from '@angular/core';
import { Http, Jsonp } from '@angular/http';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { Router } from '@angular/router';
import { KvWatcher, NgxWatcherService } from 'ngx-watcher';

import { ConfigService } from '../app-config.service';

@Component({
  selector: 'app-reset-plan',
  templateUrl: './reset-plan.component.html',
  styleUrls: ['./reset-plan.component.css']
})
export class ResetPlanComponent implements OnInit, DoCheck {

  objData = {
    // 自动唤起时间延时至
    delayTime: '',
    // 休眠小区流量阀值
    tputThreshold: '',
    // RACH接入尝试次数
    rachSetupAtpts: '',
    // RACH接入成功率
    rachSetupSuccessRatio: '',
    // RRC连接建立请求次数
    rrcConnAtmps: '',
    rrcConnSuccessRatio: '',
    // E-RAB建立成功请求次数
    erabConnAtmps: '',
    // E-RAB建立成功率
    erabConnSuccessRatio: '',
    // 激活告警的绑定ID
    alarmBindingId: '',
    // 基站退服的绑定ID
    btsOutageBindingId: '',
    // 休眠小区的绑定ID
    sleepingCellBindingId: ''
  };
  kvWatcher: KvWatcher<string | string>;
  // 数据请求的地址
  url = '';
  // 是否显示重启方案预设窗口
  visible = false;
  // 维度中是否有休眠小区
  sleepCell = true;
  // 隐藏ID
  id = '';
  // 唤醒有效期
  usefulLife = '';
  // 即时自动唤醒列表
  dimensionList = [];
  // tab显示标志
  isActive = 1;
  // 方案激活标志（0:未激活，1:已激活）
  activateStates = 0;
  // 页面值变更标志
  valueChangeFlg = 0;

  constructor(private http: Http, private jsonp: Jsonp, private message: NzMessageService,
    private configService: ConfigService, private router: Router, private modalService: NzModalService,
    private watcher: NgxWatcherService) {
    this.url = configService.getRequestUrl();
    this.getSleepCell();
    this.kvWatcher = watcher.of(this.objData);
  }

  ngOnInit() {

  }

  // 监听页面控件值变化
  ngDoCheck(): void {
    if (this.objData.delayTime === '') {
      this.valueChangeFlg = 0;
    } else {
      if (this.kvWatcher !== null) {
        this.kvWatcher.watch(
          this.objData,
          v => { },
          (t, v) => {
            if (t === 'CHANGE') {
              this.valueChangeFlg = 1;
            }
          }
        );
      }
    }
  }

  // 获取是否有休眠小区维度，用于控制面板上休眠小区相关指标是否显示
  getSleepCell(): void {
    const _that = this;
    this.jsonp.get(this.url + '/wakeUpBts/getSleepCell?callback=JSONP_CALLBACK')
      .subscribe(
        function (objData) {
          const result = objData['_body'];
          _that.sleepCell = result['success'];
        },
        function (err) {
          console.log(err);
        }
      );
  }

  // 点击“重启方案预设”按钮，打开“重启方案预设”窗口
  thrSetting(planType: number): void {
    this.kvWatcher = null;
    const _that = this;
    this.jsonp.get(this.url + '/wakeUpBts/getResetPlan?planType=' + planType + '&callback=JSONP_CALLBACK')
      .subscribe(
        function (objData) {
          const result = objData['_body'];
          if (result['success']) {
            _that.id = result['id'];
            _that.objData.delayTime = result['delayTime'];
            _that.usefulLife = result['usefulLife'];
            _that.objData.tputThreshold = result['tputThreshold'];
            _that.objData.rachSetupAtpts = result['rachSetupAtpts'];
            _that.objData.rachSetupSuccessRatio = result['rachSetupSuccessRatio'];
            _that.objData.rrcConnAtmps = result['rrcConnAtmps'];
            _that.objData.rrcConnSuccessRatio = result['rrcConnSuccessRatio'];
            _that.objData.erabConnAtmps = result['erabConnAtmps'];
            _that.objData.erabConnSuccessRatio = result['erabConnSuccessRatio'];
            _that.objData.alarmBindingId = result['alarmBinding'];
            _that.objData.btsOutageBindingId = result['btsOutageBinding'];
            _that.objData.sleepingCellBindingId = result['sleepingCellBinding'];
            _that.dimensionList = result['dimensionList'];
            _that.visible = true;
            _that.activateStates = result['activateStates'] * 1;
            _that.kvWatcher = _that.watcher.of(_that.objData);
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
          const resetPlanFailed = document.getElementById('resetPlanFailed').innerText;
          _that.message.error(resetPlanFailed);
        }
      );
  }

  // 点击切换tab
  planTypeTabClick(active: number): void {
    this.isActive = active;
    this.clearData();
    this.thrSetting(active);
  }

  clearData(): void {
    this.id = '';
    this.objData.delayTime = '';
    this.usefulLife = '';
    this.objData.tputThreshold = '';
    this.objData.rachSetupAtpts = '';
    this.objData.rachSetupSuccessRatio = '';
    this.objData.rrcConnAtmps = '';
    this.objData.rrcConnSuccessRatio = '';
    this.objData.erabConnAtmps = '';
    this.objData.erabConnSuccessRatio = '';
    this.objData.alarmBindingId = '';
    this.objData.btsOutageBindingId = '';
    this.objData.sleepingCellBindingId = '';
    this.dimensionList = [];
  }

  // 点击激活当前方案
  handleThrActive(): void {
    // 方案值改变未保存，激活时提示先保存后再激活
    if (this.valueChangeFlg === 1) {
      const tips = document.getElementById('tips').innerText;
      const activeTips = document.getElementById('activeTips').innerText;
      const ok = document.getElementById('ok').innerText;
      this.modalService.info({
        nzTitle: tips,
        nzContent: activeTips,
        nzOkText: ok
      });
    } else {
      const _that = this;
      this.jsonp.get(this.url + '/wakeUpBts/activateResetPlan?id=' + _that.id + '&callback=JSONP_CALLBACK')
        .subscribe(
          function (objData) {
            const result = objData['_body'];
            if (result['success']) {
              _that.activateStates = 1;
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
            const resetPlanFailed = document.getElementById('resetPlanFailed').innerText;
            _that.message.error(resetPlanFailed);
          }
        );
    }
  }

  handleThrCancel(): void {
    this.visible = false;
  }

  // 绑定基站按钮事件
  bindBtsFun(taskId: String, code: String): void {
    if (taskId === '') {
      const _that = this;
      this.jsonp.get(this.url + '/wakeUpBts/getBindBtsId?callback=JSONP_CALLBACK')
        .subscribe(
          function (objData) {
            const result = objData['_body'];
            if (result['success'] === '0') {
              if (code === 'slb_001') {
                _that.objData.alarmBindingId = result['taskId'];
                _that.openBindBtsServer(_that.objData.alarmBindingId);
              } else if (code === 'slb_002') {
                _that.objData.btsOutageBindingId = result['taskId'];
                _that.openBindBtsServer(_that.objData.btsOutageBindingId);
              } else if (code === 'slb_003') {
                _that.objData.sleepingCellBindingId = result['taskId'];
                _that.openBindBtsServer(_that.objData.sleepingCellBindingId);
              }
            } else {
              _that.message.error(result['msg']);
            }
          },
          function (err) {
            console.log(err);
            const bindingBtsFailed = document.getElementById('bindingBtsFailed').innerText;
            _that.message.error(bindingBtsFailed);
          }
        );
    } else {
      this.openBindBtsServer(taskId);
    }
  }

  // 打开基站选择器程序
  openBindBtsServer(taskId: String): void {
    const userName = sessionStorage.getItem('userName') === null ? '' : sessionStorage.getItem('userName');
    const token = sessionStorage.getItem('token') === null ? '' : sessionStorage.getItem('token');
    if (userName === '' || token === '') {
      this.router.navigate(['']);
      return;
    }
    const tips = document.getElementById('tips').innerText;
    const bindingInfo = document.getElementById('bindingInfo').innerText;
    const iSee = document.getElementById('iSee').innerText;
    this.modalService.info({
      nzTitle: tips,
      nzContent: bindingInfo,
      nzOkText: iSee
    });
    const btsSelectUrl = this.configService.getBtsSelectUrl();
    window.open(btsSelectUrl + '?token=' + token + '&userName=' + userName + '&taskId=' + taskId, '_blank');
  }

  // 保存事件
  handleThrSave(): void {
    if (this.usefulLife !== '') {
      const checkResult = this.checkNumber(this.usefulLife);
      if (!checkResult) {
        const inputTputusefulCheck = document.getElementById('inputTputusefulCheck').innerText;
        this.message.warning(inputTputusefulCheck);
        return;
      }
    }
    if (this.sleepCell) {
      if (this.objData.tputThreshold === '') {
        const inputTputThreshold = document.getElementById('inputTputThreshold').innerText;
        this.message.warning(inputTputThreshold);
        return;
      } else {
        const checkResult = this.checkNumber(this.objData.tputThreshold);
        if (!checkResult) {
          const inputTputThresholdCheck = document.getElementById('inputTputThresholdCheck').innerText;
          this.message.warning(inputTputThresholdCheck);
          return;
        }
      }
      if (this.objData.rachSetupAtpts === '') {
        const inputRachSetupAtpts = document.getElementById('inputRachSetupAtpts').innerText;
        this.message.warning(inputRachSetupAtpts);
        return;
      } else {
        const checkResult = this.checkNumber(this.objData.rachSetupAtpts);
        if (!checkResult) {
          const inputRachSetupAtptsCheck = document.getElementById('inputRachSetupAtptsCheck').innerText;
          this.message.warning(inputRachSetupAtptsCheck);
          return;
        }
      }
      if (this.objData.rachSetupSuccessRatio === '') {
        const inputRachSetupSuccessRatio = document.getElementById('inputRachSetupSuccessRatio').innerText;
        this.message.warning(inputRachSetupSuccessRatio);
        return;
      } else {
        const checkResult = this.checkNumber(this.objData.rachSetupSuccessRatio);
        if (!checkResult) {
          const inputRachSetupSuccessRatioCheck = document.getElementById('inputRachSetupSuccessRatioCheck').innerText;
          this.message.warning(inputRachSetupSuccessRatioCheck);
          return;
        }
      }
      if (this.objData.rrcConnAtmps === '') {
        const inputRrcConnAtmps = document.getElementById('inputRrcConnAtmps').innerText;
        this.message.warning(inputRrcConnAtmps);
        return;
      } else {
        const checkResult = this.checkNumber(this.objData.rrcConnAtmps);
        if (!checkResult) {
          const inputRrcConnAtmpsCheck = document.getElementById('inputRrcConnAtmpsCheck').innerText;
          this.message.warning(inputRrcConnAtmpsCheck);
          return;
        }
      }
      if (this.objData.rrcConnSuccessRatio === '') {
        const inputRrcConnSuccessRatio = document.getElementById('inputRrcConnSuccessRatio').innerText;
        this.message.warning(inputRrcConnSuccessRatio);
        return;
      } else {
        const checkResult = this.checkNumber(this.objData.rrcConnSuccessRatio);
        if (!checkResult) {
          const inputRrcConnSuccessRatioCheck = document.getElementById('inputRrcConnSuccessRatioCheck').innerText;
          this.message.warning(inputRrcConnSuccessRatioCheck);
          return;
        }
      }
      if (this.objData.erabConnAtmps === '') {
        const inputErabConnAtmps = document.getElementById('inputErabConnAtmps').innerText;
        this.message.warning(inputErabConnAtmps);
        return;
      } else {
        const checkResult = this.checkNumber(this.objData.erabConnAtmps);
        if (!checkResult) {
          const inputErabConnAtmpsCheck = document.getElementById('inputErabConnAtmpsCheck').innerText;
          this.message.warning(inputErabConnAtmpsCheck);
          return;
        }
      }
      if (this.objData.erabConnSuccessRatio === '') {
        const inputErabConnSuccessRatio = document.getElementById('inputErabConnSuccessRatio').innerText;
        this.message.warning(inputErabConnSuccessRatio);
        return;
      } else {
        const checkResult = this.checkNumber(this.objData.erabConnSuccessRatio);
        if (!checkResult) {
          const inputErabConnSuccessRatioCheck = document.getElementById('inputErabConnSuccessRatioCheck').innerText;
          this.message.warning(inputErabConnSuccessRatioCheck);
          return;
        }
      }
    }
    const userName = sessionStorage.getItem('userName') === null ? '' : sessionStorage.getItem('userName');
    const token = sessionStorage.getItem('token') === null ? '' : sessionStorage.getItem('token');
    if (userName === '' || token === '') {
      this.router.navigate(['']);
      return;
    }
    const _that = this;
    this.jsonp.get(this.url + '/wakeUpBts/saveResetPlan?id=' + _that.id +
      '&delayTime=' + _that.objData.delayTime + '&usefulLife=' + _that.usefulLife +
      '&tputThreshold=' + _that.objData.tputThreshold + '&rachSetupAtpts=' + _that.objData.rachSetupAtpts +
      '&rachSetupSuccessRatio=' + _that.objData.rachSetupSuccessRatio + '&rrcConnAtmps=' + _that.objData.rrcConnAtmps +
      '&rrcConnSuccessRatio=' + _that.objData.rrcConnSuccessRatio + '&erabConnAtmps=' + _that.objData.erabConnAtmps +
      '&erabConnSuccessRatio=' + _that.objData.erabConnSuccessRatio + '&planType=' + _that.isActive +
      '&alarmBindingId=' + _that.objData.alarmBindingId + '&btsOutageBindingId=' + _that.objData.btsOutageBindingId +
      '&sleepingCellBindingId=' + _that.objData.sleepingCellBindingId +
      '&callback=JSONP_CALLBACK')
      .subscribe(
        function (objData) {
          const result = objData['_body']['success'];
          if (result) {
            const saveSuccessfully = document.getElementById('saveSuccessfully').innerText;
            _that.message.info(saveSuccessfully);
            _that.valueChangeFlg = 0;
            _that.thrSetting(_that.isActive);
          } else {
            const saveFailed = document.getElementById('saveFailed').innerText;
            _that.modalService.warning({
              nzTitle: saveFailed,
              nzContent: result['msg']
            });
          }
        },
        function (err) {
          const saveFailed = document.getElementById('saveFailed').innerText;
          console.log(err);
          _that.message.error(saveFailed);
        }
      );
  }

  // 正则表达式验证是否为全数字
  checkNumber(value: string): boolean {
    let checkResult = false;
    const reg = /[^\d.]/g;
    if (!reg.test(value)) {
      checkResult = true;
    }
    return checkResult;
  }

}
