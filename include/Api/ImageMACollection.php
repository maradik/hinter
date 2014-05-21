<?php
    namespace Maradik\Hinter\Api;   
    
    use Maradik\Hinter\Core\FileParentType; 
    use Maradik\Hinter\Core\RepositoryFactory;
    use Maradik\User\UserCurrent;    
      
    class ImageMACollection extends ImageSubcollection 
    {
        public function __construct(RepositoryFactory $repositoryFactory, UserCurrent $user)
        {
            parent::__construct($repositoryFactory, $user);
            $this->fileParentType = FileParentType::MAIN_ANSWER;
        }          
    }