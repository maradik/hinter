<?php
    namespace Maradik\HinterApi;    
    
    use Maradik\Testing\BaseData;
    use Maradik\Testing\BaseRepository; 
    use Maradik\User\UserCurrent; 
    use Maradik\User\UserData;
    
    abstract class UserController extends ResourceController
    {
        /**
         * @param array $data         
         * @return UserData
         */        
        protected function unpackEntity(array $data)
        {
            $ret = new UserData();
            $ret->login     = !empty($data['login']) ? $data['login'] : '';
            $ret->password  = !empty($data['password']) ? $data['password'] : '';
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