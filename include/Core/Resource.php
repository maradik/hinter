<?php
    namespace Maradik\Hinter\Core;    
    
    abstract class Resource
    {
        const MESS_NOTIFICATION = 0;
        const MESS_SUCCESS      = 1;
        const MESS_WARNING      = 2;
        const MESS_ERROR        = 3;
        
        /**
         * @var int $responseCode
         */
        private $responseCode = 200;
        
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
        final protected function addResponseMessage($text, $type = self::MESS_NOTIFICATION)
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
            $this->setResponseCode(HttpResponseCode::METHOD_NOT_ALLOWED);
            header('Allow: ' . implode(', ', $this->getSupportedMethods()), true, HttpResponseCode::METHOD_NOT_ALLOWED);            
        }    
        
        final protected function responseNotImplemented()
        {
            /* 501 (Method Not Implemented) */
            $this->setResponseCode(HttpResponseCode::NOT_IMPLEMENTED);
            header('Allow: ' . implode(', ', $this->serverSupportedMethods), true, HttpResponseCode::NOT_IMPLEMENTED);          
        }          
        
        final protected function responseNotFound()
        {
            $this->setResponseCode(HttpResponseCode::NOT_FOUND);
            header("Status: 404 Not Found", true, HttpResponseCode::NOT_FOUND);            
        }       
        
        final protected function responseCreated($location) 
        {
            /* 201 (Created) */
            $this->setResponseCode(HttpResponseCode::CREATED);
            header('Location: ' . $location, true, HttpResponseCode::CREATED);            
        }         
        
        final protected function setResponseCode($code)
        {
            // прим: в PHP 5.4 есть функция http_response_code
            $this->responseCode = $code;
            header("HTTP/1.1 {$code} ".HttpResponseCode::getPhrase($code));    
        }
        
        final protected function getResponseCode()
        {
            // прим: в PHP 5.4 есть функция http_response_code
            return $this->responseCode;
        }
        
        final protected function getFullUrl() 
        {
            $location = $_SERVER['REQUEST_URI'];
            if (!empty($_SERVER['QUERY_STRING'])) {
              $location = substr($location, 0, strrpos($location, $_SERVER['QUERY_STRING']) - 1);
            }
            return $this->getProtocol() . '://' . $_SERVER['HTTP_HOST'] . $location;
        }  
        
        final protected function getProtocol()
        {
            return self::getHttpProtocol();
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
        
        /**
         * @return Http-протокол
         */
        static public function getHttpProtocol()
        {
            return !empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] == 'on' ? 'https' : 'http';            
        }
    }
