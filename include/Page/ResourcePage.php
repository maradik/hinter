<?php
    namespace Maradik\Hinter\Page;
    
    use Maradik\User\UserCurrent;
    use Maradik\Hinter\Core\HttpResponseCode;
    use Maradik\Hinter\Core\RepositoryFactory;
    use Maradik\Hinter\Core\Resource;  
    
    abstract class ResourcePage extends Resource
    {
        /**
         * @var \Fenom $templateEngine
         */
        private $templateEngine;
        
        /**
         * @var string $template
         */
        private $template;   
        
        /**
         * @var string $templateNotFound
         */
        private $templateNotFound;     
        
        /**
         * @var string $templateAccessDeny
         */
        private $templateAccessDeny; 
        
        /**
         * @var string $needUserRole Минимальная роль, которой доступна страница (из констант Maradik\User\UserRoles)
         */
        private $needUserRole;                                  
        
        /**
         * @var RepositoryFactory
         */
        protected $repositoryFactory;
        
        /**
         * @var UserCurrent $user
         */
        protected $user;        
        
        /**
         * @param RepositoryFactory $repositoryFactory
         * @param UserCurrent $user
         * @param int $needUserRole Минимальная роль, которой доступна страница (из констант Maradik\User\UserRoles)
         * @param string $templateNotFound
         * @param string $templateAccessDeny
         */
        protected function __construct(
            RepositoryFactory   $repositoryFactory, 
            UserCurrent         $user,
            $needUserRole,            
            $templateNotFound,
            $templateAccessDeny
        ) {
            if (empty($templateNotFound) || empty($templateAccessDeny)) {
                throw new \InvalidArgumentException(
                    'Некорректные названия шаблонов $templateNotFound, $templateAccessDeny'
                );
            }
            
            $this->repositoryFactory    = $repositoryFactory;           
            $this->user                 = $user;     
            $this->needUserRole         = $needUserRole;
            $this->templateNotFound     = $templateNotFound;
            $this->templateAccessDeny   = $templateAccessDeny;
            
            $this->addSupportedMethod('GET', 'base_get');
            $this->addSupportedMethod('POST', 'base_post');  
            
            global $templates_s, $system_s; //TODO Переделать на аргументы конструктора
            $this->templateEngine = \Fenom::factory($templates_s['templates_path'], $templates_s['compiled_path']);
            if ($system_s['dev_server']) {
                $this->templateEngine->setOptions(\Fenom::FORCE_COMPILE);
            }              
        }   
        
        /**
         * @return string Название файла-шаблона HTML (tpl)
         */
        final protected function getTemplate()
        {
            return $this->template;
        }
        
        /**
         * @param string $template Название файла-шаблона HTML (tpl)
         */        
        final protected function setTemplate($template)
        {
            $this->template = $template;
        }
        
        /**
         * @return string Название файла-шаблона HTML (tpl) для ответа 404 Not Found 
         */        
        final protected function templateNotFound()
        {
            return $this->templateNotFound;
        }        
        
        /**
         * @return string Название файла-шаблона HTML (tpl) для ответа 403 Forbidden
         */        
        final protected function templateAccessDeny()
        {
            return $this->templateAccessDeny;
        }         
        
        /**
         * @return \Fenom
         */
        final protected function getTemplateEngine()
        {
            return $this->templateEngine;
        }
           
        /**
         * @return array|false Аргументы, полученные из http-запроса. False - в случае ошибки.
         */
        final protected function getRequestArgs() 
        {
            $args = array();
            switch ($_SERVER['REQUEST_METHOD']) {
                case 'GET':
                case 'HEAD':                     
                    $args = $_GET;
                    break;
                case 'POST':
                    $args = $_POST;
                    break;                        
            }   
            
            return is_null($args) ? array() : $args;          
        }             
           
        protected function sendResponse()
        {
            global $system_s, $info_s;
            $this->addResponseData('dev_server', $system_s['dev_server']);
            $this->addResponseData('info_s', $info_s);
            
            $template = $this->getTemplate();            
            
            if (empty($template)) {
                $this->clearResponseMessages();
                $template = $this->templateNotFound();
                $this->responseNotFound();
            }

            $this->templateEngine->display(
                $template, 
                $this->getResponseData()
            );             
        }        
        
        final protected function headers()
        {
            header("Content-Type: text/html; charset=utf-8");            
        }         

        /**
         * @param array $args
         */        
        final protected function base_get(array $args = array()) 
        {
            if ($this->needUserRole <= $this->user->data()->role) {
                $this->request_get($args);
            } else {
                $this->setTemplate($this->templateAccessDeny());
                $this->setResponseCode(HttpResponseCode::FORBIDDEN);
            }
        }  
        
        /**
         * @param array $args
         */        
        final protected function base_post(array $args = array()) 
        {
            if ($this->needUserRole <= $this->user->data()->role) {
                $this->request_post($args);
            } else {
                $this->setTemplate($this->templateAccessDeny());
                $this->setResponseCode(HttpResponseCode::FORBIDDEN);
            }
        }          

        /**
         * Метод, обрабатывающий запрос POST к ресурсу
         * 
         * @param array $args
         */        
        protected function request_post(array $args = array()) 
        {
            $this->request_get($args);
        }            
        
        /**
         * Метод, обрабатывающий запрос GET к ресурсу
         * 
         * @param array $args
         */
        abstract protected function request_get(array $args = array());
    }

