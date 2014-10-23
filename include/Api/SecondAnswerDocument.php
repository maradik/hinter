<?php
    namespace Maradik\Hinter\Api;    
    
    use Maradik\Testing\BaseData;
    use Maradik\Testing\AnswerData;
    use Maradik\Testing\AnswerRepository;
    use Maradik\User\UserCurrent;
    use Maradik\Hinter\Core\HttpResponseCode;
    use Maradik\Hinter\Core\RepositoryFactory; 
    use Maradik\Hinter\Core\IResource;
    
    class SecondAnswerDocument extends MainAnswerDocument implements IResource
    {
        public function __construct(RepositoryFactory $repositoryFactory, UserCurrent $user)
        {
            parent::__construct($repositoryFactory, $user);
            $this->repository = $repositoryFactory->getSecondAnswerRepository(); 
        } 
        
        /**
         * @param BaseData $entity         
         * @return boolean
         */        
        protected function checkPermissionUpdate(BaseData $entity)
        {
            if (!($entity instanceof \Maradik\Testing\AnswerData)) {
                throw new \InvalidArgumentException(
                    'Неверный тип параметра $entity: ожидается \Maradik\Testing\AnswerData, получен '
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
                    ->query()
                    ->join($this->repositoryFactory->getSecondQuestionRepository())
                    ->addLinkFields('id', 'parentId')
                    ->addFilterField('id', $entity->questionId)
                    ->getOneEntity();
    
                if (empty($parentEntity)) {
                    $this->addResponseMessage('Некорректная ссылка на вопрос!', self::MESS_ERROR);
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