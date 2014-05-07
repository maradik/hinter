<?php
    namespace Maradik\Hinter\Core;
    
    use Maradik\User\UserCurrent;
    
    class ResManager
    {
        /**
         * @var string[] $resources
         */
        protected $resources = array();
        
        
        /**
         * @var string $resourceNotFound
         */
        protected $resourceNotFound;
        
        /**
         * @var RepositoryFactory $repositoryFactory
         */
        protected $repositoryFactory;
        
        /**
         * @var UserCurrent $user
         */
        protected $user;
        
        public function __construct(
            RepositoryFactory $repositoryFactory, 
            UserCurrent $user
        ) {
            $this->repositoryFactory = $repositoryFactory;
            $this->user = $user;
        }                
        
        /**
         * @param string $uri
         * @param string $classname
         */
        public function register($uri, $className)
        {          
            if (!preg_match('/^[\w-\/{}]*$/', $uri)) {                
                throw new \InvalidArgumentException(
                    'Некорректный формат Uri в параметре $uri'
                );
            }
            
            $this->validateResourceClass($className);                 
            
            $this->resources[strtolower($uri)] = $className;
        }

        /**
         * @param string $classname
         */
        public function registerNotFound($className)
        {
            $this->validateResourceClass($className);
            
            $this->resourceNotFound = $className;
        }
        
        public function request()
        {
            $requestUri = current(explode('?', $_SERVER['REQUEST_URI'], 2));
            $requestUri = strtolower(current(explode('#', $requestUri, 2)));

            foreach ($this->resources as $uri => $className) {
                if ( preg_match(
                        '/^' . str_ireplace(array('{id}', '/'), array('(\d+)', '\/'), $uri) . '$/',
                        $requestUri,
                        $resId
                    )
                ) {
                    array_shift($resId);
                    $res = new $className($this->repositoryFactory, $this->user);
                    $res->request($resId);                    
                    return true;
                }              
            }

            if (!empty($this->resourceNotFound)) {
                $res = new $this->resourceNotFound($this->repositoryFactory, $this->user);
                $res->request(array());                    
                return true;                
            }

            header("HTTP/1.1 404 Not Found"); 
            return false;
        }

        /**
         * @param string $className
         */        
        protected function validateResourceClass($className) 
        {
            if (!class_exists($className)) {                
                throw new \InvalidArgumentException(
                    'Не найден класс "' . $className  
                  . '" переданный параметром $className'
                );
            }     

            if (!in_array('Maradik\\Hinter\\Core\\IResource', class_implements(($className)))) {                
                throw new \InvalidArgumentException(
                    'Класс "' . $className  
                  . '" должен наследовать интерфейс Maradik\\Hinter\\Core\\IResource'
                );
            }             
        }
    }
