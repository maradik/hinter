<?php
    namespace Maradik\HinterApi;    
    
    use Maradik\Testing\BaseData;
    use Maradik\Testing\BaseRepository; 
    use Maradik\User\UserCurrent; 
    use Maradik\HinterApi\RepositoryFactory;           
    
    abstract class ResourceCollection extends ResourceBase
    {              
        protected function __construct(
            RepositoryFactory   $repositoryFactory,
            BaseRepository      $repository, 
            UserCurrent         $user
        ) {
            parent::__construct($repositoryFactory, $repository, $user);
            
            $this->addSupportedMethod('GET', 'api_get');
            $this->addSupportedMethod('POST', 'api_post');                   
        }
        
        protected function api_get(array $args = array())
        {                                             
            $collection = $this->repository->getCollection();   
            $this->setResponseData($this->packCollection($collection));                     
        }        

        protected function api_post(array $args = array())
        {                     
            if (!empty($args)) {                                                                                                                            
                $data = $this->unpackEntity($args); 
                
                if ($this->checkPermissionAppend($data)) {    
                    if ($this->repository->insert($data) && !empty($data->id)) {
                        $this->responseCreated($this->getFullUrl()."/{$data->id}");
                        $data = $this->repository->getById($data->id);
                        $this->setResponseData($this->packEntity($data));
                    } else {
                        $this->setResponseCode(HttpResponseCode::INTERNAL_SERVER_ERROR);
                    }      
                }
            } else {
                $this->setResponseCode(HttpResponseCode::BAD_REQUEST);
            }      
        }           
        
        /**
         * @param BaseData $entity         
         * @return boolean
         */        
        abstract protected function checkPermissionAppend(BaseData $entity);           
        
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
         * @param BaseData $entity         
         * @return array
         */        
        abstract protected function packEntity(BaseData $entity);             
        
        /**
         * @param array $data         
         * @return BaseData
         */        
        abstract protected function unpackEntity(array $data);          
    }
