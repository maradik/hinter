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
    
    abstract class ImageSubcollection extends ImageCollection 
    {
        /**
         * @var int $fileParentType
         */
        protected $fileParentType = 0;
        
        protected function api_get(array $args = array())
        {
            $args['filterfield'] = isset($args['filterfield']) ? $args['filterfield'] : array();
            $args['filtervalue'] = isset($args['filtervalue']) ? $args['filtervalue'] : array();
            
            if (is_array($args['filterfield']) && is_array($args['filtervalue'])) {
                $args['filterfield'][] = 'parentType';
                $args['filtervalue'][] = $this->fileParentType;
                
                $args['filterfield'][] = 'parentId';
                $args['filtervalue'][] = $this->resId[0];

                $args['filterfield'][] = 'type';
                $args['filtervalue'][] = FileData::TYPE_IMAGE;
                
                parent::api_get($args);                           
            } else {
                $this->setResponseCode(HttpResponseCode::BAD_REQUEST);
            } 
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
                      
            $this->setResponseCode(HttpResponseCode::FORBIDDEN); 
            return false;                                       //TODO временная заглушка по добавлению               
                 
            return true;
        }
    }    