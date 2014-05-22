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
        var observableArray = ko.observableArray(baseModelArray);
        observableArray.findById = function(searchId) {
            return this().filter(function(item){ return item.Id() == searchId; }).pop();
        };        
        return observableArray;    
    }     
    
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
        
        var uri = resUri;
        self.getUri = function() {
            return uri;
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
            if (!allowedExt.some(function(ext) { return file.name.substr(-ext.length-1) == '.' + ext; })) {
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
    
    BaseModel.send = function(model, method, callbackSuccess, callbackError) {
        //var model = observableModel();
        model.Edited(model.Editing());
        model.Locked(true);
        model.Editing(false);        
        requestAjaxJson(
            method,  
            apiUrlBase + '/' + model.getUri() + (model.Id() ? '/' + model.Id() : ''), 
            model.pack(), 
            function (data, textStatus, jqXHR) { 
                //observableModel(model.unpack(data.data));
                if (callbackSuccess) {
                    callbackSuccess(data, textStatus, jqXHR);
                }
            },
            function (jqXHR, textStatus) {
                model.Editing(model.Edited());
                model.Locked(false);
                model.Edited(false);                
                
                if (callbackError) {
                    callbackError(jqXHR, textStatus);
                }
            }
        );
    };
    
    BaseModel.save = function(model, callbackSuccess, callbackError) {
        BaseModel.send(model, model.Id() ? 'PUT' : 'POST', callbackSuccess, callbackError);    
    }; 
    
    BaseModel.remove = function(model, callbackSuccess, callbackError) {
        BaseModel.send(model, 'DELETE', callbackSuccess, callbackError);    
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
    
        self.unpack = function(json) {
            self.Id(            json.id);
            self.Title(         json.title);
            self.Description(   json.description);
            self.ParentId(      json.parentId);
            self.Order(         json.order);
            return self;
        };
    
        self.pack = function() {
            return {
                id:         self.Id(),
                title:      self.Title(),
                description:self.Description(), 
                parentId:   self.ParentId(),
                order:      self.Order()
            };
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
        self.CreateDate     = ko.observable(createDate);
        self.UserId         = ko.observable(userId);   
        self.Active         = ko.observable(active);          
        
        self.unpack = function(json) {
            self.Id(            json.id);
            self.Title(         json.title);
            self.Description(   json.description);
            self.CategoryId(    json.categoryId);
            self.CreateDate(    json.createDate);
            self.Order(         json.order);
            self.UserId(        json.userId);
            self.Active(        json.active);
            return self;
        };
        
        self.pack = function() {
            return {
                id:         self.Id(),
                title:      self.Title(),
                description:self.Description(), 
                categoryId: self.CategoryId(),
                order:      self.Order(),
                userId:     0,
                active:     self.Active()                    
            };
        };        
    };
    
    function MainAnswer(
        id, 
        title, 
        description,
        questionId,
        createDate,
        order,
        userId
    ) {
        var self = this;
        ko.utils.extend(self, new BaseModel(id, title, description, order, 'mainanswer'));
        
        self.Title          = self.Title.extend({ bounds: {minLen: 1, maxLen: 50, required: true}, truncatedText: true });
        self.Description    = self.Description.extend({ bounds: {maxLen: 500}, truncatedText: true });
        self.QuestionId     = ko.observable(questionId);
        self.CreateDate     = ko.observable(createDate);
        self.UserId         = ko.observable(userId);
        
        self.unpack = function(json) {
            self.Id(            json.id);
            self.Title(         json.title); 
            self.Description(   json.description);
            self.QuestionId(    json.questionId);
            self.CreateDate(    json.createDate);
            self.Order(         json.order);
            self.UserId(        json.userId);
            return self;
        }; 

        self.pack = function() {
            return {
                id:         self.Id(),
                title:      self.Title(),
                description:self.Description(), 
                questionId: self.QuestionId(),
                order:      self.Order(),    
                userId:     0                 
            };
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
        self.CreateDate     = ko.observable(createDate);
        self.UserId         = ko.observable(userId);
        
        self.SecondAnswers  = baseObservableArray(); 
        
        self.unpack = function(json) {
            self.Id(            json.id);
            self.Title(         json.title);
            self.Description(   json.description);
            self.ParentId(      json.parentId);
            self.CreateDate(    json.createDate);
            self.Order(         json.order);
            self.UserId(        json.userId);
            return self;
        };
        
        self.pack = function() {
            return {
                id:         self.Id(),
                title:      self.Title(),
                description:self.Description(), 
                parentId:   self.ParentId(),
                order:      self.Order(),
                userId:     0                      
            };
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
        self.CreateDate     = ko.observable(createDate);
        self.UserId         = ko.observable(userId);

        self.MainAnswers    = baseObservableArray().extend({ bounds: {required: true, requiredMessage: "Выберите значение"} });
        
        self.unpack = function(json) {
            self.Id(            json.id);
            self.Title(         json.title);
            self.Description(   json.description);
            self.QuestionId(    json.questionId);
            self.CreateDate(    json.createDate);
            self.Order(         json.order);
            self.UserId(        json.userId);
            return self;
        };
        
        self.pack = function() {
            return {
                id:         self.Id(),
                title:      self.Title(),
                description:self.Description(), 
                questionId: self.QuestionId(),
                order:      self.Order(),
                userId:     0                     
            };
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
        
        self.Login    = ko.observable(login);
        self.Password = ko.observable(password);
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
        self.CreateDate     = ko.observable(createDate);
        self.UserId         = ko.observable(userId);
        self.Size           = ko.observable(size);
        self.FileName       = ko.observable(fileName);
        self.OrigFileName   = ko.observable(origFileName);
        self.UrlData        = ko.observable(urlData);
        self.UrlThumbnail   = ko.observable(urlThumbnail);
        self.UrlMiddle      = ko.observable(urlMiddle);
        self.UrlLarge       = ko.observable(urlLarge);
    
        self.unpack = function(json) {
            self.Id(                json.id);
            self.Title(             json.title); 
            self.Description(       json.description);
            self.ParentType(        json.parentType);
            self.ParentId(          json.parentId);
            self.Order(             json.order);
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
    
        self.pack = function() {
            return {
                id:         self.Id(),
                title:      self.Title(),
                description:self.Description(), 
                parentType: self.ParentType(),
                parentId:   self.ParentId(),
                order:      self.Order()                
            };
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
        
        self.MainQuestionImageList  = baseObservableArray();
        self.SecondQuestionList     = baseObservableArray();
        self.SecondQuestion         = ko.observable(null);
        self.SecondAnswerList       = baseObservableArray();
        self.MainAnswerList         = baseObservableArray();
        self.RelMainAnswerList      = baseObservableArray();
        
        self.bind = function(htmlElementId) {
            ko.applyBindings(self, document.getElementById(htmlElementId || "page-content-block"));
            
            requestAjaxJson('GET', apiUrlBase + "/mainquestion/" + mainQuestionId + "/mainanswer", null, function (json) {                
                self.MainAnswerList(
                    json 
                    ? $.map(json.data, function (item) { 
                        var ma = (new MainAnswer).unpack(item);
                        requestAjaxJson('GET', apiUrlBase + "/mainanswer/" + ma.Id() + "/image", null, function (json) {                
                            ma.Images(
                                json 
                                ? $.map(json.data, function (item) { return (new Image).unpack(item); }) 
                                : []
                            );
                        });  
                        return ma;                       
                    }) 
                    : []
                );
                self.MainAnswerList.sort(sortQuestionAnswerArray);
            });
            
            requestAjaxJson('GET', apiUrlBase + "/mainquestion/" + mainQuestionId + "/image", null, function (json) {                
                self.MainQuestionImageList(
                    json 
                    ? $.map(json.data, function (item) { return (new Image).unpack(item); }) 
                    : []
                );
                self.MainQuestionImageList.sort(sortQuestionAnswerArray);
            });            
            
            requestAjaxJson('GET', apiUrlBase + "/mainquestion/" + mainQuestionId + "/secondaryquestion", null, function (json) {                
                self.SecondQuestionList(
                    json
                    ? $.map(json.data, function (item) { return (new SecondQuestion).unpack(item); }) 
                    : []
                );
            });            
            //ko.mapping.fromJS(json, mappingOptions(), model);
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
            if (selectedSecondAnswer instanceof SecondAnswer) {
                //alert("выбран ответ " + selectedSecondAnswer.Id);
                if (self.CurrentSecQuestion() == 1) {
                    self.MainAnswerList().forEach(function(elMa, indMa, arrMa) { elMa.Order(0); });
                }
                requestAjaxJson('GET', apiUrlBase + "/secondaryanswer/" + selectedSecondAnswer.Id() + "/mainanswer", null, function (json) {                
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
                });                
            };
            
            if (self.CurrentSecQuestion() + 1 <= self.SecondQuestionList().length) {
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
            } else {
                self.Finish(true);
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
                
        self.MainQuestion       = ko.observable(new MainQuestion());        
        self.MainAnswerList     = baseObservableArray();
        self.SecondQuestionList = baseObservableArray();
        //self.SecondAnswerList   = baseObservableArray();
        self.CategoryList       = baseObservableArray();
        /*
        self.CategoryList.findById = function(searchId) {
            return this().filter(function(item){ return item.Id() == searchId; }).pop();
        };
        */
        self.MainAnswerList.Locked = function() {
            return this().some(function(item) { return item.Locked(); });
        };       
        
        self.SecondQuestionList.Locked = function() {
            return this().some(function(item) { 
                return item.Locked() 
                    || item.SecondAnswers().some(function(saItem){ return saItem.Locked(); });  
            });
        };  
        
        self.bind = function(htmlElementId) {
            ko.applyBindings(self, document.getElementById(htmlElementId || "page-content-block"));
            
            requestAjaxJson('GET', apiUrlBase + "/category", null, function (json) {                
                self.CategoryList(
                    json 
                    ? $.map(json.data, function (item) { return (new Category).unpack(item); }) 
                    : []
                );
                self.CategoryList.sort(sortQuestionAnswerArray);
            }); 
        };      
        
        self.nextStep = function(step) {
            self.Step(step || self.Step() + 1);
            
            if (self.Step() == 1) { // создание главного вопроса
                self.MainQuestion(new MainQuestion());
                self.MainQuestion().Editing(true);           
            }
            
            if (self.Step() == 2) { // добавление ответов
                self.addMainAnswer();
                self.addMainAnswer();
            }
            
            if (self.Step() == 3) { // добавление наводящих вопросов с ответами
                self.MainAnswerList().forEach(function(item) {
                    if (!item.Id) {
                        self.saveMainAnswer(item);
                    }
                });
                self.addSecondQuestion();
            }   
            
            if (self.Step() == 4) { // финиш
                self.SecondQuestionIdx(-1);
            }                       
        };
        
        self.addMainQuestionImage = function(mainQuestion, event, file) {
            if (file == null) {
                return;
            }            
            
            var uploadImageFunc = function() {
                self.MainQuestion().uploadImage(
                    file,
                    function() {self.MainQuestion().Editing(false);self.nextStep(2);},
                    function() {self.MainQuestion().Editing(true);}
                );
            };
            
            if (!mainQuestion.Id()) {            
                BaseModel.save(
                    mainQuestion, 
                    function(data) {
                        self.MainQuestion((new MainQuestion).unpack(data.data));
                        uploadImageFunc();
                    }
                );
            } else {
                uploadImageFunc();
            }
        };        
        
        self.saveMainQuestion = function(mainQuestion) {
            BaseModel.save(
                mainQuestion, 
                function(data) {
                    self.MainQuestion((new MainQuestion).unpack(data.data));
                    self.nextStep(2);  
                }
            );
        };      
        
        self.addMainAnswerImage = function(mainAnswer, event, file) {
            if (file == null) {
                return;
            }            
            
            var uploadImageFunc = function(maIdx) {
                self.MainAnswerList()[maIdx].uploadImage(
                    file,
                    function() { self.MainAnswerList()[maIdx].Editing(false); },
                    function() { self.MainAnswerList()[maIdx].Editing(true); }
                );
            };
            
            var maIdx = self.MainAnswerList().indexOf(mainAnswer);            
            if (!mainAnswer.Id()) {            
                BaseModel.save(
                    mainAnswer,
                    function(data) {
                        self.MainAnswerList.replace(mainAnswer, (new MainAnswer).unpack(data.data));
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
        };      
        
        self.saveMainAnswer = function(mainAnswer) {
            BaseModel.save(
                mainAnswer,
                function(data) {
                    self.MainAnswerList.replace(mainAnswer, (new MainAnswer).unpack(data.data));
                }
            );
        };
        
        self.applyMainAnswers = function() {
            function tryNextStep() {
                if (self.MainAnswerList().every(function(item) {
                    if (item.Editing() || item.Edited()) {return false;}
                    return true;
                })) {
                    self.nextStep(3);
                }                
            };
            
            self.MainAnswerList().forEach(function(mainAnswer) { 
                if (mainAnswer.Editing()) {               
                    BaseModel.save(
                        mainAnswer,
                        function(data) {
                            var mainAnswerSaved = (new MainAnswer).unpack(data.data);
                            self.MainAnswerList.replace(mainAnswer, mainAnswerSaved);
                            tryNextStep();
                        }
                    );                
                } 
            });
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

        self.applySecondQuestion = function(secondQuestion, addSecondQuestion) {
            addSecondQuestion = addSecondQuestion || false;
            var tryNextStep = function() {
                if (secondQuestion.SecondAnswers().every(function(item) {
                    if (item.Editing() || item.Edited() || item.Locked()) {return false;}
                    return true;
                })) {
                    self.nextStep(4);
                }                
            };    
            var tryAddSecondQuestion= function() {
                if (secondQuestion.SecondAnswers().every(function(item) {
                    if (item.Editing() || item.Edited() || item.Locked()) {return false;}
                    return true;
                })) {
                    self.addSecondQuestion();
                }                
            };                     
            
            BaseModel.save(
                secondQuestion,
                function(data) {
                    var secondQuestionSaved = (new SecondQuestion).unpack(data.data);
                    secondQuestionSaved.SecondAnswers(secondQuestion.SecondAnswers());
                    secondQuestionSaved.SecondAnswers().forEach(function(secondAnswer) {
                       secondAnswer.QuestionId(secondQuestionSaved.Id()); 
                    });                    
                    self.SecondQuestionList.replace(secondQuestion, secondQuestionSaved);
                    self.saveSecondAnswers(secondQuestionSaved.SecondAnswers, addSecondQuestion ? tryAddSecondQuestion : tryNextStep);
                }
            );           
        };
        
        self.saveSecondAnswers = function(secondAnswerList, callbackOnSuccess) {
            secondAnswerList().forEach(function(secondAnswer) {
                if (secondAnswer.Editing()) {
                    BaseModel.save(
                        secondAnswer,
                        function(data) {
                            var secondAnswerSaved = (new SecondAnswer).unpack(data.data);
                            secondAnswerSaved.Locked(true);
                            secondAnswerSaved.MainAnswers(secondAnswer.MainAnswers());
                            secondAnswerList.replace(secondAnswer, secondAnswerSaved);                            
                            self.saveSecondAnswerRel(secondAnswerSaved, callbackOnSuccess);
                        }
                    );     
                };           
            });              
        };
        
        self.saveSecondAnswerRel = function(secondAnswer, callbackOnSuccess) {    
            var sendMainAnswers = [];
            secondAnswer.MainAnswers().forEach(function(mainAnswer) { sendMainAnswers.push(mainAnswer.pack()); });        
            requestAjaxJson(
                'POST',
                apiUrlBase + '/secondaryanswer/' + secondAnswer.Id() + '/link',
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
                    callbackOnSuccess();
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
    function MainQuestionListVM(categoryId, admin) {
        var self = this;
        
        self.MainQuestionList   = baseObservableArray();     
        self.CategoryList       = baseObservableArray();           
        self.IsEndOfList        = ko.observable(false);
        self.Loading            = ko.observable(false);  
        self.CategoryId         = ko.observable(categoryId);
        self.FilterActive       = ko.observable(admin ? NoYesAll.All : NoYesAll.Yes);
        self.LastMainQuestionId = ko.computed(function() {
            var mq = self.MainQuestionList()[self.MainQuestionList().length - 1];
            return mq ? mq.Id() : 2147483647;
        });      
        
        self.bind = function(mainQuestionList, categoryList, htmlElementId) {
            if (mainQuestionList) {
                mainQuestionList.forEach(function(item) {
                    self.MainQuestionList.push((new MainQuestion).unpack(item));
                });  
            }
            
            if (categoryList) {
                categoryList.forEach(function(item) {
                   self.CategoryList.push((new Category).unpack(item)); 
                });
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
            BaseModel.save(
                mainQuestion, 
                function(data) {
                    if (data.data) {
                        self.MainQuestionList.replace(mainQuestion, (new MainQuestion).unpack(data.data));                        
                    }
                }
            );
        };        
        
        self.removeMainQuestion = function(mainQuestion) {
            if (confirm("Действительно желаете удалить?")) {
                BaseModel.remove(
                    mainQuestion, 
                    function() {
                        self.MainQuestionList.remove(mainQuestion);
                    }
                );
            }    
        };
        
        function onWindowScroll(){
            if (needLoadOlderList())
                asyncLoadOlderList();
        }
        
        function needLoadOlderList() {
            return !self.IsEndOfList() && (!self.MainQuestionList().length || ($(document).height() - $(window).height() - 100 <= $(window).scrollTop()));
        }        
        
        function asyncLoadOlderList() {
            if (!self.Loading()) {
                self.Loading(true);
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
                var url = apiUrlBase + '/mainquestion?limit=10&' + $.param(params);
                
                requestAjaxJson(
                    'GET',
                    url,
                    null,
                    function(data) {
                        if (data.data) {
                            data.data.forEach(function(item){
                                self.MainQuestionList.push((new MainQuestion).unpack(item));
                            });
                        } 
                        if (!data.data || !data.data.length) {
                            self.IsEndOfList(true);
                        }
                        self.Loading(false);
                    }   
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
        self.Messages = ko.observableArray();
        
        self.bind = function(htmlElementId) {
            ko.applyBindings(self, document.getElementById(htmlElementId || "bs-navbar-collapse-1"/* "page-navbar-user-block"*/));
        };
        
        self.reloadPage = function(redirectToMainPage) {
            redirectToMainPage = redirectToMainPage || false;
            var pagesWithoutReload = [
                /^https?:\/\/[^/]+\/$/,
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
                        
        }
        validate(target());
        target.subscribe(validate);
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
    
    ko.bindingHandlers.thumbnail = {
        //http://knockoutjs.com/documentation/custom-bindings.html
        init: function(element, valueAccessor, allBindings, viewModel, bindingContext) {
            /*
            var value = ko.unwrap(valueAccessor()); // Get the current value of the current property we're bound to
            $(element).toggle(value); // jQuery will hide/show the element depending on whether "value" or true or false
            */
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
                        userMessageList.addMessage(new Message("Неопознанная внутренняя ошибка!", MessageType.ERROR));
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

    return {
        PassTestVM: PassTestVM,
        CreateTestVM: CreateTestVM,
        MainQuestionListVM: MainQuestionListVM,
        CurrentUserVM: CurrentUserVM,
        MessageType: MessageType,
        MessagesVM: MessagesVM
    };    
}();
