import { NgModule } from '@angular/core';
import { NgxEchartsDirective, NGX_ECHARTS_CONFIG, } from './ngx-echarts.directive';
import * as i0 from "@angular/core";
const provideEcharts = (config = {}) => {
    return {
        provide: NGX_ECHARTS_CONFIG,
        useFactory: () => ({
            ...config,
            echarts: () => import('echarts'),
        }),
    };
};
const provideEchartsCore = (config) => {
    return {
        provide: NGX_ECHARTS_CONFIG,
        useValue: config,
    };
};
export class NgxEchartsModule {
    static forRoot(config) {
        return {
            ngModule: NgxEchartsModule,
            providers: [provideEchartsCore(config)],
        };
    }
    static forChild() {
        return {
            ngModule: NgxEchartsModule,
        };
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.0.1", ngImport: i0, type: NgxEchartsModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule }); }
    static { this.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "17.0.1", ngImport: i0, type: NgxEchartsModule, imports: [NgxEchartsDirective], exports: [NgxEchartsDirective] }); }
    static { this.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "17.0.1", ngImport: i0, type: NgxEchartsModule }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.0.1", ngImport: i0, type: NgxEchartsModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [NgxEchartsDirective],
                    exports: [NgxEchartsDirective],
                }]
        }] });
