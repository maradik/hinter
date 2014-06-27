<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN"
"http://www.w3.org/TR/html4/loose.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
	<head>
		<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
		
		<link rel="shortcut icon" href="/favicon.png" type="image/png">
		
		<link rel="stylesheet" type="text/css" href="/styles/bootstrap/3.1.1/css/bootstrap.min.css?cid={$cache_id}">
		<link rel="stylesheet" type="text/css" href="/styles/styles.css?cid={$cache_id}">
		<link rel="stylesheet" type="text/css" href="/scripts/shadowbox-3.0.3/shadowbox.css?cid={$cache_id}">
		
		<script type="text/javascript" src="/scripts/jquery-1.11.0.min.js?cid={$cache_id}"></script>
		<script type="text/javascript" src="/styles/bootstrap/3.1.1/js/bootstrap.min.js?cid={$cache_id}"></script>
		<script type="text/javascript" src="/scripts/knockout-3.1.0.js?cid={$cache_id}"></script>
		<script type="text/javascript" src="/scripts/knockout.mapping-latest.js?cid={$cache_id}"></script>
		<script type="text/javascript" src="/scripts/hinter.js?cid={$cache_id}"></script>
		<script type="text/javascript" src="/scripts/shadowbox-3.0.3/shadowbox.js?cid={$cache_id}"></script>
		<script type="text/javascript">Shadowbox.init();</script>
		<script type="text/javascript" src="https://vk.com/js/api/share.js?90" charset="windows-1251"></script>
		<script type="text/javascript" src="https://vk.com/js/api/openapi.js?113" charset="windows-1251"></script>
		
		<title>{block 'title'}HintOk{/block}</title>
	</head>
	<body>
		{block 'page'}
			<div class="container">		
			
				{include 'navbar.tpl'}
						
				<div class="row" id="page-content-block">
					<div class="col-md-9">
						{include 'block_messages.tpl'}
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