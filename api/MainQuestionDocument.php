<?php
    namespace Maradik\HinterApi;    
    
    use Maradik\Testing\BaseData;
    use Maradik\Testing\QuestionData;
    use Maradik\Testing\QuestionRepository;
    use Maradik\User\UserCurrent;
    use Maradik\HinterApi\RepositoryFactory;
    
    class MainQuestionDocument extends ResourceDocument
    {
        public function __construct(RepositoryFactory $repositoryFactory, UserCurrent $user)
        {
            parent::__construct($repositoryFactory, $repositoryFactory->getMainQuestionRepository(), $user);
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
            
            if (!$this->user->isAdmin() &&
                $entity->userId != $this->user->data()->id) {
                $this->setResponseCode(HttpResponseCode::FORBIDDEN);
                return false;
            }            
            
            return true;
        }           
        
        /**
         * @param BaseData $entity         
         * @return boolean
         */        
        protected function checkPermissionDelete(BaseData $entity)
        {
            return $this->checkPermissionUpdate($entity);
        } 
        
        /**
         * @param BaseData $entity         
         * @return array
         */        
        protected function packEntity(BaseData $entity)    
        {
            if (!($entity instanceof \Maradik\Testing\QuestionData)) {
                throw new \InvalidArgumentException(
                    'Неверный тип параметра $entity: ожидается \Maradik\Testing\QuestionData, получен '
                  . get_class($entity)
                );       
            }               
            
            return $entity->jsonSerialize(); //TODO Переделать в JSON!
        }
        
        /**
         * @param array $data         
         * @return BaseData
         */        
        protected function unpackEntity(array $data)
        {                          
            $ret = QuestionData::createFromJson($data); //TODO Переделать из JSON!  
            $ret->userId     = $this->user->data()->id;
            $ret->createDate = time();

            if (!$this->user->isAdmin()) {
                $ret->active = false;    
            }            
            
            return $ret;                        
        }        
        
        /**
         * @param BaseData $toEntity      
         * @param BaseData $fromEntity   
         */           
        protected function mergeEntities(BaseData $toEntity, BaseData $fromEntity)
        {
            if (!($toEntity instanceof \Maradik\Testing\QuestionData)) {
                throw new \InvalidArgumentException(
                    'Неверный тип параметра $toEntity: ожидается \Maradik\Testing\QuestionData, получен '
                  . get_class($toEntity)
                );       
            }   
                
            if (!($fromEntity instanceof \Maradik\Testing\QuestionData)) {
                throw new \InvalidArgumentException(
                    'Неверный тип параметра $fromEntity: ожидается \Maradik\Testing\QuestionData, получен '
                  . get_class($fromEntity)
                );       
            }                                     
                        
            $toEntity->title        = $fromEntity->title;
            $toEntity->description  = $fromEntity->description;
            $toEntity->categoryId   = $fromEntity->categoryId;
            $toEntity->parentId     = $fromEntity->parentId;
            $toEntity->order        = $fromEntity->order;
            
            if ($this->user->isAdmin()) {
                $toEntity->active = $fromEntity->active;    
            }             
            //$toEntity->createDate 
            //$toEntity->userId    
            //$toEntity->active      
        }
    }    