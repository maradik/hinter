<?php
    namespace Maradik\Hinter\Api;    
    
    use Maradik\Testing\BaseData;
    use Maradik\Testing\QuestionData;
    use Maradik\Testing\QuestionRepository;
    use Maradik\User\UserCurrent;
    use Maradik\Hinter\Core\HttpResponseCode;
    use Maradik\Hinter\Core\RepositoryFactory; 
    
    class SecondQuestionDocument extends MainQuestionDocument
    {
        public function __construct(RepositoryFactory $repositoryFactory, UserCurrent $user)
        {
            parent::__construct($repositoryFactory, $user);
            $this->repository = $repositoryFactory->getSecondQuestionRepository();
        }             
    }    