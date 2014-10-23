<?php

    namespace Maradik\Hinter\Page;
    
    use Maradik\Hinter\Core\RepositoryFactory;
    use Maradik\Hinter\Core\IResource;
    use Maradik\User\UserCurrent;
    use Maradik\Hinter\Core\HttpResponseCode;
    
    class PageQuestionEdit extends ResourcePageSidebar implements IResource
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
            $mqId = !empty($this->resId[0]) ? (int) $this->resId[0] : 0; 
            $mq = null;
            
            if (!empty($mqId)) {                    
                $mq = $this->repositoryFactory->getMainQuestionRepository()->getById($mqId);                                     
            }
            
            if (empty($mqId) || empty($mq)) {                
                $this->setTemplate("page_404.tpl");
                $this->responseNotFound();
            } elseif ($mq->userId != $this->user->data()->id && !$this->user->isAdmin()) {
                $this->setTemplate("page_accessdeny.tpl"); 
                $this->setResponseCode(HttpResponseCode::FORBIDDEN);
            } else {
                $this->addResponseData(
                    'mainQuestionId',
                    $mq->id
                );                            
                $this->setTemplate("page_question_create.tpl");
            }  
        }      
    }
