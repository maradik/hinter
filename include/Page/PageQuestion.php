<?php

    namespace Maradik\Hinter\Page;
    
    use Maradik\Testing\Query;
    
    class PageQuestion extends ResourcePageSidebar
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
