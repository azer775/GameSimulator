import { Component, OnInit } from '@angular/core';

import * as echarts from 'echarts/core';
import type { ECActionEvent } from 'echarts/types/src/util/types';
import * as echart from 'echarts';
import {
  DatasetComponent,
  DatasetComponentOption,
  TitleComponent,
  TitleComponentOption,
  ToolboxComponent,
  ToolboxComponentOption,
  TooltipComponent,
  TooltipComponentOption,
  GridComponent,
  GridComponentOption,
  VisualMapComponent,
  VisualMapComponentOption,
  DataZoomComponent,
  DataZoomComponentOption,
  LegendComponent 
} from 'echarts/components';
import {
  CandlestickChart,
  CandlestickSeriesOption,
  BarChart,
  BarSeriesOption,
  LineChart
} from 'echarts/charts';
import { CanvasRenderer } from 'echarts/renderers';
import { ECElementEvent, ECharts, EChartsOption } from 'echarts';
import { NgxEchartsDirective, NgxEchartsModule, provideEchartsCore } from 'ngx-echarts';
import { Company } from '../../Models/Company';
import { CandlestickData } from '../../Models/CandlestickData';

import { filter, Subscription } from 'rxjs';
import { CompanyService } from 'src/app/services/company.service';
import { WebsocketService } from 'src/app/services/websocket.service';
import { MatDialog } from '@angular/material/dialog';
import { AddtradeComponent } from '../addtrade/addtrade.component';
import { GameclockComponent } from "../gameclock/gameclock.component";
import { News } from 'src/app/Models/News';
import { CurrencyPipe, DatePipe, NgFor, NgIf, PercentPipe } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { MatCard, MatCardContent, MatCardTitle } from '@angular/material/card';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIcon } from '@angular/material/icon';
echarts.use([
  DatasetComponent,
  TitleComponent,
  ToolboxComponent,
  TooltipComponent,
  GridComponent,
  VisualMapComponent,
  DataZoomComponent,
  CandlestickChart,
  BarChart,
  CanvasRenderer,
  LegendComponent,
  LineChart,
  
]);
@Component({
  selector: 'app-showcomapny',
  templateUrl: './showcomapny.component.html',
  styleUrl: './showcomapny.component.css',
  standalone: true,
  providers: [
      provideEchartsCore({ echarts }),
      CompanyService
    ],
  imports: [NgxEchartsDirective, NgxEchartsModule, GameclockComponent,NgFor,NgIf,MatCard,MatCardTitle,MatExpansionModule,MatCardContent,DatePipe,CurrencyPipe,PercentPipe,MatIcon]
})
export class ShowcomapnyComponent implements OnInit {
onChartLoad(chart: any):void {
  this.chartInstance = chart as echart.ECharts;
  this.chartInstance.showLoading({
          text: 'Loading data...',
          color: '#007BFF',
          textColor: '#333',
          maskColor: 'rgba(255, 255, 255, 0.8)',
        });
}

