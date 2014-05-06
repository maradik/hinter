<?php
    namespace Maradik\Hinter\Api;    
    
    use Maradik\Testing\BaseData;
    use Maradik\Testing\AnswerData;
    use Maradik\Testing\RelData;
    use Maradik\Testing\RelRepository;    
    use Maradik\User\UserCurrent;    
    use Maradik\Hinter\Core\HttpResponseCode;
    use Maradik\Hinter\Core\RepositoryFactory;     
    
    class SecondAnswerLinkController extends SecondAnswerRelController
    {
        protected function updateRel(AnswerData $secondAnswer, AnswerData $mainAnswer)
        {
            $rel = $this
                ->repositoryFactory
                ->getRelAnswerRepository()
                ->getOne(array('parentId' => $secondAnswer->id, 'childId' => $mainAnswer->id));
            if (!$rel) {
                $rel = new RelData();
                $rel->parentId = $secondAnswer->id;
                $rel->childId = $mainAnswer->id;
                if (($validateResult = $rel->validate()) === true) { 
                    return $this->repositoryFactory->getRelAnswerRepository()->insert($rel);
                } else {
                    $this->addResponseMessage(implode("\n", $validateResult), self::MESS_ERROR);
                }                    
            }     
            
            return true;       
        }       
    }    