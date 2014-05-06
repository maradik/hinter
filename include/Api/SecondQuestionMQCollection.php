<?php
    namespace Maradik\Hinter\Api;    
    
    use Maradik\Testing\BaseData;
    use Maradik\Testing\QuestionData;
    use Maradik\Testing\QuestionRepository;    
    use Maradik\User\UserCurrent;
    use Maradik\Hinter\Core\HttpResponseCode;
    use Maradik\Hinter\Core\RepositoryFactory; 
    use Maradik\Hinter\Core\IResource;    
    
    class SecondQuestionMQCollection extends SecondQuestionCollection implements IResource
    {
        public function __construct(RepositoryFactory $repositoryFactory, UserCurrent $user)
        {
            parent::__construct($repositoryFactory, $user);
            $this->repository = $repositoryFactory->getSecondQuestionRepository();
        }    
        
        protected function api_get(array $args = array())
        {
            //TODO учитывать $args
            $questionId = isset($this->resId[0]) ? (int) $this->resId[0] : 0; 
            $question = $this->repositoryFactory->getMainQuestionRepository()->getById($questionId);
            
            if (!empty($question)) {                                                                                                         
                $collection = $this->repository->getCollection(array('parentId' => $question->id));   
                $this->setResponseData($this->packCollection($collection));
            } else {
                $this->responseNotFound();                                
            }                     
        }        
        
        /**
         * @param BaseData $entity         
         * @return boolean
         */        
        protected function checkPermissionAppend(BaseData $entity)
        { 
            if (!($entity instanceof \Maradik\Testing\QuestionData)) {
                throw new \InvalidArgumentException(
                    'Неверный тип параметра $entity: ожидается \Maradik\Testing\QuestionData, получен '
                  . get_class($entity)
                );       
            }              
                      
            $this->setResponseCode(HttpResponseCode::FORBIDDEN); 
            return false;                                       //TODO временная заглушка по добавлению
            
            return true;
        }
    }    