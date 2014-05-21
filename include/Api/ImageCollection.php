<?php
    namespace Maradik\Hinter\Api;    
    
    use Maradik\Testing\BaseData;
    use Maradik\Testing\FileData;
    use Maradik\Testing\FileRepository;    
    use Maradik\User\UserCurrent;
    use Maradik\Hinter\Core\HttpResponseCode;
    use Maradik\Hinter\Core\RepositoryFactory;     
    use Maradik\Hinter\Core\IResource;
    use Maradik\Hinter\Core\FileParentType;
    
    class ImageCollection extends ResourceCollection implements IResource
    {
        const FILE_MAX_SIZE         = 524288; // 0.5МБ
        const FILE_COUNT_LIMIT      = 5000; //TODO проверять лимит загруженных файлов
        
        const IMAGE_SIZE_THUMBNAIL  = 100;
        const IMAGE_SIZE_MIDDLE     = 220;
        const IMAGE_SIZE_LARGE      = 480;
        
        protected $file;
        
        public function __construct(RepositoryFactory $repositoryFactory, UserCurrent $user)
        {
            parent::__construct($repositoryFactory, $repositoryFactory->getFileRepository(), $user);
        }        
        
        protected function api_post(array $args = array())
        {
            global $general_s;
            $this->file = current($_FILES); 
            
            if (!empty($args)
                && !empty($this->file) 
                && preg_match('/^.*\.JPE?G|GIF|PNG$/i', $this->file['name'])
                && $this->file['size'] <= self::FILE_MAX_SIZE
                && $this->file['error'] == UPLOAD_ERR_OK) {
                                                                                                                                                
                $data = $this->unpackEntity($args); 
                
                if ($this->checkPermissionAppend($data)) {
                    if (($validateResult = $data->validate()) === true) { //TODO проверку типа родителя => в FileData                       
                        $result = $this->repository->insert($data) && !empty($data->id);
                        $data->fileName = strtolower(
                            "img{$data->id}_{$data->parentType}_{$data->parentId}." 
                            . pathinfo($data->fileName, PATHINFO_EXTENSION)
                        );
                        $result &= $this->repository->update($data);
                        
                        $filename = pathinfo($_SERVER['SCRIPT_FILENAME'], PATHINFO_DIRNAME) 
                            . "/{$general_s['upload_dir']}/" . $data->fileName;
                        $result &= move_uploaded_file($this->file['tmp_name'],$filename);
                        
                        $dir = pathinfo($filename, PATHINFO_DIRNAME);
                        $result &= $this->resizeImage($filename, $dir . "/thumbnail/" . $data->fileName, self::IMAGE_SIZE_THUMBNAIL);
                        $result &= $this->resizeImage($filename, $dir . "/middle/" . $data->fileName, self::IMAGE_SIZE_MIDDLE);
                        $result &= $this->resizeImage($filename, $dir . "/large/" . $data->fileName, self::IMAGE_SIZE_LARGE);                                                
                        unset($dir);
                        
                        if ($result) {
                            $this->responseCreated($this->getFullUrl()."/{$data->id}");
                            $data = $this->repository->getById($data->id);
                            $this->setResponseData($this->packEntity($data));
                        } else {
                            $this->repository->delete($data->id);                        
                            $this->setResponseCode(HttpResponseCode::INTERNAL_SERVER_ERROR);
                        }     
                        unset($result);
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
         * @param string $srcFilename
         * @param string $dstFilename
         * @param int $maxWidth
         * @param int $maxHeight
         * 
         * @return boolean
         */
        protected function resizeImage($srcFilename, $dstFilename, $maxWidth, $maxHeight = 0)
        {
            $maxWidth = (int) $maxWidth;
            $maxHeight = empty($maxHeight) ? $maxWidth : (int) $maxHeight;
            
            if ($maxWidth < 1 || $maxHeight < 1) {
                throw new \InvalidArgumentException('Некорректные аргументы $maxWidth, $maxHeight');
            }
            
            if (!is_file($srcFilename)) {
                throw new \InvalidArgumentException('Некорректные аргумент $srcFilename - не является файлом!');
            }
            
            switch (strtolower(pathinfo($srcFilename, PATHINFO_EXTENSION))) {
                case 'png': 
                    $funcOpenImage = 'imagecreatefrompng'; 
                    $funcSaveImage = 'imagepng';
                    break;
                case 'gif': 
                    $funcOpenImage = 'imagecreatefromgif'; 
                    $funcSaveImage = 'imagegif';
                    break;
                case 'jpeg': 
                case 'jpg': 
                    $funcOpenImage = 'imagecreatefromjpeg'; 
                    $funcSaveImage = 'imagejpeg';
                    break;
                default:
                    return false;
            }            
            
            $srcImage = $funcOpenImage($srcFilename);
            if ($srcImage === false) {
                return false;
            }
            
            $srcImageWidth = imagesx($srcImage);
            $srcImageHeight = imagesy($srcImage);
            
            if ($srcImageWidth < $maxWidth && $srcImageHeight < $maxHeight) {
                return copy($srcFilename, $dstFilename);
            } 

            $koef = $srcImageWidth / $srcImageHeight;
            $dstImageWidth = (int) ($koef >= 1 ? $maxWidth : $koef*$maxWidth);
            $dstImageHeight = (int) ($koef <= 1 ? $maxHeight : $maxHeight/$koef);
            
            $dstImage = imagecreatetruecolor($dstImageWidth, $dstImageHeight);
            if ($dstImage === false) {
                return false;
            }            
            
            $ret = imagecopyresampled(
                $dstImage, 
                $srcImage, 
                0, 
                0, 
                0,
                0, 
                $dstImageWidth, 
                $dstImageHeight, 
                $srcImageWidth, 
                $srcImageHeight
            );
                       
            $ret = $ret && $funcSaveImage($dstImage, $dstFilename);          
                       
            return $ret;
        }
        
        /**
         * @param BaseData $entity         
         * @return boolean
         */        
        protected function checkPermissionAppend(BaseData $entity)
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
                 
            //TODO нужна проверка, что человек может добавлять изображения только к своим вопросам!
            /* 
            if ($entity->userId != $this->user->data()->id && !$this->user->isAdmin()) {
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

            $ret->size = (int)($this->file['size'] / 1024);
            $ret->origFileName = basename($this->file['name']);
            $ret->fileName = $ret->origFileName;          
            $ret->createDate = time();
            $ret->userId = $this->user->data()->id;
            $ret->type = FileData::TYPE_IMAGE;         
            
            return $ret;
        }          
    }    