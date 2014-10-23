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
            
            $parentEntity = $this->repositoryFactory
                ->getRepositoryByFpt($entity->parentType)
                ->getById($entity->parentId);    
                 
            if (empty($parentEntity)) {
                $this->addResponseMessage('Некорректный родительский элемент!', self::MESS_ERROR);
                $this->setResponseCode(HttpResponseCode::INTERNAL_SERVER_ERROR);  
                return false;
            }                  
                 
            if ($parentEntity->userId != $this->user->data()->id && !$this->user->isAdmin()) {
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
            if (!($entity instanceof \Maradik\Testing\FileData)) {
                throw new \InvalidArgumentException(
                    'Неверный тип параметра $entity: ожидается \Maradik\Testing\FileData, получен '
                  . get_class($entity)
                );       
            }               
            
            return self::packImage($entity);
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

        /**
         * Упаковывает МЕТА-данные изображения в массив для последующей передачи пользователю
         * 
         * @param Maradik\Testing\FileData $image
         * @return array 
         */  
        static public function packImage(FileData $image)
        {
            global $general_s; //TODO переделать на аргумент конструктору           
            
            $hrefUploads = self::getHttpProtocol()."://{$_SERVER['HTTP_HOST']}/{$general_s['upload_dir']}";   
            
            return array(
                'id'            => $image->id,
                'fileName'      => $image->fileName,
                'origFileName'  => $image->origFileName,
                'size'          => $image->size,
                'parentType'    => $image->parentType,
                'parentId'      => $image->parentId,
                'createDate'    => $image->createDate,
                'userId'        => $image->userId,                                                
                'title'         => $image->title,
                'description'   => $image->description,
                'order'         => $image->order,
                'type'          => $image->type,
                'urlData'       => "{$hrefUploads}/{$image->fileName}",
                'urlThumbnail'  => "{$hrefUploads}/thumbnail/{$image->fileName}",
                'urlMiddle'     => "{$hrefUploads}/middle/{$image->fileName}",
                'urlLarge'      => "{$hrefUploads}/large/{$image->fileName}"                                                                                                  
            );            
        }
    }    