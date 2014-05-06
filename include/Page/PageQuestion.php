<?php

    namespace Maradik\Hinter\Page;
    
    use Maradik\Testing\Query;
    use Maradik\Hinter\Core\IResource;
    
    class PageQuestion extends ResourcePageSidebar implements IResource
    {
        protected function request_get(array $args = array())
        {
            $questionId = (int) $this->resId[0];
            $mainQuestion = $this->repositoryFactory
                ->getMainQuestionRepository()
                ->getById($questionId);                           
            if ($mainQuestion) {
                $this->addResponseData(
                    'mainQuestion',
                    $mainQuestion
                );    
                $this->setTemplate("page_question.tpl");   
            }           
        }
    }
