<?php
    namespace Maradik\Hinter\Api;
    
    use Maradik\Hinter\Core\HttpResponseCode;
    use Maradik\Hinter\Core\Params;
    use Maradik\Hinter\Core\FileParentType;
    use Maradik\Testing\FileData;
    
    class VkPostCronController extends CronController
    {
        const CURL_TIMEOUT = 10;
        
        /**
         * Отправляет POST запрос на $url с телом $params 
         *
         * @param string $url
         * @param array $params Ассоциативный массив - тело запроса.
         * 
         * @return string|boolean В случае успеха возвращает экземпляр stdClass, полученный из json http-ответа. При ошибке - false.
         */
        protected function postData($url, array $params) 
        {          
            $ch = curl_init(); 
            curl_setopt($ch, CURLOPT_URL, $url);  
            //curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
            curl_setopt($ch, CURLOPT_FAILONERROR, false); 
            curl_setopt($ch, CURLOPT_FOLLOWLOCATION, false); 
            curl_setopt($ch, CURLOPT_RETURNTRANSFER, false);
            curl_setopt($ch, CURLOPT_TIMEOUT, self::CURL_TIMEOUT);  
            curl_setopt($ch, CURLOPT_POST, true);  
            curl_setopt($ch, CURLOPT_POSTFIELDS, $params); 
            curl_setopt($ch, CURLOPT_NOBODY, false);
            curl_setopt($ch, CURLOPT_HEADER, false);
            curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
            $result = curl_exec($ch); 
            $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
            //print_r($result);   
            curl_close($ch);       
            
            if ($result !== false && $httpCode == 200) {
                return json_decode($result);               
            } 
            
            return false;              
        }
        
        /**
         * Вызывает API метод ВКонтакте.
         * 
         * @param string $vkMethod Название метода
         * @param array $params Ассоциативный массив аргументов методу API
         * 
         * @return string|boolean В случае успеха возвращает экземпляр stdClass, полученный из json http-ответа. При ошибке - false.
         */
        protected function vkCallMethod($vkMethod, array $params)
        {
            $url = "https://api.vk.com/method/{$vkMethod}?access_token=" . Params::get('vk_access_token');
            return $this->postData($url, $params);            
        }

        /**
         * Загрузка изображения на сервер ВКонтакте
         * 
         * @param string $filename Абсолютный или относительный путь к файлу
         * 
         * @return string|boolean В случае успеха - идентификатор изображения, в случае ошибки - false.
         */        
        protected function vkUploadPhoto($filename) 
        {
            /**
             * API syntax:
             * http://vk.com/dev/upload_files
             */
            if (!is_file($filename)) {
                //throw new \InvalidArgumentException('Переданный аргументом $filename файл не существует!');
                return false;
            }
            $filename = realpath($filename);
                        
            $owner_id = Params::get('vk_wallpost_owner_id');
            
            $uploadServerResponse = $this->vkCallMethod(
                'photos.getWallUploadServer',
                array(
                    'v'         => 5.21,
                    'user_id'   => (int)$owner_id > 0 ? $owner_id : 0,
                    'group_id'  => (int)$owner_id < 0 ? abs($owner_id) : 0                
                ) 
            );
            if ($uploadServerResponse !== false) {
                if (isset($uploadServerResponse->response->upload_url)) {
                    $uploadResponse = $this->postData(
                        $uploadServerResponse->response->upload_url, 
                        array('photo' => "@{$filename}")
                    );
                    if ($uploadResponse !== false) {
                        $saveResponse = $this->vkCallMethod(
                            'photos.saveWallPhoto', 
                            array(
                                'server'    => $uploadResponse->server,
                                'photo'     => $uploadResponse->photo,
                                'hash'      => $uploadResponse->hash,
                                'user_id'   => (int)$owner_id > 0 ? $owner_id : 0,
                                'group_id'  => (int)$owner_id < 0 ? abs($owner_id) : 0
                            )
                        );    
                        if ($saveResponse !== false) {
                            if (isset($saveResponse->response[0]->id)) {
                                return $saveResponse->response[0]->id;
                            }
                        }             
                    }
                }
            }
            
            return false;
        }        
        
        /**
         * Постинг сообщения ВКонтакте
         * 
         * @param $message Текст сообщения
         * @param array $attachments Массив вложений к сообщению
         */
        protected function vkPostMessage($message, array $attachments) 
        {
            /**
             * API syntax:
             * http://vk.com/dev/wall.post
             */             
            $result = $this->vkCallMethod(
                "wall.post", 
                array(
                'message'       => $message,
                'attachments'    => implode(',', $attachments),
                'owner_id'      => Params::get('vk_wallpost_owner_id'),
                'friends_only'  => Params::get('vk_wallpost_friends_only', 0),
                'from_group'    => Params::get('vk_wallpost_from_group', 1),
                'signed'        => Params::get('vk_wallpost_signed', 0),
                'v'             => 5.21
                ) 
            );
            if ($result !== false) {
                if (isset($result->response->post_id) && !empty($result->response->post_id)) {
                    $this->addResponseMessage('Message posted to VK.COM successfully!');
                } else {
                    $this->setResponseCode(HttpResponseCode::INTERNAL_SERVER_ERROR);
                    $this->addResponseMessage("Error occured on posting message to VK.COM!", self::MESS_ERROR);
                }                
            } else {
                $this->setResponseCode(HttpResponseCode::INTERNAL_SERVER_ERROR);
                $this->addResponseMessage('Error occured when send request to VK.COM!', self::MESS_ERROR);    
            }              
        }
        
        protected function cron(array $args = array())
        {
            global $general_s; //TODO переделать global на параметры
            $q = $this->repositoryFactory
                ->getCategoryRepository()
                ->query()
                ->join($this->repositoryFactory->getMainQuestionRepository())
                ->addLinkFields('id', 'categoryId')
                ->addFilterField('active', true);

            $mainQuestionId = empty($args['mq']) ? 0 : (int) $args['mq'];            
            if (!empty($mainQuestionId)) {
                $q = $q->addFilterField('id', $mainQuestionId);
            }
            
            $mainQuestionCount = $q->getCount();
            $row = $q->getOne(mt_rand(0, $mainQuestionCount - 1));
            if (!empty($row)) {
                list($category, $mainQuestion) = $row;
                unset($row);
                $mainAnswers = $this->repositoryFactory
                    ->getMainAnswerRepository()
                    ->query()
                    ->addFilterField('questionId', $mainQuestion->id)   
                    ->getEntity();
                $mqUrl = $this->getProtocol() . '://' . $_SERVER['HTTP_HOST'] . "/question/{$mainQuestion->id}";
                $message = mb_strtoupper($mainQuestion->title, 'UTF-8') 
                    . "\n\n{$mainQuestion->description}\n\n"
                    . "ОТВЕТ ЗДЕСЬ: {$mqUrl}";                                
                /*
                $message = mb_strtoupper($mainQuestion->title, 'UTF-8') 
                    . "\n{$mqUrl}\n\n{$mainQuestion->description}\n\n"
                    . "Возможные варианты:\n"
                    . implode("\n", array_map(function($ma) { return "- {$ma->title}"; }, $mainAnswers));
                 * 
                 */
                $fileData = $this->repositoryFactory
                    ->getFileRepository()
                    ->query()
                    ->addFilterField('parentType', FileParentType::MAIN_QUESTION)
                    ->addFilterField('parentId', $mainQuestion->id)
                    ->addFilterField('type', FileData::TYPE_IMAGE)   
                    ->getOneEntity(); 
                if ($fileData) {    
                    $photoId = $this->vkUploadPhoto(
                        pathinfo($_SERVER['SCRIPT_FILENAME'], PATHINFO_DIRNAME) 
                        . "/{$general_s['upload_dir']}/large/"
                        . $fileData->fileName                
                    );
                }
                $attachments = array(
                    $mqUrl   
                );
                if (!empty($photoId)) {
                    $attachments[] = $photoId;
                }
                $this->vkPostMessage($message, $attachments);                
            } else {
                $this->setResponseCode(HttpResponseCode::INTERNAL_SERVER_ERROR);                
            }
        }
    }
    