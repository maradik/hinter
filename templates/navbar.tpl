<div class="navbar navbar-default" role="navigation">
  <div id="navbar-block" class="container-fluid">
    <!-- Brand and toggle get grouped for better mobile display -->
    <div class="navbar-header">
    	<button type="button" class="navbar-toggle" title="Развернуть меню" data-toggle="collapse" data-target="#bs-navbar-collapse-1">
    		<span class="sr-only">Развернуть меню</span>
    		<span class="icon-bar"></span>
    		<span class="icon-bar"></span>    		
    		<span class="icon-bar"></span>    		
    	</button>
      	<a class="navbar-brand" href="/">
      		<img class="img-responsive" src="/uploads/logo.png" alt="HintOk.RU" title="HintOk.RU" />
      	</a>
      	<p class="navbar-text hidden-md hidden-sm"><em>Поможем в любом вопросе!</em></p>
    </div>

    <!-- Collect the nav links, forms, and other content for toggling -->
    <div class="collapse navbar-collapse" id="bs-navbar-collapse-1">
      <!--
      <ul class="nav navbar-nav">
      	<li><a href="/" title="Перейти на главную">Главная</a></li>
        <li><a href="/question/create" title="Помочь другим людям">Создать решение!</a></li>
      </ul>
      -->
      <div class="navbar-form navbar-left">
          	<a href="/" class="btn btn-default" title="Перейти на главную">
          		<span class="glyphicon glyphicon-home"></span> Главная
          	</a>
	        <span class="dropdown">
	            <a href="#" class="btn btn-default dropdown-toggle" data-toggle="dropdown"><span class="glyphicon glyphicon-folder-open"></span>&nbsp;&nbsp;Категории <span class="caret"></span></a>
	            <ul class="dropdown-menu" role="menu">
	            	{foreach $categoryList as $category}
					<li{if $clearUri == "/category/{$category->id}"} class="active"{/if}>
						<a href="/category/{$category->id}" title="{$category->description|truncate:40:'...'|e:'HTML'}">
							{$category->title|e:'HTML'}
						</a>
					</li>	       
					{/foreach}     
	            </ul>
	        </span>            	
      	  	<a href="/question/create" class="btn btn-primary" title="Помочь другим людям" data-bind="visible: true || isRegisteredUser()">
      	  		<span class="glyphicon glyphicon-plus"></span> Создать подсказку!
      	  	</a>
          	<a href="/about" class="btn btn-default" title="Зачем нужен HintOk?">
          		<span class="glyphicon glyphicon-info-sign"></span> О проекте
          	</a>    
      </div>
      <form class="navbar-form navbar-right">
      	  <fieldset data-bind="disable: UserData().Locked()">
	      	<div data-bind="visible: !isRegisteredUser()">
	      		<div data-bind="visible: FormLoginVisible()">
			        <div class="form-group">
			          <input name="login" type="text" size="10" class="form-control" placeholder="Имя" data-bind="value: UserData().Login">
			        </div>
			        <div class="form-group">
			          <input name="password" type="password" size="10" class="form-control" placeholder="Пароль" data-bind="value: UserData().Password">
			        </div>
			        <button class="btn btn-primary" title="Войти под своим именем" data-bind="click: login">Войти</button>
			        <button class="btn btn-danger" title="Быстрая регистрация в один клик!" data-bind="click: register">Новый</button>
			    </div>
			    <div data-bind="visible: !FormLoginVisible()">
			    	<button class="btn btn-primary" title="Войти под своим именем" data-bind="click: function(){ FormLoginVisible(true); }"><span class="glyphicon glyphicon-log-in"></span>&nbsp;&nbsp;Войти</button>
			    </div>
		    </div>
			<div data-bind="visible: isRegisteredUser()">	    
		        <div class="form-group">
					Здравствуйте, <strong><span class="text-danger" data-bind="text: UserData().Login"></span></strong>				
		        </div>
    	        <span class="dropdown hidden-xs">
		            <a href="#" class="btn btn-primary btn-navbar-onlyicon dropdown-toggle" data-toggle="dropdown"><span class="glyphicon glyphicon-cog"></span></a>
		            <ul class="dropdown-menu" role="menu">
			            <li>
						  	<a href="/admin/question" title="Список подсказок" data-bind="visible: isAdmin()">
						  		<span class="glyphicon glyphicon-list-alt"></span> Список
						  	</a> 	            	
						</li>
			            <li>
				  		  	<a href="/admin/flushcache" title="Сбросить системный кэш" data-bind="visible: isAdmin()">
						  		<span class="glyphicon glyphicon-refresh"></span> Кэш
						  	</a> 	            	
			            </li>
			            <li class="divider" data-bind="visible: isAdmin()"></li>		            	
			            <li>
						  	<a href="/user/question" title="Список подсказок">
						  		<span class="glyphicon glyphicon-list-alt"></span> Мои подсказки
						  	</a> 	            	
						</li>
						<li class="divider"></li>
			            <li>
				  		  	<a href="#" title="Завершить работу под своим именем" data-bind="click: logout">
						  		<span class="glyphicon glyphicon-off"></span> Выйти
						  	</a> 	            	
			            </li>
		            </ul>
		        </span>  
		        
		        <span class="visible-xs">
			        <span data-bind="visible: isAdmin()">
					  	<a href="/admin/question" class="btn btn-danger" title="Список подсказок">
					  		<span class="glyphicon glyphicon-list-alt"></span> Список
					  	</a> 	            					
			  		  	<a href="/admin/flushcache" class="btn btn-danger" title="Сбросить системный кэш">
					  		<span class="glyphicon glyphicon-refresh"></span> Кэш
					  	</a> 	            	
				    </span> 	        			        	
				  	<a href="/user/question" class="btn btn-primary" title="Список подсказок">
				  		<span class="glyphicon glyphicon-list-alt"></span> Мои подсказки
				  	</a> 	            							
		  		  	<a href="#" class="btn btn-default" title="Завершить работу под своим именем" data-bind="click: logout">
				  		<span class="glyphicon glyphicon-off"></span> Выйти
				  	</a> 	
			  	</span>	        
		    </div> 
		  </fieldset>
	  </form>	 
    </div><!-- /.navbar-collapse -->
  </div><!-- /.container-fluid -->
</div>	

<script type="text/javascript">
	var CurrentUserVM;
	$(document).ready(function () {
		CurrentUserVM = new Hinter.CurrentUserVM({json_encode($userData)});
		CurrentUserVM.bind('bs-navbar-collapse-1');		
	});	
</script>