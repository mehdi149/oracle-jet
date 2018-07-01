/**
 * @license
 * Copyright (c) 2014, 2018, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */
/*
 * Your application specific code will go here
 */
define(['ojs/ojcore', 'knockout', 'jquery','ojs/ojknockout' ],
  function(oj, ko , $) {

    
     

     function ControllerViewModel() {
       var self = this;

      // Media queries for repsonsive layouts
      var smQuery = oj.ResponsiveUtils.getFrameworkQuery(oj.ResponsiveUtils.FRAMEWORK_QUERY_KEY.SM_ONLY);
      self.smScreen = oj.ResponsiveKnockoutUtils.createMediaQueryObservable(smQuery);

      // Header
      // Application Name used in Branding Area
      self.appName = ko.observable("Test App Name");
      // User Info used in Global Navigation area
      self.userLogin = ko.observable("bahra.mehdi1@gmail.com");

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
          for(let i = 0 ; i < rows_data.length ; i++) {
              let columns = rows_data[i].split('\\t');
              console.log('columns : ',columns);
              let entry = {};
              columns.forEach( (column , index) => {
                entry['column'+index] = column;
                if(column !== 'NULL') {
                if (!columnTypeMetadata['column'+index]){
                   // check if the column value is a number or Text , ignore null values
                   
                    if(isNaN(parseFloat(column))) columnTypeMetadata['column'+index] = 'Text';
                    else columnTypeMetadata['column'+index] = 'Number';
                   
              
                }
               
                // count frequencies
                if (!columnValueFrequency['column'+index]) columnValueFrequency['column'+index] = {};
                if( !columnValueFrequency['column'+index][column]) columnValueFrequency['column'+index][column] = 0;
                columnValueFrequency['column'+index][column]++;
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
      /**
       * Extract the possible plots by series , groups and numerical value
       */
      var groupEntryBySeries= {};
       series_groups.forEach(column => {
        
         groupEntryByColumn [column] = {};
         Object.keys(columnValueFrequency[column]).forEach(serie => {
          groupEntryByColumn[column][serie] = entries.filter(entry => entry[column] === serie);
         })
         Object.keys(columnValueFrequency)

       })


      console.log(columnTypeMetadata);
      console.log(IsColumnCategorical);
      console.log(series_groups);
      console.log(groupEntryByColumn);
      })
      console.log(columnValueFrequency);
      console.log(columnTypeMetadata);
     

      //charts section

      var scatterSeries = [{name : "Series 1", items : [{x:15, y:15}, {x:25, y:43}, {x:25, y:25}]},
      {name : "Series 2", items : [{x:25, y:15}, {x:55, y:45}, {x:57, y:47}]},
      {name : "Series 3", items : [{x:17, y:36}, {x:32, y:52}, {x:26, y:28}]},
      {name : "Series 4", items : [{x:38, y:22}, {x:43, y:43}, {x:58, y:36}]}];

var scatterGroups = ["Group A", "Group B", "Group C"];


this.scatterSeriesValue = ko.observableArray(scatterSeries);
this.scatterGroupsValue = ko.observableArray(scatterGroups);






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
