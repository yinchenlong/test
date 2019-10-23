import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'neg-bts-auto-reset-web-agl';

  constructor(private translate: TranslateService) {
    // 添加语言支持
    translate.addLangs(['en', 'zh-CN', 'zh-TW']);
    // 设置默认语言，一般在无法匹配的时候使用
    translate.setDefaultLang('zh-CN');
    // 获取当前浏览器环境的语言比如en、 zh-CN
    const browserLang = translate.getBrowserCultureLang();
    translate.use(browserLang);
  }
}
