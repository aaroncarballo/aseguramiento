import {
    Component,
    OnInit, ViewChild,
    OnDestroy,
    ViewEncapsulation,
    AfterViewInit,
    OnChanges,
    SimpleChanges,
  } from '@angular/core';
  
  import { Chart, Highcharts } from 'angular-highcharts';
  import { ActivatedRoute } from '@angular/router';
  import { Location } from '@angular/common';
  
  import { GraphicsService } from './graphics-view.service';
  import { DataTableDirective } from 'angular-datatables';
  import { Subject, Observable } from 'rxjs';
  
  import { VariableByCensus } from '../main-classes/VariableByCensus';
  import {
    DATATABLE_OPTIONS,
    CHART_OPTIONS,
    VARIABLE_GRAPHIC_OPTION,
    Patterns
  } from './graphics-view.constants';
  
  @Component({
    selector: 'app-nationalStatistics-graphicsView',
    templateUrl: './graphics-view.component.html',
    styleUrls: ['./graphics-view.component.scss'],
    providers: [GraphicsService],
    encapsulation: ViewEncapsulation.None
  })
  
  class GraphicsViewComponent implements OnInit, OnDestroy, OnInit, OnChanges, AfterViewInit {
    //+++++++++++++++++++++++++++++++++++++++++++++++++++++++++
    //                    Variables 
    //+++++++++++++++++++++++++++++++++++++++++++++++++++++++++
    @ViewChild(DataTableDirective) dtElement: DataTableDirective;
    public displayDefaultBlockView: boolean;
    public displayGraphic: boolean;
    public displayTable: boolean;
    public variableByCensusArray: VariableByCensus[];
    public inquestType: number;
    idCensus: number;
  
    //DataTable options
    dtOptions: DataTables.Settings = DATATABLE_OPTIONS.dtOptions;
    dtTrigger: Subject<any> = new Subject();
  
    // Chart options
    chart: Chart = new Chart();
    dataColumn = [];
    descriptionChart: string;
    backgroundStyle = CHART_OPTIONS.initialOptions.backgroundStyle;
    titleStyle = CHART_OPTIONS.initialOptions.titleStyle;
    subtitleStyle = CHART_OPTIONS.initialOptions.subtitleStyle;
    itemStyle = CHART_OPTIONS.initialOptions.itemStyle;
    itemOver = CHART_OPTIONS.initialOptions.itemOver;
    tooltipStyle = CHART_OPTIONS.initialOptions.tooltipStyle;
    pointStyle = CHART_OPTIONS.initialOptions.pointStyle;
    yAxis = CHART_OPTIONS.initialOptions.yAxis;
    xAxis = CHART_OPTIONS.initialOptions.xAxis;
    selectedOptionContrast: boolean;
    selectedOptionPattern: boolean;
    selectedVariable: any = {};
    typeSelected: string;
    highContrast: string;
    patthern: string;
    Patterns: Patterns;
  
    //+++++++++++++++++++++++++++++++++++++++++++++++++++++++++
    //              Crossing Variables
    //+++++++++++++++++++++++++++++++++++++++++++++++++++++++++
    public variableByCensusToCross: VariableByCensus[] = [];
    public variableByCrossingTwo: VariableByCensus[] = [];
    public variableByCrossingThree: VariableByCensus[] = [];
    public displayDefaultBlockViewCross: boolean;
    public loadCross: boolean;
    public variablesInfo: any = {
      variableOne: [],
      variableTwo: [],
      variableThree: []
    }
  
    constructor(
      private route: ActivatedRoute,
      private graphicsService: GraphicsService,
      private location: Location
    ) {
      this.displayDefaultBlockView = false;
      this.displayDefaultBlockViewCross = false;
      this.displayGraphic = true;
      this.displayTable = true;
      this.loadCross = true;
      this.selectedVariable.title = '';
      this.highContrast = "desactivado";
      this.patthern = 'desactivado';
      this.selectedOptionContrast = true;
      this.selectedOptionPattern = true;
      this.Patterns = new Patterns('custom-pattern');
      Highcharts.setOptions(<any>{
        lang: CHART_OPTIONS.langOptions
      });
    }
  
    public ngOnInit() {
      this.inquestType = +this.route.snapshot.paramMap.get('type');
      this.chargeVariableByCensus();
      this.idCensus = this.getUrlId(); // Set the idCensus
    }
  
    ngOnChanges(changes: SimpleChanges) {
      if (this.variableByCensusArray !== undefined) {
        this.initialize(this.variableByCensusArray);
  
      } else {
        this.variableByCensusArray = [];
        this.initialize(this.variableByCensusArray);
      }
    }
  
    ngOnDestroy(): void {
      // Do not forget to unsubscribe the event
      this.dtTrigger.unsubscribe();
    }
  
    ngAfterViewInit(): void {
      this.dtTrigger.next();
    }
  
  
    initialize(dataTable) {
      this.dtOptions = DATATABLE_OPTIONS.dtOptions;
      let tempData = Observable.of(dataTable);
      tempData.subscribe((data) => {
        if (this.dtElement) {
          this.rerender(data);
        }
        else {
          this.variableByCensusArray = data;
          this.dtTrigger.next();
        }
      });
    }
  
    rerender(data): void {
      this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
        dtInstance.destroy();
        this.variableByCensusArray = data;
        this.dtTrigger.next();
      });
    }
  
    getUrlId() {
      return +this.route.snapshot.paramMap.get('id');
    }
  
    //+++++++++++++++++++++++++++++++++++++++++++++++++++++++++
    // Action buttons
    //+++++++++++++++++++++++++++++++++++++++++++++++++++++++++
  
    displayChartTypeOfDisability() {
      this.setValueBooleanVariables();
      const id = this.getUrlId();
      this.graphicsService.getTypeOfDisabilityByCensus(id)
        .subscribe(variableByCensus =>
          this.groupData(variableByCensus, VARIABLE_GRAPHIC_OPTION.TypeOfDisability));
    }
  
  
    displayChartSex() {
      this.setValueBooleanVariables();
      const id = this.getUrlId();
      this.graphicsService.getSexByCensus(id)
        .subscribe(variableByCensus =>
          this.groupData(variableByCensus, VARIABLE_GRAPHIC_OPTION.Sex));
    }
  
    displayChartAge() {
      this.setValueBooleanVariables();
      const id = this.getUrlId();
      this.graphicsService.getAgeByCensus(id)
        .subscribe(variableByCensus =>
          this.groupData(variableByCensus, VARIABLE_GRAPHIC_OPTION.Age));
    }
  
    displayChartEducation() {
      this.setValueBooleanVariables();
      const id = this.getUrlId();
      this.graphicsService.getEducationByCensus(id)
        .subscribe(variableByCensus =>
          this.groupData(variableByCensus, VARIABLE_GRAPHIC_OPTION.Education));
    }
  
    displayChartTechnologies() {
      this.setValueBooleanVariables();
      const id = this.getUrlId();
      this.graphicsService.getTechnologiesByCensus(id)
        .subscribe(variableByCensus =>
          this.groupData(variableByCensus, VARIABLE_GRAPHIC_OPTION.Technologies));
    }
  
    displayChartRegion() {
      this.setValueBooleanVariables();
      const id = this.getUrlId();
      this.graphicsService.getRegionByCensus(id)
        .subscribe(variableByCensus =>
          this.groupData(variableByCensus, VARIABLE_GRAPHIC_OPTION.Region));
    }
  
    displayChartEmployment() {
      this.setValueBooleanVariables();
      const id = this.getUrlId();
      this.graphicsService.getEmploymentByCensus(id)
        .subscribe(variableByCensus =>
          this.groupData(variableByCensus, VARIABLE_GRAPHIC_OPTION.Employment));
    }
  
    showGraphic() {
      this.displayGraphic = false;
      this.displayTable = true;
    }
  
    showTable() {
      this.displayTable = false;
      this.displayGraphic = true;
    }
  
    setValueBooleanVariables() {
      this.displayDefaultBlockView = true;
      this.displayGraphic = false;
      this.displayTable = true;
    }
  
    changeOptionsConstrast() {
      if (this.selectedOptionContrast) {
        this.highContrast = 'activado';
        this.setOptionConstrast();
        this.selectedOptionContrast = false;
      }
      else {
        this.highContrast = 'desactivado';
        this.reverseChartConstrast();
        this.selectedOptionContrast = true;
      }
    }
  
    changeOptionsPattern() {
      if (this.selectedOptionPattern) {
        this.patthern = 'activado';
        this.buildChart(this.variableByCensusArray);  //rebuild the chart
        this.selectedOptionPattern = false;
      }
      else {
        this.patthern = 'desactivado';
        this.buildChart(this.variableByCensusArray);
        this.selectedOptionPattern = true;
      }
    }
  
    changeChartType(type) {
      this.selectedVariable.type = type;
      this.buildChart(this.variableByCensusArray);
    }
  
  
  
    //+++++++++++++++++++++++++++++++++++++++++++++++++++++++++
    // Process Data
    //+++++++++++++++++++++++++++++++++++++++++++++++++++++++++
  
    groupData(arrayData: any[], variableOptions: any): void {
      this.variableByCensusArray = arrayData;
      this.selectedVariable = variableOptions;
      this.writeDescriptionChart();
  
      this.buildChart(arrayData);
      this.initialize(this.variableByCensusArray);
  
    }
  
    // Reduce the array to key => value
    // correspondent to pie or donut
    reduceArrayToNameData(arrayData) {
      let tempData = [];
      arrayData.forEach((element, index) => {
        let obj: any =
        {
          name: element.variableDescription,
          data: [element.quantity],
          color: this.patthern == 'activado' ? `url(#custom-pattern-${index})` : CHART_OPTIONS.colors[index]
        };
        tempData.push(<JSON>obj);
      });
      this.dataColumn = tempData;
    }
  
    // Reduce the array to key => value
    // correspondent to pie or donut
    reduceArrayToNameY(arrayData, typeChart: string) {
      let tempData = [];
      arrayData.forEach((element, index) => {
        let obj: any =
        {
          name: element.variableDescription,
          y: element.quantity,
          color: this.patthern == 'activado' ? `url(#custom-pattern-${index})` : CHART_OPTIONS.colors[index]
        };
        tempData.push(<JSON>obj);
      });
      this.dataColumn = [{
        type: 'pie',
        innerSize: typeChart == 'donut' ? '50%' : '0%',
        name: this.selectedVariable.title,
        data: tempData
      }];
    }
  
  
  
  
    //+++++++++++++++++++++++++++++++++++++++++++++++++++++++++
    // Chart process
    //+++++++++++++++++++++++++++++++++++++++++++++++++++++++++
    setOptionConstrast() {
      this.backgroundStyle = CHART_OPTIONS.highContrastOptions.backgroundStyle;
      this.titleStyle = CHART_OPTIONS.highContrastOptions.titleStyle;
      this.subtitleStyle = CHART_OPTIONS.highContrastOptions.subtitleStyle;
      this.itemStyle = CHART_OPTIONS.highContrastOptions.itemStyle;
      this.itemOver = CHART_OPTIONS.highContrastOptions.itemOver;
      this.tooltipStyle = CHART_OPTIONS.highContrastOptions.tooltipStyle;
      this.pointStyle = CHART_OPTIONS.highContrastOptions.pointStyle;
      this.xAxis = CHART_OPTIONS.highContrastOptions.xAxis;
      this.yAxis = CHART_OPTIONS.highContrastOptions.yAxis;
      this.displayChart();
  
    }
  
    reverseChartConstrast() {
      this.backgroundStyle = CHART_OPTIONS.initialOptions.backgroundStyle;
      this.titleStyle = CHART_OPTIONS.initialOptions.titleStyle;
      this.subtitleStyle = CHART_OPTIONS.initialOptions.subtitleStyle;
      this.itemStyle = CHART_OPTIONS.initialOptions.itemStyle;
      this.itemOver = CHART_OPTIONS.initialOptions.itemOver;
      this.tooltipStyle = CHART_OPTIONS.initialOptions.tooltipStyle;
      this.pointStyle = CHART_OPTIONS.initialOptions.pointStyle;
      this.xAxis = CHART_OPTIONS.initialOptions.xAxis;
      this.yAxis = CHART_OPTIONS.initialOptions.yAxis;
  
      this.displayChart();
  
    }
  
    processDataToChart(typeChart: string, arrayData) {
      if (typeChart == 'bar' || typeChart == 'column') {
        this.reduceArrayToNameData(arrayData);
      }
      else if (typeChart == 'pie' || typeChart == 'donut') {
        this.reduceArrayToNameY(arrayData, typeChart);
      }
    }
  
    changeDonutToPie(type: string) {
      if (type == 'donut') {
        return 'pie';
      }
      return type;
    }
  
    buildChart(arrayData) {
      this.processDataToChart(this.selectedVariable.type, arrayData);
      this.typeSelected = this.changeDonutToPie(this.selectedVariable.type);
      this.displayChart();
    }
  
    displayChart() {
      let chart = new Chart({
        defs: this.Patterns.def,
        chart: {
          type: this.typeSelected,
          backgroundColor: this.backgroundStyle,
          description: this.descriptionChart,
          height: this.typeSelected == 'bar' ? 800 : null
        },
        title: {
          text: this.selectedVariable.title,
          style: this.titleStyle
        },
        subtitle: {
          text: this.selectedVariable.subtitle,
          style: this.subtitleStyle
        },
        credits: {
          text: 'www.sicid.go.cr',
          href: 'http://www.sicid.go.cr'
        },
        legend: {
          symbolHeight: 20,
          margin: 10,
          itemMarginBottom: 10,
          itemStyle: this.itemStyle,
          itemHoverStyle: this.itemOver
        },
        accessibility: {
          enabled: true,
          describeSingleSeries: true,
        },
        xAxis: {
          categories: this.selectedVariable.xAxis,
          crosshair: true,
          labels: {
            style: this.xAxis
          }
        },
        yAxis: {
          min: 0,
          title: {
            text: this.selectedVariable.yAxis,
            style: this.yAxis
          },
          labels: {
            style: this.yAxis
          },
          gridLineColor: this.highContrast == 'activado' ? '#212121' : '#e6e6e6'
        },
        tooltip: {
          borderColor: this.highContrast == 'activado' ? 'white' :'',
          backgroundColor: this.highContrast == 'activado' ? 'rgba(0, 0, 0, 0.85)' : 'rgba(255, 255, 255, 0.85)',
          headerFormat: '<span>{point.key}</span><br><table>',
          pointFormat: `<tr><td style="color:{white};padding:0"><b>{series.name}:</b> </td><td style="padding:0">{point.y}</td></tr> ${this.typeSelected == 'pie' ? '<tr><td style="color:{white};padding:0"><b>Porcentaje:</b> {point.percentage:.1f} </td></tr>':''}`,
          footerFormat: '</table>',
          useHTML: true,
          valueSuffix: ` ${this.selectedVariable.conteo} `,
          style: this.tooltipStyle
        },
        plotOptions: {
          bar: {
            pointPadding: 0.2,
            borderWidth: 1,
            borderColor: this.highContrast == 'desactivado' && this.patthern == 'activado' ? '#212121' : '#ccd6eb',
            cursor: 'pointer',
            allowPointSelect: true,
          },
          column: {
            pointPadding: 0.2,
            borderWidth: 1,
            borderColor: this.highContrast == 'desactivado' && this.patthern == 'activado' ? '#212121' : '#ccd6eb',
            cursor: 'pointer',
            allowPointSelect: true,
          },
          pie: {
            borderWidth: 1,
            borderColor: this.highContrast == 'desactivado' && this.patthern == 'activado' ? '#212121' : '#ccd6eb',
            dataLabels: {
              enabled: false
            },
            showInLegend: true,
            cursor: 'pointer',
            allowPointSelect: true
          }
        },
        series: this.dataColumn,
        exporting: {
          buttons: {
            contextButton: {
              menuItems: ["printChart",
                "separator",
                "downloadPNG",
                "downloadJPEG",
                "downloadPDF",
                "downloadSVG",
                "separator",
                "downloadCSV",
                "downloadXLS",
                ]
            }
          }
        }
      });
      this.chart = chart;
  
    }
  
    //Write the description chart based into data extracted from database
    writeDescriptionChart() {
      let copyOfVariableByCensusArray = JSON.parse(JSON.stringify(this.variableByCensusArray));
      let dataOrdered = this.getMostHighestData(copyOfVariableByCensusArray);
      let graphicName = this.getGraphicName(this.selectedVariable.type);
      this.descriptionChart = `Se presenta un gŕafico de ${graphicName} que compara el numero de personas con discapacidad por ${this.selectedVariable.title}. El mayor es ${dataOrdered[0].variableDescription} con ${dataOrdered[0].quantity} personas. Seguido de `;
      dataOrdered.slice(1, dataOrdered.length).forEach(element => {
        this.descriptionChart += `${element.variableDescription} con ${element.quantity} personas, `;
      });
    }
  
    getGraphicName(graphicName) {
      if (graphicName == 'pie') {
        return 'pastel';
      }
      else if (graphicName == 'donut') {
        return 'dona';
      }
      else if (graphicName == 'bar') {
        return 'barras';
      }
      else if (graphicName == 'column') {
        return 'columnas';
      }
    }
  
    getMostHighestData(pJson): [any] {
      return pJson.sort((n1, n2) => n2.quantity - n1.quantity);
    }
  
  
    //+++++++++++++++++++++++++++++++++++++++++++++++++++++++++
    //
    //                     Variable Crossing
    //
    //+++++++++++++++++++++++++++++++++++++++++++++++++++++++++
  
    setValueBooleanCrossingVariables() {
      this.displayDefaultBlockViewCross = !this.displayDefaultBlockViewCross;
    }
  
    // load the data on array crossing two
    // param -  an array of [idVariable, variableDescription]
    onChangeVariableOne(variableValue) {
      this.variablesInfo.variableOne = variableValue.split(',');
      if (this.variablesInfo.variableOne[0] !== '-1') {
        this.chargeVariableCrossingTwo(this.variablesInfo.variableOne[0]);
      }
      else {
        this.variableByCrossingTwo = [];   // reinitialize the variable two array
      }
  
      this.variableByCrossingThree = [];   // reinitialize the variable three array
      this.variablesInfo.variableTwo = ['-1', 'Variable 2', '-1'];
      this.variablesInfo.variableThree = ['-1', 'Variable 3', '-1'];
      this.loadCross = true;
    }
  
    // load the data on array crossing three
    // param -  an array of [idVariable, variableDescription]
    onChangeVariableTwo(variableValue) {
      this.variablesInfo.variableTwo = variableValue.split(',');
      if (this.variablesInfo.variableTwo[0] !== '-1') {
        this.chargeVariableCrossingThree(this.variablesInfo.variableTwo[0]);
        this.loadCross = false;
      }
      else {
        this.variableByCrossingThree = [];
        this.loadCross = true;
      }
      this.variablesInfo.variableThree = ['-1', 'Variable 3', '-1'];
  
    }
  
    onChangeVariableThree(variableValue) {
      this.variablesInfo.variableThree = variableValue.split(',');
    }
  
    //+++++++++++++++++++++++++++++++++++++++++++++++++++++++++
    // Action buttons
    //+++++++++++++++++++++++++++++++++++++++++++++++++++++++++
  
    chargeVariables() {
      this.setValueBooleanCrossingVariables();
    }
  
    chargeCross() {
      this.location.back();
      this.setValueBooleanCrossingVariables();
    }
  
    chargeVariableByCensus() {
      const id = this.getUrlId();
      this.graphicsService.getVariablesByCensus(id)
        .subscribe(variableByCensus => this.variableByCensusToCross = variableByCensus);
    }
  
    chargeVariableCrossingTwo(idVariableOne: number) {
      const id = this.getUrlId();
      this.graphicsService.getVariableCrossingTwo(id, idVariableOne)
        .subscribe(variableByCensus => this.variableByCrossingTwo = variableByCensus);
    }
  
    chargeVariableCrossingThree(idVariableThree: number) {
      const id = this.getUrlId();
      this.graphicsService.getVariableCrossingThree(id, idVariableThree)
        .subscribe(variableByCensus => this.variableByCrossingThree = variableByCensus);
    }
  
  }
  export { GraphicsViewComponent }