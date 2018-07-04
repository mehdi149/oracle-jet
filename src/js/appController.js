/**
 * @license
 * Copyright (c) 2014, 2018, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */
/*
 * Your application specific code will go here
 */
define(['ojs/ojcore', 'knockout', 'jquery','ojs/ojknockout' , 'underscore' ,'./dataParser'],
  function(oj, ko , $ ,ojk,underscore ,dataParser) {


console.log("data parser : ",dataParser);
     

     function ControllerViewModel() {
      var dataEntries;
      var self = this;
       self.data = "";
       self.columnsSerieGroup =  ko.observableArray([]);
       self.columnsValue = ko.observableArray([]);
       self.selectedGroupSerieColumn = ko.observable("");
       self.selectedValueColumn = ko.observable("");
       self.chartOptions = ko.observable(["barChart","scatterChart"]);
       self.selectedChart = ko.observable("barChart");


       self.selectValueX = ko.observable("");

       self.selectValueY = ko.observable("");
       self.isScatterChart = ko.observable(false);

       self.plotData = ko.observable();

       self.processData = function(){
         /**
          * Process data from imput 
          */

        dataEntries = dataParser.parseCSV(self.data);

        console.log("dataEntries : ",dataEntries);
        // get column name to group on
         Object.keys(dataEntries.schemas).filter(columnName => dataEntries.schemas[columnName].isCategorical).forEach(columnName => {
         self.columnsSerieGroup.push(columnName);
       })
         Object.keys(dataEntries.schemas).filter(columnName => ( (!dataEntries.schemas[columnName].isCategorical) && (dataEntries.schemas[columnName].dataType === 'Number')))
                                .forEach(columnName => {
                                  self.columnsValue.push(columnName);
                                })

        // default plotting 
        console.log("columnsSerieGroup : ",self.columnsSerieGroup()[0]);
        self.selectedGroupSerieColumn (self.columnsSerieGroup()[0]);
        self.selectedValueColumn(self.columnsValue()[0]);
        self.plotData(self.getPlotData(dataEntries.entries , 'barChart'));
        console.log("plotData : ",self.plotData());





       }


       self.selectedGroupSerieColumn.subscribe(value => {
         if(dataEntries) {
          if(self.selectedGroupSerieColumn() !== '' &&  self.selectedValueColumn() !== '' && self.selectedChart() !== '' ) {
            self.plotData(self.getPlotData(dataEntries.entries , self.selectedChart()));
          }
         }
   

       })

       self.selectedValueColumn.subscribe(value => {
          if(dataEntries){
            if(self.selectedGroupSerieColumn() !== '' &&  self.selectedValueColumn() !== '' && self.selectedChart() !== '' ) {
              self.plotData(self.getPlotData(dataEntries.entries , self.selectedChart()));
            }
          }
         
       })

       self.selectedChart.subscribe(value => {
         if(dataEntries){
          if(value == 'scatterChart') { 
            self.isScatterChart(true);
            self.selectValueX(self.columnsValue()[0]); 
            self.selectValueY(self.columnsValue()[1]); 
          }
          else self.isScatterChart(false);
          console.log("isScatterChart : ",self.isScatterChart());
          if(self.selectedGroupSerieColumn() !== '' &&  self.selectedValueColumn() !== '' && self.selectedChart() !== '' ) {
            self.plotData(self.getPlotData(dataEntries.entries , self.selectedChart()));
          }
         }
      
       })
       self.selectValueX.subscribe(value => {
        if(dataEntries){

         if(self.selectedGroupSerieColumn() !== '' &&  self.selectedValueColumn() !== '' && self.selectedChart() !== '' ) {
           self.plotData(self.getPlotData(dataEntries.entries , self.selectedChart()));
         }
        }
     
      })
      self.selectValueY.subscribe(value => {
        if(dataEntries){

         if(self.selectedGroupSerieColumn() !== '' &&  self.selectedValueColumn() !== '' && self.selectedChart() !== '' ) {
           self.plotData(self.getPlotData(dataEntries.entries , self.selectedChart()));
         }
        }
     
      })
       self.getPlotData= function(entries , typeChart){
        let series = [];
    
        console.log("selectedGroupSerieColumn : ",self.selectedGroupSerieColumn());
        let groupedEntries = dataParser.groupByColumn(entries , self.selectedGroupSerieColumn());
        console.log("groupedEntries : ",groupedEntries);
        console.log("selectedValueColumn: ",self.selectedValueColumn());
        switch(typeChart) {
          case 'barChart':
            Object.keys(groupedEntries).forEach(column_value => {
              let valueItems = []
              groupedEntries[column_value].forEach(entry => valueItems.push(entry[self.selectedValueColumn()]));
             series.push( {
               'name': column_value,
              'items' : valueItems
             });
            });
             break;
          case 'scatterChart':
          Object.keys(groupedEntries).forEach(column_value => {
            let valueItems = []
            groupedEntries[column_value].forEach(entry => valueItems.push({x : entry[self.selectValueX()] , y : entry[self.selectValueY()] }));
           series.push( {
             'name': column_value,
            'items' : valueItems
           });
          });
          console.log('scatter chart : ', series)
          break;
        
        }
        return series;
          
       }

      // Media queries for repsonsive layouts
      var smQuery = oj.ResponsiveUtils.getFrameworkQuery(oj.ResponsiveUtils.FRAMEWORK_QUERY_KEY.SM_ONLY);
      self.smScreen = oj.ResponsiveKnockoutUtils.createMediaQueryObservable(smQuery);
      self.stackValue = ko.observable('off');
      self.orientationValue = ko.observable('vertical');

    









      // Footer
      function footerLink(name, id, linkTarget) {
        this.name = name;
        this.linkId = id;
        this.linkTarget = linkTarget;
      }
      self.footerLinks = ko.observableArray([
        new footerLink('About Oracle', 'aboutOracle', 'http://www.oracle.com/us/corporate/index.html#menu-about'),
        new footerLink('Contact Us', 'contactUs', 'http://www.oracle.com/us/corporate/contact/index.html'),
        new footerLink('Legal Notices', 'legalNotices', 'http://www.oracle.com/us/legal/index.html'),
        new footerLink('Terms Of Use', 'termsOfUse', 'http://www.oracle.com/us/legal/terms/index.html'),
        new footerLink('Your Privacy Rights', 'yourPrivacyRights', 'http://www.oracle.com/us/legal/privacy/index.html')
      ]);
     }

     return new ControllerViewModel();
  }
);
