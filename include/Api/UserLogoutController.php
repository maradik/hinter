<?php
    namespace Maradik\Hinter\Api;    
    
    use Maradik\Testing\BaseData;
    use Maradik\Testing\BaseRepository; 
    use Maradik\User\UserCurrent; 
    use Maradik\User\UserData;
    use Maradik\Hinter\Core\HttpResponseCode;
    use Maradik\Hinter\Core\RepositoryFactory;    
    
    class UserLogoutController extends UserController
    {
        protected function api_post(array $args = array())
        {
            $this->user->logout();
            $this->setResponseData($this->packEntity($this->user->data()));            
        }                                                                       
    }    