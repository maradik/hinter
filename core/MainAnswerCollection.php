<?php
    namespace Maradik\HinterApi;    
    
    use Maradik\Testing\BaseData;
    use Maradik\Testing\AnswerData;
    use Maradik\Testing\AnswerRepository;    
    use Maradik\User\UserCurrent;
    use Maradik\HinterApi\RepositoryFactory;
    
    class MainAnswerCollection extends ResourceCollection
    {
        public function __construct(RepositoryFactory $repositoryFactory, UserCurrent $user)
        {
            parent::__construct($repositoryFactory, $repositoryFactory->getMainAnswerRepository(), $user);
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
                      
            if (!$this->user->isRegisteredUser()) {
                $this->setResponseCode(HttpResponseCode::UNATHORIZED);
                return false;
            }                       
                      
            //TODO нужна проверка, что человек может добавлять ответы только к своим вопросам!                      
            /*
            if (!$this->user->isAdmin()) {
                $this->setResponseCode(HttpResponseCode::FORBIDDEN);
                return false;
            } 
            */
            
            return true;
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
            
            return $entity->jsonSerialize(); //TODO Переделать в JSON!
        }
        
        /**
         * @param array $data         
         * @return BaseData
         */        
        protected function unpackEntity(array $data)
        {                                                                           
            return AnswerData::createFromJson($data); //TODO Переделать из JSON!
        }          
    }    