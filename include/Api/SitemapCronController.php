<?php
    namespace Maradik\Hinter\Api;
    
    use Maradik\Testing\BaseData;
    use Maradik\Testing\BaseRepository; 
    use Maradik\User\UserCurrent; 
    use Maradik\Hinter\Core\HttpResponseCode;
    use Maradik\Hinter\Core\RepositoryFactory;     
    
    /**
     * Создание карты сайта sitemap.xml
     * Формат XML: http://www.sitemaps.org/ru/protocol.html
     */    
    class SitemapCronController extends CronController
    {
        const NODE_CHANGEFREQ_ALWAYS    = 'always';
        const NODE_CHANGEFREQ_HOURLY    = 'hourly';
        const NODE_CHANGEFREQ_DAILY     = 'daily';
        const NODE_CHANGEFREQ_WEEKLY    = 'weekly';
        const NODE_CHANGEFREQ_MONTHLY   = 'monthly';
        const NODE_CHANGEFREQ_YEARLY    = 'yearly';
        const NODE_CHANGEFREQ_NEVER     = 'never';
        
        /**
         * @var \SimpleXMLElement $sxe
         */
        private $sxe;
        
        /**
         * @param string $url
         * @param int $lastmod Timestamp
         * @param string $changefreq
         * @param real $priority
         */
        private function addUrlToSitemap(
            $url,
            $lastmod    = 0, 
            $changefreq = self::NODE_CHANGEFREQ_MONTHLY, 
            $priority   = 0.5
        ) {
            if (empty($url)) {
                throw new \InvalidArgumentException('Параметр $url не может быть пустым!');
            }
            
            if (substr($url, 0, 1) == '/') {
                $url = $this->getProtocol() . '://' . $_SERVER['HTTP_HOST'] . $url;
            }
            
            $ue = $this->sxe->addChild('url');
            $ue->addChild('loc', htmlspecialchars($url));
            if (!empty($lastmod)) {
                $ue->addChild('lastmod', date_format(new \DateTime("@" . (int)$lastmod), 'Y-m-d'));
            }
            if (!empty($changefreq)) {
                $ue->addChild('changefreq', (string)$changefreq);
            }
            if (!empty($priority)) {
                $ue->addChild('priority', (real)$priority);
            }
            /*
            *  <url>
            *      <loc>http://www.example.com/</loc>
            *      <lastmod>2005-01-01</lastmod>
            *      <changefreq>monthly</changefreq>
            *      <priority>0.8</priority>
            *  </url>   
            */         
        }
        
        protected function cron(array $args = array())
        {
            //TODO Данные об индексируемых страницах брать из ResManager
            global $general_s; //TODO переделать global на параметры
            
            $this->sxe = new \SimpleXMLElement(
                '<?xml version="1.0" encoding="UTF-8"?>'
                . '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"></urlset>'
            );
                                 
            // Главная                                 
            $this->addUrlToSitemap('/', time(), self::NODE_CHANGEFREQ_DAILY, 1.0);
            
            // Категории
            $categories = $this->repositoryFactory->getCategoryRepository()
                ->query()
                ->getEntity(PHP_INT_MAX);
            foreach ($categories as $category) {
                $this->addUrlToSitemap("/category/{$category->id}", null, self::NODE_CHANGEFREQ_DAILY);                
            }      
            unset($categories);             
            
            // Вопросы
            $mainQuestions = $this->repositoryFactory->getMainQuestionRepository()
                ->query()
                ->addFilterField('active', true)
                ->getEntity(PHP_INT_MAX);
            foreach ($mainQuestions as $mainQuestion) {
                $this->addUrlToSitemap("/question/{$mainQuestion->id}", $mainQuestion->createDate);                
            }    
            unset($mainQuestions);
            
            // Сохранение XML
            $result = $this->sxe->asXML(
                pathinfo($_SERVER['SCRIPT_FILENAME'], PATHINFO_DIRNAME) . "/{$general_s['sitemap_file']}"
            );
            
            if ($result === false) {
                $this->setResponseCode(HttpResponseCode::INTERNAL_SERVER_ERROR);
                $this->addResponseMessage(
                    "Ошибка создания карты сайта! Проверьте права на запись в файл "
                        . basename($general_s['sitemap_file']),
                    self::MESS_ERROR
                );
            } else {
                $this->addResponseMessage('Карта сайта успешно создана!');
            }
            
            unset($this->sxe);
        }              
    }
