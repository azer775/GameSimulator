import { Directive, EventEmitter, Inject, InjectionToken, Input, Output, } from '@angular/core';
import { Observable, ReplaySubject, Subject, asyncScheduler } from 'rxjs';
import { switchMap, throttleTime } from 'rxjs/operators';
import { ChangeFilterV2 } from './change-filter-v2';
import * as i0 from "@angular/core";
export const NGX_ECHARTS_CONFIG = new InjectionToken('NGX_ECHARTS_CONFIG');
export class NgxEchartsDirective {
    constructor(config, el, ngZone) {
        this.el = el;
        this.ngZone = ngZone;
        this.options = null;
        this.theme = null;
        this.initOpts = null;
        this.merge = null;
        this.autoResize = true;
        this.loading = false;
        this.loadingType = 'default';
        this.loadingOpts = null;
        // ngx-echarts events
        this.chartInit = new EventEmitter();
        this.optionsError = new EventEmitter();
        // echarts mouse events
        this.chartClick = this.createLazyEvent('click');
        this.chartDblClick = this.createLazyEvent('dblclick');
        this.chartMouseDown = this.createLazyEvent('mousedown');
        this.chartMouseMove = this.createLazyEvent('mousemove');
        this.chartMouseUp = this.createLazyEvent('mouseup');
        this.chartMouseOver = this.createLazyEvent('mouseover');
        this.chartMouseOut = this.createLazyEvent('mouseout');
        this.chartGlobalOut = this.createLazyEvent('globalout');
        this.chartContextMenu = this.createLazyEvent('contextmenu');
        // echarts events
        this.chartHighlight = this.createLazyEvent('highlight');
        this.chartDownplay = this.createLazyEvent('downplay');
        this.chartSelectChanged = this.createLazyEvent('selectchanged');
        this.chartLegendSelectChanged = this.createLazyEvent('legendselectchanged');
        this.chartLegendSelected = this.createLazyEvent('legendselected');
        this.chartLegendUnselected = this.createLazyEvent('legendunselected');
        this.chartLegendLegendSelectAll = this.createLazyEvent('legendselectall');
        this.chartLegendLegendInverseSelect = this.createLazyEvent('legendinverseselect');
        this.chartLegendScroll = this.createLazyEvent('legendscroll');
        this.chartDataZoom = this.createLazyEvent('datazoom');
        this.chartDataRangeSelected = this.createLazyEvent('datarangeselected');
        this.chartGraphRoam = this.createLazyEvent('graphroam');
        this.chartGeoRoam = this.createLazyEvent('georoam');
        this.chartTreeRoam = this.createLazyEvent('treeroam');
        this.chartTimelineChanged = this.createLazyEvent('timelinechanged');
        this.chartTimelinePlayChanged = this.createLazyEvent('timelineplaychanged');
        this.chartRestore = this.createLazyEvent('restore');
        this.chartDataViewChanged = this.createLazyEvent('dataviewchanged');
        this.chartMagicTypeChanged = this.createLazyEvent('magictypechanged');
        this.chartGeoSelectChanged = this.createLazyEvent('geoselectchanged');
        this.chartGeoSelected = this.createLazyEvent('geoselected');
        this.chartGeoUnselected = this.createLazyEvent('geounselected');
        this.chartAxisAreaSelected = this.createLazyEvent('axisareaselected');
        this.chartBrush = this.createLazyEvent('brush');
        this.chartBrushEnd = this.createLazyEvent('brushend');
        this.chartBrushSelected = this.createLazyEvent('brushselected');
        this.chartGlobalCursorTaken = this.createLazyEvent('globalcursortaken');
        this.chartRendered = this.createLazyEvent('rendered');
        this.chartFinished = this.createLazyEvent('finished');
        this.animationFrameID = null;
        this.chart$ = new ReplaySubject(1);
        this.resize$ = new Subject();
        this.changeFilter = new ChangeFilterV2();
        this.resizeObFired = false;
        this.echarts = config.echarts;
        this.theme = config.theme || null;
    }
    ngOnChanges(changes) {
        this.changeFilter.doFilter(changes);
    }
    ngOnInit() {
        if (!window.ResizeObserver) {
            throw new Error('please install a polyfill for ResizeObserver');
        }
        this.resizeSub = this.resize$
            .pipe(throttleTime(100, asyncScheduler, { leading: false, trailing: true }))
            .subscribe(() => this.resize());
        if (this.autoResize) {
            // https://github.com/xieziyu/ngx-echarts/issues/413
            this.resizeOb = this.ngZone.runOutsideAngular(() => new window.ResizeObserver(entries => {
                for (const entry of entries) {
                    if (entry.target === this.el.nativeElement) {
                        // Ignore first fire on insertion, no resize actually happened
                        if (!this.resizeObFired) {
                            this.resizeObFired = true;
                        }
                        else {
                            this.animationFrameID = window.requestAnimationFrame(() => {
                                this.resize$.next();
                            });
                        }
                    }
                }
            }));
            this.resizeOb.observe(this.el.nativeElement);
        }
        this.changeFilter.notFirstAndEmpty('options', opt => this.onOptionsChange(opt));
        this.changeFilter.notFirstAndEmpty('merge', opt => this.setOption(opt));
        this.changeFilter.has('loading', v => this.toggleLoading(!!v));
        this.changeFilter.notFirst('theme', () => this.refreshChart());
    }
    ngOnDestroy() {
        window.clearTimeout(this.initChartTimer);
        if (this.resizeSub) {
            this.resizeSub.unsubscribe();
        }
        if (this.animationFrameID) {
            window.cancelAnimationFrame(this.animationFrameID);
        }
        if (this.resizeOb) {
            this.resizeOb.unobserve(this.el.nativeElement);
        }
        if (this.loadingSub) {
            this.loadingSub.unsubscribe();
        }
        this.changeFilter.dispose();
        this.dispose();
    }
    ngAfterViewInit() {
        this.initChartTimer = window.setTimeout(() => this.initChart());
    }
    dispose() {
        if (this.chart) {
            if (!this.chart.isDisposed()) {
                this.chart.dispose();
            }
            this.chart = null;
        }
    }
    /**
     * resize chart
     */
    resize() {
        if (this.chart) {
            this.chart.resize();
        }
    }
    toggleLoading(loading) {
        if (this.chart) {
            loading
                ? this.chart.showLoading(this.loadingType, this.loadingOpts)
                : this.chart.hideLoading();
        }
        else {
            this.loadingSub = this.chart$.subscribe(chart => loading ? chart.showLoading(this.loadingType, this.loadingOpts) : chart.hideLoading());
        }
    }
    setOption(option, opts) {
        if (this.chart) {
            try {
                this.chart.setOption(option, opts);
            }
            catch (e) {
                console.error(e);
                this.optionsError.emit(e);
            }
        }
    }
    /**
     * dispose old chart and create a new one.
     */
    async refreshChart() {
        this.dispose();
        await this.initChart();
    }
    createChart() {
        const dom = this.el.nativeElement;
        if (window && window.getComputedStyle) {
            const prop = window.getComputedStyle(dom, null).getPropertyValue('height');
            if ((!prop || prop === '0px') && (!dom.style.height || dom.style.height === '0px')) {
                dom.style.height = '400px';
            }
        }
        // here a bit tricky: we check if the echarts module is provided as function returning native import('...') then use the promise
        // otherwise create the function that imitates behaviour above with a provided as is module
        return this.ngZone.runOutsideAngular(() => {
            const load = typeof this.echarts === 'function' ? this.echarts : () => Promise.resolve(this.echarts);
            return load().then(({ init }) => init(dom, this.theme, this.initOpts));
        });
    }
    async initChart() {
        await this.onOptionsChange(this.options);
        if (this.merge && this.chart) {
            this.setOption(this.merge);
        }
    }
    async onOptionsChange(opt) {
        if (!opt) {
            return;
        }
        if (this.chart) {
            this.setOption(this.options, true);
        }
        else {
            this.chart = await this.createChart();
            this.chart$.next(this.chart);
            this.chartInit.emit(this.chart);
            this.setOption(this.options, true);
        }
    }
    // allows to lazily bind to only those events that are requested through the `@Output` by parent components
    // see https://stackoverflow.com/questions/51787972/optimal-reentering-the-ngzone-from-eventemitter-event for more info
    createLazyEvent(eventName) {
        return this.chartInit.pipe(switchMap((chart) => new Observable(observer => {
            chart.on(eventName, (data) => this.ngZone.run(() => observer.next(data)));
            return () => {
                if (this.chart) {
                    if (!this.chart.isDisposed()) {
                        chart.off(eventName);
                    }
                }
            };
        })));
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.0.1", ngImport: i0, type: NgxEchartsDirective, deps: [{ token: NGX_ECHARTS_CONFIG }, { token: i0.ElementRef }, { token: i0.NgZone }], target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "17.0.1", type: NgxEchartsDirective, isStandalone: true, selector: "echarts, [echarts]", inputs: { options: "options", theme: "theme", initOpts: "initOpts", merge: "merge", autoResize: "autoResize", loading: "loading", loadingType: "loadingType", loadingOpts: "loadingOpts" }, outputs: { chartInit: "chartInit", optionsError: "optionsError", chartClick: "chartClick", chartDblClick: "chartDblClick", chartMouseDown: "chartMouseDown", chartMouseMove: "chartMouseMove", chartMouseUp: "chartMouseUp", chartMouseOver: "chartMouseOver", chartMouseOut: "chartMouseOut", chartGlobalOut: "chartGlobalOut", chartContextMenu: "chartContextMenu", chartHighlight: "chartHighlight", chartDownplay: "chartDownplay", chartSelectChanged: "chartSelectChanged", chartLegendSelectChanged: "chartLegendSelectChanged", chartLegendSelected: "chartLegendSelected", chartLegendUnselected: "chartLegendUnselected", chartLegendLegendSelectAll: "chartLegendLegendSelectAll", chartLegendLegendInverseSelect: "chartLegendLegendInverseSelect", chartLegendScroll: "chartLegendScroll", chartDataZoom: "chartDataZoom", chartDataRangeSelected: "chartDataRangeSelected", chartGraphRoam: "chartGraphRoam", chartGeoRoam: "chartGeoRoam", chartTreeRoam: "chartTreeRoam", chartTimelineChanged: "chartTimelineChanged", chartTimelinePlayChanged: "chartTimelinePlayChanged", chartRestore: "chartRestore", chartDataViewChanged: "chartDataViewChanged", chartMagicTypeChanged: "chartMagicTypeChanged", chartGeoSelectChanged: "chartGeoSelectChanged", chartGeoSelected: "chartGeoSelected", chartGeoUnselected: "chartGeoUnselected", chartAxisAreaSelected: "chartAxisAreaSelected", chartBrush: "chartBrush", chartBrushEnd: "chartBrushEnd", chartBrushSelected: "chartBrushSelected", chartGlobalCursorTaken: "chartGlobalCursorTaken", chartRendered: "chartRendered", chartFinished: "chartFinished" }, exportAs: ["echarts"], usesOnChanges: true, ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.0.1", ngImport: i0, type: NgxEchartsDirective, decorators: [{
            type: Directive,
            args: [{
                    standalone: true,
                    selector: 'echarts, [echarts]',
                    exportAs: 'echarts',
                }]
        }], ctorParameters: () => [{ type: undefined, decorators: [{
                    type: Inject,
                    args: [NGX_ECHARTS_CONFIG]
                }] }, { type: i0.ElementRef }, { type: i0.NgZone }], propDecorators: { options: [{
                type: Input
            }], theme: [{
                type: Input
            }], initOpts: [{
                type: Input
            }], merge: [{
                type: Input
            }], autoResize: [{
                type: Input
            }], loading: [{
                type: Input
            }], loadingType: [{
                type: Input
            }], loadingOpts: [{
                type: Input
            }], chartInit: [{
                type: Output
            }], optionsError: [{
                type: Output
            }], chartClick: [{
                type: Output
            }], chartDblClick: [{
                type: Output
            }], chartMouseDown: [{
                type: Output
            }], chartMouseMove: [{
                type: Output
            }], chartMouseUp: [{
                type: Output
            }], chartMouseOver: [{
                type: Output
            }], chartMouseOut: [{
                type: Output
            }], chartGlobalOut: [{
                type: Output
            }], chartContextMenu: [{
                type: Output
            }], chartHighlight: [{
                type: Output
            }], chartDownplay: [{
                type: Output
            }], chartSelectChanged: [{
                type: Output
            }], chartLegendSelectChanged: [{
                type: Output
            }], chartLegendSelected: [{
                type: Output
            }], chartLegendUnselected: [{
                type: Output
            }], chartLegendLegendSelectAll: [{
                type: Output
            }], chartLegendLegendInverseSelect: [{
                type: Output
            }], chartLegendScroll: [{
                type: Output
            }], chartDataZoom: [{
                type: Output
            }], chartDataRangeSelected: [{
                type: Output
            }], chartGraphRoam: [{
                type: Output
            }], chartGeoRoam: [{
                type: Output
            }], chartTreeRoam: [{
                type: Output
            }], chartTimelineChanged: [{
                type: Output
            }], chartTimelinePlayChanged: [{
                type: Output
            }], chartRestore: [{
                type: Output
            }], chartDataViewChanged: [{
                type: Output
            }], chartMagicTypeChanged: [{
                type: Output
            }], chartGeoSelectChanged: [{
                type: Output
            }], chartGeoSelected: [{
                type: Output
            }], chartGeoUnselected: [{
                type: Output
            }], chartAxisAreaSelected: [{
                type: Output
            }], chartBrush: [{
                type: Output
            }], chartBrushEnd: [{
                type: Output
            }], chartBrushSelected: [{
                type: Output
            }], chartGlobalCursorTaken: [{
                type: Output
            }], chartRendered: [{
                type: Output
            }], chartFinished: [{
                type: Output
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmd4LWVjaGFydHMuZGlyZWN0aXZlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vcHJvamVjdHMvbmd4LWVjaGFydHMvc3JjL2xpYi9uZ3gtZWNoYXJ0cy5kaXJlY3RpdmUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUVMLFNBQVMsRUFFVCxZQUFZLEVBQ1osTUFBTSxFQUNOLGNBQWMsRUFDZCxLQUFLLEVBS0wsTUFBTSxHQUVQLE1BQU0sZUFBZSxDQUFDO0FBQ3ZCLE9BQU8sRUFBRSxVQUFVLEVBQUUsYUFBYSxFQUFFLE9BQU8sRUFBZ0IsY0FBYyxFQUFFLE1BQU0sTUFBTSxDQUFDO0FBQ3hGLE9BQU8sRUFBRSxTQUFTLEVBQUUsWUFBWSxFQUFFLE1BQU0sZ0JBQWdCLENBQUM7QUFDekQsT0FBTyxFQUFFLGNBQWMsRUFBRSxNQUFNLG9CQUFvQixDQUFDOztBQVVwRCxNQUFNLENBQUMsTUFBTSxrQkFBa0IsR0FBRyxJQUFJLGNBQWMsQ0FBbUIsb0JBQW9CLENBQUMsQ0FBQztBQU83RixNQUFNLE9BQU8sbUJBQW1CO0lBMEU5QixZQUM4QixNQUF3QixFQUM1QyxFQUFjLEVBQ2QsTUFBYztRQURkLE9BQUUsR0FBRixFQUFFLENBQVk7UUFDZCxXQUFNLEdBQU4sTUFBTSxDQUFRO1FBNUVmLFlBQU8sR0FBeUIsSUFBSSxDQUFDO1FBQ3JDLFVBQUssR0FBZ0MsSUFBSSxDQUFDO1FBQzFDLGFBQVEsR0FNTixJQUFJLENBQUM7UUFDUCxVQUFLLEdBQXlCLElBQUksQ0FBQztRQUNuQyxlQUFVLEdBQUcsSUFBSSxDQUFDO1FBQ2xCLFlBQU8sR0FBRyxLQUFLLENBQUM7UUFDaEIsZ0JBQVcsR0FBRyxTQUFTLENBQUM7UUFDeEIsZ0JBQVcsR0FBa0IsSUFBSSxDQUFDO1FBRTNDLHFCQUFxQjtRQUNYLGNBQVMsR0FBRyxJQUFJLFlBQVksRUFBTyxDQUFDO1FBQ3BDLGlCQUFZLEdBQUcsSUFBSSxZQUFZLEVBQVMsQ0FB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Ryx3QkFBd0I7c0JBQWpDLE1BQU07Z0JBQ0csbUJBQW1CO3NCQUE1QixNQUFNO2dCQUNHLHFCQUFxQjtzQkFBOUIsTUFBTTtnQkFDRywwQkFBMEI7c0JBQW5DLE1BQU07Z0JBQ0csOEJBQThCO3NCQUF2QyxNQUFNO2dCQUNHLGlCQUFpQjtzQkFBMUIsTUFBTTtnQkFDRyxhQUFhO3NCQUF0QixNQUFNO2dCQUNHLHNCQUFzQjtzQkFBL0IsTUFBTTtnQkFDRyxjQUFjO3NCQUF2QixNQUFNO2dCQUNHLFlBQVk7c0JBQXJCLE1BQU07Z0JBQ0csYUFBYTtzQkFBdEIsTUFBTTtnQkFDRyxvQkFBb0I7c0JBQTdCLE1BQU07Z0JBQ0csd0JBQXdCO3NCQUFqQyxNQUFNO2dCQUNHLFlBQVk7c0JBQXJCLE1BQU07Z0JBQ0csb0JBQW9CO3NCQUE3QixNQUFNO2dCQUNHLHFCQUFxQjtzQkFBOUIsTUFBTTtnQkFDRyxxQkFBcUI7c0JBQTlCLE1BQU07Z0JBQ0csZ0JBQWdCO3NCQUF6QixNQUFNO2dCQUNHLGtCQUFrQjtzQkFBM0IsTUFBTTtnQkFDRyxxQkFBcUI7c0JBQTlCLE1BQU07Z0JBQ0csVUFBVTtzQkFBbkIsTUFBTTtnQkFDRyxhQUFhO3NCQUF0QixNQUFNO2dCQUNHLGtCQUFrQjtzQkFBM0IsTUFBTTtnQkFDRyxzQkFBc0I7c0JBQS9CLE1BQU07Z0JBQ0csYUFBYTtzQkFBdEIsTUFBTTtnQkFDRyxhQUFhO3NCQUF0QixNQUFNIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtcbiAgQWZ0ZXJWaWV3SW5pdCxcbiAgRGlyZWN0aXZlLFxuICBFbGVtZW50UmVmLFxuICBFdmVudEVtaXR0ZXIsXG4gIEluamVjdCxcbiAgSW5qZWN0aW9uVG9rZW4sXG4gIElucHV0LFxuICBOZ1pvbmUsXG4gIE9uQ2hhbmdlcyxcbiAgT25EZXN0cm95LFxuICBPbkluaXQsXG4gIE91dHB1dCxcbiAgU2ltcGxlQ2hhbmdlcyxcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBPYnNlcnZhYmxlLCBSZXBsYXlTdWJqZWN0LCBTdWJqZWN0LCBTdWJzY3JpcHRpb24sIGFzeW5jU2NoZWR1bGVyIH0gZnJvbSAncnhqcyc7XG5pbXBvcnQgeyBzd2l0Y2hNYXAsIHRocm90dGxlVGltZSB9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcbmltcG9ydCB7IENoYW5nZUZpbHRlclYyIH0gZnJvbSAnLi9jaGFuZ2UtZmlsdGVyLXYyJztcbmltcG9ydCB0eXBlIHsgRUNoYXJ0c09wdGlvbiwgRUNoYXJ0cywgRUNFbGVtZW50RXZlbnQgfSBmcm9tICdlY2hhcnRzJztcblxuZXhwb3J0IGludGVyZmFjZSBOZ3hFY2hhcnRzQ29uZmlnIHtcbiAgZWNoYXJ0czogYW55IHwgKCgpID0+IFByb21pc2U8YW55Pik7XG4gIHRoZW1lPzogc3RyaW5nIHwgVGhlbWVPcHRpb247XG59XG5cbmV4cG9ydCB0eXBlIFRoZW1lT3B0aW9uID0gUmVjb3JkPHN0cmluZywgYW55PjtcblxuZXhwb3J0IGNvbnN0IE5HWF9FQ0hBUlRTX0NPTkZJRyA9IG5ldyBJbmplY3Rpb25Ub2tlbjxOZ3hFY2hhcnRzQ29uZmlnPignTkdYX0VDSEFSVFNfQ09ORklHJyk7XG5cbkBEaXJlY3RpdmUoe1xuICBzdGFuZGFsb25lOiB0cnVlLFxuICBzZWxlY3RvcjogJ2VjaGFydHMsIFtlY2hhcnRzXScsXG4gIGV4cG9ydEFzOiAnZWNoYXJ0cycsXG59KVxuZXhwb3J0IGNsYXNzIE5neEVjaGFydHNEaXJlY3RpdmUgaW1wbGVtZW50cyBPbkNoYW5nZXMsIE9uRGVzdHJveSwgT25Jbml0LCBBZnRlclZpZXdJbml0IHtcbiAgQElucHV0KCkgb3B0aW9uczogRUNoYXJ0c09wdGlvbiB8IG51bGwgPSBudWxsO1xuICBASW5wdXQoKSB0aGVtZTogc3RyaW5nIHwgVGhlbWVPcHRpb24gfCBudWxsID0gbnVsbDtcbiAgQElucHV0KCkgaW5pdE9wdHM6IHtcbiAgICBkZXZpY2VQaXhlbFJhdGlvPzogbnVtYmVyO1xuICAgIHJlbmRlcmVyPzogc3RyaW5nO1xuICAgIHdpZHRoPzogbnVtYmVyIHwgc3RyaW5nO1xuICAgIGhlaWdodD86IG51bWJlciB8IHN0cmluZztcbiAgICBsb2NhbGU/OiBzdHJpbmc7XG4gIH0gfCBudWxsID0gbnVsbDtcbiAgQElucHV0KCkgbWVyZ2U6IEVDaGFydHNPcHRpb24gfCBudWxsID0gbnVsbDtcbiAgQElucHV0KCkgYXV0b1Jlc2l6ZSA9IHRydWU7XG4gIEBJbnB1dCgpIGxvYWRpbmcgPSBmYWxzZTtcbiAgQElucHV0KCkgbG9hZGluZ1R5cGUgPSAnZGVmYXVsdCc7XG4gIEBJbnB1dCgpIGxvYWRpbmdPcHRzOiBvYmplY3QgfCBudWxsID0gbnVsbDtcblxuICAvLyBuZ3gtZWNoYXJ0cyBldmVudHNcbiAgQE91dHB1dCgpIGNoYXJ0SW5pdCA9IG5ldyBFdmVudEVtaXR0ZXI8YW55PigpO1xuICBAT3V0cHV0KCkgb3B0aW9uc0Vycm9yID0gbmV3IEV2ZW50RW1pdHRlcjxFcnJvcj4oKTtcblxuICAvLyBlY2hhcnRzIG1vdXNlIGV2ZW50c1xuICBAT3V0cHV0KCkgY2hhcnRDbGljayA9IHRoaXMuY3JlYXRlTGF6eUV2ZW50PEVDRWxlbWVudEV2ZW50PignY2xpY2snKTtcbiAgQE91dHB1dCgpIGNoYXJ0RGJsQ2xpY2sgPSB0aGlzLmNyZWF0ZUxhenlFdmVudDxFQ0VsZW1lbnRFdmVudD4oJ2RibGNsaWNrJyk7XG4gIEBPdXRwdXQoKSBjaGFydE1vdXNlRG93biA9IHRoaXMuY3JlYXRlTGF6eUV2ZW50PEVDRWxlbWVudEV2ZW50PignbW91c2Vkb3duJyk7XG4gIEBPdXRwdXQoKSBjaGFydE1vdXNlTW92ZSA9IHRoaXMuY3JlYXRlTGF6eUV2ZW50PEVDRWxlbWVudEV2ZW50PignbW91c2Vtb3ZlJyk7XG4gIEBPdXRwdXQoKSBjaGFydE1vdXNlVXAgPSB0aGlzLmNyZWF0ZUxhenlFdmVudDxFQ0VsZW1lbnRFdmVudD4oJ21vdXNldXAnKTtcbiAgQE91dHB1dCgpIGNoYXJ0TW91c2VPdmVyID0gdGhpcy5jcmVhdGVMYXp5RXZlbnQ8RUNFbGVtZW50RXZlbnQ+KCdtb3VzZW92ZXInKTtcbiAgQE91dHB1dCgpIGNoYXJ0TW91c2VPdXQgPSB0aGlzLmNyZWF0ZUxhenlFdmVudDxFQ0VsZW1lbnRFdmVudD4oJ21vdXNlb3V0Jyk7XG4gIEBPdXRwdXQoKSBjaGFydEdsb2JhbE91dCA9IHRoaXMuY3JlYXRlTGF6eUV2ZW50PEVDRWxlbWVudEV2ZW50PignZ2xvYmFsb3V0Jyk7XG4gIEBPdXRwdXQoKSBjaGFydENvbnRleHRNZW51ID0gdGhpcy5jcmVhdGVMYXp5RXZlbnQ8RUNFbGVtZW50RXZlbnQ+KCdjb250ZXh0bWVudScpO1xuXG4gIC8vIGVjaGFydHMgZXZlbnRzXG4gIEBPdXRwdXQoKSBjaGFydEhpZ2hsaWdodCA9IHRoaXMuY3JlYXRlTGF6eUV2ZW50PGFueT4oJ2hpZ2hsaWdodCcpO1xuICBAT3V0cHV0KCkgY2hhcnREb3ducGxheSA9IHRoaXMuY3JlYXRlTGF6eUV2ZW50PGFueT4oJ2Rvd25wbGF5Jyk7XG4gIEBPdXRwdXQoKSBjaGFydFNlbGVjdENoYW5nZWQgPSB0aGlzLmNyZWF0ZUxhenlFdmVudDxhbnk+KCdzZWxlY3RjaGFuZ2VkJyk7XG4gIEBPdXRwdXQoKSBjaGFydExlZ2VuZFNlbGVjdENoYW5nZWQgPSB0aGlzLmNyZWF0ZUxhenlFdmVudDxhbnk+KCdsZWdlbmRzZWxlY3RjaGFuZ2VkJyk7XG4gIEBPdXRwdXQoKSBjaGFydExlZ2VuZFNlbGVjdGVkID0gdGhpcy5jcmVhdGVMYXp5RXZlbnQ8YW55PignbGVnZW5kc2VsZWN0ZWQnKTtcbiAgQE91dHB1dCgpIGNoYXJ0TGVnZW5kVW5zZWxlY3RlZCA9IHRoaXMuY3JlYXRlTGF6eUV2ZW50PGFueT4oJ2xlZ2VuZHVuc2VsZWN0ZWQnKTtcbiAgQE91dHB1dCgpIGNoYXJ0TGVnZW5kTGVnZW5kU2VsZWN0QWxsID0gdGhpcy5jcmVhdGVMYXp5RXZlbnQ8YW55PignbGVnZW5kc2VsZWN0YWxsJyk7XG4gIEBPdXRwdXQoKSBjaGFydExlZ2VuZExlZ2VuZEludmVyc2VTZWxlY3QgPSB0aGlzLmNyZWF0ZUxhenlFdmVudDxhbnk+KCdsZWdlbmRpbnZlcnNlc2VsZWN0Jyk7XG4gIEBPdXRwdXQoKSBjaGFydExlZ2VuZFNjcm9sbCA9IHRoaXMuY3JlYXRlTGF6eUV2ZW50PGFueT4oJ2xlZ2VuZHNjcm9sbCcpO1xuICBAT3V0cHV0KCkgY2hhcnREYXRhWm9vbSA9IHRoaXMuY3JlYXRlTGF6eUV2ZW50PGFueT4oJ2RhdGF6b29tJyk7XG4gIEBPdXRwdXQoKSBjaGFydERhdGFSYW5nZVNlbGVjdGVkID0gdGhpcy5jcmVhdGVMYXp5RXZlbnQ8YW55PignZGF0YXJhbmdlc2VsZWN0ZWQnKTtcbiAgQE91dHB1dCgpIGNoYXJ0R3JhcGhSb2FtID0gdGhpcy5jcmVhdGVMYXp5RXZlbnQ8YW55PignZ3JhcGhyb2FtJyk7XG4gIEBPdXRwdXQoKSBjaGFydEdlb1JvYW0gPSB0aGlzLmNyZWF0ZUxhenlFdmVudDxhbnk+KCdnZW9yb2FtJyk7XG4gIEBPdXRwdXQoKSBjaGFydFRyZWVSb2FtID0gdGhpcy5jcmVhdGVMYXp5RXZlbnQ8YW55PigndHJlZXJvYW0nKTtcbiAgQE91dHB1dCgpIGNoYXJ0VGltZWxpbmVDaGFuZ2VkID0gdGhpcy5jcmVhdGVMYXp5RXZlbnQ8YW55PigndGltZWxpbmVjaGFuZ2VkJyk7XG4gIEBPdXRwdXQoKSBjaGFydFRpbWVsaW5lUGxheUNoYW5nZWQgPSB0aGlzLmNyZWF0ZUxhenlFdmVudDxhbnk+KCd0aW1lbGluZXBsYXljaGFuZ2VkJyk7XG4gIEBPdXRwdXQoKSBjaGFydFJlc3RvcmUgPSB0aGlzLmNyZWF0ZUxhenlFdmVudDxhbnk+KCdyZXN0b3JlJyk7XG4gIEBPdXRwdXQoKSBjaGFydERhdGFWaWV3Q2hhbmdlZCA9IHRoaXMuY3JlYXRlTGF6eUV2ZW50PGFueT4oJ2RhdGF2aWV3Y2hhbmdlZCcpO1xuICBAT3V0cHV0KCkgY2hhcnRNYWdpY1R5cGVDaGFuZ2VkID0gdGhpcy5jcmVhdGVMYXp5RXZlbnQ8YW55PignbWFnaWN0eXBlY2hhbmdlZCcpO1xuICBAT3V0cHV0KCkgY2hhcnRHZW9TZWxlY3RDaGFuZ2VkID0gdGhpcy5jcmVhdGVMYXp5RXZlbnQ8YW55PignZ2Vvc2VsZWN0Y2hhbmdlZCcpO1xuICBAT3V0cHV0KCkgY2hhcnRHZW9TZWxlY3RlZCA9IHRoaXMuY3JlYXRlTGF6eUV2ZW50PGFueT4oJ2dlb3NlbGVjdGVkJyk7XG4gIEBPdXRwdXQoKSBjaGFydEdlb1Vuc2VsZWN0ZWQgPSB0aGlzLmNyZWF0ZUxhenlFdmVudDxhbnk+KCdnZW91bnNlbGVjdGVkJyk7XG4gIEBPdXRwdXQoKSBjaGFydEF4aXNBcmVhU2VsZWN0ZWQgPSB0aGlzLmNyZWF0ZUxhenlFdmVudDxhbnk+KCdheGlzYXJlYXNlbGVjdGVkJyk7XG4gIEBPdXRwdXQoKSBjaGFydEJydXNoID0gdGhpcy5jcmVhdGVMYXp5RXZlbnQ8YW55PignYnJ1c2gnKTtcbiAgQE91dHB1dCgpIGNoYXJ0QnJ1c2hFbmQgPSB0aGlzLmNyZWF0ZUxhenlFdmVudDxhbnk+KCdicnVzaGVuZCcpO1xuICBAT3V0cHV0KCkgY2hhcnRCcnVzaFNlbGVjdGVkID0gdGhpcy5jcmVhdGVMYXp5RXZlbnQ8YW55PignYnJ1c2hzZWxlY3RlZCcpO1xuICBAT3V0cHV0KCkgY2hhcnRHbG9iYWxDdXJzb3JUYWtlbiA9IHRoaXMuY3JlYXRlTGF6eUV2ZW50PGFueT4oJ2dsb2JhbGN1cnNvcnRha2VuJyk7XG4gIEBPdXRwdXQoKSBjaGFydFJlbmRlcmVkID0gdGhpcy5jcmVhdGVMYXp5RXZlbnQ8YW55PigncmVuZGVyZWQnKTtcbiAgQE91dHB1dCgpIGNoYXJ0RmluaXNoZWQgPSB0aGlzLmNyZWF0ZUxhenlFdmVudDxhbnk+KCdmaW5pc2hlZCcpO1xuXG4gIHB1YmxpYyBhbmltYXRpb25GcmFtZUlEID0gbnVsbDtcbiAgcHJpdmF0ZSBjaGFydDogRUNoYXJ0cztcbiAgcHJpdmF0ZSBjaGFydCQgPSBuZXcgUmVwbGF5U3ViamVjdDxFQ2hhcnRzPigxKTtcbiAgcHJpdmF0ZSBlY2hhcnRzOiBhbnk7XG4gIHByaXZhdGUgcmVzaXplT2I6IFJlc2l6ZU9ic2VydmVyO1xuICBwcml2YXRlIHJlc2l6ZSQgPSBuZXcgU3ViamVjdDx2b2lkPigpO1xuICBwcml2YXRlIHJlc2l6ZVN1YjogU3Vic2NyaXB0aW9uO1xuICBwcml2YXRlIGluaXRDaGFydFRpbWVyPzogbnVtYmVyO1xuICBwcml2YXRlIGNoYW5nZUZpbHRlciA9IG5ldyBDaGFuZ2VGaWx0ZXJWMigpO1xuICBwcml2YXRlIGxvYWRpbmdTdWI6IFN1YnNjcmlwdGlvbjtcbiAgcHJpdmF0ZSByZXNpemVPYkZpcmVkOiBib29sZWFuID0gZmFsc2U7XG5cbiAgY29uc3RydWN0b3IoXG4gICAgQEluamVjdChOR1hfRUNIQVJUU19DT05GSUcpIGNvbmZpZzogTmd4RWNoYXJ0c0NvbmZpZyxcbiAgICBwcml2YXRlIGVsOiBFbGVtZW50UmVmLFxuICAgIHByaXZhdGUgbmdab25lOiBOZ1pvbmVcbiAgKSB7XG4gICAgdGhpcy5lY2hhcnRzID0gY29uZmlnLmVjaGFydHM7XG4gICAgdGhpcy50aGVtZSA9IGNvbmZpZy50aGVtZSB8fCBudWxsO1xuICB9XG5cbiAgbmdPbkNoYW5nZXMoY2hhbmdlczogU2ltcGxlQ2hhbmdlcykge1xuICAgIHRoaXMuY2hhbmdlRmlsdGVyLmRvRmlsdGVyKGNoYW5nZXMpO1xuICB9XG5cbiAgbmdPbkluaXQoKSB7XG4gICAgaWYgKCF3aW5kb3cuUmVzaXplT2JzZXJ2ZXIpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcigncGxlYXNlIGluc3RhbGwgYSBwb2x5ZmlsbCBmb3IgUmVzaXplT2JzZXJ2ZXInKTtcbiAgICB9XG4gICAgdGhpcy5yZXNpemVTdWIgPSB0aGlzLnJlc2l6ZSRcbiAgICAgIC5waXBlKHRocm90dGxlVGltZSgxMDAsIGFzeW5jU2NoZWR1bGVyLCB7IGxlYWRpbmc6IGZhbHNlLCB0cmFpbGluZzogdHJ1ZSB9KSlcbiAgICAgIC5zdWJzY3JpYmUoKCkgPT4gdGhpcy5yZXNpemUoKSk7XG5cbiAgICBpZiAodGhpcy5hdXRvUmVzaXplKSB7XG4gICAgICAvLyBodHRwczovL2dpdGh1Yi5jb20veGlleml5dS9uZ3gtZWNoYXJ0cy9pc3N1ZXMvNDEzXG4gICAgICB0aGlzLnJlc2l6ZU9iID0gdGhpcy5uZ1pvbmUucnVuT3V0c2lkZUFuZ3VsYXIoXG4gICAgICAgICgpID0+XG4gICAgICAgICAgbmV3IHdpbmRvdy5SZXNpemVPYnNlcnZlcihlbnRyaWVzID0+IHtcbiAgICAgICAgICAgIGZvciAoY29uc3QgZW50cnkgb2YgZW50cmllcykge1xuICAgICAgICAgICAgICBpZiAoZW50cnkudGFyZ2V0ID09PSB0aGlzLmVsLm5hdGl2ZUVsZW1lbnQpIHtcbiAgICAgICAgICAgICAgICAvLyBJZ25vcmUgZmlyc3QgZmlyZSBvbiBpbnNlcnRpb24sIG5vIHJlc2l6ZSBhY3R1YWxseSBoYXBwZW5lZFxuICAgICAgICAgICAgICAgIGlmICghdGhpcy5yZXNpemVPYkZpcmVkKSB7XG4gICAgICAgICAgICAgICAgICB0aGlzLnJlc2l6ZU9iRmlyZWQgPSB0cnVlO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICB0aGlzLmFuaW1hdGlvbkZyYW1lSUQgPSB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKCgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5yZXNpemUkLm5leHQoKTtcbiAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pXG4gICAgICApO1xuICAgICAgdGhpcy5yZXNpemVPYi5vYnNlcnZlKHRoaXMuZWwubmF0aXZlRWxlbWVudCk7XG4gICAgfVxuXG4gICAgdGhpcy5jaGFuZ2VGaWx0ZXIubm90Rmlyc3RBbmRFbXB0eSgnb3B0aW9ucycsIG9wdCA9PiB0aGlzLm9uT3B0aW9uc0NoYW5nZShvcHQpKTtcbiAgICB0aGlzLmNoYW5nZUZpbHRlci5ub3RGaXJzdEFuZEVtcHR5KCdtZXJnZScsIG9wdCA9PiB0aGlzLnNldE9wdGlvbihvcHQpKTtcbiAgICB0aGlzLmNoYW5nZUZpbHRlci5oYXM8Ym9vbGVhbj4oJ2xvYWRpbmcnLCB2ID0+IHRoaXMudG9nZ2xlTG9hZGluZyghIXYpKTtcbiAgICB0aGlzLmNoYW5nZUZpbHRlci5ub3RGaXJzdDxzdHJpbmcgfCBUaGVtZU9wdGlvbj4oJ3RoZW1lJywgKCkgPT4gdGhpcy5yZWZyZXNoQ2hhcnQoKSk7XG4gIH1cblxuICBuZ09uRGVzdHJveSgpIHtcbiAgICB3aW5kb3cuY2xlYXJUaW1lb3V0KHRoaXMuaW5pdENoYXJ0VGltZXIpO1xuICAgIGlmICh0aGlzLnJlc2l6ZVN1Yikge1xuICAgICAgdGhpcy5yZXNpemVTdWIudW5zdWJzY3JpYmUoKTtcbiAgICB9XG4gICAgaWYgKHRoaXMuYW5pbWF0aW9uRnJhbWVJRCkge1xuICAgICAgd2luZG93LmNhbmNlbEFuaW1hdGlvbkZyYW1lKHRoaXMuYW5pbWF0aW9uRnJhbWVJRCk7XG4gICAgfVxuICAgIGlmICh0aGlzLnJlc2l6ZU9iKSB7XG4gICAgICB0aGlzLnJlc2l6ZU9iLnVub2JzZXJ2ZSh0aGlzLmVsLm5hdGl2ZUVsZW1lbnQpO1xuICAgIH1cbiAgICBpZiAodGhpcy5sb2FkaW5nU3ViKSB7XG4gICAgICB0aGlzLmxvYWRpbmdTdWIudW5zdWJzY3JpYmUoKTtcbiAgICB9XG4gICAgdGhpcy5jaGFuZ2VGaWx0ZXIuZGlzcG9zZSgpO1xuICAgIHRoaXMuZGlzcG9zZSgpO1xuICB9XG5cbiAgbmdBZnRlclZpZXdJbml0KCkge1xuICAgIHRoaXMuaW5pdENoYXJ0VGltZXIgPSB3aW5kb3cuc2V0VGltZW91dCgoKSA9PiB0aGlzLmluaXRDaGFydCgpKTtcbiAgfVxuXG4gIHByaXZhdGUgZGlzcG9zZSgpIHtcbiAgICBpZiAodGhpcy5jaGFydCkge1xuICAgICAgaWYgKCF0aGlzLmNoYXJ0LmlzRGlzcG9zZWQoKSkge1xuICAgICAgICB0aGlzLmNoYXJ0LmRpc3Bvc2UoKTtcbiAgICAgIH1cbiAgICAgIHRoaXMuY2hhcnQgPSBudWxsO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiByZXNpemUgY2hhcnRcbiAgICovXG4gIHJlc2l6ZSgpIHtcbiAgICBpZiAodGhpcy5jaGFydCkge1xuICAgICAgdGhpcy5jaGFydC5yZXNpemUoKTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIHRvZ2dsZUxvYWRpbmcobG9hZGluZzogYm9vbGVhbikge1xuICAgIGlmICh0aGlzLmNoYXJ0KSB7XG4gICAgICBsb2FkaW5nXG4gICAgICAgID8gdGhpcy5jaGFydC5zaG93TG9hZGluZyh0aGlzLmxvYWRpbmdUeXBlLCB0aGlzLmxvYWRpbmdPcHRzKVxuICAgICAgICA6IHRoaXMuY2hhcnQuaGlkZUxvYWRpbmcoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5sb2FkaW5nU3ViID0gdGhpcy5jaGFydCQuc3Vic2NyaWJlKGNoYXJ0ID0+XG4gICAgICAgIGxvYWRpbmcgPyBjaGFydC5zaG93TG9hZGluZyh0aGlzLmxvYWRpbmdUeXBlLCB0aGlzLmxvYWRpbmdPcHRzKSA6IGNoYXJ0LmhpZGVMb2FkaW5nKClcbiAgICAgICk7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBzZXRPcHRpb24ob3B0aW9uOiBhbnksIG9wdHM/OiBhbnkpIHtcbiAgICBpZiAodGhpcy5jaGFydCkge1xuICAgICAgdHJ5IHtcbiAgICAgICAgdGhpcy5jaGFydC5zZXRPcHRpb24ob3B0aW9uLCBvcHRzKTtcbiAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgY29uc29sZS5lcnJvcihlKTtcbiAgICAgICAgdGhpcy5vcHRpb25zRXJyb3IuZW1pdChlKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogZGlzcG9zZSBvbGQgY2hhcnQgYW5kIGNyZWF0ZSBhIG5ldyBvbmUuXG4gICAqL1xuICBhc3luYyByZWZyZXNoQ2hhcnQoKSB7XG4gICAgdGhpcy5kaXNwb3NlKCk7XG4gICAgYXdhaXQgdGhpcy5pbml0Q2hhcnQoKTtcbiAgfVxuXG4gIHByaXZhdGUgY3JlYXRlQ2hhcnQoKSB7XG4gICAgY29uc3QgZG9tID0gdGhpcy5lbC5uYXRpdmVFbGVtZW50O1xuXG4gICAgaWYgKHdpbmRvdyAmJiB3aW5kb3cuZ2V0Q29tcHV0ZWRTdHlsZSkge1xuICAgICAgY29uc3QgcHJvcCA9IHdpbmRvdy5nZXRDb21wdXRlZFN0eWxlKGRvbSwgbnVsbCkuZ2V0UHJvcGVydHlWYWx1ZSgnaGVpZ2h0Jyk7XG4gICAgICBpZiAoKCFwcm9wIHx8IHByb3AgPT09ICcwcHgnKSAmJiAoIWRvbS5zdHlsZS5oZWlnaHQgfHwgZG9tLnN0eWxlLmhlaWdodCA9PT0gJzBweCcpKSB7XG4gICAgICAgIGRvbS5zdHlsZS5oZWlnaHQgPSAnNDAwcHgnO1xuICAgICAgfVxuICAgIH1cblxuICAgIC8vIGhlcmUgYSBiaXQgdHJpY2t5OiB3ZSBjaGVjayBpZiB0aGUgZWNoYXJ0cyBtb2R1bGUgaXMgcHJvdmlkZWQgYXMgZnVuY3Rpb24gcmV0dXJuaW5nIG5hdGl2ZSBpbXBvcnQoJy4uLicpIHRoZW4gdXNlIHRoZSBwcm9taXNlXG4gICAgLy8gb3RoZXJ3aXNlIGNyZWF0ZSB0aGUgZnVuY3Rpb24gdGhhdCBpbWl0YXRlcyBiZWhhdmlvdXIgYWJvdmUgd2l0aCBhIHByb3ZpZGVkIGFzIGlzIG1vZHVsZVxuICAgIHJldHVybiB0aGlzLm5nWm9uZS5ydW5PdXRzaWRlQW5ndWxhcigoKSA9PiB7XG4gICAgICBjb25zdCBsb2FkID1cbiAgICAgICAgdHlwZW9mIHRoaXMuZWNoYXJ0cyA9PT0gJ2Z1bmN0aW9uJyA/IHRoaXMuZWNoYXJ0cyA6ICgpID0+IFByb21pc2UucmVzb2x2ZSh0aGlzLmVjaGFydHMpO1xuXG4gICAgICByZXR1cm4gbG9hZCgpLnRoZW4oKHsgaW5pdCB9KSA9PiBpbml0KGRvbSwgdGhpcy50aGVtZSwgdGhpcy5pbml0T3B0cykpO1xuICAgIH0pO1xuICB9XG5cbiAgcHJpdmF0ZSBhc3luYyBpbml0Q2hhcnQoKSB7XG4gICAgYXdhaXQgdGhpcy5vbk9wdGlvbnNDaGFuZ2UodGhpcy5vcHRpb25zKTtcblxuICAgIGlmICh0aGlzLm1lcmdlICYmIHRoaXMuY2hhcnQpIHtcbiAgICAgIHRoaXMuc2V0T3B0aW9uKHRoaXMubWVyZ2UpO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgYXN5bmMgb25PcHRpb25zQ2hhbmdlKG9wdDogYW55KSB7XG4gICAgaWYgKCFvcHQpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5jaGFydCkge1xuICAgICAgdGhpcy5zZXRPcHRpb24odGhpcy5vcHRpb25zLCB0cnVlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5jaGFydCA9IGF3YWl0IHRoaXMuY3JlYXRlQ2hhcnQoKTtcbiAgICAgIHRoaXMuY2hhcnQkLm5leHQodGhpcy5jaGFydCk7XG4gICAgICB0aGlzLmNoYXJ0SW5pdC5lbWl0KHRoaXMuY2hhcnQpO1xuICAgICAgdGhpcy5zZXRPcHRpb24odGhpcy5vcHRpb25zLCB0cnVlKTtcbiAgICB9XG4gIH1cblxuICAvLyBhbGxvd3MgdG8gbGF6aWx5IGJpbmQgdG8gb25seSB0aG9zZSBldmVudHMgdGhhdCBhcmUgcmVxdWVzdGVkIHRocm91Z2ggdGhlIGBAT3V0cHV0YCBieSBwYXJlbnQgY29tcG9uZW50c1xuICAvLyBzZWUgaHR0cHM6Ly9zdGFja292ZXJmbG93LmNvbS9xdWVzdGlvbnMvNTE3ODc5NzIvb3B0aW1hbC1yZWVudGVyaW5nLXRoZS1uZ3pvbmUtZnJvbS1ldmVudGVtaXR0ZXItZXZlbnQgZm9yIG1vcmUgaW5mb1xuICBwcml2YXRlIGNyZWF0ZUxhenlFdmVudDxUPihldmVudE5hbWU6IHN0cmluZyk6IEV2ZW50RW1pdHRlcjxUPiB7XG4gICAgcmV0dXJuIHRoaXMuY2hhcnRJbml0LnBpcGUoXG4gICAgICBzd2l0Y2hNYXAoXG4gICAgICAgIChjaGFydDogYW55KSA9PlxuICAgICAgICAgIG5ldyBPYnNlcnZhYmxlKG9ic2VydmVyID0+IHtcbiAgICAgICAgICAgIGNoYXJ0Lm9uKGV2ZW50TmFtZSwgKGRhdGE6IFQpID0+IHRoaXMubmdab25lLnJ1bigoKSA9PiBvYnNlcnZlci5uZXh0KGRhdGEpKSk7XG4gICAgICAgICAgICByZXR1cm4gKCkgPT4ge1xuICAgICAgICAgICAgICBpZiAodGhpcy5jaGFydCkge1xuICAgICAgICAgICAgICAgIGlmICghdGhpcy5jaGFydC5pc0Rpc3Bvc2VkKCkpIHtcbiAgICAgICAgICAgICAgICAgIGNoYXJ0Lm9mZihldmVudE5hbWUpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfTtcbiAgICAgICAgICB9KVxuICAgICAgKVxuICAgICkgYXMgRXZlbnRFbWl0dGVyPFQ+O1xuICB9XG59XG4iXX0=