  id: number = 1;
  option!: EChartsOption; 
  Company!: Company;
  Cs!: CandlestickData[];
  chartInstance!: ECharts;
  latestprice: number = 0;
  date:Date;
  constructor(private companyservice: CompanyService,private webSocketService: WebsocketService,private dialog: MatDialog,private route: ActivatedRoute) { }
  ngOnInit(): void {
    this.id = this.route.snapshot.params['id'];
    this.companyservice.getbyid(this.id).subscribe({
      next: (company: Company) => {
        this.Company = company;
        console.log(this.Company);
      }
    })
    this.companyservice.getcurrentdata(this.id).subscribe({
      next: (candlestickData: CandlestickData[]) => {
        this.Cs = candlestickData;
        console.log('Candlestick Data:', this.Cs);
        const rawData = this.transformCandlestickData(candlestickData);
        console.log('raw Data:', rawData);
        const data1 = this.splitData(rawData);
        /*this.chartInstance.showLoading({
          text: 'Loading data...',
          color: '#007BFF',
          textColor: '#333',
          maskColor: 'rgba(255, 255, 255, 0.8)',
        });*/
        this.option = {
          title: {
            text: this.Company.name,
            left: 0
          },
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'cross'
            }
          },
          legend: {
            data: ['日K', 'MA5']
          },
          grid: {
            left: '10%',
            right: '10%',
            bottom: '15%'
          },
          showLoading:{
            text: 'Loading data...',
            color: '#007BFF',
            textColor: '#333',
            maskColor: 'rgba(255, 255, 255, 0.8)',
            zlevel: 0,
          },
          xAxis: {
            type: 'category',
            data: this.splitData(this.transformCandlestickData(candlestickData)).categoryData,
            boundaryGap: false,
            axisLine: { onZero: false },
            splitLine: { show: false },
            min: 'dataMin',
            max: 'dataMax'
          },
          yAxis: {
            scale: true,
            splitArea: {
              show: true
            }
          },
          dataZoom: [
            {
              type: 'inside',
              start: 50,
              end: 100
            },
            {
              show: true,
              type: 'slider',
              top: '90%',
              start: 50,
              end: 100
            }
          ],
          series: [
            {
              name: '日K',
              type: 'candlestick',
              data: this.splitData(this.transformCandlestickData(candlestickData)).values,
              itemStyle: {
                color: '#00da3c',
                color0: '#ec0000',
                borderColor: '#008F28',
                borderColor0: '#8A0000'
              },
              markPoint: {
                label: {
                  formatter: function (param: any) {
                    return param != null ? Math.round(param.value) + '' : '';
                  }
                },
                data: [
                  {
                    name: 'Mark',
                    coord: ['2021/5/31', 100],
                    value: 2300,
                    itemStyle: {
                      color: 'rgb(41,60,85)'
                    }
                  },
                  {
                    name: 'highest value',
                    type: 'max',
                    valueDim: 'highest'
                  },
                  {
                    name: 'lowest value',
                    type: 'min',
                    valueDim: 'lowest'
                  },
                  {
                    name: 'average value on close',
                    type: 'average',
                    valueDim: 'close'
                  }
                ],
                tooltip: {
                  formatter: function (param: any) {
                    return param.name + '<br>' + (param.data.coord || '');
                  }
                }
              },
              markLine: {
                symbol: ['none', 'none'],
                data: [
                  [
                    {
                      name: 'from lowest to highest',
                      type: 'min',
                      valueDim: 'lowest',
                      symbol: 'circle',
                      symbolSize: 10,
                      label: {
                        show: true
                      },
                      emphasis: {
                        label: {
                          show: false
                        }
                      }
                    },
                    {
                      type: 'max',
                      valueDim: 'highest',
                      symbol: 'circle',
                      symbolSize: 10,
                      label: {
                        show: false
                      },
                      emphasis: {
                        label: {
                          show: false
                        }
                      }
                    }
                  ],
                  {
                    name: 'min line on close',
                    type: 'min',
                    valueDim: 'close'
                  },
                  {
                    name: 'max line on close',
                    type: 'max',
                    valueDim: 'close'
                  }
                ]
              }
            },
            {
              name: 'MA5',
              type: 'line',
              data: this.Cs.map(data=>(data.open+data.close)/2),
              smooth: true,
              lineStyle: {
                opacity: 0.2
              }
            },
            /*{
              name: 'MA10',
              type: 'line',
              data: this.calculateMA(10),
              smooth: true,
              lineStyle: {
                opacity: 0.5
              }
            },*/
            /*{
              name: 'MA20',
              type: 'line',
              data: this.calculateMA(20),
              smooth: true,
              lineStyle: {
                opacity: 0.5
              }
            },*/
            /*{
              name: 'MA30',
              type: 'line',
              data: this.calculateMA(30),
              smooth: true,
              lineStyle: {
                opacity: 0.5
              }
            }*/
          ]
        };
        //this.chartInstance.hideLoading();
        console.log('news',this.Company.news);
        this.latestprice = this.Cs[this.Cs.length - 1].close;
        this.date=this.Cs[this.Cs.length - 1].dateTime;
        console.log(this.latestprice);

      },
      error: (error) => {
        console.error('Error adding company:', error);
      }
    });
   
    this.webSocketService.connect1(this.id).subscribe(data => {
      if(this.Cs[this.Cs.length - 1].dateTime != data[data.length - 1].dateTime) 
      {this.Cs.push(data[data.length - 1]);}
      this.latestprice = this.Cs[this.Cs.length - 1].close;
      this.date=this.Cs[this.Cs.length - 1].dateTime;
      console.log(this.latestprice);
      console.log('Candlestick updates:', this.Cs);
      this.updateChart1();
    });
  }
  onChartInit(chart: any): void {
    this.chartInstance = chart as echart.ECharts;
     // Save the chart instance
  }
  
  
  updateChart1(): void {
    const rawData = this.transformCandlestickData(this.Cs);
    const data1 = this.splitData(rawData);

    this.chartInstance.setOption({
      xAxis: {
        data: data1.categoryData,
      },
      series: [
        {
          name: '日K',
          data: data1.values,
        },
        {
          name: 'MA5',
          data: this.Cs.map(data=>(data.open+data.close)/2),
        },
      ],
    });
  }
  private transformCandlestickData(data: CandlestickData[]): (string | number)[][] {
    return data.map(item => {
      const date = typeof item.dateTime === 'string' ? new Date(item.dateTime) : item.dateTime;
      const formattedDate = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}:${String(date.getSeconds()).padStart(2, '0')}`;
      return [
        formattedDate, // Include date and time in the format YYYY-MM-DD HH:mm:ss
        item.open,
        item.close,
        item.low,
        item.high
      ];
    });
  }
  splitData(rawData: (number | string)[][]) {
    const categoryData = [];
    const values = [];
    for (var i = 0; i < rawData.length; i++) {
      categoryData.push(rawData[i].splice(0, 1)[0]);
      values.push(rawData[i]);
    }
    return {
      categoryData: categoryData,
      values: values
    };
  }
  openPopup(): void {
    this.dialog.open(AddtradeComponent, {
      width: "flex", // Set the width of the dialog
      data: { message: 'Hello from the parent component!' ,
        id: this.id,
        price: this.latestprice
      }, // Pass data if needed
    });
  }
  
}
