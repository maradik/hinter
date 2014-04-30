<?php
    namespace Maradik\Hinter\Api;    
    
    use Maradik\Hinter\Core\HttpResponseCode;

    abstract class Resource
    {
        const MESS_NOTIFICATION = 0;
        const MESS_SUCCESS      = 1;
        const MESS_WARNING      = 2;
        const MESS_ERROR        = 3;
        
        /**
         * @var array $responseData
         */
        private $responseData = array();       
        
        /**
         * @var array $responseMessages
         */
        private $responseMessages = array();           
        
        /**
         * @var array $supportedMethods
         */         
        private $supportedMethods = array();
        
        /**
         * @var array $serverSupportedMethods
         */
        private $serverSupportedMethods = array('GET', 'POST', 'PUT', 'DELETE', 'HEAD');        
        
        /**
         * @var int[] $resId
         */
        protected $resId = array();
           
        public function request(array $resId)
        {
            $this->resId = $resId;
            
            //TODO написать свой хэндлер ошибок, чтобы выдавать не 200 ОК в случае любой ошибки            
            $this->headers();                                                                                                  
            
            $args = array();
            
            switch ($_SERVER['REQUEST_METHOD']) {
                case 'GET':
                case 'HEAD':                     
                    $args = $_GET;
                    break;
                case 'POST':
                    //$args = $_POST;
                    //break;
                case 'PUT':      
                case 'DELETE':                  
                    $requestheaders = getallheaders();  
                    if (empty($requestheaders["Content-Type"]) || //TODO некрасивая проверка заголовка Content-Type 
                        strtolower($requestheaders["Content-Type"]) != strtolower("application/json; charset=utf-8")) {
                        $this->setResponseCode(HttpResponseCode::UNSUPPORTED_MEDIA_TYPE); 
                        return false;                    
                    }           
                    $args = json_decode(file_get_contents('php://input'), true);
                    break;                        
                default:
                    $this->responseNotImplemented();
                    return false;                                  
            }                                  
            
            if (in_array($_SERVER['REQUEST_METHOD'], $this->getSupportedMethods()) &&
                method_exists($this, $this->supportedMethods[$_SERVER['REQUEST_METHOD']])) {                
                try {
                    $methodname = $this->supportedMethods[$_SERVER['REQUEST_METHOD']];
                    $this->$methodname(is_null($args) ? array() : $args);
                    $this->sendResponse();
                    unset($methodname);
                } catch (\Exception $e) {
                    $this->setResponseCode(HttpResponseCode::INTERNAL_SERVER_ERROR);
                    return false;
                }                
            } else {
                $this->responseNotAllowed();
                return false;   
            }
            
            return true;
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
            header("Content-Type: application/json; charset=utf-8"); //TODO а может другой?           
        }         
        
        protected function getResponseType()
        {
            return end(explode('\\', get_called_class())); // Имя класса без namespace
        }       
        
        /**
         * @param string $text Текст сообщения
         * @param int $type Тип сообщения
         */
        final protected function addResponseMessage($text, $type = Resource::MESS_NOTIFICATION)
        {
            $this->responseMessages[] = array('text' => $text, 'type' => $type);
        }

        final protected function getResponseMessages()
        {
            return $this->responseMessages;
        }
        
        final protected function setResponseData(array $data)
        {
            $this->responseData = $data;
        }
        
        /**
         * @return array
         */
        final protected function getResponseData()
        {
            return $this->responseData;
        }        
        
        /**
         * @param string $httpRequestMethod GET, POST, PUT, DELETE и т.д.
         * @param string $handlerMethod Название метода класса, который будет обрабатывать запрос
         */
        final protected function addSupportedMethod($httpRequestMethod, $handlerMethod)
        {
            $this->supportedMethods[$httpRequestMethod] = $handlerMethod;  
        }
        
        final public function getSupportedMethods()
        {
            return array_keys($this->supportedMethods);
        }
        
        protected function responseNotAllowed() 
        {
            /* 405 (Method Not Allowed) */
            header('Allow: ' . implode(', ', $this->getSupportedMethods()), true, HttpResponseCode::METHOD_NOT_ALLOWED);            
        }    
        
        protected function responseNotImplemented()
        {
            /* 501 (Method Not Implemented) */
            header('Allow: ' . implode(', ', $this->serverSupportedMethods), true, HttpResponseCode::NOT_IMPLEMENTED);          
        }          
        
        protected function responseNotFound()
        {
            //header("HTTP/1.1 404 Not Found");      
            header("Status: 404 Not Found", true, HttpResponseCode::NOT_FOUND);            
        }       
        
        protected function responseCreated($location) 
        {
            /* 201 (Created) */
            header('Location: ' . $location, true, HttpResponseCode::CREATED);            
        }         
        
        protected function setResponseCode($code)
        {
            header("HTTP/1.1 {$code} ".HttpResponseCode::getPhrase($code));    
        }
        
        protected function parseResId()
        {
            //TODO не очень красиво привязываемся к структуре URL, поэтому пока не используем
            /*
            $base_uri = current(explode('#', current(explode('?', $_SERVER['REQUEST_URI']))));
            $uri_elements = explode('/',$_SERVER['REQUEST_URI']);
            array_shift($uri_elements);
            
            $resId = array();

            foreach($uri_elements as $key => $value) {
                if ($key % 2 != 0) {
                    $resId[] = $value;
                } 
            }            
            
            array_reverse($resId);
            $this->resId  = $resId; 
             * 
             */
        }
        
        protected function getFullUrl() 
        {
            $protocol = !empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] == 'on' ? 'https' : 'http';
            $location = $_SERVER['REQUEST_URI'];
            if (!empty($_SERVER['QUERY_STRING'])) {
              $location = substr($location, 0, strrpos($location, $_SERVER['QUERY_STRING']) - 1);
            }
            return $protocol.'://'.$_SERVER['HTTP_HOST'].$location;
        }                
    }
