<?php

    namespace Maradik\Hinter\Page;
    
    use Maradik\Testing\Query;
    use Maradik\Testing\FileData;
    use Maradik\Hinter\Core\IResource;
    use Maradik\Hinter\Api\ImageDocument;
    use Maradik\Hinter\Core\FileParentType;
    
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
                    
                $fileRepository = $this->repositoryFactory->getFileRepository();
                $this->addResponseData(
                    'mainQuestionList',
                    array_map(
                        function($mq) use ($fileRepository) {
                            $images = $fileRepository
                                ->query()
                                ->addFilterField('parentType', FileParentType::MAIN_QUESTION)
                                ->addFilterField('parentId', $mq->id)
                                ->addFilterField('type', FileData::TYPE_IMAGE)
                                ->getEntity();           
                                
                            $mq->images = array_map(
                                function($image) {
                                    return ImageDocument::packImage($image);
                                },
                                $images
                            ); 
                            return $mq;
                        },
                        $mainQuestionList  
                    )                      
                );
                $this->setTemplate("page_category.tpl");                    
            }
        }
    }
