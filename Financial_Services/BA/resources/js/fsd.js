// color map
//
define(['cdf/lib/jquery', 'amd!cdf/lib/underscore', 'cdf/lib/CCC/protovis',  'cdf/Dashboard.Clean',  'cdf/lib/CCC/pvc', 'cdf/dashboard/Utils', 'cdf/lib/moment', 'cdf/lib/mustache'], function($, _, pv, Dashboard, pvc, Utils, moment, Mustache ) {
    var fsd = {};
    
    fsd.opts = {
        mapColors : {
            '1' : "#E5EFF6", 
            '2' : "#CCDFED",
            '3' : "#B2CEE4",
            '4' : "#99BEDB", 
            '5' : "#80AED3",
    		'6' : "#669ECA",
			'7' : "#4D8EC1",
			'8' : "#337DB8",
			'9' : "#1A6DAF",
			'10' : "#005DA6",
        },
        
        gradientScaleDefaults : {
            'numberOfBuckets':10,
            'message':'Some measure...',
            'showAllValues':true,
            barColorArray: [
                '#E5EFF6',
                '#CCDFED',
                '#B2CEE4',
                '#99BEDB',
                '#80AED3',
                '#669ECA',
                '#4D8EC1',
                '#337DB8',
                '#1A6DAF',
                '#005DA6'
            ],
            minValue: 0,
            maxValue: 1,
            template:
                '<div class="scale-container" >' +
                '  <div class="scale-message">{{label}}</div>' +
                '  <div class="scale-buckets-container clearfix">' +
                '    {{#buckets}}' +
                '      <div class="scale-bucket pull-left" style="width:{{width}};">' +
                '        <div class="scale-bucket-bar" style="background-color:{{color}};"></div>' +
                '        <div class="scale-bucket-label {{firstBucket}}" style="visibility:{{visibility}};">{{scale}}</div>' +
                '      </div>' +
                '    {{/buckets}}' +
                '  </div>' +
                '</div>'
        },
        
        mapTooltipDimensions:{
            w:200,
            h:26
        },

        parameterDefaults:{
            'param_start_loan_date':['2005-01-01'],
            'param_end_loan_date':['2045-01-11'] ,
            'param_networth':["10000-19999","20000-29999","30000-39999","40000-49999","50000-59999","60000-69999","70000-79999","80000-89999","90000-99999","100000+"] ,
            'param_cc_debt':["$0-$2,000","$2,001-$2,500","$2,501-$4,000","$4,001-$5,500","$5,501-$7,000","$7,001-$8,500","$8,501-$10,000","$10,001-$11,500","$11,501-$13,000","$13,001-$14,500","$14,501-$16,000+"],
            'param_loan_debt':["$0-$250,000","$250,001-$350,000","$350,001-$450,000","$450,001-$550,000","$550,001-$650,000","$650,001-$750,000","$750,001-$850,000","$850,001-$950,000+"] ,
            'param_annual_hh_income':["$0-$80,000","$0-$80,000","$80,001-$140,000","$140,001-$200,000","$200,001-$260,000","$260,001-$320,000","$320,001-$380,000","$380,001-$440,000","$440,001-$500,000","$500,001-$560,000","$560,001-$620,000+"] ,
            'param_mortgage_term':["180","240","360"] ,
            'param_interest_rate':["0-3","3.1-4","4.1-5","5.1-6","6.1-7","7.1+"],
            'param_age_range':["25-29","30-34","35-39","40-44","45-49","50-54","55-59+"],
            'param_recent_web_activity_flag':['false']
        },
        
        // table settings
        tables:{
            generalConfig:{
                filter:false,
                info:false,
                lengthChange:false,
                sort:true,
                paginationType : "customInput"
            },
            generalView:{
                colTypes : ['hidden', 'string', 'string', 'string', 'string'],
                colHeaders : ['Zip Code', 'State', 'Traffic', 'Var', 'Pos'],
                colWidths : ['0%', '30%', '25%', '25%', '20%'],
                sortBy: [["2","desc"]]
            },
            detailedView:{
                colTypes : ['string', 'string', 'string'],
                colHeaders : ['Issues', 'Stats', 'Pos'],
                colWidths : ['50%', '25%', '25%'],
                sortBy: [["0","desc"]]
            }
        }
    };
    
    fsd.data = {
        usStates : {
            'ALABAMA': 'AL',
            'ALASKA': 'AK',
            'AMERICAN SAMOA': 'AS',
            'ARIZONA': 'AZ',
            'ARKANSAS': 'AR',
            'CALIFORNIA': 'CA',
            'COLORADO': 'CO',
            'CONNECTICUT': 'CT',
            'DELAWARE': 'DE',
            'DISTRICT OF COLUMBIA': 'DC',
            'FEDERATED STATES OF MICRONESIA': 'FM',
            'FLORIDA': 'FL',
            'GEORGIA': 'GA',
            'GUAM': 'GU',
            'HAWAII': 'HI',
            'IDAHO': 'ID',
            'ILLINOIS': 'IL',
            'INDIANA': 'IN',
            'IOWA': 'IA',
            'KANSAS': 'KS',
            'KENTUCKY': 'KY',
            'LOUISIANA': 'LA',
            'MAINE': 'ME',
            'MARSHALL ISLANDS': 'MH',
            'MARYLAND': 'MD',
            'MASSACHUSETTS': 'MA',
            'MICHIGAN': 'MI',
            'MINNESOTA': 'MN',
            'MISSISSIPPI': 'MS',
            'MISSOURI': 'MO',
            'MONTANA': 'MT',
            'NEBRASKA': 'NE',
            'NEVADA': 'NV',
            'NEW HAMPSHIRE': 'NH',
            'NEW JERSEY': 'NJ',
            'NEW MEXICO': 'NM',
            'NEW YORK': 'NY',
            'NORTH CAROLINA': 'NC',
            'NORTH DAKOTA': 'ND',
            'NORTHERN MARIANA ISLANDS': 'MP',
            'OHIO': 'OH',
            'OKLAHOMA': 'OK',
            'OREGON': 'OR',
            'PALAU': 'PW',
            'PENNSYLVANIA': 'PA',
            'PUERTO RICO': 'PR',
            'RHODE ISLAND': 'RI',
            'SOUTH CAROLINA': 'SC',
            'SOUTH DAKOTA': 'SD',
            'TENNESSEE': 'TN',
            'TEXAS': 'TX',
            'UTAH': 'UT',
            'VERMONT': 'VT',
            'VIRGIN ISLANDS': 'VI',
            'VIRGINIA': 'VA',
            'WASHINGTON': 'WA',
            'WEST VIRGINIA': 'WV',
            'WISCONSIN': 'WI',
            'WYOMING': 'WY'
        }
    };
    
    fsd.helpers = {
        addSortIcons: function(component) {
            
            // Use different way to show the sort arrows in th cells
            // Append span elements with .sort-arrow class to all sortable headers
            var table = component.placeholder().find('table'),
                th = table.find('th');
                
            th.each(function() {
                var cell = $(this);
                
                if(cell.find('.sort-arrow').length < 1) {
                    cell.wrapInner('<span class="cell-title"></span>');
                    cell.append('<span class="sort-arrow"></span>');
                }
            });
            
        },
        wrapStringColumns: function(component, ...theStrings) {
            
            // theStrings is the array of column indexes that we want to be
            // affected by this method. To affect indexes 0, 1 and 2, use:
            // fsd.helpers.wrapStringColumns(this, 0, 1, 2);
            
            
            var table = component.placeholder().find('table');
            
            theStrings.map(function(x) {
                
                // get referred table cell
                cell = table.find('td.column' + x);
                
                // If cell content was not wrapped before, wrap into new span
                if(cell.find('span.table-cell-wrapper').length < 1) {
                    cell.wrapInner('<span class="table-cell-wrapper"></span>');
                }
                
            });
            
        },
        addInfoIcon: function(button) {
            
            // add info icon
            var tooltipContent = '<div class=\'info-tooltip-title\'>SDR Technical Information</div><div class=\'info-tooltip-description\'>Lorem ipsum dolor sit amet, vide aperiri accommodare no sit, cum ea solet iudico repudiandae, ei vim tantas ubique. Ad nam audire impetus. Has clita assentior posidonium te, ut pro augue possim maiorum, et putant melius scriptorem est.</div>';
            button.append('<span class="info-marker" title="' + tooltipContent + '">i</span>');
            
            // turn info icon title into tipsy tooltip
            button.find('.info-marker').tipsy({
                gravity: $.fn.tipsy.autoNS,
                fade: true,
                className: 'info-tooltip',
                html: true,
                offset: 10,
                opacity: 1
            });
            
        },
        addCtoolsInfoIcon: function(button) {
            
            // add info icon
            var tooltipContent = '<div class=\'info-tooltip-title\'>CTools Technical Information</div><div class=\'info-tooltip-description\'>Lorem ipsum dolor sit amet, vide aperiri accommodare no sit, cum ea solet iudico repudiandae, ei vim tantas ubique. Ad nam audire impetus. Has clita assentior posidonium te, ut pro augue possim maiorum, et putant melius scriptorem est.</div>';
            button.append('<span class="info-marker" title="' + tooltipContent + '">i</span>');
            
            // turn info icon title into tipsy tooltip
            button.find('.info-marker').tipsy({
                gravity: 'e',
                fade: true,
                className: 'info-tooltip',
                html: true,
                offset: 10,
                opacity: 1
            });
            
        }
    };
    
    fsd.functions = {
        isTableDetail: function(params, context){
            return _.filter(
                _.map(params, function(p){
                    return !_.isEmpty(context.getParameterValue(p));
                }), 
                function(e){ 
                    return e === true;}
                ).length > 0;
        },
        
        generateGradientScale: function(opts){   
                
            var newOpts = normalizeOpts(opts);
            
                return render(newOpts);
            
            function normalizeOpts(opts){
                return $.extend( {} , fsd.opts.gradientScaleDefaults , opts );
            }
            
            function getViewModel ( opts ){
                return {
                    label: opts.message,
                    buckets: getBucketsModel(opts)
                }
            }
        
            function getBucketsModel ( opts ){
                var range = _.range( opts.numberOfBuckets ),
                    min = opts.minValue,
                    max = opts.maxValue,
                    delta = max - min;
                var data = _.map( range , function ( idx ){
                   return {
                       color: opts.barColorArray[ (idx % opts.numberOfBuckets) + 1 ],
                       scale: min + (idx+1)*( delta / opts.numberOfBuckets ),
                       width: Math.floor( 100/opts.numberOfBuckets ) + '%',
                       visibility: ( (idx === 0 || idx === 9) ? 'inline' : 'hidden' ),
                       firstBucket: ( (idx === 0 ) ? 'firstBucket' : 'otherBucket' ),
                   } 
                });
                /* replace delta value for first bucket with minimum value */
                data[0].scale = min;
                return data;
            }
        
            function render ( opts ){
                return $( Mustache.render( opts.template , getViewModel( opts ) ) );
            }
        },
        
        generateTableTooltip: function(tableRows){
            var tooltipContent = ''+
            '<div class="tableTooltipWrapper">'+
            '   <div class="header">Data Source</div>'+
            '   <div class="tooltipInfo">'+
            '       <div>Mortgage</div>'+
            '       <div>Real Estate API</div>'+
            '   </div>'+
            '</div>';
            
            // append title to rows
            _.each(tableRows, function(row){
                    var currentRow = $(row);
                        currentRow.addClass('breakdownTooltip');
                        currentRow.attr('title', $(tooltipContent).remove().html());
                        $(currentRow).tipsy({html:true, className:'breakdownTooltip', opacity:1});
            });
        },
        
        fetchConnections: function(){
            var link = '/pentaho/plugin/data-access/api/datasource/dsw/domain';
            var resp = JSON.parse($.getJSON(link).responseText);
            
            
            if(resp.Item === undefined){
                // no connection present
                return [];
            }
            else if(resp.Item.length === undefined){
                // one item in array
                return [resp.Item.$.replace('.xmi','')];
            } else {
                return _.map(resp.Item, function(el){ return (el.$).replace('.xmi', '')});
            }
        }
    }
    
    
    return fsd;
});