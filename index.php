<?php
    require_once __DIR__.'/init.php';  
    
    use Maradik\Hinter\Core\ResManager;            
    
    $resManager = new ResManager($repositoryFactory, $user);
    
    if (strpos($_SERVER['REQUEST_URI'], $system_s['api_base_uri']) === 0) { // подключаем только то, что нужно - экономим время
        // Регистрация ресурсов для API
        $ns = 'Maradik\\Hinter\\Api\\';
        $upx = $system_s['api_base_uri'];
        
        // Collections
        $resManager->register($upx . '/mainquestion', $ns . 'MainQuestionCollection');
        $resManager->register($upx . '/mainquestion/{id}/mainanswer', $ns . 'MainAnswerMQCollection');
        $resManager->register($upx . '/mainquestion/{id}/secondaryquestion', $ns . 'SecondQuestionMQCollection');
        $resManager->register($upx . '/mainquestion/{id}/image', $ns . 'ImageMQCollection');
        $resManager->register($upx . '/mainanswer', $ns . 'MainAnswerCollection');
        $resManager->register($upx . '/mainanswer/{id}/image', $ns . 'ImageMACollection');
        $resManager->register($upx . '/secondaryquestion', $ns . 'SecondQuestionCollection');
        $resManager->register($upx . '/secondaryquestion/{id}/secondaryanswer', $ns . 'SecondAnswerSQCollection');
        $resManager->register($upx . '/secondaryanswer', $ns . 'SecondAnswerCollection');       
        $resManager->register($upx . '/secondaryanswer/{id}/mainanswer', $ns . 'MainAnswerSACollection');
        $resManager->register($upx . '/category', $ns . 'CategoryCollection');
        $resManager->register($upx . '/image', $ns . 'ImageCollection');
        
        // Documents
        $resManager->register($upx . '/mainquestion/{id}', $ns . 'MainQuestionDocument');
        $resManager->register($upx . '/mainanswer/{id}', $ns . 'MainAnswerDocument');
        $resManager->register($upx . '/secondaryquestion/{id}', $ns . 'SecondQuestionDocument');
        $resManager->register($upx . '/secondaryanswer/{id}', $ns . 'SecondAnswerDocument');
        $resManager->register($upx . '/category/{id}', $ns . 'CategoryDocument');
        $resManager->register($upx . '/image/{id}', $ns . 'ImageDocument');
        
        // Controllers
        $resManager->register($upx . '/mainquestion/{id}/finish', $ns . 'MainQuestionFinishController');
        $resManager->register($upx . '/secondaryanswer/{id}/link', $ns . 'SecondAnswerLinkController');
        $resManager->register($upx . '/secondaryanswer/{id}/unlink', $ns . 'SecondAnswerUnlinkController');
        $resManager->register($upx . '/secondaryanswer/{id}/setrel', $ns . 'SecondAnswerSetRelController');
        $resManager->register($upx . '/user/current/register', $ns . 'UserRegisterController');
        $resManager->register($upx . '/user/current/login', $ns . 'UserLoginController');
        $resManager->register($upx . '/user/current/logout', $ns . 'UserLogoutController');
        $resManager->register($upx . '/cron/sitemap-update', $ns . 'SitemapCronController');
        $resManager->register($upx . '/cron/vk-post', $ns . 'VkPostCronController');
        
        // NotFound
        $resManager->registerNotFound($ns . 'ResourceNotFound');
        unset($ns);        
    } else {
        // Регистрация html-страниц        
        $ns = 'Maradik\\Hinter\\Page\\';
        
        // Pages
        $resManager->register('/', $ns . 'PageMain');
        $resManager->register('/category/{id}', $ns . 'PageCategory');
        $resManager->register('/question/{id}', $ns . 'PageQuestion');
        $resManager->register('/question/create', $ns . 'PageQuestionCreate');
        $resManager->register('/question/{id}/edit', $ns . 'PageQuestionEdit');
        $resManager->register('/about', $ns . 'PageAbout');

        // User
        $resManager->register('/user/question', $ns . 'PageUserQuestionList');
        
        // Admin
        $resManager->register('/admin/question', $ns . 'AdminQuestionList');
        $resManager->register('/admin/flushcache', $ns . 'AdminFlushCache');
                
        // NotFound        
        $resManager->registerNotFound($ns . 'ResourceNotFound');
        unset($ns);         
    }
    
    $resManager->request();

    