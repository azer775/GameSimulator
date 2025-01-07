import { ModuleWithProviders, Provider } from '@angular/core';
import { NgxEchartsDirective, NgxEchartsConfig, NGX_ECHARTS_CONFIG, ThemeOption } from './ngx-echarts.directive';
import * as i0 from "@angular/core";
import * as i1 from "./ngx-echarts.directive";
declare const provideEcharts: (config?: Omit<NgxEchartsConfig, 'echarts'>) => Provider;
declare const provideEchartsCore: (config: NgxEchartsConfig) => Provider;
export declare class NgxEchartsModule {
    static forRoot(config: NgxEchartsConfig): ModuleWithProviders<NgxEchartsModule>;
    static forChild(): ModuleWithProviders<NgxEchartsModule>;
    static ɵfac: i0.ɵɵFactoryDeclaration<NgxEchartsModule, never>;
    static ɵmod: i0.ɵɵNgModuleDeclaration<NgxEchartsModule, never, [typeof i1.NgxEchartsDirective], [typeof i1.NgxEchartsDirective]>;
    static ɵinj: i0.ɵɵInjectorDeclaration<NgxEchartsModule>;
}
export { NgxEchartsDirective, NGX_ECHARTS_CONFIG, ThemeOption, provideEcharts, provideEchartsCore };
