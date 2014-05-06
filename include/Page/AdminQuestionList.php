<?php

    namespace Maradik\Hinter\Page;
    
    use Maradik\Testing\Query;
    
    class AdminQuestionList extends ResourcePageSidebar
    {
        protected function request_get(array $args = array())
        {
            $this->setTemplate("admin_mainquestionlist.tpl");
        }
        
        /**
         * @return int Минимальная роль, которой доступна страница (из констант Maradik\User\UserRoles)
         */
        protected function needUserRole()
        {
            return \Maradik\User\UserRoles::ADMIN;
        }        
    }