<?php
    namespace Maradik\Hinter\Core;

    use Maradik\Testing\CategoryRepository;
    use Maradik\Testing\QuestionRepository;
    use Maradik\Testing\AnswerRepository;
    use Maradik\Testing\RelRepository;
    use Maradik\Testing\FileRepository;
    use Maradik\Testing\FileData;

    class RepositoryFactory        
    {
        protected $db;        
        protected $dbPrefix;    
        
        protected $tableCategory;
        protected $tableMainQuestion;
        protected $tableMainAnswer;
        protected $tableSecondQuestion;
        protected $tableSecondAnswer;
        protected $tableRelationAnswers;
        protected $tableParam;
        protected $tableFile;
        protected $uploadDir;
                           
        protected $categoryRepository;
        protected $mainQuestionRepository;
        protected $mainAnswerRepository;
        protected $secondQuestionRepository;
        protected $secondAnswerRepository;
        protected $relAnswerRepository;
        protected $paramRepository;
        protected $fileRepository;
        
        public function __construct(
            \PDO $pdo,
            $dbPrefix                   = '',
            $tableCategory              = 'category',
            $tableMainQuestion          = 'mainquestion',
            $tableMainAnswer            = 'mainanswer',
            $tableSecondQuestion        = 'secondaryquestion',
            $tableSecondAnswer          = 'secondaryanswer',
            $tableRelationAnswers       = 'relationanswers',
            $tableParam                 = 'params',
            $tableFile                  = 'file',
            $uploadDir                  = 'uploads'
        )
        {
            $this->db                   = $pdo;        
            $this->dbPrefix             = $dbPrefix;    
            $this->tableCategory        = $tableCategory;
            $this->tableMainQuestion    = $tableMainQuestion;
            $this->tableMainAnswer      = $tableMainAnswer;
            $this->tableSecondQuestion  = $tableSecondQuestion;
            $this->tableSecondAnswer    = $tableSecondAnswer;
            $this->tableRelationAnswers = $tableRelationAnswers;  
            $this->tableParam           = $tableParam;      
            $this->tableFile            = $tableFile;     
            $this->uploadDir            = $uploadDir; 
        }
        
        /**
         * @param int $fileId
         * @param Maradik\Testing\FileData $fileEntity
         *
         * @return boolean
         */
        public function deleteFile($fileId, $fileEntity) 
        {
            $uploadDir = pathinfo($_SERVER['SCRIPT_FILENAME'], PATHINFO_DIRNAME) . "/{$this->uploadDir}";
                       
            array_map(
                function($f) {
                    if (is_file($f)) {
                        unlink($f);
                    }
                },
                array(
                    $uploadDir . "/{$fileEntity->fileName}",
                    $uploadDir . "/thumbnail/{$fileEntity->fileName}",
                    $uploadDir . "/middle/{$fileEntity->fileName}",
                    $uploadDir . "/large/{$fileEntity->fileName}"
                )
            );
            
            return true;           
        }        
        
        /**
         * @param int $parentType
         * @param int $parentId
         *
         * @return boolean
         */
        public function deleteRelatedFiles($parentType, $parentId) 
        {
            $files = $this->getFileRepository()
                ->query()
                ->addFilterField('parentType', $parentType)
                ->addFilterField('parentId', $parentId)
                ->getEntity();
            foreach ($files as $file) {
                if (!$this->getFileRepository()->delete($file->id)) {
                    return false;    
                }
            }   
            
            return true;           
        }
        
        /**
         * @return Maradik\Testing\CategoryRepository
         */
        public function getCategoryRepository()
        {
            if (!isset($this->categoryRepository)) {
                $this->categoryRepository = new CategoryRepository(
                    $this->db,
                    $this->tableCategory,
                    $this->dbPrefix
                );      
            }
            return $this->categoryRepository;                    
        }
        
        /**
         * @return Maradik\Testing\QuestionRepository
         */  
        public function getMainQuestionRepository()
        {
            if (!isset($this->mainQuestionRepository)) {
                $this->mainQuestionRepository = new QuestionRepository(
                    $this->db,
                    $this->tableMainQuestion,
                    $this->dbPrefix
                );
                $self = $this;
                $this->mainQuestionRepository->setOnDelete(function($id) use ($self) {
                    $mainAnswers = $self->getMainAnswerRepository()
                        ->query()
                        ->addFilterField('questionId', $id)
                        ->getEntity();
                    foreach ($mainAnswers as $mainAnswer) {
                        if (!$self->getMainAnswerRepository()->delete($mainAnswer->id)) {
                            return false;    
                        }
                    }  
                    $secondQuestions = $self->getSecondQuestionRepository()
                        ->query()
                        ->addFilterField('parentId', $id)
                        ->getEntity();
                    foreach ($secondQuestions as $secondQuestion) {
                        if (!$self->getSecondQuestionRepository()->delete($secondQuestion->id)) {
                            return false;    
                        }
                    }                         
                    return $self->deleteRelatedFiles(FileParentType::MAIN_QUESTION, $id);
                });                 
            }
            return $this->mainQuestionRepository;                    
        }
        
        /**
         * @return Maradik\Testing\AnswerRepository
         */        
        public function getMainAnswerRepository()
        {
            if (!isset($this->mainAnswerRepository)) {
                $this->mainAnswerRepository = new AnswerRepository(
                    $this->db,
                    $this->tableMainAnswer,
                    $this->dbPrefix                
                );
                $self = $this;                
                $this->mainAnswerRepository->setOnDelete(function($id) use ($self) {
                    $rels = $self->getRelAnswerRepository()
                        ->query()
                        ->addFilterField('childId', $id)
                        ->getEntity();
                    foreach ($rels as $rel) {
                        if (!$self->getRelAnswerRepository()->delete($rel->id)) {
                            return false;    
                        }
                    }    
                    return $self->deleteRelatedFiles(FileParentType::MAIN_ANSWER, $id);
                });                 
            }
            return $this->mainAnswerRepository;                    
        }
        
        /**
         * @return Maradik\Testing\QuestionRepository
         */        
        public function getSecondQuestionRepository()
        {
            if (!isset($this->secondQuestionRepository)) {
                $this->secondQuestionRepository = new QuestionRepository(
                    $this->db,
                    $this->tableSecondQuestion,
                    $this->dbPrefix
                );
                $self = $this;
                $this->secondQuestionRepository->setOnDelete(function($id) use ($self) {
                    $secondAnswers = $self->getSecondAnswerRepository()
                        ->query()
                        ->addFilterField('questionId', $id)
                        ->getEntity();
                    foreach ($secondAnswers as $secondAnswer) {
                        if (!$self->getSecondAnswerRepository()->delete($secondAnswer->id)) {
                            return false;    
                        }
                    }    
                    return $self->deleteRelatedFiles(FileParentType::SECOND_QUESTION, $id);
                });                 
            }
            return $this->secondQuestionRepository;                    
        }
        
        /**
         * @return Maradik\Testing\AnswerRepository
         */        
        public function getSecondAnswerRepository()
        {
            if (!isset($this->secondAnswerRepository)) {
                $this->secondAnswerRepository = new AnswerRepository(
                    $this->db,
                    $this->tableSecondAnswer,
                    $this->dbPrefix                
                );
                $self = $this;                
                $this->secondAnswerRepository->setOnDelete(function($id) use ($self) {
                    $rels = $self->getRelAnswerRepository()
                        ->query()
                        ->addFilterField('parentId', $id)
                        ->getEntity();
                    foreach ($rels as $rel) {
                        if (!$self->getRelAnswerRepository()->delete($rel->id)) {
                            return false;    
                        }
                    }    
                    return $self->deleteRelatedFiles(FileParentType::SECOND_ANSWER, $id);
                });                  
            }
            return $this->secondAnswerRepository;                    
        }
        
        /**
         * @return Maradik\Testing\RelRepository
         */        
        public function getRelAnswerRepository()
        {
            if (!isset($this->relAnswerRepository)) {
                $this->relAnswerRepository = new RelRepository(
                    $this->db,
                    $this->tableRelationAnswers,
                    $this->dbPrefix                
                );
            }
            return $this->relAnswerRepository;                    
        } 
        
        /**
         * @return Maradik\Core\ParamRepository
         */        
        public function getParamRepository()
        {
            if (!isset($this->paramRepository)) {
                $this->paramRepository = new ParamRepository(
                    $this->db,
                    $this->tableParam,
                    $this->dbPrefix
                );      
            }
            return $this->paramRepository;                    
        }     
        
        /**
         * @return Maradik\Testing\FileRepository
         */
        public function getFileRepository()
        {
            if (!isset($this->fileRepository)) {
                $this->fileRepository = new FileRepository(
                    $this->db,
                    $this->tableFile,
                    $this->dbPrefix
                );
                $self = $this;
                $this->fileRepository->setOnDelete(function($id, $entity = null) use ($self) {
                    return empty($entity) ? true : $self->deleteFile($id, $entity);
                });                        
            }
            return $this->fileRepository;                    
        }           
        
        /**
         * @return Maradik\Testing\BaseRepository
         */
        public function getRepositoryByFpt($fileParentType)
        {
            switch ($fileParentType) {
                case FileParentType::MAIN_QUESTION:     return $this->getMainQuestionRepository();
                case FileParentType::MAIN_ANSWER:       return $this->getMainAnswerRepository();
                case FileParentType::SECOND_QUESTION:   return $this->getSecondQuestionRepository();
                case FileParentType::SECOND_ANSWER:     return $this->getSecondAnswerRepository();
            }
            
            throw \InvalidArgumentException('Некорректное значение аргумента $fileParentType');
        } 
    }