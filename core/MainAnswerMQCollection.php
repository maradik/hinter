<?php
    namespace Maradik\HinterApi;    
    
    use Maradik\Testing\BaseData;
    use Maradik\Testing\AnswerData;
    use Maradik\Testing\BaseRepository;
    use Maradik\Testing\AnswerRepository;
    use Maradik\Testing\QuestionRepository;      
    use Maradik\User\UserCurrent;
    use Maradik\HinterApi\RepositoryFactory;
    
    class MainAnswerMQCollection extends MainAnswerCollection
    {                           
        public function __construct(
            RepositoryFactory $repositoryFactory, 
            UserCurrent $user
        ) {
            parent::__construct($repositoryFactory, $user);
        }        
        
        protected function api_get(array $args = array())
        {            
            $questionId = isset($this->resId[0]) ? (int) $this->resId[0] : 0; 
            $question = $this->repositoryFactory->getMainQuestionRepository()->getById($questionId);
            
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