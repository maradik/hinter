<?php
    require_once __DIR__.'/init.php';  
    
    use Maradik\Testing\CategoryRepository;
    use Maradik\Testing\QuestionRepository;
    use Maradik\Testing\AnswerRepository;
    use Maradik\Testing\Query;   
    use Maradik\HinterApi\HinterApi;                            
    
    $hinterApi = new HinterApi($repositoryFactory, $user);
    
    if ($hinterApi->isApiRequest()) {
        // Collections
        $hinterApi->registerResource('mainquestion', 'MainQuestionCollection');
        $hinterApi->registerResource('mainanswer', 'MainAnswerCollection');
        $hinterApi->registerResource('secondaryquestion', 'SecondQuestionCollection');
        $hinterApi->registerResource('secondaryquestion/{id}/secondaryanswer', 'SecondAnswerSQCollection');
        $hinterApi->registerResource('secondaryanswer', 'SecondAnswerCollection');       
        $hinterApi->registerResource('secondaryanswer/{id}/mainanswer', 'MainAnswerSACollection');
        $hinterApi->registerResource('mainquestion/{id}/mainanswer', 'MainAnswerMQCollection');
        $hinterApi->registerResource('mainquestion/{id}/secondaryquestion', 'SecondQuestionMQCollection');
        $hinterApi->registerResource('category', 'CategoryCollection');
        
        // Documents
        $hinterApi->registerResource('mainquestion/{id}', 'MainQuestionDocument');
        $hinterApi->registerResource('mainanswer/{id}', 'MainAnswerDocument');
        $hinterApi->registerResource('secondaryquestion/{id}', 'SecondQuestionDocument');
        $hinterApi->registerResource('secondaryanswer/{id}', 'SecondAnswerDocument');
        $hinterApi->registerResource('category/{id}', 'CategoryDocument');
        
        // Controllers
        $hinterApi->registerResource('secondaryanswer/{id}/link', 'SecondAnswerLinkController');
        $hinterApi->registerResource('secondaryanswer/{id}/unlink', 'SecondAnswerUnlinkController');
        $hinterApi->registerResource('user/current/register', 'UserRegisterController');
        $hinterApi->registerResource('user/current/login', 'UserLoginController');
        $hinterApi->registerResource('user/current/logout', 'UserLogoutController');
       
        $hinterApi->requestResource();
    } else {
        header("Content-Type: text/html; charset=utf-8");
        $vars = array();
        
        $clearUri = current(explode('#', current(explode('?', $_SERVER['REQUEST_URI'], 2)), 2));
        $vars['clearUri'] = $clearUri;
        
        $categoryList = $repositoryFactory->getCategoryRepository()->getCollection();        
        $vars['categoryList'] = $categoryList;                
        
        switch (true) {
            case $clearUri == "/":
                $mainQuestionList = array_map(
                    'array_shift',
                    $repositoryFactory
                        ->getMainQuestionRepository()
                        ->query()
                        ->addSortField('id', Query::SORT_DESC)
                        ->addFilterField('active', true)
                        ->get(10)
                );
                $vars['mainQuestionList'] = $mainQuestionList;
                $template = "page_main.tpl";
                break;
            case $clearUri == "/admin/question" && $user->isAdmin():
                if ($user->isAdmin()) {
                    $template = "admin_mainquestionlist.tpl";
                }
                break;
            case preg_match('{^/category/(\d+)$}', $clearUri, $matches):
                $categoryId = (int) $matches[1];
                $categoryCurrent = $repositoryFactory
                    ->getCategoryRepository()
                    ->getById($categoryId);                           
                if ($categoryCurrent) {
                    $vars['categoryCurrent'] = $categoryCurrent;
                    /*
                    $mainQuestionList = $repositoryFactory
                        ->getMainQuestionRepository()
                        ->getCollection(array('categoryId' => $categoryId));
                    */
                    $mainQuestionList = array_map(
                        'array_shift',
                        $repositoryFactory
                            ->getMainQuestionRepository()
                            ->query()
                            ->addFilterField('categoryId', $categoryId)
                            ->addSortField('id', Query::SORT_DESC)
                            ->addFilterField('active', true)                            
                            ->get(10)
                    );                    
                    $vars['mainQuestionList'] = $mainQuestionList;
                    $template = "page_category.tpl";                    
                } else {
                    $template = "page_404.tpl";
                    header("HTTP/1.1 404 Not Found");                     
                }                          
                break;     
            case preg_match('{^/question/(\d+)$}', $clearUri, $matches):
                $questionId = (int) $matches[1];
                $mainQuestion = $repositoryFactory
                    ->getMainQuestionRepository()
                    ->getById($questionId);                           
                if ($mainQuestion) {
                    $vars['mainQuestion'] = $mainQuestion;
                    $template = "page_question.tpl";   
                }                
                break;
            case preg_match('{^/question/create$}', $clearUri, $matches) && $user->isRegisteredUser():
                $template = "page_question_create.tpl";   
                break;                
        }
        
        if (!isset($template)) {
            $template = "page_404.tpl";
            header("HTTP/1.1 404 Not Found");             
        }

        $vars['userData'] = array(
            'id'    => $user->data()->id,
            'login' => $user->data()->login,
            'email' => $user->data()->email,
            'role'  => $user->data()->role
        );
        $fenom = Fenom::factory(__DIR__.'/templates', __DIR__.'/templates/compiled');
        $fenom->setOptions(Fenom::FORCE_COMPILE); //TODO перекомпиляция шаблонов только на период разработки   
        $fenom->display($template, $vars);                            
    }

    
