var projectId = 'bks9992003lxlleeol9902-0000s';
var datasetId = '64786069';

var date = new Date();
date.setTime(date.getTime() - 24*60*60*1000);
var yesterdayString = date.toISOString().slice(0,4) + date.toISOString().slice(5,7) + date.toISOString().slice(8,10);

var outputTableName = 'AMAZON_ASIN';  


function AMAZON_ASIN() {  
  runDailyUpdate(yesterdayString);
}

function manuallyRunDailyUpdate() {
  var manualDate = SpreadsheetApp.getActive().getSheetByName('Sheet').getRange('B1').getValue();
  var manualDateString = manualDate.toISOString().slice(0,4) + manualDate.toISOString().slice(5,7) + manualDate.toISOString().slice(8,10);  
  runDailyUpdate(manualDateString);
}

//QUERY GOES HERE!

var query = 'SELECT REGEXP_EXTRACT(hits.eventInfo.eventAction,r\'(\\bB[0-9A-Z]+)\') AS ProdASIN FROM TABLE_DATE_RANGE([125604721.ga_sessions_], TIMESTAMP(DATE_ADD(CURRENT_DATE(), -1, \'DAY\')), TIMESTAMP(DATE_ADD(CURRENT_DATE(), -1, \'DAY\'))) WHERE hits.eventInfo.eventAction CONTAINS \'www.amazon.com\') WHERE ProdASIN IS NOT NULL;'
function runDailyUpdate(dateString) {
    tableUpdate(outputTableName, 'ga_sessions_' + dateString, query, true);
  
}


function tableUpdate(outputTableId, dependencyTableId, query, overwrite) {
  try {
    if (checkIfTableExists(dependencyTableId)) {
       runQuery(outputTableId, query, overwrite)   
    } else { throw new Error('The data to run this query is not yet available.') }
  } catch(e) { throw e }
}

function checkIfTableExists(tableId) {
  try {
    if (BigQuery.Tables.get(projectId, datasetId, tableId)) {
      return true; }
  }
  catch(e) {
    if (e.message.indexOf('Not found') !== -1) { return false; }
    else { Logger.log(e); return undefined; }
  }
}

function runQuery(tableId, query, overwrite) {
 
  if(!checkIfTableExists(tableId) || overwrite) {
   
    var jobId = tableId + Math.round(new Date() / 1000);
    var writeDisposition = overwrite ? 'WRITE_TRUNCATE' : 'WRITE_EMPTY';
    
    var job = {
      jobReference: {
        projectId: projectId,
        jobId: jobId },
      configuration: {
        query: { 
          query: query,
          destinationTable: {
            projectId: projectId,
            datasetId: datasetId,
            tableId: tableId },
          writeDisposition: writeDisposition,
          allowLargeResults: true } } };
    
    var runJob = BigQuery.Jobs.insert(job, projectId);
    
  }
  
}

function onOpen() {
  var ui = SpreadsheetApp.getUi();
  ui.createMenu('BigQuery Scheduler')
      .addItem('Run daily update for date in B2', 'manuallyRunDailyUpdate')
      .addToUi();
}