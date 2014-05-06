<?php

    namespace Maradik\Hinter\Page;
    
    use Maradik\Testing\Query;
    use Maradik\Hinter\Core\Params;
    
    class AdminFlushCache extends ResourcePageSidebar
    {
        protected function request_get(array $args = array())
        {
            Params::put(Params::KEY_CACHE_ID, time());
            $this->getTemplateEngine()->clearAllCompiles();
            header('Location: /');
            exit(); 
        }
        
        /**
         * @return int Минимальная роль, которой доступна страница (из констант Maradik\User\UserRoles)
         */
        protected function needUserRole()
        {
            return \Maradik\User\UserRoles::ADMIN;
        }        
    }