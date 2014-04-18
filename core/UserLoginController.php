<?php
    namespace Maradik\HinterApi;    
    
    use Maradik\Testing\BaseData;
    use Maradik\Testing\BaseRepository; 
    use Maradik\User\UserCurrent; 
    use Maradik\User\UserData;
    
    class UserLoginController extends UserController
    {
        protected function api_post(array $args = array())
        {
            $userData = $this->unpackEntity($args);
            
            if (!$this->user->login($userData->login, $userData->password)) {
                $this->addResponseMessage($this->user->errorInfo());
                $this->setResponseCode(HttpResponseCode::INTERNAL_SERVER_ERROR);
            }
            
            $this->setResponseData($this->packEntity($this->user->data()));            
        }                                                                       
    }    