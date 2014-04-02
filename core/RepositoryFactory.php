<?php
    namespace Maradik\HinterApi;

    use Maradik\Testing\CategoryRepository;
    use Maradik\Testing\QuestionRepository;
    use Maradik\Testing\AnswerRepository;
    use Maradik\Testing\RelRepository;

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
                           
        protected $categoryRepository;
        protected $mainQuestionRepository;
        protected $mainAnswerRepository;
        protected $secondQuestionRepository;
        protected $secondAnswerRepository;
        protected $relAnswerRepository;
        
        public function __construct(
            \PDO $pdo,
            $dbPrefix                   = '',
            $tableCategory              = 'category',
            $tableMainQuestion          = 'mainquestion',
            $tableMainAnswer            = 'mainanswer',
            $tableSecondQuestion        = 'secondaryquestion',
            $tableSecondAnswer          = 'secondaryanswer',
            $tableRelationAnswers       = 'relationanswers'
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
        }
        
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

        public function getMainQuestionRepository()
        {
            if (!isset($this->mainQuestionRepository)) {
                $this->mainQuestionRepository = new QuestionRepository(
                    $this->db,
                    $this->tableMainQuestion,
                    $this->dbPrefix
                );
            }
            return $this->mainQuestionRepository;                    
        }
        
        public function getMainAnswerRepository()
        {
            if (!isset($this->mainAnswerRepository)) {
                $this->mainAnswerRepository = new AnswerRepository(
                    $this->db,
                    $this->tableMainAnswer,
                    $this->dbPrefix                
                );
            }
            return $this->mainAnswerRepository;                    
        }
        
        public function getSecondQuestionRepository()
        {
            if (!isset($this->secondQuestionRepository)) {
                $this->secondQuestionRepository = new QuestionRepository(
                    $this->db,
                    $this->tableSecondQuestion,
                    $this->dbPrefix
                );
            }
            return $this->secondQuestionRepository;                    
        }
        
        public function getSecondAnswerRepository()
        {
            if (!isset($this->secondAnswerRepository)) {
                $this->secondAnswerRepository = new AnswerRepository(
                    $this->db,
                    $this->tableSecondAnswer,
                    $this->dbPrefix                
                );
            }
            return $this->secondAnswerRepository;                    
        }
        
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
    }