<?php
    namespace Maradik\Hinter\Api;    
    
    use Maradik\Testing\BaseData;
    use Maradik\Testing\BaseRepository; 
    use Maradik\Testing\Query;
    use Maradik\User\UserCurrent; 
    use Maradik\Hinter\Core\HttpResponseCode;
    use Maradik\Hinter\Core\RepositoryFactory;            
    
    abstract class ResourceCollection extends ResourceApi
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
            $args = array_change_key_case($args, CASE_LOWER); 
            
            $q = $this->repository->query();
            
            if (!empty($args['filterfield']) && is_array($args['filterfield'])) {
                foreach ($args['filterfield'] as $key => $field) {
                    if (!empty($field)) {
                        $q->addFilterField(
                            $field,
                            !empty($args['filtervalue'][$key]) ? $args['filtervalue'][$key] : '',
                            !empty($args['filtertype'][$key])  ? $args['filtertype'][$key]  : '='
                        );
                    }
                }
            }
            
            if (!empty($args['sortfield']) && is_array($args['sortfield'])) {
                foreach ($args['sortfield'] as $key => $field) {
                    if (!empty($field)) {
                        $q->addSortField(
                            $field,
                            !empty($args['sortorder'][$key]) && strtoupper($args['sortorder'][$key]) == 'DESC'
                                ? Query::SORT_DESC
                                : Query::SORT_ASC
                        );
                    }
                }
            }          
    
            $limit  = !empty($args['limit']) && (int) $args['limit'] < 100 ? (int) $args['limit'] : 100; 
            $offset = !empty($args['offset']) ? (int) $args['offset'] : 0;
                                    
            $collection = $q->getEntity($limit, $offset);   
            $this->setResponseData($this->packCollection($collection));                     
        }        

        protected function api_post(array $args = array())
        {                     
            if (!empty($args)) {                                                                                                                            
                $data = $this->unpackEntity($args); 
                
                if ($this->checkPermissionAppend($data)) {
                    if (($validateResult = $data->validate()) === true) {                        
                        if ($this->repository->insert($data) && !empty($data->id)) {
                            $this->responseCreated($this->getFullUrl()."/{$data->id}");
                            $data = $this->repository->getById($data->id);
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
    }
