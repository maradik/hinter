<?php
    namespace Maradik\Hinter\Api;    
    
    use Maradik\Testing\BaseData;
    use Maradik\Testing\AnswerData;
    use Maradik\Testing\RelData;
    use Maradik\Testing\RelRepository;    
    use Maradik\User\UserCurrent;
    use Maradik\Hinter\Core\HttpResponseCode;
    use Maradik\Hinter\Core\RepositoryFactory; 
    use Maradik\Hinter\Core\IResource; 
    
    abstract class SecondAnswerRelController extends ResourceController implements IResource
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
                    if (!empty($args)) {
                        $this->repository->transactionBegin();
                        if (!$this->prepareRel($secondAnswer)) {
                            $this->setResponseCode(HttpResponseCode::INTERNAL_SERVER_ERROR);
                            $this->repository->transactionRollBack();
                            return;                            
                        }                        
                        foreach ($args as $mainAnswerArgs) {
                            $mainAnswer = $this->unpackEntity($mainAnswerArgs);
                            if ($mainAnswer) {
                              $mainAnswer = $this->repositoryFactory->getMainAnswerRepository()->getById($mainAnswer->id);  
                            }    
                            $secondQuestion = $this
                                ->repositoryFactory
                                ->getSecondQuestionRepository()
                                ->getById($secondAnswer->questionId);                                            
                            
                            if ($mainAnswer && $secondQuestion && $secondQuestion->parentId == $mainAnswer->questionId) {
                                if (!$this->updateRel($secondAnswer, $mainAnswer)) {
                                    $this->setResponseCode(HttpResponseCode::INTERNAL_SERVER_ERROR);
                                    $this->repository->transactionRollBack();
                                    return;
                                }
                            } else {
                                $this->setResponseCode(HttpResponseCode::BAD_REQUEST);
                                $this->repository->transactionRollBack();
                                return;
                            } 
                        }
                        $this->repository->transactionCommit();
                        $collection = $this
                            ->repository
                            ->query()
                            ->setHidden()
                            ->addFilterField('parentId', $secondAnswerId)
                            ->join($this->repositoryFactory->getMainAnswerRepository())
                            ->addLinkFields('childId', 'id')
                            ->get();
                        $this->setResponseData($this->packCollection(array_map('array_shift', $collection)));
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
                      
            // check SecondAnswer ONLY!!!!          
            if ($entity->userId != $this->user->data()->id && !$this->user->isAdmin()) {
                $parentEntity = $this->repositoryFactory
                    ->getMainQuestionRepository()
                    ->query()
                    ->join($this->repositoryFactory->getSecondQuestionRepository())
                    ->addLinkFields('id', 'parentId')
                    ->addFilterField('id', $entity->questionId)
                    ->getOneEntity();
    
                if (empty($parentEntity) || $parentEntity->userId != $this->user->data()->id) {
                    $this->setResponseCode(HttpResponseCode::FORBIDDEN);
                    return false;
                }    
            }                               
            
            return true;
        }          
        
        /**
         * @param BaseData[] $entity         
         * @return array
         */        
        protected function packCollection(array $collection)
        {
            $ret = array();         
            foreach ($collection as $key => $val) {
                $ret[$key] = $this->packEntity($val);  
            }            
            
            return $ret;
        }      
        
         
        /*
         * @param AnswerData $entity         
         * @return array
         */        
        protected function packEntity(AnswerData $entity)
        {
            return $entity->jsonSerialize(); //TODO Переделать в JSON!
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
        
        /**
         * @param AnswerData $secondAnswer
         * @return boolean
         */
        protected function prepareRel(AnswerData $secondAnswer)
        {
            return true;    
        }  
        
        /**
         * @param AnswerData $secondAnswer
         * @param AnswerData $mainAnswer
         * @return boolean
         */
        abstract protected function updateRel(AnswerData $secondAnswer, AnswerData $mainAnswer); 
    }    