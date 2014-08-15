{extends 'page.tpl'}

{block 'title'}О проекте HintOk{/block}

{block 'content'}
	<div class="row">
		<div class="col-md-12">
			<!--
			<h1><span class="glyphicon glyphicon-info-sign"></span> О проекте HintOk</h1>
			-->
			<div class="panel panel-default">
				<div class="panel-heading">
					<h2 class="panel-title"><span class="glyphicon glyphicon-exclamation-sign"></span> И не останется больше вопросов...</h2>
				</div>
				<div class="panel-body">				
					<div class="row">
						<div class="col-sm-2 col-xs-3">
							<img src="/uploads/default.png" title="HintOk - помощник во всем!" class="img-responsive" />
						</div>
						<div class="col-sm-10 col-xs-9">			
							<p>
								<strong>Hint<span class="text-success">Ok</span></strong> - сервис поиска <strong><span class="text-success">оптимальных ответов</span></strong> на ежедневные вопросы!
							</p>
							<p>
								<strong>Hint<span class="text-primary">Ok</span></strong> - содержит <strong><span class="text-primary">множество подсказок</span></strong> на различные тематики!
							</p>			
							<p>
								<strong>Hint<span class="text-danger">Ok</span></strong> - не каталог статей, а <strong><span class="text-danger">живой интерактивный сервис</span></strong>!
							</p>	
							<p>
								<strong>Hint<span class="text-warning">Ok</span></strong> - подсказки создаются <strong><span class="text-warning">посетителями</span></strong>!
							</p>
						</div>				
					</div>	
				</div>
			</div>		
			<div class="row">
				<div class="col-lg-6 col-lg-offset-3 col-md-8 col-md-offset-2 col-sm-8 col-sm-offset-2 col-xs-10 col-xs-offset-2">
					<ul class="list-group">
					  	<li class="list-group-item list-group-item-danger">
					  		<h4 class="list-group-item-heading">Вас волнует вопрос</h4>			  		
					  		<p class="list-group-item-text">Что подарить девушке?</p>
					  	</li>
					  	<li class="list-group-item list-group-item-info">
					  		<h4 class="list-group-item-heading">Находите на HintOk <a href="/question/8" title="Что подарить девушке?" style="text-decoration: underline;">подсказку</a></h4>			  		
					  		<p class="list-group-item-text">Что подарить девушке?</p>
					  	</li>
					  	<li class="list-group-item list-group-item-warning">
					  		<h4 class="list-group-item-heading">Отвечаете на наводящие вопросы</h4>
					  		<ol class="list-group-item-text">
					  			<li>Требуется эксклюзивный подарок?</li>
					  			<li>Должен ли подарок быть полезным?</li>
					  			<li>Какой характер у девушки?</li>
					  			<li>...</li>
					  		</ol>
					  	</li>
					  	<li class="list-group-item list-group-item-success">
					  		<h4 class="list-group-item-heading">Получаете оптимальный ответ!</h4>
					  		<p class="list-group-item-text">Прыжок с парашютом <span class="glyphicon glyphicon-thumbs-up"></span></p>
					  	</li>			  	
					</ul>	
				</div>
			</div>				
			
			<div class="embed-responsive embed-responsive-16by9">				
				<iframe class="embed-responsive-item" src="//www.youtube.com/embed/e2pvfY_2jwo?vq=large&showinfo=0&rel=0&border=1&fs=1"></iframe>
			</div>				
	
			<div class="top10">	
				<noindex>
					<address>
						<strong><span class="glyphicon glyphicon-envelope"></span> Команда HintOk</strong><br>							
						<abbr title="В любое время дня и ночи :)">Почта:</abbr> <a href="mailto:{$info_s.admin_email}">{$info_s.admin_email}</a>
					</address>
				</noindex>	
			</div>	
		</div>		
	</div>		
{/block}


