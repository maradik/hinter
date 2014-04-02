<?php
    namespace Maradik\HinterApi;

    class HttpResponseCode
    {
        const OK                    = 200;
        const CREATED               = 201;
        const NO_CONTENT            = 204;               
        const BAD_REQUEST           = 400;
        const UNATHORIZED           = 401;
        const FORBIDDEN             = 403;
        const NOT_FOUND             = 404;        
        const METHOD_NOT_ALLOWED    = 405;
        const NOT_ACCEPTABLE        = 406;
        const UNSUPPORTED_MEDIA_TYPE= 415;                       
        const INTERNAL_SERVER_ERROR = 500;
        const NOT_IMPLEMENTED       = 501;                      
        
        /**
         * @var array $httpResponseList
         */           
        protected static $httpResponseList = array(
                200 => 'OK',
                201 => 'Created',
                204 => 'No Content',
                400 => 'Bad Request',
                401 => 'Unauthorized',
                403 => 'Forbidden',
                404 => 'Not Found',
                405 => 'Method Not Allowed',
                406 => 'Not Acceptable',
                415 => "Unsupported Media Type",
                500 => 'Internal Server Error',
                501 => 'Not Implemented'                
            );
            
            
        public static function getPhrase($code)
        {
            return self::$httpResponseList[$code];
        }           
        
        public static function getResponseList()
        {
            return self::$httpResponseList;
        }
    }    

