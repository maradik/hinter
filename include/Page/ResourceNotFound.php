<?php

    namespace Maradik\Hinter\Page;
    
    class ResourceNotFound extends ResourcePageSidebar
    {
        /**
         * Метод, обрабатывающий запрос GET к ресурсу
         */
        protected function request_get(array $args = array())
        {
            $this->responseNotFound();
            $this->setTemplate($this->templateNotFound()); 
        }      
        
        
    }
