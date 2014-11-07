<div>
	<h1>Для продолжения войдите</h1>
	<form id="fullloginform" class="form-horizontal" role="form">
		<fieldset data-bind="disable: UserData().Locked()">
			<div data-bind="visible: !isRegisteredUser(), with: UserData">
		        <div class="form-group" data-bind="css: Login.hasError() ? 'has-error' : 'has-success'">
		        	<label for="inputLoginFormLogin" class="control-label col-sm-3 col-xs-12">Пользователь</label>
		        	<div class="col-sm-4 col-xs-6">
		        		<input id="inputLoginFormLogin" name="login" type="text" size="10" class="form-control" placeholder="Имя" data-bind="value: Login">
		        	</div>
		        	<div class="col-sm-5 col-xs-6">
		        		<div class="small text-danger top5" data-bind="text: Login.validationMessage(), visible: Login.validationMessage()"></div>
		        	</div>
		        </div>
		        <div class="form-group" data-bind="css: Password.hasError() ? 'has-error' : 'has-success'">
		        	<label for="inputLoginFormPassword" class="control-label col-sm-3 col-xs-12">Пароль</label>
		        	<div class="col-sm-4 col-xs-6">
		        		<input id="inputLoginFormPassword" name="password" type="password" size="10" class="form-control" placeholder="Пароль" data-bind="value: Password">
		        	</div>
		        	<div class="col-sm-5 col-xs-6">
		        		<div class="small text-danger top5" data-bind="text: Password.validationMessage(), visible: Password.validationMessage()"></div>
		        	</div>
		        </div>
		        <div class="form-group">
		        	<div class="col-sm-offset-3 col-sm-9">
				        <button class="btn btn-primary" title="Войти под своим именем" data-bind="click: $parent.login">Войти</button>
				        <button class="btn btn-danger" title="Быстрая регистрация в один клик!" data-bind="click: $parent.register">Быстрая регистрация!</button>
			    	</div>
		        </div>
		    </div>
			<div data-bind="visible: isRegisteredUser()">	    
	        	<div class="alert alert-info">
					Здравствуйте, <strong><span class="text-danger" data-bind="text: UserData().Login"></span></strong>
				</div>				
		        <div>
		        	<img src="/uploads/loading2.gif" alt="Загрузка..." title="Загрузка..." /> Загрузка страницы...
		        </div>
			</div>
		</fieldset>
	</form>			
</div>	

<script type="text/javascript">
	$(document).ready(function () {
		if (typeof CurrentUserVM != 'undefined') {
			CurrentUserVM.bind('fullloginform');
		}		
	});	
</script>