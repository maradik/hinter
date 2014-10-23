<?php
    namespace Maradik\Hinter\Api;    
    
    use Maradik\Testing\BaseData;
    use Maradik\Testing\AnswerData;
    use Maradik\Testing\RelData;
    use Maradik\Testing\RelRepository;    
    use Maradik\User\UserCurrent;    
    use Maradik\Hinter\Core\HttpResponseCode;
    use Maradik\Hinter\Core\RepositoryFactory;     
    
    class SecondAnswerSetRelController extends SecondAnswerLinkController
    {
        protected function prepareRel(AnswerData $secondAnswer)
        {
            $ret = parent::prepareRel($secondAnswer);
            
            if ($ret) {
                $rels = $this->repositoryFactory
                    ->getRelAnswerRepository()
                    ->query()
                    ->addFilterField('parentId', $secondAnswer->id)   
                    ->getEntity();                 
                
                foreach ($rels as $rel) {
                    if (!$this->repositoryFactory->getRelAnswerRepository()->delete($rel->id)) {
                        return false;
                    }
                }                                                       
            }           
            
            return true;    
        }       
    }    