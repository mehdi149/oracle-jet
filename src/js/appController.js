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
       var self = this;
       self.data = "";

       self.processData = function(){
         /**
          * Process data from imput 
          */
        let entries = dataParser.parseCSV(self.data);
          console.log("entries : ",entries);
       }

      // Media queries for repsonsive layouts
      var smQuery = oj.ResponsiveUtils.getFrameworkQuery(oj.ResponsiveUtils.FRAMEWORK_QUERY_KEY.SM_ONLY);
      self.smScreen = oj.ResponsiveKnockoutUtils.createMediaQueryObservable(smQuery);

      // Header
      // Application Name used in Branding Area
      self.appName = ko.observable("Test App Name");
      // User Info used in Global Navigation area
      self.userLogin = ko.observable("bahra.mehdi1@gmail.com");
         /* toggle button variables */
         self.stackValue = ko.observable('off');
         self.orientationValue = ko.observable('vertical');

      var columnValueFrequency = {};
      var columnTypeMetadata = {};
      var IsColumnCategorical = {};
      const THRESOLD_CATEGORICAL = 0.5;
      var length_data;
      $.get('js/countries.txt', function (data) {
          console.log("countries data : ", data);
          let rows_data = data.split('\\n');
          let entries = []
          length_data = rows_data.length;
          console.log('rows length:',rows_data.length);
          let headers = rows_data[0].split('\\t');
          rows_data.splice(0,1);
          for(let i = 0 ; i < rows_data.length ; i++) {
              let columns = rows_data[i].split('\\t');
              console.log('columns : ',columns);
              let entry = {};
              headers.forEach((column_name , index) => {
                let column_value = columns[index]
                entry[column_name] = column_value;
                if(column_value !== 'NULL') {
                if (!columnTypeMetadata[column_name]){
                   // check if the column value is a number or Text , ignore null values
                   
                    if(isNaN(parseFloat(column_value))) {
                      columnTypeMetadata[column_name] = 'Text';
                      entry[column_name] = column_value;
                    }
                    else {
                      columnTypeMetadata[column_name] = 'Number';
                      
                    }
                    
                   
              
                }
                if(columnTypeMetadata[column_name] == 'Text')
                entry[column_name] = column_value;
                else
                entry[column_name] = parseFloat(column_value);
               
                // count frequencies
                if (!columnValueFrequency[column_name]) columnValueFrequency[column_name] = {};
                if( !columnValueFrequency[column_name][column_value]) columnValueFrequency[column_name][column_value] = 0;
                columnValueFrequency[column_name][column_value]++;
              }
              });
              entries.push(entry)
          }
      console.log(columnValueFrequency);
      /**
       * Counting the number of unique obserations in each column of our data 
       * similar to the function nunique in pandas (python) , if the ration of total of observation to the number of total values
       * less than a given threshold , take the column as categorical , 
       */

       Object.keys(columnValueFrequency).forEach(column => {
         let number_observations = Object.keys(columnValueFrequency[column]).length;
         IsColumnCategorical[column] = ((number_observations/length_data) < THRESOLD_CATEGORICAL);

       })

       /**
        * Get potential attribute that represent series and groups
        */
      var series_groups = []
      Object.keys(IsColumnCategorical).forEach(column => {
        if(IsColumnCategorical[column] && columnTypeMetadata[column] == 'Text')
        series_groups.push(column);

      });
      console.log("entries : ",entries);
   


    /***
     * Example
     *  name : Africa , items : [ surfaceAreaRegion1 , surfaceAreaRegion2 ,SurfaceAreaRegion3 , ...]
     *         groups :[region1 , region2 , region3 , ...]
     */
    /**
     * Je regroupe ces donnees par continent , ensuite je regroupe ces memes donnes par federation 
     * Africa
     *        region1
     *                 entries
     *        region2  entries
     */
      let plots_data = {}
       let value_columns = Object.keys(columnTypeMetadata).filter(column => columnTypeMetadata[column] == 'Number')
      let entriesGroupedByColumn = {}
      series_groups.forEach(column1 => {
         entriesGroupedByColumn[column1] = {};
         plots_data[column1] = [];
        let entriesGrouped1  = _.groupBy(entries, column1);
   
        Object.keys(entriesGrouped1).forEach(column_value => {
          let surface_areas = []
          entriesGrouped1[column_value].forEach(entry => surface_areas.push(entry[value_columns[0]]));
          plots_data[column1].push({name : column_value , items : surface_areas});
        })
       
      })

      console.log(plots_data);

   

      console.log(value_columns);

      

      self.barSeriesValue = ko.observableArray(plots_data[series_groups[2]]);


  


  
      /*
       * Extract the possible plots by series , groups and numerical value*/
       
      // group entry by categorical values;
      // split series by groups
      var series = {}
       series_groups.forEach(column => {
        
         series [column] = {};
         Object.keys(columnValueFrequency[column]).forEach(serie => {
          series[column][serie] = {};
          let filterentries = entries.filter(entry => entry[column] === serie);
          let other_series_groups = series_groups.filter( serie_group => serie_group !== column)
          other_series_groups.forEach(columnSerieGroup => {

           series[column][serie][columnSerieGroup] = {};
           Object.keys(columnValueFrequency[columnSerieGroup]).forEach(columnSerieGroupValue => {
             series[column][serie][columnSerieGroup][columnSerieGroupValue] = entries.filter(entry => entry[columnSerieGroup] === columnSerieGroupValue);
            })
          })
         })



       })


      console.log(columnTypeMetadata);
      console.log(IsColumnCategorical);
      console.log(series_groups);
      console.log(series);
    

      })
      console.log(columnValueFrequency);
      console.log(columnTypeMetadata);
     

      //charts section

      var scatterSeries = [{name : "Series 1", items : [{x:15, y:15}, {x:25, y:43}, {x:25, y:25}]},
      {name : "Series 2", items : [{x:25, y:15}, {x:55, y:45}, {x:57, y:47}]},
      {name : "Series 3", items : [{x:17, y:36}, {x:32, y:52}, {x:26, y:28}]},
      {name : "Series 4", items : [{x:38, y:22}, {x:43, y:43}, {x:58, y:36}]}];




this.scatterSeriesValue = ko.observableArray(scatterSeries);







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
