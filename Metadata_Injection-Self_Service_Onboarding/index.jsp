<!DOCTYPE html>
<html>
<head>

<script type="text/javascript" src="js/jquery-1.11.1.min.js"></script>
<script type="text/javascript" src="js/jquery-ui-1.11.1.min.js"></script>
<script type="text/javascript" src="js/jquery.appendGrid-1.6.2.js"></script>
<script type="text/javascript" src="js/script.js"></script>

<link rel="stylesheet" type="text/css" href="css/jquery-ui.structure.min.css"/>
<link rel="stylesheet" type="text/css" href="css/jquery-ui.theme.min.css"/>
<link rel="stylesheet" type="text/css" href="css/jquery.appendGrid-1.6.2.css"/>
<link type="text/css" rel="stylesheet" href="css/master.css" media="all" />
<link type="text/css" rel="stylesheet" href="css/custom.css" media="all" />

</head>

<body>
<h1>HR SaaS File Upload </h1>

<div class="customer_name"><h2></h2></div>

<!--Form-->
<div class="custom-form">
	<form accept-charset="UTF-8" action="onboard.jsp" method="POST" enctype="multipart/form-data">
		<input class="customer_hidden" type="hidden" name="customer" value=""/>

		<h4>File Type</h4>
		<!--File Type-->
		<div class="form-item form-type-select form-item-file-type">
		  <label>File Type</label>
		 	<select name="file_type" class="form-select required">
		 		<option value="" selected="selected">- Select -</option>
		 		<option value="employee">Employee</option>
		 		<option value="department">Department</option>
		 	</select>
		</div>

		<h4>Mapping</h4>

		<!--Delimiter-->
		<div class="form-item form-type-select">
		  <label>Delimiter</label>
		 	<select name="delimiter" class="form-select required">
		 		<option value="" selected="selected">- Select -</option>
		 		<option value=",">Comma</option>
		 		<option value="$[09]">Tab</option>
		 		<option value=";">Semicolon</option>
		 		<option value="$[32]">Space</option>
		 	</select>
		</div>

		<!--Has Header-->

		<div class="form-item form-type-checkbox">
 			<input type="checkbox" name="has_header" value="1" class="form-checkbox">  
 			<label class="option">Has Header?</label>
		</div>

		<!--Grid-->
		<div class="form-item">
		  <label>&nbsp;</label>
				<table id="tblAppendGrid">
				</table>
		</div>

		<!--File Upload-->
		<div class="field-type-file form-wrapper">
			<div>
				<div class="form-item form-type-managed-file">
  				<label>File Upload </label>
 					<div class="file-widget form-managed-file clearfix">
 						<input type="file" name="file_attachment" size="22" class="form-file">
 						<!--<input type="submit" name="file_attachment_upload_button" value="Upload" class="form-submit">-->
					</div>
				</div>
			</div>
		</div>

		<!--Go Button -->
		<input class="btn btn-large btn-primary form-submit" type="submit" name="op" value="Go">

	</form>
</div>
</body>
</html>