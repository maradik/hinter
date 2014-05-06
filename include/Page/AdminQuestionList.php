<?php

    namespace Maradik\Hinter\Page;
    
    use Maradik\User\UserCurrent;
    use Maradik\Testing\Query;
    use Maradik\Hinter\Core\RepositoryFactory;
    use Maradik\Hinter\Core\IResource;
    
    class AdminQuestionList extends ResourcePageSidebar implements IResource
    {
        /**
         * @param RepositoryFactory $repositoryFactory
         * @param UserCurrent $user
         */
        public function __construct(
            RepositoryFactory   $repositoryFactory, 
            UserCurrent         $user
        ) {
            parent::__construct(
                $repositoryFactory, 
                $user, 
                \Maradik\User\UserRoles::ADMIN
            );  
        }          
        
        protected function request_get(array $args = array())
        {
            $this->setTemplate("admin_mainquestionlist.tpl");
        }
    }