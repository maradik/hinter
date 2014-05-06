<?php

    namespace Maradik\Hinter\Page;
    
    use Maradik\Hinter\Core\RepositoryFactory;
    use Maradik\Hinter\Core\IResource;
    use Maradik\User\UserCurrent;
    
    class PageQuestionCreate extends ResourcePageSidebar implements IResource
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
                \Maradik\User\UserRoles::USER
            );  
        }         
        
        protected function request_get(array $args = array())
        {
            $this->setTemplate("page_question_create.tpl");  
        }      
    }
