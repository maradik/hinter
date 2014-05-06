<?php
    namespace Maradik\Hinter\Core;    
    
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
           
        final public function request(array $resId)
        {
            $this->resId = $resId;
            
            //TODO написать свой хэндлер ошибок, чтобы выдавать не 200 ОК в случае любой ошибки            
            $this->headers();                                                                                                  
            
            if (!in_array($_SERVER['REQUEST_METHOD'], $this->getServerSupportedMethods())) {
                $this->responseNotImplemented();
                return false;                 
            }
            
            if (($args = $this->getRequestArgs()) === false) {
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
        
        final protected function clearResponseMessages()
        {
            $this->responseMessages = array();
        }        
        
        final protected function setResponseData(array $data)
        {
            $this->responseData = $data;
        }
        
        final protected function addResponseData($key, $value)
        {
            $this->responseData[$key] = $value;
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
        
        final protected function getServerSupportedMethods()
        {
            return $this->serverSupportedMethods;
        }        
        
        final protected function responseNotAllowed() 
        {
            /* 405 (Method Not Allowed) */
            header('Allow: ' . implode(', ', $this->getSupportedMethods()), true, HttpResponseCode::METHOD_NOT_ALLOWED);            
        }    
        
        final protected function responseNotImplemented()
        {
            /* 501 (Method Not Implemented) */
            header('Allow: ' . implode(', ', $this->serverSupportedMethods), true, HttpResponseCode::NOT_IMPLEMENTED);          
        }          
        
        final protected function responseNotFound()
        {
            //header("HTTP/1.1 404 Not Found");      
            header("Status: 404 Not Found", true, HttpResponseCode::NOT_FOUND);            
        }       
        
        final protected function responseCreated($location) 
        {
            /* 201 (Created) */
            header('Location: ' . $location, true, HttpResponseCode::CREATED);            
        }         
        
        final protected function setResponseCode($code)
        {
            header("HTTP/1.1 {$code} ".HttpResponseCode::getPhrase($code));    
        }
        
        final protected function getFullUrl() 
        {
            $protocol = !empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] == 'on' ? 'https' : 'http';
            $location = $_SERVER['REQUEST_URI'];
            if (!empty($_SERVER['QUERY_STRING'])) {
              $location = substr($location, 0, strrpos($location, $_SERVER['QUERY_STRING']) - 1);
            }
            return $protocol.'://'.$_SERVER['HTTP_HOST'].$location;
        }  
        
        /**
         * Определяет HTTP-заголовки
         */
        abstract protected function headers();
        
        /**
         * Вывод HTTP-ответа
         */
        abstract protected function sendResponse();
        
        /**
         * @return array|false Аргументы, полученные из http-запроса. False - в случае ошибки.
         */
        abstract protected function getRequestArgs();
    }
