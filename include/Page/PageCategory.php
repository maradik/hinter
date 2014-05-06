<?php

    namespace Maradik\Hinter\Page;
    
    use Maradik\Testing\Query;
    use Maradik\Hinter\Core\IResource;
    
    class PageCategory extends ResourcePageSidebar implements IResource
    {
        protected function request_get(array $args = array())
        {
            $categoryId = (int) $this->resId[0];
            $categoryCurrent = $this->repositoryFactory
                ->getCategoryRepository()
                ->getById($categoryId);                           
            if ($categoryCurrent) {
                $this->addResponseData(
                    'categoryCurrent',
                    $categoryCurrent
                );
                $mainQuestionList = $this->repositoryFactory
                    ->getMainQuestionRepository()
                    ->query()
                    ->addFilterField('categoryId', $categoryId)
                    ->addSortField('id', Query::SORT_DESC)
                    ->addFilterField('active', true)                            
                    ->getEntity(10);
                $this->addResponseData(
                    'mainQuestionList',
                    $mainQuestionList
                );
                $this->setTemplate("page_category.tpl");                    
            }
        }
    }
