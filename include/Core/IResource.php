<?php

    namespace Maradik\Hinter\Core;
    
    use Maradik\User\UserCurrent;
    
    interface IResource 
    {
        public function __construct(RepositoryFactory $repositoryFactory, UserCurrent $user);
        public function request(array $resId);
    }
