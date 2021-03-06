




define('dataParser',['jquery','underscore'] , 
            
    function ($ , _){

        const ROW_DELIMITER = '\\n';
        const COLUMN_DELIMITER = '\\t';


        const RATIO_CATEGORICAL = 0.5;



         function getTypeColumn(entries , column_name){
            let distinct_values = _.uniq(entries ,function( entry ){return entry[column_name]});
            let isCategorical = ((distinct_values.length/entries.length) < RATIO_CATEGORICAL);
            return isCategorical;
        }
        
        
        
         function getDataTypeColumn(value){
            if(isNaN(value)) return 'Text';
            else return 'Number';
        }
        
        var dataParser = {
            parseCSV : function(data){
                let rows = data.split(ROW_DELIMITER);
                let header = rows[0].split(COLUMN_DELIMITER);
                rows.splice(0,1);
                let entries = [];
                let schemas = {};
                rows.forEach(row => {
                    let entry = {};
                    let columns = row.split(COLUMN_DELIMITER);
                    header.forEach((column_name,index) => {
                        if(columns[index] === undefined){ alert("DATA MALFORMED !"); throw "parsing error";}
                        let value = columns[index]
                        if(!schemas[column_name] && value !== 'Null' ){
                          schemas[column_name] = {};
                          schemas[column_name].dataType = getDataTypeColumn(value);
                        }
                        if(schemas[column_name].dataType == 'Number') 
                        entry[column_name] = parseFloat(value);
                        else
                        entry[column_name] =  value.replace("\'","");
            
            
                    });
                    entries.push(entry);
                });
                if(entries.length  == 0) {alert("NO ENTRY FOUND !"); throw "parsing error";}
                header.forEach(column_name => {
                  schemas[column_name].isCategorical = getTypeColumn(entries,column_name);  
                });
            
                return { 'schemas':schemas ,'entries':entries };
            
            
            },
            groupByColumn : function(entries , columnName){
                
                return _.groupBy(entries , columnName );
            }
        
        }
        return dataParser;
        }

)