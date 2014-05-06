<?php
    namespace Maradik\Hinter\Api;    
    
    use Maradik\Testing\BaseData;
    use Maradik\Testing\BaseRepository; 
    use Maradik\User\UserCurrent; 
    use Maradik\User\UserData;
    use Maradik\Hinter\Core\HttpResponseCode;
    use Maradik\Hinter\Core\RepositoryFactory;    
    
    class UserLoginController extends UserController
    {
        protected function api_post(array $args = array())
        {
            $userData = $this->unpackEntity($args);
            
            if (!$this->user->login($userData->login, $userData->password)) {
                if ($this->user->errorCode()) {
                    $this->addResponseMessage(
                        $this->user->errorInfo(), 
                        self::MESS_ERROR
                    );
                } else {
                    $this->addResponseMessage(
                        'Неверное имя пользователя или пароль!', 
                        self::MESS_WARNING
                    );
                }
                $this->setResponseCode(HttpResponseCode::INTERNAL_SERVER_ERROR);
            }
            
            $this->setResponseData($this->packEntity($this->user->data()));            
        }                                                                       
    }    