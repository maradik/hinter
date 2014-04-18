<?php
    namespace Maradik\HinterApi;    
    
    use Maradik\Testing\BaseData;
    use Maradik\Testing\BaseRepository; 
    use Maradik\User\UserCurrent; 
    use Maradik\HinterApi\RepositoryFactory;           
    
    abstract class ResourceController extends ResourceBase
    {              
        protected function __construct(
            RepositoryFactory   $repositoryFactory,
            BaseRepository      $repository, 
            UserCurrent         $user
        ) {
            parent::__construct($repositoryFactory, $repository, $user);
            
            $this->addSupportedMethod('POST', 'api_post');                   
        }            

        abstract protected function api_post(array $args = array());                        
    }
