<?php
    namespace Maradik\HinterApi;    
    
    use Maradik\Testing\BaseData;
    use Maradik\Testing\BaseRepository; 
    use Maradik\User\UserCurrent; 
    use Maradik\User\UserData;
    
    abstract class UserController extends ResourceController
    {
        public function __construct(RepositoryFactory $repositoryFactory, UserCurrent $user)
        {
            parent::__construct($repositoryFactory, $repositoryFactory->getCategoryRepository(), $user);
        }          
        
        /**
         * @param array $data         
         * @return UserData
         */        
        protected function unpackEntity(array $data)
        {
            $ret = new UserData();
            $ret->login     = trim(!empty($data['login'])    ? (string) $data['login'] : '');
            $ret->password  = trim(!empty($data['password']) ? (string) $data['password'] : '');
            $ret->email     = "{$ret->login}@{$ret->login}";
    
            return $ret;
        }      

        /**
         * @param UserData $userData         
         * @return array
         */        
        protected function packEntity(UserData $userData)
        {
            $ret = array(
                'id'    => $userData->id,
                'login' => $userData->login,
                'email' => $userData->email,
                'role'  => $userData->role
            );
    
            return $ret;
        }                   
    }    