export { NgxEchartsDirective, NGX_ECHARTS_CONFIG, provideEcharts, provideEchartsCore };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmd4LWVjaGFydHMubW9kdWxlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vcHJvamVjdHMvbmd4LWVjaGFydHMvc3JjL2xpYi9uZ3gtZWNoYXJ0cy5tb2R1bGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFFBQVEsRUFBaUMsTUFBTSxlQUFlLENBQUM7QUFDeEUsT0FBTyxFQUNMLG1CQUFtQixFQUVuQixrQkFBa0IsR0FFbkIsTUFBTSx5QkFBeUIsQ0FBQzs7QUFFakMsTUFBTSxjQUFjLEdBQUcsQ0FBQyxTQUE0QyxFQUFFLEVBQVksRUFBRTtJQUNsRixPQUFPO1FBQ0wsT0FBTyxFQUFFLGtCQUFrQjtRQUMzQixVQUFVLEVBQUUsR0FBRyxFQUFFLENBQUMsQ0FBQztZQUNqQixHQUFHLE1BQU07WUFDVCxPQUFPLEVBQUUsR0FBRyxFQUFFLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQztTQUNqQyxDQUFDO0tBQ0gsQ0FBQztBQUNKLENBQUMsQ0FBQztBQUVGLE1BQU0sa0JBQWtCLEdBQUcsQ0FBQyxNQUF3QixFQUFZLEVBQUU7SUFDaEUsT0FBTztRQUNMLE9BQU8sRUFBRSxrQkFBa0I7UUFDM0IsUUFBUSxFQUFFLE1BQU07S0FDakIsQ0FBQztBQUNKLENBQUMsQ0FBQztBQU1GLE1BQU0sT0FBTyxnQkFBZ0I7SUFDM0IsTUFBTSxDQUFDLE9BQU8sQ0FBQyxNQUF3QjtRQUNyQyxPQUFPO1lBQ0wsUUFBUSxFQUFFLGdCQUFnQjtZQUMxQixTQUFTLEVBQUUsQ0FBQyxrQkFBa0IsQ0FBQyxNQUFNLENBQUMsQ0FBQztTQUN4QyxDQUFDO0lBQ0osQ0FBQztJQUNELE1BQU0sQ0FBQyxRQUFRO1FBQ2IsT0FBTztZQUNMLFFBQVEsRUFBRSxnQkFBZ0I7U0FDM0IsQ0FBQztJQUNKLENBQUM7OEdBWFUsZ0JBQWdCOytHQUFoQixnQkFBZ0IsWUFIakIsbUJBQW1CLGFBQ25CLG1CQUFtQjsrR0FFbEIsZ0JBQWdCOzsyRkFBaEIsZ0JBQWdCO2tCQUo1QixRQUFRO21CQUFDO29CQUNSLE9BQU8sRUFBRSxDQUFDLG1CQUFtQixDQUFDO29CQUM5QixPQUFPLEVBQUUsQ0FBQyxtQkFBbUIsQ0FBQztpQkFDL0I7O0FBZUQsT0FBTyxFQUFFLG1CQUFtQixFQUFFLGtCQUFrQixFQUFlLGNBQWMsRUFBRSxrQkFBa0IsRUFBRSxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgTmdNb2R1bGUsIE1vZHVsZVdpdGhQcm92aWRlcnMsIFByb3ZpZGVyIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge1xuICBOZ3hFY2hhcnRzRGlyZWN0aXZlLFxuICBOZ3hFY2hhcnRzQ29uZmlnLFxuICBOR1hfRUNIQVJUU19DT05GSUcsXG4gIFRoZW1lT3B0aW9uLFxufSBmcm9tICcuL25neC1lY2hhcnRzLmRpcmVjdGl2ZSc7XG5cbmNvbnN0IHByb3ZpZGVFY2hhcnRzID0gKGNvbmZpZzogT21pdDxOZ3hFY2hhcnRzQ29uZmlnLCAnZWNoYXJ0cyc+ID0ge30pOiBQcm92aWRlciA9PiB7XG4gIHJldHVybiB7XG4gICAgcHJvdmlkZTogTkdYX0VDSEFSVFNfQ09ORklHLFxuICAgIHVzZUZhY3Rvcnk6ICgpID0+ICh7XG4gICAgICAuLi5jb25maWcsXG4gICAgICBlY2hhcnRzOiAoKSA9PiBpbXBvcnQoJ2VjaGFydHMnKSxcbiAgICB9KSxcbiAgfTtcbn07XG5cbmNvbnN0IHByb3ZpZGVFY2hhcnRzQ29yZSA9IChjb25maWc6IE5neEVjaGFydHNDb25maWcpOiBQcm92aWRlciA9PiB7XG4gIHJldHVybiB7XG4gICAgcHJvdmlkZTogTkdYX0VDSEFSVFNfQ09ORklHLFxuICAgIHVzZVZhbHVlOiBjb25maWcsXG4gIH07XG59O1xuXG5ATmdNb2R1bGUoe1xuICBpbXBvcnRzOiBbTmd4RWNoYXJ0c0RpcmVjdGl2ZV0sXG4gIGV4cG9ydHM6IFtOZ3hFY2hhcnRzRGlyZWN0aXZlXSxcbn0pXG5leHBvcnQgY2xhc3MgTmd4RWNoYXJ0c01vZHVsZSB7XG4gIHN0YXRpYyBmb3JSb290KGNvbmZpZzogTmd4RWNoYXJ0c0NvbmZpZyk6IE1vZHVsZVdpdGhQcm92aWRlcnM8Tmd4RWNoYXJ0c01vZHVsZT4ge1xuICAgIHJldHVybiB7XG4gICAgICBuZ01vZHVsZTogTmd4RWNoYXJ0c01vZHVsZSxcbiAgICAgIHByb3ZpZGVyczogW3Byb3ZpZGVFY2hhcnRzQ29yZShjb25maWcpXSxcbiAgICB9O1xuICB9XG4gIHN0YXRpYyBmb3JDaGlsZCgpOiBNb2R1bGVXaXRoUHJvdmlkZXJzPE5neEVjaGFydHNNb2R1bGU+IHtcbiAgICByZXR1cm4ge1xuICAgICAgbmdNb2R1bGU6IE5neEVjaGFydHNNb2R1bGUsXG4gICAgfTtcbiAgfVxufVxuXG5leHBvcnQgeyBOZ3hFY2hhcnRzRGlyZWN0aXZlLCBOR1hfRUNIQVJUU19DT05GSUcsIFRoZW1lT3B0aW9uLCBwcm92aWRlRWNoYXJ0cywgcHJvdmlkZUVjaGFydHNDb3JlIH07XG4iXX0=