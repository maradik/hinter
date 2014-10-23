<?php
    
    /**
     * Настройки базы данных
     */
    $database_s = array(
        'database' => 'hintok',
        'username' => 'root',
        'password' => '',
        'host' => 'localhost',        
        'driver' => 'mysql',
        'prefix' => ''
    ); 
    
    /**
     * Общие настройки
     */
    $general_s = array(
        'enctryptsalt'  => 'a0s9D8F7g6H5',      // соль для хеширования паролей
        'cron_key'      => 'j1Nfle804L5Nzc',    // параметр в запросе для запуска задачи cron
        'upload_dir'    => 'uploads',           // директория аплоада
        'sitemap_file'  => 'sitemap.xml',       // относительный путь к файлу sitemap
        'img_cnt_mq'    => 3,                   // max кол-во картинок к основному вопросу
        'img_cnt_ma'    => 3,                   // max кол-во картинок к основному ответу
        'img_cnt_sq'    => 0,                   // max кол-во картинок к наводящему вопросу
        'img_cnt_sa'    => 0                    // max кол-во картинок к наводящему ответу          
    );     
    
    /**
     * Параметры, доступные в tpl-шаблонах через $info_s
     */
    $info_s = array(
        'admin_email'  => 'admin@mysite.com'
    );
    
    /**
     * Ссылки
     */
    $linkList = array(
        array(
            'title'         => 'Группа ВКонтакте',
            'description'   => 'Будь в курсе новостей и интересных подсказок!',
            'url'           => 'http://vk.com',
            'imageUrl'      => '/uploads/vkontakte.png'
        )
    );       
    
    /**
     * Системные настройки (лучше не менять)
     */    
    $table_s = array(
        'category'          => 'category',
        'mainquestion'      => 'mainquestion',
        'secondquestion'    => 'secondaryquestion',
        'mainanswer'        => 'mainanswer',
        'secondanswer'      => 'secondaryanswer',
        'relationanswers'   => 'relationanswers',
        'param'             => 'params',
        'user'              => 'user',
        'file'              => 'file'   
    );

    $templates_s = array(
        'templates_path'    => __DIR__.'/templates',
        'compiled_path'     => __DIR__.'/templates/compiled'
    );
    
    $system_s = array(
        'api_base_uri'      => '/api',
        'dev_server'        => $_SERVER['HTTP_HOST'] == 'hintok.an'
    );
    
