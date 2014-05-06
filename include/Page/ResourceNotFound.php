<?php

    namespace Maradik\Hinter\Page;
    
    use Maradik\Hinter\Core\IResource;
    
    class ResourceNotFound extends ResourcePageSidebar implements IResource
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
