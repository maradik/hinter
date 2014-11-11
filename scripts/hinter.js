var Hinter = function () {
    // наследование смотри http://habrahabr.ru/post/131714/
    // Синхронизация http://habrahabr.ru/post/108542/
    
    var FileParentType = {MAIN_QUESTION: 1, MAIN_ANSWER: 2, SECOND_QUESTION: 3, SECOND_ANSWER: 4};
    var MessageType = {NOTIFICATION: 0, SUCCESS: 1, WARNING: 2, ERROR: 3};
    var NoYesAll = {No: 0, Yes: 1, All: 2};
    
    function Message(text, type) {
        var self = this;
        
        self.Text = text;
        self.Type = type;
    }    
    
    function baseObservableArray(baseModelArray) {
        var observableArray = ko.observableArray(baseModelArray).extend({baseList: true});
        return observableArray;    
    };     

    //-------------------------------------------------------
    // Модели

    function BaseModel(id, title, description, order, resUri) {
        var self = this;
        self.Id             = ko.observable(id);        
        self.Title          = ko.observable(title);
        self.Description    = ko.observable(description);
        self.Order          = ko.observable(order);        
        self.Images         = baseObservableArray();
        
        self.Editing        = ko.observable(false);
        self.Edited         = ko.observable(false);
        self.Locked         = ko.observable(false);
        self.Visible        = ko.observable(true);
        self.Expanded       = ko.observable(false);
        
        var uri = resUri;
        self.getUri = function() {
            return uri;
        };

        self.expand = function() {
            self.Expanded(!self.Expanded());
        };

        self.unpack = function(json) {
            self.Id(            json.id);
            self.Title(         json.title);
            self.Description(   json.description);
            self.Order(         json.order);
            self.Images.unpack(json.images, Image);
            return self;
        };

        self.pack = function() {
            return {
                id:         self.Id(),
                title:      self.Title(),
                description:self.Description(),                 
                order:      self.Order()
            };
        };          

        self.save = function(callbackSuccess, callbackError) {
            var model = this;
            var cbSuccess = function(json, textStatus, jqXHR) {
                model.unpack(json.data);
                if (callbackSuccess) {
                    callbackSuccess(json, textStatus, jqXHR);
                }
            };
            var cbError = callbackError;
            BaseModel.save(model, cbSuccess, cbError); 
        }; 
        
        self.load = function(modelId, callbackSuccess, callbackError) {
            var model = this;
            var cbSuccess = function(json, textStatus, jqXHR) {
                model.unpack(json.data);
                if (callbackSuccess) {
                    callbackSuccess(json, textStatus, jqXHR);
                }
            };
            var cbError = callbackError;
            BaseModel.load(model, modelId, cbSuccess, cbError); 
        };     
        
        self.remove = function(callbackSuccess, callbackError) {
            var model = this;
            var cbSuccess = function(json, textStatus, jqXHR) {
                model.Id(0);
                model.Locked(true);                
                if (callbackSuccess) {
                    callbackSuccess(json, textStatus, jqXHR);
                }
            };
            var cbError = callbackError;
            BaseModel.remove(model, cbSuccess, cbError); 
        };               

        self.uploadImage = function(file, callbackSuccess, callbackError) {
            var fileParentType = 0;
            switch (true) {
                case (this instanceof MainQuestion):    fileParentType = FileParentType.MAIN_QUESTION; break;
                case (this instanceof MainAnswer):      fileParentType = FileParentType.MAIN_ANSWER; break;
                case (this instanceof SecondQuestion):  fileParentType = FileParentType.SECOND_QUESTION; break;
                case (this instanceof SecondAnswer):    fileParentType = FileParentType.SECOND_ANSWER; break;
            }
            
            var maxFilesize = 500; //KB
            if (file.size > maxFilesize*1024) {
                userMessageList.push(new Message('Слишком большой файл для загрузки! Максимальный размер ' + maxFilesize + ' КБ', MessageType.WARNING));
                if (callbackError) {
                    callbackError();
                }
                return;
            }
            
            var allowedExt = ['jpeg', 'jpg', 'gif', 'png'];
            if (!allowedExt.some(function(ext) { return file.name.substr(-ext.length-1).toLowerCase() == '.' + ext; })) {
                userMessageList.push(new Message('Некорректный файл! Допустимые форматы: ' + allowedExt.join(', '), MessageType.WARNING));
                if (callbackError) {
                    callbackError();
                }
                return;
            }
            
            self.Locked(true);       
            
            var fd = new FormData();
            fd.append('image', file);
            fd.append('parentType', fileParentType);
            fd.append('parentId', self.Id());
            fd.append('title', self.Title.truncatedText(100));
            requestAjaxJson(
                'POST', 
                apiUrlBase + '/image', 
                fd, 
                function(data, textStatus, jqXHR) {
                    self.Images.push((new Image).unpack(data.data));
                    self.Locked(false);  
                    if (callbackSuccess) {
                        callbackSuccess(data, textStatus, jqXHR);
                    }                      
                },
                function(jqXHR, textStatus) {
                    self.Locked(false);
                    userMessageList.push(new Message('Не удалось загрузить изображение.', MessageType.ERROR));
                    if (callbackError) {
                        callbackError(jqXHR, textStatus);
                    }                    
                }    
            );
        };        
    }
    
    BaseModel.send = function(model, method, url, callbackSuccess, callbackError) {
        //var model = observableModel();
        model.Edited(model.Editing());
        model.Locked(true);
        model.Editing(false);        
        requestAjaxJson(
            method,  
            url || (apiUrlBase + '/' + model.getUri() + (model.Id() ? '/' + model.Id() : '')), 
            method != 'GET' ? model.pack() : null, 
            function (data, textStatus, jqXHR) { 
                model.Locked(false);
                model.Editing(false);
                model.Edited(false);

                if (callbackSuccess) {
                    callbackSuccess(data, textStatus, jqXHR);
                }
            },
            function (jqXHR, textStatus) {
                model.Locked(false);
                model.Editing(model.Edited());
                model.Edited(false);  
                
                if (callbackError) {
                    callbackError(jqXHR, textStatus);
                }
            }
        );
    };
    
    BaseModel.save = function(model, callbackSuccess, callbackError) {
        BaseModel.send(model, model.Id() ? 'PUT' : 'POST', '', callbackSuccess, callbackError);    
    }; 
    
    BaseModel.remove = function(model, callbackSuccess, callbackError) {
        BaseModel.send(model, 'DELETE', '', callbackSuccess, callbackError);    
    }; 
    
    BaseModel.load = function(model, modelId, callbackSuccess, callbackError) {
        var modelEditing = model.Editing();
        BaseModel.send(
            model, 
            'GET', 
            apiUrlBase + '/' + model.getUri() + '/' + modelId,
            function(data, textStatus, jqXHR) {
                model.Editing(modelEditing);
                if (callbackSuccess) {
                    callbackSuccess(data, textStatus, jqXHR);
                }
            }, 
            callbackError
        );    
    };     
    
    function Category(
        id, 
        title, 
        description,
        parentId,
        order
    ) {
        var self = this;
        ko.utils.extend(self, new BaseModel(id, title, description, order, 'category'));        
        
        self.Title          = self.Title.extend({ bounds: {minLen: 1, maxLen: 30, required: true}, truncatedText: true });
        self.Description    = self.Description.extend({ bounds: {maxLen: 1000}, truncatedText: true });;
        self.ParentId       = ko.observable(parentId);
    
        var parentUnpack = self.unpack;
        self.unpack = function(json) {
            parentUnpack(json);
            self.ParentId(json.parentId);
            return self;
        };
    
        var parentPack = self.pack;    
        self.pack = function() {
            return ko.utils.extend(
                parentPack(),
                {
                    parentId:   self.ParentId()
                }
            );
        };
    }

    function MainQuestion(
        id, 
        title, 
        description,
        categoryId,
        createDate,
        order,
        userId,
        active
    ) {
        var self = this;
        ko.utils.extend(self, new BaseModel(id, title, description, order, 'mainquestion'));
        
        self.Title          = self.Title.extend({ bounds: {minLen: 10, maxLen: 150, required: true}, truncatedText: true });        
        self.Description    = self.Description.extend({ bounds: {maxLen: 1000}, truncatedText: true });
        self.CategoryId     = ko.observable(categoryId).extend({ bounds: {required: true, requiredMessage: "Выберите значение"} });
        self.CreateDate     = ko.observable(createDate).extend({dateToStr: true});
        self.UserId         = ko.observable(userId);   
        self.Active         = ko.observable(active);                 
        
        self.finish = function(callbackSuccess, callbackError) {
            var model = self;
            var cbSuccess = function(json, textStatus, jqXHR) {
                model.unpack(json.data);
                if (callbackSuccess) {
                    callbackSuccess(json, textStatus, jqXHR);
                }
            };

            BaseModel.send(
                model, 
                'POST', 
                apiUrlBase + '/' + model.getUri() + '/' + model.Id() + '/finish', 
                cbSuccess, 
                callbackError
            );
        };        
        
        var parentUnpack = self.unpack;
        self.unpack = function(json) {
            parentUnpack(json);
            self.CategoryId(    json.categoryId);
            self.CreateDate(    json.createDate);
            self.UserId(        json.userId);
            self.Active(        json.active);
            return self;
        };
        
        var parentPack = self.pack;
        self.pack = function() {
            return ko.utils.extend(
                parentPack(),
                {
                    categoryId: self.CategoryId(),
                    userId:     0,
                    active:     self.Active()
                } 
            );                   
        };        
    };
    //inherit(MainQuestion, BaseModel);
    
    function MainAnswer(
        id, 
        title, 
        description,
        questionId,
        createDate,
        order,
        userId,
        linkUrl,
        linkTitle
    ) {
        var self = this;
        ko.utils.extend(self, new BaseModel(id, title, description, order, 'mainanswer'));
        
        self.Title          = self.Title.extend({ bounds: {minLen: 1, maxLen: 50, required: true}, truncatedText: true });
        self.Description    = self.Description.extend({ bounds: {maxLen: 500}, truncatedText: true });
        self.QuestionId     = ko.observable(questionId);
        self.CreateDate     = ko.observable(createDate).extend({dateToStr: true});
        self.UserId         = ko.observable(userId);
        self.LinkUrl        = ko.observable(linkUrl).extend({ bounds: {maxLen: 2000, isUrl: true}});
        self.LinkTitle      = ko.observable(linkTitle).extend({ bounds: {maxLen: 100}, truncatedText: true});        
        
        var parentUnpack = self.unpack;        
        self.unpack = function(json) {
            parentUnpack(json);
            self.QuestionId(    json.questionId);
            self.CreateDate(    json.createDate);
            self.UserId(        json.userId);
            self.LinkUrl(       json.linkUrl);
            self.LinkTitle(     json.linkTitle);
            return self;
        }; 

        var parentPack = self.pack;
        self.pack = function() {
            return ko.utils.extend(
                parentPack(),
                {
                    questionId: self.QuestionId(),
                    userId:     0,
                    linkUrl:    self.LinkUrl(),
                    linkTitle:  self.LinkTitle()                
                }
            );
        };         
    }    
       
    function SecondQuestion(
        id, 
        title, 
        description,
        parentId,
        createDate,
        order,
        userId
    ) {
        var self = this;
        ko.utils.extend(self, new BaseModel(id, title, description, order, 'secondaryquestion'));
        
        self.Title          = self.Title.extend({ bounds: {minLen: 10, maxLen: 150, required: true}, truncatedText: true });
        self.Description    = self.Description.extend({ bounds: {maxLen: 1000}, truncatedText: true });
        self.ParentId       = ko.observable(parentId);
        self.CreateDate     = ko.observable(createDate).extend({dateToStr: true});
        self.UserId         = ko.observable(userId);
        
        self.SecondAnswers  = baseObservableArray(); 
        
        var parentUnpack = self.unpack;
        self.unpack = function(json) {
            parentUnpack(json);
            self.ParentId(      json.parentId);
            self.CreateDate(    json.createDate);
            self.UserId(        json.userId);
            return self;
        };
        
        var parentPack = self.pack;
        self.pack = function() {
            return ko.utils.extend(
                parentPack(),
                {
                    parentId:   self.ParentId(),
                    userId:     0    
                }                  
            );
        };         
    };    
    
    function SecondAnswer(
        id, 
        title, 
        description,
        questionId,
        createDate,
        order,
        userId
    ) {
        var self = this;
        ko.utils.extend(self, new BaseModel(id, title, description, order, 'secondaryanswer'));
        
        self.Title          = self.Title.extend({ bounds: {minLen: 1, maxLen: 50, required: true}, truncatedText: true });
        self.Description    = self.Description.extend({ bounds: {maxLen: 150}, truncatedText: true });
        self.QuestionId     = ko.observable(questionId);
        self.CreateDate     = ko.observable(createDate).extend({dateToStr: true});
        self.UserId         = ko.observable(userId);

        self.MainAnswers    = baseObservableArray().extend({ bounds: {required: true, requiredMessage: "Выберите значение"} });
        
        var parentUnpack = self.unpack;
        self.unpack = function(json) {
            parentUnpack(json);
            self.QuestionId(    json.questionId);
            self.CreateDate(    json.createDate);
            self.UserId(        json.userId);
            return self;
        };
        
        var parentPack = self.pack;
        self.pack = function() {
            return ko.utils.extend(
                parentPack(),
                {
                    questionId: self.QuestionId(),
                    userId:     0                     
                }
            );
        };       
    }     
    
    function UserData(
        id, 
        login, 
        password,
        email,
        role
    ) {
        var self = this;
        ko.utils.extend(self, new BaseModel(id));
        
        self.Login    = ko.observable(login).extend({ bounds: {minLen: 1, maxLen: 20, required: true} });
        self.Password = ko.observable(password).extend({ bounds: {minLen: 6, maxLen: 32, required: true} });
        self.Email    = ko.observable(email);
        self.Role     = ko.observable(role);
        
        self.unpack = function(json) {
            self.Id(        json.id);
            self.Login(     json.login);
            self.Password(  json.password);
            self.Email(     json.email);
            self.Role(      json.role);
            return self;
        };   
        
        self.pack = function() {
            return {
                id:         self.Id(),
                login:      self.Login(),
                password:   self.Password(),
                email:      self.Email(),
                role:       self.Role()
            };
        };        
    };    
    
    function Image(
        id, 
        title, 
        description,
        parentType,
        parentId,
        order,
        createDate,
        userId,
        size,
        fileName,
        origFileName,
        urlData,
        urlThumbnail,
        urlMiddle,
        urlLarge
    ) {
        var self = this;
        ko.utils.extend(self, new BaseModel(id, title, description, order, 'image'));        
        
        self.Title          = self.Title.extend({ bounds: {maxLen: 100}, truncatedText: true });
        self.Description    = self.Description.extend({ bounds: {maxLen: 1000}, truncatedText: true });;
        self.ParentType     = ko.observable(parentType);
        self.ParentId       = ko.observable(parentId);
        self.CreateDate     = ko.observable(createDate).extend({dateToStr: true});
        self.UserId         = ko.observable(userId);
        self.Size           = ko.observable(size);
        self.FileName       = ko.observable(fileName);
        self.OrigFileName   = ko.observable(origFileName);
        self.UrlData        = ko.observable(urlData);
        self.UrlThumbnail   = ko.observable(urlThumbnail);
        self.UrlMiddle      = ko.observable(urlMiddle);
        self.UrlLarge       = ko.observable(urlLarge);
    
        var parentUnpack = self.unpack;    
        self.unpack = function(json) {
            parentUnpack(json);
            self.ParentType(        json.parentType);
            self.ParentId(          json.parentId);
            self.CreateDate(        json.createDate);
            self.UserId(            json.userId);
            self.Size(              json.size);
            self.FileName(          json.fileName);
            self.OrigFileName(      json.origFileName);
            self.UrlData(           json.urlData);
            self.UrlThumbnail(      json.urlThumbnail);
            self.UrlMiddle(         json.urlMiddle);
            self.UrlLarge(          json.urlLarge);
            return self;
        };   
    
        var parentPack = self.pack;
        self.pack = function() {
            return ko.utils.extend(
                parentPack(),
                {
                    parentType: self.ParentType(),
                    parentId:   self.ParentId()
                }
            );
        };
    }
    
    //-------------------------------------------------------
    // Модели представления
    
    /***************************************************************************
     * 
     * Модель: Прохождение теста
     * 
     ***************************************************************************/        
    function PassTestVM(mainQuestionId) {
        var mainQuestionId = mainQuestionId;
        var self = this;
        self.CurrentSecQuestion     = ko.observable(0);
        self.Finish                 = ko.observable(false);
        
        self.CategoryList           = baseObservableArray();
        self.MainQuestion           = ko.observable(null);
        //self.MainQuestionImageList  = baseObservableArray();
        self.SecondQuestionList     = baseObservableArray();
        self.SecondQuestion         = ko.observable(null);
        self.SecondAnswerList       = baseObservableArray();
        self.MainAnswerList         = baseObservableArray();
        self.RelMainAnswerList      = baseObservableArray();
        self.MainQuestionRelList    = baseObservableArray();
        
        self.VkShareButton          = ko.computed(function(){
            if (!self.MainAnswerList().length || !self.Finish() || (typeof VK === 'undefined')) { 
                return ''; 
            }
            var mainAnswer = self.MainAnswerList()[0];            
            return VK.Share.button({
                  url: window.location.href,
                  title: document.title,
                  description: mainAnswer.Title().toUpperCase() + ' - оптимальный вариант!',// + mainAnswer.Description(),
                  image: mainAnswer.Images().length 
                    ? mainAnswer.Images()[0].UrlThumbnail()
                    : window.location.protocol + '//' + window.location.hostname + '/uploads/thumbnail/default.png',
                  noparse: true
                },
                {
                    type: 'custom',
                    text: '<span class="btn btn-info btn-sm"><img src="/uploads/vkontakte.png"/> Поделиться ответом</span>'        
                }
            ); 
        });
        
        self.bind = function(mainQuestion, categoryList, htmlElementId) {           
            ko.applyBindings(self, document.getElementById(htmlElementId || "page-content-block"));
            self.CategoryList.unpack(categoryList, Category);
            self.MainQuestion((new MainQuestion()).unpack(mainQuestion));            
            
            requestAjaxJson('GET', apiUrlBase + "/mainquestion/" + mainQuestionId + "/mainanswer", null, function (json) {                
                self.MainAnswerList.unpack(json.data, MainAnswer);
                self.MainAnswerList.sort(sortQuestionAnswerArray);
            });
            

            var filterCount = 0;
            var params = {
                sortField:      [],
                sortOrder:      [],
                filterField:    [],
                filterType:     [],
                filterValue:    []
            };
            params.sortField[0] = 'id';
            params.sortOrder[0] = 'desc';
            params.filterField[filterCount] = 'id';
            params.filterType[filterCount] = '<>';
            params.filterValue[filterCount++] = self.MainQuestion().Id();            
            params.filterField[filterCount] = 'active';
            params.filterValue[filterCount++] = 1;                                   
            params.filterField[filterCount] = 'categoryId';
            params.filterValue[filterCount++] = self.MainQuestion().CategoryId();                                        
            requestAjaxJson('GET', apiUrlBase + "/mainquestion?limit=5&" + $.param(params), null, function (json) {                
                self.MainQuestionRelList.unpack(json.data, MainQuestion);
                //self.MainQuestionRelList.sort(sortQuestionAnswerArray);
            });            
            /*
            requestAjaxJson('GET', apiUrlBase + "/mainquestion/" + mainQuestionId + "/image", null, function (json) {                
                self.MainQuestionImageList(
                    json 
                    ? $.map(json.data, function (item) { return (new Image).unpack(item); }) 
                    : []
                );
                self.MainQuestionImageList.sort(sortQuestionAnswerArray);
            });            
            */
            /*
            self.MainQuestionImageList((new MainQuestion).unpack(mainQuestion).Images());
            self.MainQuestionImageList.sort(sortQuestionAnswerArray);
            */
            
            requestAjaxJson('GET', apiUrlBase + "/mainquestion/" + mainQuestionId + "/secondaryquestion", null, function (json) {                
                self.SecondQuestionList(
                    json
                    ? $.map(json.data, function (item) { return (new SecondQuestion).unpack(item); }) 
                    : []
                );
                // Авто-старт, проверка эффективности 29/10/2014
                if (self.CurrentSecQuestion() == 0 && !self.Finish()) {
                    self.start(); 
                }                
                /*
                setTimeout(
                    function() { 
                        if (self.CurrentSecQuestion() == 0 && !self.Finish()) {
                            self.start(); 
                        }
                    },
                    5000
                ); 
                */
            });            
        };      
        
        self.start = function() {
            self.CurrentSecQuestion(0);
            self.Finish(false);
            self.SecondQuestion(null);
            self.SecondAnswerList([]);
            self.RelMainAnswerList([]);
            self.MainAnswerList().forEach(function(elMa, indMa, arrMa) { elMa.Order(0); });
            self.nextQuestion();            
        };
        
        self.nextQuestion = function(selectedSecondAnswer) {
            finish = self.CurrentSecQuestion() + 1 > self.SecondQuestionList().length;
            if (self.CurrentSecQuestion() == 0) {                    
                self.MainAnswerList().forEach(function(elMa, indMa, arrMa) { elMa.Order(0); elMa.Expanded(false); });
                //$('body').scrollTo('.footer', 800, {offset: 0}); // http://plugins.jquery.com/scrollto/                
            }            
            if (selectedSecondAnswer instanceof SecondAnswer) {
                //alert("выбран ответ " + selectedSecondAnswer.Id);
                /*
                if (self.CurrentSecQuestion() == 1) {                    
                    self.MainAnswerList().forEach(function(elMa, indMa, arrMa) { elMa.Order(0); elMa.Expanded(false); });
                }
                */
                requestAjaxJson('GET', apiUrlBase + "/secondaryanswer/" + selectedSecondAnswer.Id() + "/mainanswer", null, 
                    function(json) {                
                        var collection = json 
                            ? $.map(json.data, function (item) { return (new MainAnswer).unpack(item); })
                            : [];
                        //ko.mapping.fromJS(collection, null, self.SecondAnswerList);
                        self.RelMainAnswerList(collection);                      
                        //---
                        self.RelMainAnswerList().forEach(function(elRel, indRel, arrRel) {
                            self.MainAnswerList().every(function(elMa, indMa, arrMa) {
                                if (elRel.Id() == elMa.Id()) { elMa.Order(elMa.Order() - 1); return false; }
                                return true;
                            });                     
                        });
                        self.MainAnswerList.sort(sortQuestionAnswerArray);                         
                        //---       
                        self.Finish(finish);
                    },
                    function() {self.Finish(finish);}
                );                
            };
            
            if (finish) {
                self.MainQuestion().finish();
            } else {
                self.CurrentSecQuestion(self.CurrentSecQuestion() + 1);
                self.SecondQuestion(self.SecondQuestionList()[self.CurrentSecQuestion() - 1]);
                
                self.SecondAnswerList([]);
                requestAjaxJson('GET', apiUrlBase + "/secondaryquestion/" + self.SecondQuestion().Id() + "/secondaryanswer", null, function (json) {                
                    var collection = json 
                        ? $.map(json.data, function (item) { return (new SecondAnswer).unpack(item); })
                        : [];
                    //ko.mapping.fromJS(collection, null, self.SecondAnswerList);
                    self.SecondAnswerList(collection);
                    self.SecondAnswerList.sort(sortQuestionAnswerArray);
                });                      
            }     
        };    
        
        self.getProgress = ko.computed(function() {
            return !self.SecondQuestionList().length || !self.CurrentSecQuestion() ? 0 : Math.round((self.CurrentSecQuestion()-1)*100/self.SecondQuestionList().length);
        });
    }
    
    /***************************************************************************
     * 
     * Модель: Создание теста
     * 
     ***************************************************************************/
    function CreateTestVM() {
        self = this;
        
        self.Step               = ko.observable(0);
        self.SecondQuestionIdx  = ko.observable(-1);
        self.EditMode           = ko.observable(false);
                                   
        self.MainQuestion       = ko.observable(new MainQuestion());        
        self.MainAnswerList     = baseObservableArray();
        self.SecondQuestionList = baseObservableArray();
        self.CategoryList       = baseObservableArray();
        
        // ВНИМАНИЕ! self.curSecondQuestion() может вернуть NULL!!!
        self.curSecondQuestion  = ko.computed(function() {
            if (!(self.SecondQuestionIdx() != -1 && self.SecondQuestionIdx() < self.SecondQuestionList().length)) {
                return null;
            }           
            var sqList = self.SecondQuestionList();
            return sqList[self.SecondQuestionIdx()];
        });

        self.MainAnswerList.Locked = function() {
            return this().some(function(item) { return item.Locked(); });
        };       
        
        self.SecondQuestionList.Locked = function() {
            return this().some(function(item) { 
                return item.Locked() 
                    || item.SecondAnswers().some(function(saItem){ return saItem.Locked(); });  
            });
        };  

        self.maxImagesMQ = function() { return 3; };
        self.maxImagesMA = function() { return 3; };
        
        self.bind = function(mainQuestionId, htmlElementId) {
            ko.applyBindings(self, document.getElementById(htmlElementId || "page-content-block"));            

            if (mainQuestionId) {
                self.EditMode(true);
                self.nextStep(1);             
                self.loadMainQuestion(mainQuestionId);                 
            }

            self.CategoryList.load(
                apiUrlBase + "/category", 
                Category, 
                true, 
                function() { self.CategoryList.sort(sortQuestionAnswerArray); }  
            );                                   
        };      
        
        self.loadMainQuestion = function(mainQuestionId) {
            self.MainQuestion().load(mainQuestionId);    
        };        
        
        self.nextStep = function(step) {
            self.Step(step || self.Step() + 1);
            
            if (self.Step() == 1) { // создание главного вопроса
                //self.MainQuestion(new MainQuestion());
                self.MainQuestion().Editing(true);           
            }
            
            if (self.Step() == 2) { // добавление ответов
                if (self.EditMode()) {
                    self.MainAnswerList.load(
                        apiUrlBase + "/mainquestion/" + self.MainQuestion().Id() + "/mainanswer", 
                        MainAnswer, 
                        true
                    );                       
                } else {
                    self.addMainAnswer();
                    self.addMainAnswer();
                }
            }
            
            if (self.Step() == 3) { // добавление наводящих вопросов с ответами
                self.MainAnswerList().forEach(function(item) {
                    if (!item.Id) {
                        self.saveMainAnswer(item);
                    }
                });
                if (self.EditMode()) {
                    self.SecondQuestionList.load(
                        apiUrlBase + "/mainquestion/" + self.MainQuestion().Id() + "/secondaryquestion", 
                        SecondQuestion, 
                        true,
                        function () { if (self.SecondQuestionList().length == 0) {self.addSecondQuestion();} }
                    );                      
                } else {
                    self.addSecondQuestion();
                }
            }   
            
            if (self.Step() == 4) { // финиш
                self.SecondQuestionIdx(-1);
            }                       
        };
        
        self.removeImage = function(parentModel, imageModel) {    
            if (confirm("Удалить изображение?")) {
                parentModel.Locked(true);        
                var funcUnlock = function() {
                    parentModel.Locked(false);     
                };
                parentModel.Images.removeModel(imageModel, funcUnlock, funcUnlock);
            }
        };  
        
        self.addMainQuestionImage = function(mainQuestion, event, file) {
            if (file == null) {
                return;
            }            
            var mqEditing = self.MainQuestion().Editing();
            var uploadImageFunc = function() {
                self.MainQuestion().uploadImage(
                    file,
                    function() {self.MainQuestion().Editing(mqEditing);/*self.nextStep(2);*/},
                    function() {self.MainQuestion().Editing(true);}
                );
            };
            
            if (!mainQuestion.Id()) {            
                mainQuestion.save(
                    function(data) {
                        uploadImageFunc();
                    }
                );
            } else {
                uploadImageFunc();
            }
        };        
        
        self.removeMainQuestion = function(mainQuestion) {
            if (confirm('Удалить подсказку?')) {
                mainQuestion.remove(
                    function() { window.location.href = '/user/question'; }
                );
            }
        };         
        
        self.saveMainQuestion = function(mainQuestion) {
            mainQuestion.save(function(data) {self.nextStep(2);});
        };              
        
        self.addMainAnswerImage = function(mainAnswer, event, file) {
            if (file == null) {
                return;
            }            
            var maEditing = mainAnswer.Editing();
            var uploadImageFunc = function(maIdx) {
                self.MainAnswerList()[maIdx].uploadImage(
                    file,
                    function() { self.MainAnswerList()[maIdx].Editing(maEditing); },
                    function() { self.MainAnswerList()[maIdx].Editing(true); }
                );
            };
            
            var maIdx = self.MainAnswerList().indexOf(mainAnswer);            
            if (!mainAnswer.Id()) {            
                mainAnswer.save(
                    function(data) {
                        uploadImageFunc(maIdx);
                    }
                );
            } else {
                uploadImageFunc(maIdx);
            }
        };        
        
        self.addMainAnswer = function() {
            var newMainAnswer = new MainAnswer();
            newMainAnswer.QuestionId(self.MainQuestion().Id());
            newMainAnswer.Editing(true);
            self.MainAnswerList.push(newMainAnswer);
            newMainAnswer.Order(self.MainAnswerList().length - 1);
            ko.computed(function(){
                if ((typeof newMainAnswer.LinkUrl() === 'string' && newMainAnswer.LinkUrl().length)
                    && (typeof newMainAnswer.LinkTitle() === 'undefined' || !newMainAnswer.LinkTitle().length)) {
                    var hostname = newMainAnswer.LinkUrl().match(/^(?:https?\:\/\/)(.+?)(?:[\/\:\?\#].*)?$/);
                    newMainAnswer.LinkTitle(hostname && hostname.length > 1 ? hostname[1] : newMainAnswer.LinkUrl().substring(0, 100));    
                } 
            });
        };      
        
        self.applyMainAnswers = function() {
            function tryNextStep() {
                if (self.MainAnswerList().every(function(ma) {return !Boolean(ma.Editing() || ma.Edited() || ma.Locked()); })) {
                    self.nextStep(3);
                }                
            };
            
            self.MainAnswerList().filter(function(ma) {return ma.Editing();})
                .forEach(function(ma) { ma.save(function(data) { tryNextStep(); }); });
            tryNextStep();
        };        
        
        self.addSecondQuestion = function() {
            var newSecondQuestion = new SecondQuestion();
            newSecondQuestion.ParentId(self.MainQuestion().Id());
            newSecondQuestion.Editing(true);
            self.SecondQuestionList.push(newSecondQuestion);
            self.SecondQuestionIdx(self.SecondQuestionList().length - 1);
            newSecondQuestion.Order(self.SecondQuestionIdx());
            self.addSecondAnswer(newSecondQuestion);
            self.addSecondAnswer(newSecondQuestion);
        };
        
        self.addSecondAnswer = function(secondQuestion) {
            var newSecondAnswer = new SecondAnswer();
            newSecondAnswer.QuestionId(secondQuestion.Id());
            newSecondAnswer.Editing(true);
            secondQuestion.SecondAnswers.push(newSecondAnswer);
            newSecondAnswer.Order(secondQuestion.SecondAnswers().length - 1);            
        };

        self.editSecondQuestion = function(secondQuestion) {
            if (self.SecondQuestionIdx() != -1) {
                alert('Вначале завершите редактирование другого вопроса!');
                return;
            }
            var sqIdx = self.SecondQuestionList.indexOf(secondQuestion); 
            self.SecondQuestionIdx(sqIdx);
            secondQuestion.Editing(true);
            
            if (secondQuestion.SecondAnswers().length == 0) {
                secondQuestion.Locked(true);
                secondQuestion.SecondAnswers.load(
                    apiUrlBase + "/secondaryquestion/" + secondQuestion.Id() + "/secondaryanswer", 
                    SecondAnswer, 
                    true,
                    function () { 
                        secondQuestion.SecondAnswers().forEach(function(sa) {
                            sa.Locked(true);
                            sa.MainAnswers.load(
                                apiUrlBase + "/secondaryanswer/" + sa.Id() + "/mainanswer", 
                                MainAnswer, 
                                true,
                                function () { 
                                    sa.MainAnswers(
                                        $.map(sa.MainAnswers(), function (ma) { return self.MainAnswerList.findById(ma.Id()); })
                                    );                                      
                                    sa.Locked(false);
                                    if (!secondQuestion.SecondAnswers.Locked()) {
                                        secondQuestion.Locked(false);
                                    }
                                }
                            );
                        });                         
                    }
                );                   
            }
        };

        self.applySecondQuestion = function(secondQuestion, addSecondQuestion) {
            addSecondQuestion = addSecondQuestion || false;
            var tryNextStep = function() {
                if (!secondQuestion || secondQuestion.SecondAnswers().every(function(sa) {
                    return !Boolean(sa.Editing() || sa.Edited() || sa.Locked());
                })) {
                    self.nextStep(4);
                }                
            };    
            var tryAddSecondQuestion= function() {
                if (!secondQuestion || secondQuestion.SecondAnswers().every(function(sa) {
                    return !Boolean(sa.Editing() || sa.Edited() || sa.Locked());
                })) {
                    self.addSecondQuestion();
                }                
            };                     
            
            var callbackOnSuccess = addSecondQuestion ? tryAddSecondQuestion : tryNextStep;
            if (secondQuestion) {
                self.saveSecondQuestion(secondQuestion, callbackOnSuccess);
            } else {
                callbackOnSuccess();    
            }          
        };
        
        self.removeSecondQuestion = function(secondQuestion) {
            self.SecondQuestionList.removeModel(
                secondQuestion, 
                function() { self.SecondQuestionIdx(-1); }, 
                undefined, 
                true
            );
        };        
        
        self.saveSecondQuestion = function(secondQuestion, callbackOnSuccess) {
            //console.log('saveSecondQuestion - ' + secondQuestion.Id());
            if (secondQuestion.Editing() || secondQuestion.SecondAnswers.Editing()) {
                secondQuestion.save(
                    function(data) {
                        secondQuestion.SecondAnswers().forEach(function(sa) { sa.QuestionId(secondQuestion.Id()); });
                        self.saveSecondAnswers(secondQuestion.SecondAnswers, callbackOnSuccess);
                    }
                );            
            } else {
                if (callbackOnSuccess) {
                    callbackOnSuccess();
                }
            }
        };
        
        self.saveSecondAnswers = function(secondAnswerList, callbackOnSuccess) {
            //console.log('saveSecondAnswers');
            if (secondAnswerList.Editing()) {
                secondAnswerList().forEach(function(secondAnswer) {
                    if (secondAnswer.Editing()) {
                        //console.log('saveSecondAnswer - ' + secondAnswer.Id());
                        secondAnswer.save(
                            function(data) {
                                secondAnswer.Locked(true);
                                self.saveSecondAnswerRel(secondAnswer, callbackOnSuccess);
                            }
                        );     
                    };           
                });              
            } else {
                if (callbackOnSuccess) {
                    callbackOnSuccess();
                }
            }
        };
        
        self.saveSecondAnswerRel = function(secondAnswer, callbackOnSuccess) {   
            //console.log('saveSecondAnswerRel - ' + secondAnswer.Id()); 
            var sendMainAnswers = [];
            secondAnswer.MainAnswers().forEach(function(mainAnswer) { sendMainAnswers.push(mainAnswer.pack()); });        
            requestAjaxJson(
                'POST',
                apiUrlBase + '/secondaryanswer/' + secondAnswer.Id() + '/setrel',
                sendMainAnswers,
                function(data) {
                    var mainAnswers = [];
                    data.data.forEach(function(item) {
                        mainAnswers.push((new MainAnswer).unpack(item));
                    });  
                    secondAnswer.MainAnswers(self.MainAnswerList().filter(function(item) {
                        return mainAnswers.some(function(item2) { return item.Id() == item2.Id(); });
                    }));    
                    secondAnswer.Locked(false);      
                    if (callbackOnSuccess) {    
                        //console.log('CallBackSuccess SecondAnswer - ' + secondAnswer.Id());    
                        callbackOnSuccess();
                    }
                },
                function() {
                    secondAnswer.Editing(true);
                    secondAnswer.Locked(false); 
                }
            );
        };
    };
    
    /**********************************************************
     * 
     * Подгружаемый список основных вопросов
     * 
     * ********************************************************/
    function MainQuestionListVM(categoryId, withInactive, currentUserVM, editMode) {
        var self = this;
        var userId = typeof currentUserVM == 'undefined' ? 0 : currentUserVM.UserData().Id();
        
        self.MainQuestionList   = baseObservableArray();     
        self.CategoryList       = baseObservableArray();           
        self.IsEndOfList        = ko.observable(false);
        self.CategoryId         = ko.observable(categoryId);
        self.FilterActive       = ko.observable(withInactive ? NoYesAll.All : NoYesAll.Yes);
        self.FilterUserId       = ko.observable(userId);
        self.EditMode           = ko.observable(editMode ? true : false);
        self.LastMainQuestionId = ko.computed(function() {
            var mq = self.MainQuestionList()[self.MainQuestionList().length - 1];
            return mq ? mq.Id() : 2147483647;
        });      
        self.Loading            = ko.computed(function() { //TODO Удалить и исправить шаблон tpl
           return self.MainQuestionList.Loading();
        });
        
        self.bind = function(mainQuestionList, categoryList, htmlElementId) {            
            if (mainQuestionList) {
                self.MainQuestionList.unpack(mainQuestionList, MainQuestion);
            }
            
            if (categoryList) {
                self.CategoryList.unpack(categoryList, Category);
            }
                      
            $(window).scroll(onWindowScroll);
            $(".list-item-static").hide();
            ko.applyBindings(self, document.getElementById(htmlElementId || "page-content-block"));
            
            if (needLoadOlderList()) {
                asyncLoadOlderList();
            } 
        };
        
        self.activateMainQuestion = function(mainQuestion) {
            mainQuestion.Active(mainQuestion.Active() == true ? false : true);
            mainQuestion.save();
        };        
        
        self.removeMainQuestion = function(mainQuestion) {
            if (confirm("Удалить подсказку?")) {
                BaseModel.remove(
                    mainQuestion, 
                    function() {
                        self.MainQuestionList.remove(mainQuestion);
                    }
                );
            }    
        };
        
        self.asyncLoadOlderList = asyncLoadOlderList;
        
        function onWindowScroll(){
            if (needLoadOlderList())
                asyncLoadOlderList();
        }
        
        function needLoadOlderList() {
            return !self.IsEndOfList() && (!self.MainQuestionList().length || ($(document).height() - $(window).height() - 100 <= $(window).scrollTop()));
        }        
        
        function asyncLoadOlderList() {
            if (!self.MainQuestionList.Loading()) {
                var filterCount = 0;
                var params = {
                    sortField:      [],
                    sortOrder:      [],
                    filterField:    [],
                    filterType:     [],
                    filterValue:    []
                };
                params.sortField[0] = 'id';
                params.sortOrder[0] = 'desc';
                params.filterField[filterCount] = 'id';
                params.filterType[filterCount]  = '<';
                params.filterValue[filterCount++] = self.LastMainQuestionId();
                if (self.FilterActive() == NoYesAll.Yes) {
                    params.filterField[filterCount] = 'active';
                    params.filterValue[filterCount++] = 1;   
                } else if (self.FilterActive() == NoYesAll.No) {
                    params.filterField[filterCount] = 'active';
                    params.filterValue[filterCount++] = 0;                       
                }
                if (self.CategoryId()) {
                    params.filterField[filterCount] = 'categoryId';
                    params.filterValue[filterCount++] = self.CategoryId();     
                }        
                if (self.FilterUserId()) {
                    params.filterField[filterCount] = 'userId';
                    params.filterValue[filterCount++] = self.FilterUserId();                    
                }       
                self.MainQuestionList.load(
                    apiUrlBase + '/mainquestion?limit=10&' + $.param(params), 
                    MainQuestion, 
                    false, 
                    function(json) { if (!json.data.length || json.data.length < 10) {self.IsEndOfList(true);} }
                );
            }
        }        
    }
    
    /**********************************************************
     * 
     * Текущий пользователь
     * 
     * ********************************************************/
    function CurrentUserVM(userData) {
        var self = this;
        
        self.UserData = ko.observable(typeof userData == 'undefined' ? new UserData : (new UserData).unpack(userData)); 
        self.FormLoginVisible = ko.observable(false);
        self.Messages = ko.observableArray();        
        
        self.bind = function(htmlElementId) {
            ko.applyBindings(self, document.getElementById(htmlElementId || "bs-navbar-collapse-1"/* "page-navbar-user-block"*/));
        };
        
        self.reloadPage = function(redirectToMainPage) {
            redirectToMainPage = redirectToMainPage || false;
            var pagesWithoutReload = [
                /^https?:\/\/[^/]+\/$/,
                /^https?:\/\/[^/]+\/about$/,
                /^https?:\/\/[^/]+\/category\/\d+$/,
                /^https?:\/\/[^/]+\/question\/\d+$/
            ];
            if (!pagesWithoutReload.some(function(item) { return window.location.href.match(item); })){
                if (redirectToMainPage) {window.location.href = '/';} else {window.location.reload();}
            } 
        };
        
        self.register = function() {
            if (self.isRegisteredUser()) {
                self.Messages.push(new Message('Вы уже вошли под пользователем ' + self.UserData().login(), MessageType.ERROR));
                return;
            } 
            self.UserData().Email(new Date().getTime() + '@dummy.com');
            self.UserData().Locked(true);
            requestAjaxJson(
                'POST',
                apiUrlBase + '/user/current/register',
                self.UserData().pack(),
                function (data) {
                    if (data.data) {
                        self.FormLoginVisible(false);
                        self.UserData((new UserData).unpack(data.data));
                        self.reloadPage();
                    }
                },
                function() { self.UserData().Locked(false); }
            );
        };
        
        self.login = function() {
            if (self.isRegisteredUser()) {
                self.Messages.push(new Message('Вы уже вошли под пользователем ' + self.UserData().login(), MessageType.ERROR));
                return;
            }
            self.UserData().Locked(true);
            requestAjaxJson(
                'POST',
                apiUrlBase + '/user/current/login',
                self.UserData().pack(),
                function (data) {
                    if (data.data) {
                        self.FormLoginVisible(false);
                        self.UserData((new UserData).unpack(data.data));
                        self.reloadPage();                        
                    }
                },
                function() { self.UserData().Locked(false); }
            );
        };   
        
        self.logout = function() {
            if (!self.isRegisteredUser()) {
                return;
            }
            self.UserData().Locked(true);
            requestAjaxJson(
                'POST',
                apiUrlBase + '/user/current/logout',
                self.UserData().pack(),
                function (data) {
                    if (data.data) {
                        self.UserData((new UserData).unpack(data.data));
                        self.reloadPage(true);                        
                    }
                },
                function() { self.UserData().Locked(false); }
            );
        };              
        
        self.isRegisteredUser = ko.computed(function() {
            return Boolean(self.UserData().Id());
        });  
        
        self.isAdmin = ko.computed(function() {
            return self.UserData().Role() == 3;
        });                   
    }    
    
    /**********************************************************
     * 
     * Сообщения для пользователя
     * 
     * ********************************************************/
    function MessagesVM(msgList) {
        var self = this;
        var elementId = "message-modal-block";
        
        self.MessageList = userMessageList;
        if (msgList) {
            self.MessageList(msgList);  
        }

        self.maxType = ko.computed(function(){
            var maxType = 0;
            self.MessageList().forEach(function(item){maxType = maxType < item.Type ? item.Type : maxType;});
            return maxType;
        });

        self.title = ko.computed(function(){
            switch (self.maxType()) {
                case MessageType.NOTIFICATION:  return 'Уведомление';
                case MessageType.SUCCESS:       return 'Успех';
                case MessageType.WARNING:       return 'Предупреждение';
                case MessageType.ERROR:         return 'Ошибка';
            }
        }); 
        
        self.bind = function(htmlElementId) {
            ko.applyBindings(self, document.getElementById(htmlElementId || elementId));
        };   
        
        self.showModal = ko.computed(function(){
            if (self.MessageList().length) {
               $('#' + elementId + ' .modal').modal('show');
            } else {
               $('#' + elementId + ' .modal').modal('hide'); 
            }
        });
       
        self.clear = function() {
            self.MessageList([]);
        };

        $('#' + elementId + ' .modal').on('hidden.bs.modal', self.clear);
    } 
    
    var userMessageList = ko.observableArray();
    userMessageList.addMessage = function(message) {
        var eqMessages = userMessageList().filter(function(item) {
            if (item.Text == message.Text && item.Type == message.Type) {return true;} else {return false;} 
        });  
        if (!eqMessages.length) {
            userMessageList.push(message);
        }
    };
    
    ko.extenders.bounds = function(target, options) {
        var required    = options.required || false;
        var minLen      = options.minLen || 0;
        var maxLen      = options.maxLen || 0;
        var isUrl       = options.isUrl || false;          
        target.hasError = ko.observable();
        target.validationMessage = ko.observable();

        function validate(newValue) {
            var condRequired = !required    || ((!Array.isArray(newValue) && newValue)  || (Array.isArray(newValue) && newValue.length));
            var condMinLen   = !Boolean(minLen) || (newValue && newValue.length >= minLen);
            var condMaxLen   = !Boolean(maxLen) || !newValue || (newValue && newValue.length <= maxLen);            
            target.hasError(condRequired && condMinLen && condMaxLen ? false : true);
            if (!condRequired) {
                target.validationMessage(options.requiredMessage || "Обязательно для заполнения");
            } else if (!condMinLen) {
                target.validationMessage(options.minLenMessage || "Значение должно быть не короче " + minLen);                
            } else if (!condMaxLen) {
                target.validationMessage(options.maxLenMessage || "Значение должно быть не длиннее " + maxLen);                
            } else {
                target.validationMessage("");
            }
            if (isUrl && !target.hasError() && typeof newValue !== 'undefined' && newValue.length            
                && (                    
                    typeof newValue !== 'string'
                    || (
                         !isValidUrl(newValue)
                      && !( // таким хитрым способом добавляем в начало HTTP://
                            newValue.substring(0, 4) != 'http' 
                         && (newValue = 'http://' + newValue) 
                         && isValidUrl(newValue) 
                         && (target(newValue) || true)
                          )  
                       )
                )) {
                target.hasError(true);
                target.validationMessage("Введите корректный URL-адрес");
            }
                        
        }
        validate(target());
        target.subscribe(validate);
        return target;
    };    
    
    ko.extenders.dateToStr = function(target) {
        target.dateToStr = function(onlyDate) {
            onlyDate = typeof onlyDate == 'undefined' ? true : onlyDate; 
            if (!target()) {
                return '';
            }            
            var dateint = target();
            var date = new Date(dateint * 1000);
            var month = date.getMonth()+1;
            var day   = date.getDate();   
            dateStr = (day < 10 ? '0' : '') + day + '.' 
                      + (month < 10 ? '0' : '') + month + '.' 
                      + date.getFullYear();
            return onlyDate ? dateStr : dateStr + ' ' + date.toLocaleTimeString();
        };
        return target;
    };
    
    ko.extenders.truncatedText = function(target) {
        target.truncatedText = function(maxLen) {
            maxLen = maxLen || 100;
            var originalText = target();
            return originalText.length > maxLen ? originalText.substring(0, maxLen - 3) + "..." : originalText;
        };
        return target;
    };    
    
    ko.extenders.baseList = function(target) {
        target.findById = function(searchId) {
            return target().filter(function(baseModel){ return baseModel.Id() == searchId; }).pop();
        }; 
        
        target.saveAll = function(callbackSuccess, callbackError) {
            var sucModels = errModels = [];
            target().every(function(baseModel) { 
                baseModel.save(function() { sucModels.push(baseModel); }, function() { errModels.push(baseModel); });
            });
            if (errModels.length && callbackError) {
                callbackError(errModels);
            }
            if (!errModels.length && callbackSuccess) {
                callbackSuccess(sucModels);
            }            
        }; 
        
        target.removeModel = function(baseModel, callbackSuccess, callbackError, withConfirm) {
            withConfirm = withConfirm || false;
            
            if (target.indexOf(baseModel) == -1) {
                return false;
            } 
            
            if (!(withConfirm ? confirm('Удалить объект?') : true)) {
                return false;
            }
            
            if (baseModel.Id()) {
                BaseModel.remove(
                    baseModel,
                    function(json, textStatus, jqXHR) {
                        target.remove(baseModel);
                        if (callbackSuccess) {
                            callbackSuccess(json, textStatus, jqXHR);
                        }
                    }, 
                    callbackError
                );
            } else {
                target.remove(baseModel);
                if (callbackSuccess) {
                    callbackSuccess();
                }                
            }
            
            return true;
        };     
            
        target.removeAll = function(callbackSuccess, callbackError) {
            target().forEach(function(baseModel) { target.removeModel(baseModel, callbackSuccess, callbackError); });
        };               
           
        target.Locked = function(locked) {
            if (typeof locked !== 'undefined') {
                locked = Boolean(locked);
                target().forEach(function(baseModel) { baseModel.Locked(locked); });
            }
            return target().some(function(baseModel) { return baseModel.Locked(); });
        };       
        
        target.Editing = function(editing) {
            if (typeof editing !== 'undefined') {
                editing = Boolean(editing);
                target().forEach(function(baseModel) { baseModel.Editing(editing); });
            }
            return target().some(function(baseModel) { return baseModel.Editing(); });
        };            

        target.load = function(url, modelConstructor, replaceData, callbackSuccess, callbackError) {
            replaceData = (typeof replaceData === 'undefined') ? true : replaceData;
            
            if (!target.Loading()) {
                target.Loading(true);
                
                requestAjaxJson(
                    'GET',
                    url,
                    null,
                    function(json, textStatus, jqXHR) {
                        if (replaceData) {
                            target($.map(json.data, function(item){ return (new modelConstructor).unpack(item); }));
                        } else {      
                            if (Array.isArray(json.data)) {
                                json.data.forEach(function(item){
                                    target.push((new modelConstructor).unpack(item));
                                });
                            } 
                        }
                        target.Loading(false);
                        if (callbackSuccess) {
                            callbackSuccess(json, textStatus, jqXHR);
                        }
                    },
                    function(jqXHR, textStatus) {
                        target.Loading(false);
                        if (callbackError) {
                            callbackError(jqXHR, textStatus);    
                        }                    
                    }
                );   
            }         
        };

        target.unpack = function(data, modelConstructor) {
            if (Array.isArray(data)) {
                target($.map(data, function(item) { return (new modelConstructor).unpack(item); }));                
            }
        };

        target.Loading = ko.observable(false);        

        return target;
    };      
    
    ko.bindingHandlers.thumbnail = {
        //http://knockoutjs.com/documentation/custom-bindings.html
        init: function(element, valueAccessor, allBindings, viewModel, bindingContext) {
        },
        update: function(element, valueAccessor, allBindings, viewModel, bindingContext) {
            var value = ko.unwrap(valueAccessor());
            if (value.src) {
                $(element).attr('href', ko.unwrap(value.src));
            }
            if (value.title) {
                $(element).attr('title', ko.unwrap(value.title));
            }
            Shadowbox.addCache(element);
        }
    };     
    
    ko.bindingHandlers.visibleAndScroll = {
        //http://knockoutjs.com/documentation/custom-bindings.html
        init: function(element, valueAccessor, allBindings, viewModel, bindingContext) {
        },
        update: function(element, valueAccessor, allBindings, viewModel, bindingContext) {               
            var value = ko.unwrap(valueAccessor());                       
            var visible = ko.unwrap(value.visible);
            visible = typeof visible !== 'undefined' ? Boolean(visible) : false;            
            var offset = ko.unwrap(value.offset);
            offset = typeof offset !== 'undefined' 
                ? (typeof offset === 'string' && offset.indexOf('%') != -1 
                    ? parseInt($(window).height() * parseInt(offset) / 100) 
                    : parseInt(offset)) 
                : 0;
            var delay = ko.unwrap(value.delay);
            delay = typeof delay !== 'undefined' ? delay : 800;
            
            var isVisible = $(element).is(':visible');
                        
            $(element).toggle(visible);            
            
            if (visible && !isVisible) {
                $('body').scrollTo(element, delay, {offset: offset}); 
            }
        }
    };            
    
    var apiUrlBase = '/api';
    
    var sortQuestionAnswerArray = function(left, right, desc) {
        desc = desc || false;
        kf = desc ? -1 : 1;
        
        return left.Order() == right.Order() 
            ? (left.Title() == right.Title() ? 0 : (left.Title() < right.Title() ? -1*kf : 1*kf))
            : (left.Order() < right.Order() ? -1*kf : 1*kf);
    };  
    
    var requestAjaxJson = function (requestType, serviceUrl, sendData, callback, callbackError) {
        //console.log(serviceUrl);        
        cbError = function (jqXHR, textStatus) {
                console.log("-->\n" + serviceUrl + "\n" + jqXHR.status + " " + textStatus + ":" + jqXHR.statusText + "\n" + jqXHR.responseText + "\n<--");
                switch (textStatus) {
                    case "timeout":
                    case "abort":
                        userMessageList.addMessage(new Message("Нет связи с сервером, проверьте подключение к Интернету.", MessageType.ERROR));
                        break;                   
                    case "error": 
                        var parseMessage = false;
                        try {
                            data = JSON.parse(jqXHR.responseText);
                            if (data.message && data.message.length) {
                                data.message.forEach(function(item) {
                                    userMessageList.addMessage(new Message(item.text, item.type));
                                });    
                                parseMessage = true;
                            }
                        }
                        catch (e) {}
                        if (parseMessage) {
                            break;
                        }
                    default:
                        switch (jqXHR.status) {
                            case 401: //UNATHORIZED
                                userMessageList.addMessage(new Message("Вначале войдите на сайт под своим именем или зарегистриуйтесь!", MessageType.ERROR));
                                break;
                            case 403: //FORBIDDEN
                                userMessageList.addMessage(new Message("У вас недостаточно прав на выполнение операции!", MessageType.ERROR));                            
                                break;
                            default:
                                userMessageList.addMessage(new Message("Неопознанная внутренняя ошибка!", MessageType.ERROR));
                        }                        
                }
                if (callbackError) {
                    callbackError(jqXHR, textStatus);    
                }
            };

        $.ajax({
            url: serviceUrl,
            data: sendData != null ? (sendData instanceof FormData ? sendData : JSON.stringify(sendData)) : null,
            type: requestType,
            dataType: 'json',
            cache: false,
            async: true,
            contentType: sendData instanceof FormData ? false : 'application/json; charset=utf-8',
            processData: sendData instanceof FormData ? false : true,
            success: callback,
            error: cbError
        });
    };

    function isValidUrl(str) {
        var pattern = new RegExp('^(https?:\\/\\/)'+ // protocol
        '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name
        '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
        '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
        '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
        '(\\#[-a-z\\d_]*)?$','i'); // fragment locator
    
        return pattern.test(str);
    }

    return {
        PassTestVM: PassTestVM,
        CreateTestVM: CreateTestVM,
        MainQuestionListVM: MainQuestionListVM,
        CurrentUserVM: CurrentUserVM,
        MessageType: MessageType,
        MessagesVM: MessagesVM
    };    
}();
