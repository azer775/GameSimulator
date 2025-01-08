import { Component, OnInit } from '@angular/core';
import * as echarts from 'echarts/core';
import type { ECActionEvent } from 'echarts/types/src/util/types';
import { NgModule } from '@angular/core';
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
import { FormArray, FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgxEchartsDirective, NgxEchartsModule, provideEchartsCore } from 'ngx-echarts';
import { NgIf, NgFor } from '@angular/common';
import { CompanyService } from 'src/app/services/company.service';
import { CandlestickData } from 'src/app/Models/CandlestickData';
import { CompanyDTO } from 'src/app/Models/CompanyDTO';
import { Company } from 'src/app/Models/Company';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { ActivatedRoute } from '@angular/router';
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
  LineChart
]);


@Component({
    selector: 'app-addtest2',
    templateUrl: './addtest2.component.html',
    styleUrl: './addtest2.component.css',
    standalone: true,
    providers: [
      provideEchartsCore({ echarts }),
      CompanyService
    ],
    imports: [ReactiveFormsModule, NgIf, NgFor, NgxEchartsDirective, NgxEchartsModule,
      MatFormFieldModule,
          MatSelectModule,
          FormsModule,
          ReactiveFormsModule,
          MatRadioModule,
          MatButtonModule,
          MatCardModule,
          MatInputModule,
          MatCheckboxModule,
          MatIcon
    ]
})
export class Addtest2Component implements OnInit {
  companyForm: FormGroup;
  Cs!: CandlestickData[];
  gameId: number = 1;
  option!: EChartsOption; 
  show: boolean=false;
  newsForms: { form: FormGroup, position: { top: string, left: string } }[] = [];
   
  constructor(private fb: FormBuilder, private companyService: CompanyService,private route: ActivatedRoute) {
    this.companyForm = this.fb.group({
      name: ['', Validators.required],
      industry: ['', Validators.required],
      initialPrice: [0, [Validators.required, Validators.min(0)]],
      volatility: [0, [Validators.required, Validators.min(0)]],
      drift: [0, [Validators.required, Validators.min(0)]],
      trends: this.fb.array([]) // FormArray for trends
    });
    
  }
  ngOnInit(): void {
    this.gameId = Number(this.route.snapshot.paramMap.get('id'));
  }

   /*calculateMA(dayCount: number, data: (number | string)[][]) {
    var result = [];
    for (var i = 0, len = data.values.length; i < len; i++) {
      if (i < dayCount) {
        result.push('-');
        continue;
      }
      var sum = 0;
      for (var j = 0; j < dayCount; j++) {
        sum += +this.data0.values[i - j][1];
      }
      result.push(sum / dayCount);
    }
    return result;
  }*/
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
  // Transform the CandlestickData array into the format required by splitData
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
  onChartEvent(event: ECElementEvent | ECActionEvent | ECharts, type: string) {
    console.log('chart event:', type, event);
    if ('name' in event && event.name) {
     const date  = event.name; 
      console.log('Date:', date);
      const position = {
        top: `${event.event?.offsetY}px` || '0px',
        left: `${event.event?.offsetX}px` || '0px'
      };

      // Create a new form
      const newsForm = this.fb.group({
        date: [date],
        news: [''],
        headline: ['']
      });

      // Add to the list of forms
      this.newsForms.push({ form: newsForm, position });
    }
  }
  submitNews(index: number) {
    const form = this.newsForms[index].form;
    if (form.valid) {
      console.log('Submitted News:', form.value);
      // Perform your submission logic here
      this.newsForms.splice(index, 1); // Remove the form after submission
    }
  }

  removeForm(index: number) {
    this.newsForms.splice(index, 1); // Remove the form without submission
  }
  

  // Add a trend to the form array
  addTrend(trend: string): void {
    this.trends.push(this.fb.control(trend));
  }

  // Remove a trend from the form array
  removeTrend(index: number): void {
    this.trends.removeAt(index);
  }
  get trends(): FormArray {
    return this.companyForm.get('trends') as FormArray;
  }
  onSubmit() {
    if (this.companyForm.valid) {
      const formValues = this.companyForm.value;
      this.companyService.addCompany(this.gameId, formValues, formValues.trends).subscribe({
        next: (candlestickData: CandlestickData[]) => {
          this.Cs = candlestickData;
          console.log('Candlestick Data:', this.Cs);
          const rawData = this.transformCandlestickData(candlestickData);
          console.log('raw Data:', rawData);
          const data1 = this.splitData(rawData);
          this.option = {
            title: {
              text: 'Test',
              left: 0
            },
            tooltip: {
              trigger: 'axis',
              axisPointer: {
                type: 'cross'
              }
            },
            legend: {
              data: ['日K', 'MA5', 'MA10', 'MA20', 'MA30']
            },
            grid: {
              left: '10%',
              right: '10%',
              bottom: '15%'
            },
            xAxis: {
              type: 'category',
              data: data1.categoryData,
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
                data: data1.values,
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
          this.show=true;

        },
        error: (error) => {
          console.error('Error adding company:', error);
        }
      });
    }
  }
  prepareCompanyDTO(): CompanyDTO {
    return {
      name: this.companyForm.value.name,
      industry: this.companyForm.value.industry,
      initialPrice: this.companyForm.value.initialPrice,
      volatility: this.companyForm.value.volatility,
      drift: this.companyForm.value.drift,
      candlestickData: this.Cs/*.map((cs) => ({
        dateTime: cs.dateTime,  // Make sure the dateTime is formatted correctly
        open: cs.open,
        high: cs.high,
        low: cs.low,
        close: cs.close
      }))*/, // Use processed candlestick data
      news: this.newsForms.map((newsForm) => ({
        id: 0,
        headline: newsForm.form.value.headline,
        impact: 0,
        releaseDate: this.formatDate(newsForm.form.value.date) as unknown as Date,
        content: newsForm.form.value.news,
        company: new Company()
      })), // Map news forms to the News structure
    };
  }
  sendData(): void {
    const companyDTO = this.prepareCompanyDTO();
    console.log(companyDTO);
    this.companyService.sendCompanyData( this.gameId,companyDTO).subscribe({
      next: (response) => {
        console.log(companyDTO);
        console.log('Data sent successfully:', response);
        alert('Company data sent successfully!');
      },
      error: (error) => {
        console.error('Error sending data:', error);
        alert('Failed to send company data.');
      }
    });
  }
  private formatDate(date: string | Date): string {
    const dateObj = new Date(date); // Convert the date to a Date object
    return dateObj.toISOString().slice(0, 19); // Extract "yyyy-MM-ddTHH:mm:ss"
  }

}
