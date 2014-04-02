<?php
    namespace Maradik\HinterApi;    
    
    use Maradik\Testing\BaseData;
    use Maradik\Testing\CategoryData;
    use Maradik\Testing\CategoryRepository;    
    use Maradik\User\UserCurrent;
    use Maradik\HinterApi\RepositoryFactory;
    
    class CategoryCollection extends ResourceCollection
    {
        public function __construct(RepositoryFactory $repositoryFactory, UserCurrent $user)
        {
            parent::__construct($repositoryFactory, $repositoryFactory->getCategoryRepository(), $user);
        }        
        
        /**
         * @param BaseData $entity         
         * @return boolean
         */        
        protected function checkPermissionAppend(BaseData $entity)
        {
            if (!($entity instanceof \Maradik\Testing\CategoryData)) {
                throw new \InvalidArgumentException(
                    'Неверный тип параметра $entity: ожидается \Maradik\Testing\CategoryData, получен '
                  . get_class($entity)
                );       
            }              
                      
            if (!$this->user->isRegisteredUser()) {
                $this->setResponseCode(HttpResponseCode::UNATHORIZED);
                return false;
            }                       
                      
            if (!$this->user->isAdmin()) {
                $this->setResponseCode(HttpResponseCode::FORBIDDEN);
                return false;
            } 
            
            return true;
        }
        
        /**
         * @param BaseData $entity         
         * @return array
         */        
        protected function packEntity(BaseData $entity)    
        {
            if (!($entity instanceof \Maradik\Testing\CategoryData)) {
                throw new \InvalidArgumentException(
                    'Неверный тип параметра $entity: ожидается \Maradik\Testing\CategoryData, получен '
                  . get_class($entity)
                );       
            }                
            
            return array(
                'id'            => $entity->id,
                'title'         => $entity->title,
                'description'   => $entity->description,
                'order'         => $entity->order,
                'parentId'      => $entity->parentId
            );
        }
        
        /**
         * @param array $data         
         * @return BaseData
         */        
        protected function unpackEntity(array $data)
        {                          
            $ret = new CategoryData();
            
            foreach ($data as $key => $val) {
                switch ($key) {
                    case 'title':
                    case 'description':  
                        $ret->$key = $val;                          
                        break;  
                    case 'order':
                    case 'parentId':  
                        $ret->$key = (int) $val;                          
                        break;                                              
                }                
            }                           
            
            return $ret;
        }          
    }    