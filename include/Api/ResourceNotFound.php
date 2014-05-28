<?php

    namespace Maradik\Hinter\Api;
    
    use Maradik\User\UserCurrent;
    use Maradik\Hinter\Core\RepositoryFactory;
    use Maradik\Hinter\Core\IResource;
    use Maradik\Hinter\Core\Resource;
    
    class ResourceNotFound extends ResourceApi implements IResource
    {
        public function __construct(RepositoryFactory $repositoryFactory, UserCurrent $user)
        {
            parent::__construct($repositoryFactory, $repositoryFactory->getCategoryRepository(), $user);
            
            foreach ($this->getServerSupportedMethods() as $method) {
                $this->addSupportedMethod($method, 'notFound');                
            }
        }     
        
        protected function notFound(array $args)
        {
            $this->responseNotFound();
            $this->addResponseMessage("Ресурс не существует!", self::MESS_ERROR);
        }
    }
