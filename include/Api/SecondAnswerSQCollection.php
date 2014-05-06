<?php
    namespace Maradik\Hinter\Api;    
    
    use Maradik\Testing\BaseData;
    use Maradik\Testing\AnswerData;
    use Maradik\Testing\BaseRepository;
    use Maradik\Testing\AnswerRepository;
    use Maradik\Testing\QuestionRepository;      
    use Maradik\User\UserCurrent;
    use Maradik\Hinter\Core\HttpResponseCode;
    use Maradik\Hinter\Core\RepositoryFactory; 
    use Maradik\Hinter\Core\IResource; 
    
    class SecondAnswerSQCollection extends SecondAnswerCollection implements IResource
    {                           
        public function __construct(
            RepositoryFactory $repositoryFactory, 
            UserCurrent $user
        ) {
            parent::__construct($repositoryFactory, $user);
            $this->repository = $repositoryFactory->getSecondAnswerRepository();
        }        
        
        protected function api_get(array $args = array())
        {
            //TODO учитывать $args
            $questionId = isset($this->resId[0]) ? (int) $this->resId[0] : 0; 
            $question = $this->repositoryFactory->getSecondQuestionRepository()->getById($questionId);
            
            if (!empty($question)) {                                                                                                         
                $collection = $this->repository->getCollection(array('questionId' => $question->id));   
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
            if (!($entity instanceof \Maradik\Testing\AnswerData)) {
                throw new \InvalidArgumentException(
                    'Неверный тип параметра $entity: ожидается \Maradik\Testing\AnswerData, получен '
                  . get_class($entity)
                );       
            }              
                      
            $this->setResponseCode(HttpResponseCode::FORBIDDEN); 
            return false;                                       //TODO временная заглушка по добавлению
            
            return true;
        }                
    }    