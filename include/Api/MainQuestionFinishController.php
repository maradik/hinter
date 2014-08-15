<?php
    namespace Maradik\Hinter\Api;    
    
    use Maradik\Testing\BaseData;
    use Maradik\Testing\BaseRepository; 
    use Maradik\Testing\QuestionData; 
    use Maradik\Testing\QuestionRepository;
    use Maradik\Hinter\Core\HttpResponseCode;
    use Maradik\Hinter\Core\RepositoryFactory;      
    
    class MainQuestionFinishController extends MainQuestionController
    {
        protected function api_post(array $args = array())
        {
            $id = (int) (empty($this->resId[0]) ? 0 : $this->resId[0]);
            //$newData = $this->unpackEntity($args);
            
            if ($id) {
                $origData = $this->repository->getById($id); 
                
                if (!empty($origData)) {
                    $origData->order++;
                    
                    if ($this->repository->update($origData)) {
                        $data = $this->repository->getById($origData->id);
                        $this->setResponseData($this->packEntity($data));                            
                    } else {
                        $this->setResponseCode(HttpResponseCode::INTERNAL_SERVER_ERROR);
                    }                    
                } else {
                    $this->setResponseCode(HttpResponseCode::INTERNAL_SERVER_ERROR);
                }  
            } else {
                $this->setResponseCode(HttpResponseCode::BAD_REQUEST);
            }                                 
        }                             
    }    