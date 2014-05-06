<?php

    namespace Maradik\Hinter\Page;
    
    use Maradik\Testing\Query;
    use Maradik\Hinter\Core\IResource;
    
    class PageMain extends ResourcePageSidebar implements IResource
    {
        protected function request_get(array $args = array())
        {
            $mainQuestionList = array_map(
                'array_shift',
                $this->repositoryFactory
                    ->getMainQuestionRepository()
                    ->query()
                    ->addSortField('id', Query::SORT_DESC)
                    ->addFilterField('active', true)
                    ->get(10)
            );
            
            $this->addResponseData(
                'mainQuestionList',
                $mainQuestionList
            );
            
            $this->setTemplate('page_main.tpl');
        }
    }
