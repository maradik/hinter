<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN"
"http://www.w3.org/TR/html4/loose.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
	<head>
		<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
		
		<link rel="stylesheet" href="/styles/bootstrap/3.1.1/css/bootstrap.min.css">
		<link rel="stylesheet" href="/styles/styles.css">
		
		<script src="/scripts/jquery-1.11.0.min.js"></script>
		<script src="/styles/bootstrap/3.1.1/js/bootstrap.min.js"></script>
		<script src="/scripts/knockout-3.1.0.js"></script>
		<script src="/scripts/knockout.mapping-latest.js"></script>
		<script src="/scripts/hinter.js"></script>
		
		<title>Hinter</title>
	</head>
	<body>
		{block 'page'}
			<div class="container">		
			
				{include 'navbar.tpl'}
						
				<div class="row" id="page-content-block">
					<div class="col-md-9">
						{block 'content'}{/block}
					</div>
					
					<div class="col-md-3">
						{include 'sidebar.tpl'}	
					</div>				
				</div>
			</div>		
			
			{include 'footer.tpl'}		
		{/block}
		
		{include 'messages.tpl'}
				
		{block 'scripts'}{/block}	
	</body>
</html>