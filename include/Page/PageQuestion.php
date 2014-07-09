<?php

    namespace Maradik\Hinter\Page;
    
    use Maradik\Testing\Query;
    use Maradik\Testing\FileData;
    use Maradik\Hinter\Core\IResource;
    use Maradik\Hinter\Api\ImageDocument;
    use Maradik\Hinter\Core\FileParentType;    
    
    class PageQuestion extends ResourcePageSidebar implements IResource
    {
        protected function request_get(array $args = array())
        {
            $questionId = (int) $this->resId[0];
            $mainQuestion = $this->repositoryFactory
                ->getMainQuestionRepository()
                ->getById($questionId);                           
            if ($mainQuestion) {
                $images = $this->repositoryFactory
                    ->getFileRepository()
                    ->query()
                    ->addFilterField('parentType', FileParentType::MAIN_QUESTION)
                    ->addFilterField('parentId', $mainQuestion->id)
                    ->addFilterField('type', FileData::TYPE_IMAGE)
                    ->getEntity();           
                    
                $mainQuestion->images = array_map(
                    function($image) {
                        return ImageDocument::packImage($image);
                    },
                    $images
                );                 
                
                $this->addResponseData(
                    'mainQuestion',
                    $mainQuestion
                );    
                $this->setTemplate("page_question.tpl");   
            }           
        }
    }
