<?php
    namespace Maradik\Hinter\Api;
    
    use Maradik\Testing\BaseData;
    use Maradik\Testing\BaseRepository; 
    use Maradik\User\UserCurrent; 
    use Maradik\Hinter\Core\HttpResponseCode;
    use Maradik\Hinter\Core\RepositoryFactory;   
    use Maradik\Hinter\Core\IResource;    
    
    abstract class CronController extends ResourceController implements IResource
    {
        public function __construct(
            RepositoryFactory   $repositoryFactory,
            UserCurrent         $user
        ) {
            parent::__construct($repositoryFactory, $repositoryFactory->getCategoryRepository(), $user);
            
            $this->addSupportedMethod('GET', 'api_post');                   
        }     
        
        final protected function api_post(array $args = array())
        {
            global $general_s; //TODO переделать на аргумент конструктору

            if (!empty($args['cron_key']) && $args['cron_key'] == $general_s['cron_key']) {
                $this->cron($args);                
            } else {
                $this->setResponseCode(HttpResponseCode::BAD_REQUEST);
                $this->addResponseMessage('Не указан или неверный ключ cron_key', self::MESS_ERROR);
            }
        }           
        
        abstract protected function cron(array $args = array());              
    }
