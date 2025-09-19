$(document).ready(function() {
	//Get Paramater from URL
	$.urlParam = function(name){
    var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.href);
    if (results==null){
      return '';
    }
    else{
      return results[1] || 0;
    }
	}
	
	//Set html in the customer-name div h3 to be the Parameter
	$('.customer_name h2').html(decodeURIComponent($.urlParam('customer')));

  //Set hiden field value to customer name
  $('.customer_hidden').val($.urlParam('customer'));

  //AppendGrid values for Mapping field
  $(function () {
    // Initialize appendGrid
    $('#tblAppendGrid').appendGrid({

        initRows: 1,
        columns: [
            { name: 'fieldname', display: 'Field Name', type: 'text', ctrlAttr: { maxlength: 100 }, ctrlCss: { width: '120px'} },
            { name: 'type', display: 'Type', type: 'select', ctrlOptions: { 'none': '-Select-', 'String': 'String', 'Number': 'Number', 'Date': 'Date'} },
            { name: 'length', display: 'Length', type: 'text', ctrlAttr: { maxlength: 50 }, ctrlCss: { width: '50px'} },
            
            { name: 'format', display: 'Format', type: 'select', ctrlOptions: { 0: '-Select-', 1: 'yyyy/MM/dd HH:mm:ss.SSS', 2: 'yyyy/MM/dd HH:mm:ss.SSS XXX', 3: 'yyyy/MM/dd HH:mm:ss', 4: 'yyyy/MM/dd HH:mm:ss XXX', 5: 'yyyyMMdd HHmmss', 6: 'yyyy/MM/dd', 7: 'yyyy-MM-dd', 8: 'yyyy-MM-dd HH:mm:ss', 9: 'yyyy-MM-dd HH:mm:ss XXX', 10: 'yyyyMMdd', 11: 'MM/dd/yyyy', 12: 'MM/dd/yyyy HH:mm:ss', 13: 'MM-dd-yyyy', 14: 'MM-dd-yyyy HH:mm:ss', 15: 'MM/dd/yy', 16: 'MM-dd-yy', 17: 'dd/MM/yyyy', 18: 'dd-MM-yyyy', 19: 'yyyy-MM-dd\'T\'HH:mm:ss:ss.SSSXXX'} },

            { name: 'currency', display: 'Currency', type: 'text', ctrlAttr: { maxlength: 60 }, ctrlCss: { width: '50px'} },
            { name: 'decimal', display: 'Decimal', type: 'text', ctrlAttr: { maxlength: 10 }, ctrlCss: { width: '50px'} },
            { name: 'grouping', display: 'Grouping', type: 'text', ctrlAttr: { maxlength: 10 }, ctrlCss: { width: '50px'} },
          
            { name: 'employee', display: 'Employee Field Map', type: 'select', ctrlOptions: { 'none': '-Select-', 'first_name': 'first_name', 'last_name': 'last_name', 'work_phone': 'work_phone', 'mobile_phone': 'mobile_phone', 'home_address1': 'home_address1', 'home_address2': 'home_address2', 'home_city': 'home_city', 'home_state': 'home_state', 'home_zip': 'home_zip', 'title': 'title', 'dept_name': 'dept_name', 'other1': 'other1', 'other2': 'other2', 'other3': 'other3'}, invisible: true },

            { name: 'department', display: 'Department Field Map', type: 'select', ctrlOptions: { 'none': '-Select-', 'dept_name': 'dept_name', 'parent_dept': 'parent_dept'}, invisible: true},

        ],
        hideButtons: { moveUp: true, moveDown: true, remove: true, insert:true }
    });
  });

  //Depending on what is selected in the dropdown, hide/show the last column
  $('.form-item-file-type select').on('change', function() {
    //If the option Employee is selected
    if(this.value == 'employee'){
      $('#tblAppendGrid').appendGrid('showColumn', 'employee');
      $('#tblAppendGrid').appendGrid('hideColumn', 'department');
    }
    //If the option Department is selected
    if(this.value == 'department'){
      $('#tblAppendGrid').appendGrid('showColumn', 'department');
      $('#tblAppendGrid').appendGrid('hideColumn', 'employee');
    }
  });
});