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
    
    class MainAnswerSACollection extends MainAnswerCollection implements IResource
    {                           
        public function __construct(
            RepositoryFactory $repositoryFactory, 
            UserCurrent $user
        ) {
            parent::__construct($repositoryFactory, $user);
        }        
        
        protected function api_get(array $args = array())
        {
            //TODO учитывать $args

            $secondAnswerId = isset($this->resId[0]) ? (int) $this->resId[0] : 0; 
            $secondAnswer = $this->repositoryFactory->getSecondAnswerRepository()->getById($secondAnswerId);
            
            if (!empty($secondAnswer)) {             
                $answerRels = $this->repositoryFactory
                    ->getRelAnswerRepository()
                    ->getCollection(array('parentId' => $secondAnswerId));
                
                $collection = array();
                foreach ($answerRels as $relElement) {
                    $mainAnswer = $this->repository->getById($relElement->childId);      
                    if ($mainAnswer) {
                        $collection[] = $mainAnswer;   
                    } else {
                        $this->repositoryFactory->getRelAnswerRepository()->delete($answerRels->id);    
                    }
                }            
                                                                                                                           
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