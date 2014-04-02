<?php
    namespace Maradik\HinterApi;    
    
    use Maradik\Testing\BaseData;
    use Maradik\Testing\AnswerData;
    use Maradik\Testing\RelData;
    use Maradik\Testing\RelRepository;    
    use Maradik\User\UserCurrent;    
    
    class SecondAnswerUnlinkController extends SecondAnswerRelController
    {         
        protected function updateRel(AnswerData $secondAnswer, AnswerData $mainAnswer)
        {
            $rel = $this
                ->repositoryFactory
                ->getRelAnswerRepository()
                ->getOne(array('parentId' => $secondAnswer->id, 'childId' => $mainAnswer->id));
            if ($rel) {
                if (!$this->repositoryFactory->getRelAnswerRepository()->delete($rel->id)) {
                    $this->setResponseCode(HttpResponseCode::INTERNAL_SERVER_ERROR);    
                }
            }            
        }
    }    