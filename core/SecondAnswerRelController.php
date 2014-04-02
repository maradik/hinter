<?php
    namespace Maradik\HinterApi;    
    
    use Maradik\Testing\BaseData;
    use Maradik\Testing\AnswerData;
    use Maradik\Testing\RelData;
    use Maradik\Testing\RelRepository;    
    use Maradik\User\UserCurrent;    
    
    abstract class SecondAnswerRelController extends ResourceController
    {
        public function __construct(RepositoryFactory $repositoryFactory, UserCurrent $user)
        {
            parent::__construct($repositoryFactory, $repositoryFactory->getRelAnswerRepository(), $user);
        }    
        
        protected function api_post(array $args = array())
        {
            $secondAnswerId = !empty($this->resId[0]) ? (int) $this->resId[0] : 0;
            $secondAnswer = $this->repositoryFactory->getSecondAnswerRepository()->getById($secondAnswerId);
                                            
            if ($secondAnswer) {                
                if ($this->checkPermission($secondAnswer)) {
                    $mainAnswer = $this->unpackEntity($args);
                    if ($mainAnswer) {
                      $mainAnswer = $this->repositoryFactory->getMainAnswerRepository()->getById($mainAnswer->id);  
                    }    
                    $secondQuestion = $this
                        ->repositoryFactory
                        ->getSecondQuestionRepository()
                        ->getById($secondAnswer->questionId);                                            
                    
                    if ($mainAnswer && $secondQuestion && $secondQuestion->parentId == $mainAnswer->questionId) {
                        if ($this->checkPermission($mainAnswer)) {
                            $this->updateRel($secondAnswer, $mainAnswer);
                        }
                    } else {
                        $this->setResponseCode(HttpResponseCode::BAD_REQUEST);
                    } 
                }
            } else {
                $this->responseNotFound();
            }            
        }                             
         
        /**
         * @param BaseData $entity         
         * @return boolean
         */        
        protected function checkPermission(BaseData $entity)
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
                      
            if ($entity->userId != $this->user->data()->id &&
                !$this->user->isAdmin()) {
                $this->setResponseCode(HttpResponseCode::FORBIDDEN);
                return false;
            } 
            
            return true;
        }                                                
        
        /**
         * @param array $data         
         * @return BaseData
         */        
        protected function unpackEntity(array $data)
        {
            $ret = new AnswerData();
            $ret->id = !empty($data['id']) ? (int) $data['id'] : 0;
            return $ret;
        }            
        
        abstract protected function updateRel(AnswerData $secondAnswer, AnswerData $mainAnswer); 
    }    