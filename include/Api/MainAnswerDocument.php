<?php
    namespace Maradik\Hinter\Api;    
    
    use Maradik\Testing\BaseData;
    use Maradik\Testing\AnswerData;
    use Maradik\Testing\AnswerRepository;
    use Maradik\User\UserCurrent;
    use Maradik\Hinter\Core\HttpResponseCode;
    use Maradik\Hinter\Core\RepositoryFactory;     
    use Maradik\Hinter\Core\IResource;    
    
    class MainAnswerDocument extends ResourceDocument implements IResource
    {
        public function __construct(RepositoryFactory $repositoryFactory, UserCurrent $user)
        {
            parent::__construct($repositoryFactory, $repositoryFactory->getMainAnswerRepository(), $user);
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
                    ->getById($entity->questionId);    
    
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
            if (!($entity instanceof \Maradik\Testing\AnswerData)) {
                throw new \InvalidArgumentException(
                    'Неверный тип параметра $entity: ожидается \Maradik\Testing\AnswerData, получен '
                  . get_class($entity)
                );       
            }               
            
            $ret = $entity->jsonSerialize(); //TODO Переделать в JSON!
            $ret['images'] = $this->getPackedImages($entity->id);
            return $ret;
        }
        
        /**
         * @param array $data         
         * @return BaseData
         */        
        protected function unpackEntity(array $data)
        {                          
            $ret = AnswerData::createFromJson($data); //TODO Переделать из JSON!
            $ret->userId     = $this->user->data()->id;
            $ret->createDate = time();
            $ret->linkTitle  = empty($ret->linkUrl) 
                ? "" 
                : empty($ret->linkTitle) ? parse_url($ret->linkUrl, PHP_URL_HOST) : $ret->linkTitle;
            return $ret;                                        
        }        
        
        /**
         * @param BaseData $toEntity      
         * @param BaseData $fromEntity   
         */           
        protected function mergeEntities(BaseData $toEntity, BaseData $fromEntity)
        {
            if (!($toEntity instanceof \Maradik\Testing\AnswerData)) {
                throw new \InvalidArgumentException(
                    'Неверный тип параметра $toEntity: ожидается \Maradik\Testing\AnswerData, получен '
                  . get_class($toEntity)
                );       
            }   
                
            if (!($fromEntity instanceof \Maradik\Testing\AnswerData)) {
                throw new \InvalidArgumentException(
                    'Неверный тип параметра $fromEntity: ожидается \Maradik\Testing\AnswerData, получен '
                  . get_class($fromEntity)
                );       
            }                                     
                        
            $toEntity->title        = $fromEntity->title;
            $toEntity->description  = $fromEntity->description;
            $toEntity->questionId   = $fromEntity->questionId;            
            $toEntity->order        = $fromEntity->order;      
            $toEntity->linkUrl      = $fromEntity->linkUrl;
            $toEntity->linkTitle    = $fromEntity->linkTitle;
        }
    }    