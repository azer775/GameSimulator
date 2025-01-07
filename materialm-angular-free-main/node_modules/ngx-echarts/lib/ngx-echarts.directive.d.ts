import { AfterViewInit, ElementRef, EventEmitter, InjectionToken, NgZone, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import type { EChartsOption, ECElementEvent } from 'echarts';
import * as i0 from "@angular/core";
export interface NgxEchartsConfig {
    echarts: any | (() => Promise<any>);
    theme?: string | ThemeOption;
}
export type ThemeOption = Record<string, any>;
export declare const NGX_ECHARTS_CONFIG: InjectionToken<NgxEchartsConfig>;
export declare class NgxEchartsDirective implements OnChanges, OnDestroy, OnInit, AfterViewInit {
    private el;
    private ngZone;
    options: EChartsOption | null;
    theme: string | ThemeOption | null;
    initOpts: {
        devicePixelRatio?: number;
        renderer?: string;
        width?: number | string;
        height?: number | string;
        locale?: string;
    } | null;
    merge: EChartsOption | null;
    autoResize: boolean;
    loading: boolean;
    loadingType: string;
    loadingOpts: object | null;
    chartInit: EventEmitter<any>;
    optionsError: EventEmitter<Error>;
    chartClick: EventEmitter<ECElementEvent>;
    chartDblClick: EventEmitter<ECElementEvent>;
    chartMouseDown: EventEmitter<ECElementEvent>;
    chartMouseMove: EventEmitter<ECElementEvent>;
    chartMouseUp: EventEmitter<ECElementEvent>;
    chartMouseOver: EventEmitter<ECElementEvent>;
    chartMouseOut: EventEmitter<ECElementEvent>;
    chartGlobalOut: EventEmitter<ECElementEvent>;
    chartContextMenu: EventEmitter<ECElementEvent>;
    chartHighlight: EventEmitter<any>;
    chartDownplay: EventEmitter<any>;
    chartSelectChanged: EventEmitter<any>;
    chartLegendSelectChanged: EventEmitter<any>;
    chartLegendSelected: EventEmitter<any>;
    chartLegendUnselected: EventEmitter<any>;
    chartLegendLegendSelectAll: EventEmitter<any>;
    chartLegendLegendInverseSelect: EventEmitter<any>;
    chartLegendScroll: EventEmitter<any>;
    chartDataZoom: EventEmitter<any>;
    chartDataRangeSelected: EventEmitter<any>;
    chartGraphRoam: EventEmitter<any>;
    chartGeoRoam: EventEmitter<any>;
    chartTreeRoam: EventEmitter<any>;
    chartTimelineChanged: EventEmitter<any>;
    chartTimelinePlayChanged: EventEmitter<any>;
    chartRestore: EventEmitter<any>;
    chartDataViewChanged: EventEmitter<any>;
    chartMagicTypeChanged: EventEmitter<any>;
    chartGeoSelectChanged: EventEmitter<any>;
    chartGeoSelected: EventEmitter<any>;
    chartGeoUnselected: EventEmitter<any>;
    chartAxisAreaSelected: EventEmitter<any>;
    chartBrush: EventEmitter<any>;
    chartBrushEnd: EventEmitter<any>;
    chartBrushSelected: EventEmitter<any>;
    chartGlobalCursorTaken: EventEmitter<any>;
    chartRendered: EventEmitter<any>;
    chartFinished: EventEmitter<any>;
    animationFrameID: any;
    private chart;
    private chart$;
    private echarts;
    private resizeOb;
    private resize$;
    private resizeSub;
    private initChartTimer?;
    private changeFilter;
    private loadingSub;
    private resizeObFired;
    constructor(config: NgxEchartsConfig, el: ElementRef, ngZone: NgZone);
    ngOnChanges(changes: SimpleChanges): void;
    ngOnInit(): void;
    ngOnDestroy(): void;
    ngAfterViewInit(): void;
    private dispose;
    /**
     * resize chart
     */
    resize(): void;
    private toggleLoading;
    private setOption;
    /**
     * dispose old chart and create a new one.
     */
    refreshChart(): Promise<void>;
    private createChart;
    private initChart;
    private onOptionsChange;
    private createLazyEvent;
    static ɵfac: i0.ɵɵFactoryDeclaration<NgxEchartsDirective, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<NgxEchartsDirective, "echarts, [echarts]", ["echarts"], { "options": { "alias": "options"; "required": false; }; "theme": { "alias": "theme"; "required": false; }; "initOpts": { "alias": "initOpts"; "required": false; }; "merge": { "alias": "merge"; "required": false; }; "autoResize": { "alias": "autoResize"; "required": false; }; "loading": { "alias": "loading"; "required": false; }; "loadingType": { "alias": "loadingType"; "required": false; }; "loadingOpts": { "alias": "loadingOpts"; "required": false; }; }, { "chartInit": "chartInit"; "optionsError": "optionsError"; "chartClick": "chartClick"; "chartDblClick": "chartDblClick"; "chartMouseDown": "chartMouseDown"; "chartMouseMove": "chartMouseMove"; "chartMouseUp": "chartMouseUp"; "chartMouseOver": "chartMouseOver"; "chartMouseOut": "chartMouseOut"; "chartGlobalOut": "chartGlobalOut"; "chartContextMenu": "chartContextMenu"; "chartHighlight": "chartHighlight"; "chartDownplay": "chartDownplay"; "chartSelectChanged": "chartSelectChanged"; "chartLegendSelectChanged": "chartLegendSelectChanged"; "chartLegendSelected": "chartLegendSelected"; "chartLegendUnselected": "chartLegendUnselected"; "chartLegendLegendSelectAll": "chartLegendLegendSelectAll"; "chartLegendLegendInverseSelect": "chartLegendLegendInverseSelect"; "chartLegendScroll": "chartLegendScroll"; "chartDataZoom": "chartDataZoom"; "chartDataRangeSelected": "chartDataRangeSelected"; "chartGraphRoam": "chartGraphRoam"; "chartGeoRoam": "chartGeoRoam"; "chartTreeRoam": "chartTreeRoam"; "chartTimelineChanged": "chartTimelineChanged"; "chartTimelinePlayChanged": "chartTimelinePlayChanged"; "chartRestore": "chartRestore"; "chartDataViewChanged": "chartDataViewChanged"; "chartMagicTypeChanged": "chartMagicTypeChanged"; "chartGeoSelectChanged": "chartGeoSelectChanged"; "chartGeoSelected": "chartGeoSelected"; "chartGeoUnselected": "chartGeoUnselected"; "chartAxisAreaSelected": "chartAxisAreaSelected"; "chartBrush": "chartBrush"; "chartBrushEnd": "chartBrushEnd"; "chartBrushSelected": "chartBrushSelected"; "chartGlobalCursorTaken": "chartGlobalCursorTaken"; "chartRendered": "chartRendered"; "chartFinished": "chartFinished"; }, never, never, true, never>;
}
