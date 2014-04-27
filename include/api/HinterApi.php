<?php
    namespace Maradik\HinterApi;
    
    use Maradik\User\UserCurrent;
    
    class HinterApi
    {
        const MAX_RESOURCE_DEPTH = 10;
        
        /**
         * @var string
         */
        protected $baseUri;
        
        /**
         * @var string[] $resources
         */
        protected $resources = array();
        
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
            UserCurrent $user, 
            $baseUri = '/api'
        ) {
            $this->repositoryFactory = $repositoryFactory;
            $this->user = $user;
            $this->baseUri = $baseUri;
        }                
        
        /**
         * @return boolean
         */
        public function isApiRequest()
        {
            if (strpos($_SERVER['REQUEST_URI'], $this->baseUri) === 0) {
                return true;
            }
            
            return false;
        }
        
        /**
         * @param string $uri
         * @param string $classname
         */
        public function registerResource($uri, $className)
        {
            $className = __NAMESPACE__ . '\\' . $className;
            if (!class_exists($className)) {                
                throw new \InvalidArgumentException(
                    'Не найден класс "' . $className  
                  . '" переданный параметром $className'
                );
            }         
            
            $this->resources[$uri] = $className;
        }
        
        public function requestResource()
        {
            if (!$this->isApiRequest()) {
                return false;
            }
            
            $requestUri = ltrim(substr($_SERVER['REQUEST_URI'], strlen($this->baseUri)), '/');
            $requestUri = current(explode('?', $requestUri, 2));
            $requestUri = current(explode('#', $requestUri, 2));
            $uriElements = explode('/', $requestUri, HinterApi::MAX_RESOURCE_DEPTH);
            /*
            $ret = (boolean) preg_match(
                '{^/api/(\w+)(?:/(\d+)(?:/(\w+))?)*(?:\?.*)?(?:\#.*)?$}', //TODO будет неверный разбор регулярного выражения, если вложенность ресурсов > 1
                rtrim($_SERVER['REQUEST_URI'], '/'),
                $uri_elements
            );            
            */
                                           
            $resUri = "";
            $resId = array();             
                    
            foreach ($uriElements as $key => $val) {
                if ($key % 2 && ((int)$val)) { 
                    $resId[] = (int) $val;
                }
                
                $resUri .= (!empty($resUri) ? "/" : "") . ($key % 2 && ((int)$val) ? '{id}' : (string) $val);                
            }                                
                        
            if (!empty($this->resources[$resUri]) 
                && in_array('Maradik\HinterApi\Resource', class_parents($this->resources[$resUri]))) {
                $res = new $this->resources[$resUri]($this->repositoryFactory, $this->user);
                $res->request(array_reverse($resId));
            } else {
                header("HTTP/1.1 404 Not Found");
            }       

            return true;
        }
    }
