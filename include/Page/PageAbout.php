<?php

    namespace Maradik\Hinter\Page;
    
    use Maradik\Hinter\Core\IResource;
    
    class PageAbout extends ResourcePageSidebar implements IResource
    {
        protected function request_get(array $args = array())
        {           
            $this->setTemplate('page_about.tpl');
        }
    }
