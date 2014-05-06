<?php
    namespace Maradik\Hinter\Page;
    
    use Maradik\User\UserCurrent;
    use Maradik\Hinter\Core\HttpResponseCode;
    use Maradik\Hinter\Core\RepositoryFactory;
    use Maradik\Hinter\Core\Params;
    use Maradik\Hinter\Core\IResource;     
    
    abstract class ResourcePageSidebar extends ResourcePage implements IResource
    {
        /**
         * @param RepositoryFactory $repositoryFactory
         * @param UserCurrent $user
         */
        public function __construct(
            RepositoryFactory   $repositoryFactory, 
            UserCurrent         $user
        ) {
            parent::__construct(
                $repositoryFactory, 
                $user, 
                'page_404.tpl', 
                'page_accessdeny.tpl'
            );  
        }          
            
        /**
         * @return int Минимальная роль, которой доступна страница (из констант Maradik\User\UserRoles)
         */
        protected function needUserRole()
        {
            return \Maradik\User\UserRoles::USER;
        }
        
        protected function sendResponse()
        {
            $this->addResponseData(
                'clearUri',
                current(explode('#', current(explode('?', $_SERVER['REQUEST_URI'], 2)), 2))
            );
            
            $categoryList = $this->repositoryFactory->getCategoryRepository()
                ->query()
                ->addSortField('order')
                ->addSortField('title')
                ->getEntity();    
            $this->addResponseData(
                'categoryList',
                $categoryList
            );                   
            
            $this->addResponseData(
                'cache_id',
                Params::get(Params::KEY_CACHE_ID, '1')
            );            

            $this->addResponseData(
                'userData',
                array(
                    'id'    => $this->user->data()->id,
                    'login' => $this->user->data()->login,
                    'email' => $this->user->data()->email,
                    'role'  => $this->user->data()->role
                )
            );
            
            parent::sendResponse();
        }       
    }

