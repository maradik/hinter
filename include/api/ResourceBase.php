<?php
    namespace Maradik\HinterApi;
    
    use Maradik\Testing\BaseRepository; 
    use Maradik\User\UserCurrent;   
    use Maradik\HinterApi\RepositoryFactory;    
    
    abstract class ResourceBase extends Resource
    {
        /**
         * @var RepositoryFactory
         */
        protected $repositoryFactory;
        
        /**
         * @var BaseRepository $repository
         */
        protected $repository;          
        
        /**
         * @var UserCurrent $user
         */
        protected $user;        
        
        protected function __construct(
            RepositoryFactory   $repositoryFactory, 
            BaseRepository      $repository, 
            UserCurrent         $user
        ) {
            $this->repositoryFactory = $repositoryFactory;           
            $this->repository        = $repository;
            $this->user              = $user;            
        }                
    }
