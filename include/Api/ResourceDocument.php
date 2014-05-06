<?php
    namespace Maradik\Hinter\Api;    

    use Maradik\Testing\BaseData;
    use Maradik\Testing\BaseRepository;
    use Maradik\User\UserCurrent;  
    use Maradik\Hinter\Core\HttpResponseCode;
    use Maradik\Hinter\Core\RepositoryFactory;  

    abstract class ResourceDocument extends ResourceApi
    {              
        protected function __construct(
            RepositoryFactory   $repositoryFactory,
            BaseRepository      $repository, 
            UserCurrent         $user
        ) {
            parent::__construct($repositoryFactory, $repository, $user);
            
            $this->addSupportedMethod('GET', 'api_get');
            $this->addSupportedMethod('PUT', 'api_put');
            $this->addSupportedMethod('DELETE', 'api_delete');                        
        }
        
        protected function api_get(array $args = array())        
        {
            $id = (int) (empty($this->resId[0]) ? 0 : $this->resId[0]);
                
            if ($id) {                         
                $data = $this->repository->getById($id);
                if (!empty($data)) {
                    $this->setResponseData($this->packEntity($data));                    
                } 
            }
            
            if (empty($data)) {                
                $this->responseNotFound();                
            }
        }    
        
        protected function api_put(array $args = array())        
        {
            $id = (int) (empty($this->resId[0]) ? 0 : $this->resId[0]);      
            
            if (!empty($args) && $id) {           
                $origData = $this->repository->getById($id);                          
                if (!empty($origData)) {                                                              
                    if ($this->checkPermissionUpdate($origData)) {                    
                        $newData  = $this->unpackEntity($args);  
                        $this->mergeEntities($origData, $newData); 
                        if (($validateResult = $origData->validate()) === true) {             
                            if ($this->repository->update($origData)) {
                                $data = $this->repository->getById($origData->id);
                                $this->setResponseData($this->packEntity($data));                            
                            } else {
                                $this->setResponseCode(HttpResponseCode::INTERNAL_SERVER_ERROR);
                            }
                        } else {
                            $this->addResponseMessage(implode("\n", $validateResult), self::MESS_ERROR);
                            $this->setResponseCode(HttpResponseCode::INTERNAL_SERVER_ERROR);                   
                        }                            
                    }
                } else {
                    $this->responseNotFound();
                }
            } else {
                $this->setResponseCode(HttpResponseCode::BAD_REQUEST);
            }
        } 

        protected function api_delete(array $args = array())        
        {
            $ret = false;
            $id = (int) (empty($this->resId[0]) ? 0 : $this->resId[0]);                                   
                  
            if ($id) {
                $origData = $this->repository->getById($id);  
                
                if (!empty($origData)) {
                    if ($this->checkPermissionDelete($origData)) {
                        if ($this->repository->delete($id)) {
                            $this->setResponseCode(HttpResponseCode::NO_CONTENT);    
                        } else {
                            $this->setResponseCode(HttpResponseCode::INTERNAL_SERVER_ERROR);    
                        }   
                    }   
                } else {
                    $this->responseNotFound();
                }                              
            } else {
                $this->setResponseCode(HttpResponseCode::BAD_REQUEST);
            }                      
        }
        
        /**
         * @param BaseData $entity         
         * @return boolean
         */        
        abstract protected function checkPermissionUpdate(BaseData $entity);           
        
        /**
         * @param BaseData $entity         
         * @return boolean
         */        
        abstract protected function checkPermissionDelete(BaseData $entity);            
        
        /**
         * @param BaseData $entity         
         * @return array
         */        
        abstract protected function packEntity(BaseData $entity);        
        
        /**
         * @param array $data         
         * @return BaseData
         */        
        abstract protected function unpackEntity(array $data);                
        
        /**
         * @param BaseData $toEntity      
         * @param BaseData $fromEntity            
         */           
        abstract protected function mergeEntities(BaseData $toEntity, BaseData $fromEntity);
    }    