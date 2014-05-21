<?php
    namespace Maradik\Hinter\Api;
    
    use Maradik\Testing\BaseRepository; 
    use Maradik\User\UserCurrent;   
    use Maradik\Hinter\Core\HttpResponseCode;
    use Maradik\Hinter\Core\RepositoryFactory;     
    use Maradik\Hinter\Core\Resource;    
    
    abstract class ResourceApi extends Resource
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
        
        protected function sendResponse()
        {
            $data = $this->getResponseData();
            $message = $this->getResponseMessages();
            
            if (isset($data) || isset($message)) {
                $response = array(
                    'url'       => $this->getFullUrl(),
                    'methods'   => $this->getSupportedMethods(),
                    'type'      => $this->getResponseType(),
                    'message'   => $message,
                    'data'      => $data
                );       
                
                echo json_encode($response);
            }
        } 
        
        protected function headers()
        {
            header("Content-Type: application/json; charset=utf-8");            
        }         
        
        protected function getResponseType()
        {
            return end(explode('\\', get_called_class())); // Имя класса без namespace
        }                
        
        /**
         * @return array|false Аргументы, полученные из http-запроса. False - в случае ошибки.
         */
        protected function getRequestArgs() 
        {
            $args = array();
            switch ($_SERVER['REQUEST_METHOD']) {
                case 'GET':
                case 'HEAD':                     
                    $args = $_GET;
                    break;
                case 'POST':
                case 'PUT':      
                case 'DELETE':       
                    $requestHeaders = getallheaders();   
                    
                    if (!empty($requestHeaders["Content-Type"])
                        && strtolower($requestHeaders["Content-Type"]) == "application/json; charset=utf-8") {
                            
                        $args = json_decode(file_get_contents('php://input'), true);    
                    } elseif (!empty($requestHeaders["Content-Type"]) 
                        && strpos(strtolower($requestHeaders["Content-Type"]), 'multipart/form-data') === 0) {
                        
                        $args = $_POST;
                    } else {
                        $this->setResponseCode(HttpResponseCode::UNSUPPORTED_MEDIA_TYPE); 
                        return false;                    
                    }                               
                    break;                        
            }   
            
            return is_null($args) ? array() : $args;          
        }                 
    }
