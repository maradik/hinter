<nav class="navbar navbar-default" role="navigation">
  <div id="navbar-block" class="container-fluid">
    <!-- Brand and toggle get grouped for better mobile display -->
    <div class="navbar-header">
    	<button type="button" class="navbar-toggle" title="Развернуть меню" data-toggle="collapse" data-target="#bs-navbar-collapse-1">
    		<span class="sr-only">Развернуть меню</span>
    		<span class="icon-bar"></span>
    		<span class="icon-bar"></span>
    		<span class="icon-bar"></span>
    	</button>
      	<a class="navbar-brand" href="/">Hinter.RU</a>
      	<p class="navbar-text"><em>Поможет в любом вопросе!</em></p>
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
          <a href="/" class="btn btn-default" title="Перейти на главную">Главная</a>
      	  <a href="/question/create" class="btn btn-primary" title="Помочь другим людям" data-bind="visible: isRegisteredUser()">Создать решение!</a>
      </div>
      <form class="navbar-form navbar-right">
      	  <fieldset data-bind="disable: UserData().Locked()">
	      	<div data-bind="visible: !isRegisteredUser()">
		        <div class="form-group">
		          <input name="login" type="text" size="15" class="form-control" placeholder="Имя" data-bind="value: UserData().Login">
		        </div>
		        <div class="form-group">
		          <input name="password" type="password" size="15" class="form-control" placeholder="Пароль" data-bind="value: UserData().Password">
		        </div>
		        <button class="btn btn-primary" data-bind="click: login">Войти</button>
		        <button class="btn btn-danger" data-bind="click: register">Новый</button>
		    </div>
			<div data-bind="visible: isRegisteredUser()">	    
		        <div class="form-group">
					Здравствуйте, <strong><span class="text-danger" data-bind="text: UserData().Login"></span></strong>				
		        </div>
				<button class="btn btn-default" data-bind="click: logout">Выйти</button>
		    </div> 
		  </fieldset>
	  </form>	 
    </div><!-- /.navbar-collapse -->
  </div><!-- /.container-fluid -->
</nav>	

<script type="text/javascript">
	$(document).ready(function () {
		CurrentUserVM = new Hinter.CurrentUserVM({json_encode($userData)});
		CurrentUserVM.bind('bs-navbar-collapse-1');
	});	
</script>