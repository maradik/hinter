<nav class="navbar navbar-default" role="navigation">
  <div class="container-fluid">
    <!-- Brand and toggle get grouped for better mobile display -->
    <div class="navbar-header">
      <a class="navbar-brand" href="/">Hinter.RU</a>
      <p class="navbar-text"><em>Поможет в любом вопросе!</em></p>
    </div>

    <!-- Collect the nav links, forms, and other content for toggling -->
    <div class="collapse navbar-collapse" id="bs-navbar-collapse-1">
      <!--
      <ul class="nav navbar-nav">
        <li class="active"><a href="/">Главная</a></li>
      </ul>
      -->
      <div id="page-navbar-user-block">
	      <form class="navbar-form navbar-right" data-bind="visible: isRegisteredUser()">
	        <div class="form-group">
	          <input name="login" type="text" class="form-control" placeholder="Имя">
	          <input name="password" type="text" class="form-control" placeholder="Пароль">
	        </div>
	        <button type="submit" class="btn btn-default">Войти</button>
	      </form>
      </div>
    </div><!-- /.navbar-collapse -->
  </div><!-- /.container-fluid -->
</nav>	