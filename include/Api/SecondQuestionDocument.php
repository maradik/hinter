<?php
    namespace Maradik\Hinter\Api;    
    
    use Maradik\Testing\BaseData;
    use Maradik\Testing\QuestionData;
    use Maradik\Testing\QuestionRepository;
    use Maradik\User\UserCurrent;
    use Maradik\Hinter\Core\HttpResponseCode;
    use Maradik\Hinter\Core\RepositoryFactory; 
    use Maradik\Hinter\Core\IResource;
    
    class SecondQuestionDocument extends MainQuestionDocument implements IResource
    {
        public function __construct(RepositoryFactory $repositoryFactory, UserCurrent $user)
        {
            parent::__construct($repositoryFactory, $user);
            $this->repository = $repositoryFactory->getSecondQuestionRepository();
        }             
        
        /**
         * @param BaseData $entity         
         * @return boolean
         */        
        protected function checkPermissionUpdate(BaseData $entity)
        {
            if (!($entity instanceof \Maradik\Testing\QuestionData)) {
                throw new \InvalidArgumentException(
                    'Неверный тип параметра $entity: ожидается \Maradik\Testing\QuestionData, получен '
                  . get_class($entity)
                );       
            }              
            
            if (!$this->user->isRegisteredUser()) {
                $this->setResponseCode(HttpResponseCode::UNATHORIZED);
                return false;
            }              
            
            if ($entity->userId != $this->user->data()->id && !$this->user->isAdmin()) {
                $parentEntity = $this->repositoryFactory
                    ->getMainQuestionRepository()
                    ->getById($entity->parentId);    
    
                if (empty($parentEntity)) {
                    $this->addResponseMessage('Некорректная ссылка на основной вопрос!', self::MESS_ERROR);
                    $this->setResponseCode(HttpResponseCode::INTERNAL_SERVER_ERROR);  
                    return false;
                } 
                     
                if ($parentEntity->userId != $this->user->data()->id) {
                    $this->setResponseCode(HttpResponseCode::FORBIDDEN);
                    return false;
                }                  
            }            
            
            return true;
        }                
    }    