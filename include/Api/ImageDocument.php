<?php
    namespace Maradik\Hinter\Api;    
    
    use Maradik\Testing\BaseData;
    use Maradik\Testing\FileData;
    use Maradik\Testing\FileRepository;
    use Maradik\User\UserCurrent;
    use Maradik\Hinter\Core\HttpResponseCode;
    use Maradik\Hinter\Core\RepositoryFactory;    
    use Maradik\Hinter\Core\IResource;
    
    class ImageDocument extends ResourceDocument implements IResource
    {
        public function __construct(RepositoryFactory $repositoryFactory, UserCurrent $user)
        {
            parent::__construct($repositoryFactory, $repositoryFactory->getFileRepository(), $user);
        }
        
        /**
         * @param BaseData $entity         
         * @return boolean
         */        
        protected function checkPermissionUpdate(BaseData $entity)
        {
            if (!($entity instanceof \Maradik\Testing\FileData)) {
                throw new \InvalidArgumentException(
                    'Неверный тип параметра $entity: ожидается \Maradik\Testing\FileData, получен '
                  . get_class($entity)
                );       
            }              
            
            if (!$this->user->isRegisteredUser()) {
                $this->setResponseCode(HttpResponseCode::UNATHORIZED);
                return false;
            }              
            
            if ($entity->userId != $this->user->data()->id && !$this->user->isAdmin()) {
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
            global $general_s; //TODO переделать на аргумент конструктору
            
            if (!($entity instanceof \Maradik\Testing\FileData)) {
                throw new \InvalidArgumentException(
                    'Неверный тип параметра $entity: ожидается \Maradik\Testing\FileData, получен '
                  . get_class($entity)
                );       
            }               
            
            $hrefUploads = "{$this->getProtocol()}://{$_SERVER['HTTP_HOST']}/{$general_s['upload_dir']}";            
            
            return array(
                'id'            => $entity->id,
                'fileName'      => $entity->fileName,
                'origFileName'  => $entity->origFileName,
                'size'          => $entity->size,
                'parentType'    => $entity->parentType,
                'parentId'      => $entity->parentId,
                'createDate'    => $entity->createDate,
                'userId'        => $entity->userId,                                                
                'title'         => $entity->title,
                'description'   => $entity->description,
                'order'         => $entity->order,
                'type'          => $entity->type,
                'urlData'       => "{$hrefUploads}/{$entity->fileName}",
                'urlThumbnail'  => "{$hrefUploads}/thumbnail/{$entity->fileName}",
                'urlMiddle'     => "{$hrefUploads}/middle/{$entity->fileName}",
                'urlLarge'      => "{$hrefUploads}/large/{$entity->fileName}"
            );
        }
        
        /**
         * @param array $data         
         * @return BaseData
         */        
        protected function unpackEntity(array $data)
        {                          
            $ret = new FileData();
            $ret->setAllowedParentTypes(FileParentType::getAll());
            
            foreach ($data as $key => $val) {
                switch ($key) {
                    case 'title':
                    case 'description':  
                        $ret->$key = $val;                          
                        break;  
                    case 'order':
                    case 'parentId':  
                    case 'parentType':                           
                        $ret->$key = (int) $val;                          
                        break;                                              
                }                
            }                 

            return $ret;
        }        
        
        /**
         * @param BaseData $toEntity      
         * @param BaseData $fromEntity   
         */           
        protected function mergeEntities(BaseData $toEntity, BaseData $fromEntity)
        {
            if (!($toEntity instanceof \Maradik\Testing\FileData)) {
                throw new \InvalidArgumentException(
                    'Неверный тип параметра $toEntity: ожидается \Maradik\Testing\FileData, получен '
                  . get_class($toEntity)
                );       
            }   
                
            if (!($fromEntity instanceof \Maradik\Testing\FileData)) {
                throw new \InvalidArgumentException(
                    'Неверный тип параметра $fromEntity: ожидается \Maradik\Testing\FileData, получен '
                  . get_class($fromEntity)
                );       
            }                                                             
            
            $toEntity->title        = $toEntity->title ;
            $toEntity->description  = $toEntity->description;
            $toEntity->order        = $toEntity->order;
            $toEntity->parentId     = $toEntity->parentId;
            $toEntity->parentType   = $toEntity->parentType;                                
        }
    }    