<?php
    namespace Maradik\Hinter\Page;
    
    use Maradik\User\UserCurrent;
    use Maradik\Hinter\Core\HttpResponseCode;
    use Maradik\Hinter\Core\RepositoryFactory;
    use Maradik\Hinter\Core\Params;
    
    abstract class ResourcePageSidebar extends ResourcePage
    {
        /**
         * @param RepositoryFactory $repositoryFactory
         * @param UserCurrent $user
         * @param int $needUserRole Минимальная роль, которой доступна страница (из констант Maradik\User\UserRoles)
         */
        public function __construct(
            RepositoryFactory   $repositoryFactory, 
            UserCurrent         $user,
            $needUserRole = \Maradik\User\UserRoles::GUEST
        ) {
            parent::__construct(
                $repositoryFactory, 
                $user, 
                $needUserRole,
                'page_404.tpl', 
                'page_accessdeny.tpl'
            );  
        }          
            
        protected function sendResponse()
        {
            global $linkList;
            $this->addResponseData(
                'linkList',
                $linkList
            );           
            
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

