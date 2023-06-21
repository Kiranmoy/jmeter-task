/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = true;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 7;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Throughput";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 100.0, "KoPercent": 0.0};
    var dataset = [
        {
            "label" : "FAIL",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "PASS",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.9722222222222222, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "Click \"Chairs\" tab"], "isController": false}, {"data": [1.0, 500, 1500, "open the application"], "isController": false}, {"data": [1.0, 500, 1500, "S01_TASK_T04_place_order"], "isController": true}, {"data": [1.0, 500, 1500, "Navigate to \"Tables\" tab"], "isController": false}, {"data": [1.0, 500, 1500, "Fetch country-states"], "isController": false}, {"data": [1.0, 500, 1500, "Open a table product cart (click on a table)"], "isController": false}, {"data": [1.0, 500, 1500, "Add table to Cart (click \"Add to Cart\" button)"], "isController": false}, {"data": [1.0, 500, 1500, "Open random chair"], "isController": false}, {"data": [1.0, 500, 1500, "Fill in all required fields, click \"Place an order\""], "isController": false}, {"data": [1.0, 500, 1500, "Fill in all required fields, click \"Place an order\"-0"], "isController": false}, {"data": [1.0, 500, 1500, "Fill in all required fields, click \"Place an order\"-1"], "isController": false}, {"data": [1.0, 500, 1500, "S01_TASK_T01_open_application"], "isController": true}, {"data": [1.0, 500, 1500, "S01_TASK_T02_add_table_to_cart"], "isController": true}, {"data": [1.0, 500, 1500, "Open Cart"], "isController": false}, {"data": [1.0, 500, 1500, "S01_TASK_T03_add_chair_to_cart"], "isController": true}, {"data": [0.5, 500, 1500, "Load-Model-Test"], "isController": true}, {"data": [1.0, 500, 1500, "Add chair to cart"], "isController": false}, {"data": [1.0, 500, 1500, "Click \"Place an order\""], "isController": false}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 325, 0, 0.0, 55.29538461538464, 20, 128, 57.0, 85.0, 99.39999999999998, 119.48000000000002, 0.861358401954886, 27.17453500312077, 1.3839606948909522], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Click \"Chairs\" tab", 25, 0, 0.0, 69.08, 51, 85, 71.0, 80.2, 84.1, 85.0, 0.07582305930879699, 3.415665920757321, 0.048426055456985584], "isController": false}, {"data": ["open the application", 25, 0, 0.0, 73.15999999999998, 60, 110, 72.0, 82.4, 102.79999999999998, 110.0, 0.07613594834937264, 3.9473961267739672, 0.03635788939730783], "isController": false}, {"data": ["S01_TASK_T04_place_order", 25, 0, 0.0, 225.35999999999999, 201, 258, 223.0, 249.20000000000002, 255.9, 258.0, 0.0756246596890314, 10.61809215999153, 0.6959772880240789], "isController": true}, {"data": ["Navigate to \"Tables\" tab", 25, 0, 0.0, 58.879999999999995, 55, 65, 59.0, 62.800000000000004, 64.7, 65.0, 0.07599962304186972, 3.709360507821881, 0.04853882174744413], "isController": false}, {"data": ["Fetch country-states", 25, 0, 0.0, 21.36, 20, 28, 21.0, 23.400000000000002, 26.799999999999997, 28.0, 0.07572430295779127, 0.18213765447757804, 0.046810042746369025], "isController": false}, {"data": ["Open a table product cart (click on a table)", 25, 0, 0.0, 65.56, 54, 75, 66.0, 74.0, 74.7, 75.0, 0.07603706959216758, 3.294009020277566, 0.04999140305881924], "isController": false}, {"data": ["Add table to Cart (click \"Add to Cart\" button)", 25, 0, 0.0, 31.120000000000005, 25, 39, 29.0, 39.0, 39.0, 39.0, 0.0761835108409136, 0.046275530999070565, 0.056408533124590515], "isController": false}, {"data": ["Open random chair", 25, 0, 0.0, 55.879999999999995, 50, 67, 55.0, 62.800000000000004, 66.1, 67.0, 0.07562191462588326, 3.289674399448565, 0.049508722231632954], "isController": false}, {"data": ["Fill in all required fields, click \"Place an order\"", 25, 0, 0.0, 103.8, 86, 128, 104.0, 121.60000000000001, 126.8, 128.0, 0.081302399396411, 2.925682721654731, 0.5758877612246092], "isController": false}, {"data": ["Fill in all required fields, click \"Place an order\"-0", 25, 0, 0.0, 73.75999999999999, 56, 98, 75.0, 89.2, 95.89999999999999, 98.0, 0.08131059672220722, 0.03929271062696975, 0.5171068093965777], "isController": false}, {"data": ["Fill in all required fields, click \"Place an order\"-1", 25, 0, 0.0, 29.759999999999998, 28, 33, 29.0, 32.0, 32.7, 33.0, 0.08132858374404268, 2.8873235678036404, 0.058852031791343386], "isController": false}, {"data": ["S01_TASK_T01_open_application", 25, 0, 0.0, 73.15999999999998, 60, 110, 72.0, 82.4, 102.79999999999998, 110.0, 0.07612435674918547, 3.9467951407919974, 0.03635235395542157], "isController": true}, {"data": ["S01_TASK_T02_add_table_to_cart", 25, 0, 0.0, 155.56, 141, 170, 153.0, 167.4, 169.4, 170.0, 0.07612806567720481, 7.059822409399989, 0.15503956375573244], "isController": true}, {"data": ["Open Cart", 25, 0, 0.0, 53.12, 38, 63, 57.0, 63.0, 63.0, 63.0, 0.07551067872018462, 2.872140103834734, 0.04807906496636754], "isController": false}, {"data": ["S01_TASK_T03_add_chair_to_cart", 25, 0, 0.0, 161.24, 139, 188, 162.0, 179.4, 186.5, 188.0, 0.07615148662932197, 6.7894285744746306, 0.15892160832701277], "isController": true}, {"data": ["Load-Model-Test", 25, 0, 0.0, 615.32, 575, 671, 615.0, 661.6, 669.8, 671.0, 0.07600216454164614, 28.43581797709599, 1.0491386294681673], "isController": true}, {"data": ["Add chair to cart", 25, 0, 0.0, 36.28, 26, 47, 40.0, 45.2, 47.0, 47.0, 0.07564525401676299, 0.045948582029713456, 0.060028645912130474], "isController": false}, {"data": ["Click \"Place an order\"", 25, 0, 0.0, 47.080000000000005, 37, 61, 45.0, 58.400000000000006, 60.4, 61.0, 0.07571971589962594, 4.844432069003377, 0.06548868084896944], "isController": false}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Median
            case 8:
            // Percentile 1
            case 9:
            // Percentile 2
            case 10:
            // Percentile 3
            case 11:
            // Throughput
            case 12:
            // Kbytes/s
            case 13:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": []}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 325, 0, "", "", "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
