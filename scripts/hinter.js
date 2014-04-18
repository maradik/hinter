var Hinter = function () {
    // наследование смотри http://habrahabr.ru/post/131714/
    // Синхронизация http://habrahabr.ru/post/108542/
    
    var MessageType = {NOTIFICATION: 0, SUCCESS: 1, WARNING: 2, ERROR: 3};
    
    function Message(text, type) {
        var self = this;
        
        self.text = text;
        self.type = type;
    }    
    
    var NoYesAll = {No: 0, Yes: 1, All: 2};
    
    //-------------------------------------------------------
    // Модели
    
    function BaseModel() {
        var self = this;
        self.Editing    = ko.observable(false);
        self.Edited     = ko.observable(false);
        self.Locked     = ko.observable(false);
        self.Visible    = ko.observable(true);
    }
    
    BaseModel.send = function(model, method, callbackSuccess, callbackError) {
        //var model = observableModel();
        model.Edited(model.Editing());
        model.Locked(true);
        model.Editing(false);        
        requestAjaxJson(
            method,  
            apiUrlBase + model.getUri() + (model.Id() ? '/' + model.Id() : ''), 
            model.pack(), 
            function (data, textStatus, jqXHR) { 
                //observableModel(model.unpack(data.data));
                if (callbackSuccess) {
                    callbackSuccess(data, textStatus, jqXHR);
                }
            },
            function (jqXHR, textStatus) {
                //--------
                if (confirm(jqXHR.status 
                    + " "
                    + textStatus
                    + ":"
                    + jqXHR.statusText)) {
                    alert(jqXHR.responseText);
                }           
                //----------     
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
        ko.utils.extend(self, new BaseModel());        
        
        self.Id             = ko.observable(id);
        self.Title          = ko.observable(title);
        self.Description    = ko.observable(description);
        self.ParentId       = ko.observable(parentId);
        self.Order          = ko.observable(order);
    
        self.getUri = function() {
            return 'category';
        }
    
        self.unpack = Category.unpack;
    
        self.pack = function() {
            return {
                id:         self.Id(),
                title:      self.Title(),
                description:self.Description(), 
                parentId:   self.ParentId(),
                order:      self.Order()
            }
        }
    }
    
    Category.unpack = function(json) {
        return new Category(
            json.id,
            json.title,
            json.description,
            json.parentId,
            json.order
        );
    }; 

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
        ko.utils.extend(self, new BaseModel());
        
        self.Id             = ko.observable(id);
        self.Title          = ko.observable(title);
        self.Description    = ko.observable(description);
        self.CategoryId     = ko.observable(categoryId);
        self.CreateDate     = ko.observable(createDate);
        self.Order          = ko.observable(order);
        self.UserId         = ko.observable(userId);   
        self.Active         = ko.observable(active);  
        
        self.getUri = function() {
            return 'mainquestion';
        };        
        
        self.unpack = MainQuestion.unpack;
        
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
    
    MainQuestion.unpack = function(json) {
        return new MainQuestion(
            json.id,
            json.title,
            json.description,
            json.categoryId,
            json.createDate,
            json.order,
            json.userId,
            json.active
        );
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
        ko.utils.extend(self, new BaseModel());
        
        self.Id             = ko.observable(id);
        self.Title          = ko.observable(title);
        self.Description    = ko.observable(description);
        self.QuestionId     = ko.observable(questionId);
        self.CreateDate     = ko.observable(createDate);
        self.Order          = ko.observable(order);
        self.UserId         = ko.observable(userId);
        
        self.getUri = function() {
            return 'mainanswer';
        }          
        
        self.unpack = MainAnswer.unpack;

        self.pack = function() {
            return {
                id:         self.Id(),
                title:      self.Title(),
                description:self.Description(), 
                questionId: self.QuestionId(),
                order:      self.Order(),    
                userId:     0                 
            }
        }         
    }    
    
    MainAnswer.unpack = function(json) {
        return new MainAnswer(
            json.id, 
            json.title, 
            json.description,
            json.questionId,
            json.createDate,
            json.order,
            json.userId
        );             
    };
    
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
        ko.utils.extend(self, new BaseModel());
        
        self.Id             = ko.observable(id);
        self.Title          = ko.observable(title);
        self.Description    = ko.observable(description);
        self.ParentId       = ko.observable(parentId);
        self.CreateDate     = ko.observable(createDate);
        self.Order          = ko.observable(order);
        self.UserId         = ko.observable(userId);
        
        self.SecondAnswers  = ko.observableArray(); 
        
        self.getUri = function() {
            return 'secondaryquestion';
        };            
        
        self.unpack = SecondQuestion.unpack;
        
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
    
    SecondQuestion.unpack = function(json) {
        return new SecondQuestion(
            json.id,
            json.title,
            json.description,
            json.parentId,
            json.createDate,
            json.order,
            json.userId
        );
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
        ko.utils.extend(self, new BaseModel());
        
        self.Id             = ko.observable(id);
        self.Title          = ko.observable(title);
        self.Description    = ko.observable(description);
        self.QuestionId     = ko.observable(questionId);
        self.CreateDate     = ko.observable(createDate);
        self.Order          = ko.observable(order);
        self.UserId         = ko.observable(userId);

        self.MainAnswers    = ko.observableArray();
        
        self.getUri = function() {
            return 'secondaryanswer';
        };          
        
        self.unpack = SecondAnswer.unpack;
        
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
    
    SecondAnswer.unpack = function(json) {
        return new SecondAnswer(
            json.id,
            json.title,
            json.description,
            json.questionId,
            json.createDate,
            json.order,
            json.userId
        );
    };
    
    function UserData(
        id, 
        login, 
        password,
        email,
        role
    ) {
        var self = this;
        ko.utils.extend(self, new BaseModel());
        
        self.Id       = ko.observable(id);
        self.Login    = ko.observable(login);
        self.Password = ko.observable(password);
        self.Email    = ko.observable(email);
        self.Role     = ko.observable(role);
        
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
    
    UserData.unpack = function(json) {
        return new UserData(
            json.id,
            json.login,
            json.password,
            json.email,
            json.role    
        );             
    };   
    
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
        self.CurrentSecQuestion = ko.observable(0);
        self.Finish             = ko.observable(false);
        
        self.SecondQuestionList = ko.observableArray([]);
        self.SecondQuestion     = ko.observable(null);
        self.SecondAnswerList   = ko.observableArray([]);
        self.MainAnswerList     = ko.observableArray([]);
        self.RelMainAnswerList  = ko.observableArray([]);
        
        self.bind = function() {
            ko.applyBindings(self, document.getElementById("page-content-block"));
            
            requestAjaxJson('GET', apiUrlBase + "/mainquestion/" + mainQuestionId + "/mainanswer", null, function (json) {                
                self.MainAnswerList(
                    json 
                    ? $.map(json.data, function (item) { return MainAnswer.unpack(item); }) 
                    : []
                );
                self.MainAnswerList.sort(sortQuestionAnswerArray);
            });
            
            requestAjaxJson('GET', apiUrlBase + "/mainquestion/" + mainQuestionId + "/secondaryquestion", null, function (json) {                
                self.SecondQuestionList(
                    json
                    ? $.map(json.data, function (item) { return SecondQuestion.unpack(item); }) 
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
                        ? $.map(json.data, function (item) { return MainAnswer.unpack(item); })
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
                        ? $.map(json.data, function (item) { return SecondAnswer.unpack(item); })
                        : [];
                    //ko.mapping.fromJS(collection, null, self.SecondAnswerList);
                    self.SecondAnswerList(collection);
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
        self.MainAnswerList     = ko.observableArray();
        self.SecondQuestionList = ko.observableArray();
        //self.SecondAnswerList   = ko.observableArray();
        self.CategoryList       = ko.observableArray();
        
        self.MainAnswerList.Locked = function() {
            return this().some(function(item) { return item.Locked() });
        };       
        
        self.SecondQuestionList.Locked = function() {
            return this().some(function(item) { 
                return item.Locked() 
                    || item.SecondAnswers().some(function(saItem){ return saItem.Locked(); });  
            });
        };  
        
        self.bind = function() {
            ko.applyBindings(self, document.getElementById("page-content-block"));
            
            requestAjaxJson('GET', apiUrlBase + "/category", null, function (json) {                
                self.CategoryList(
                    json 
                    ? $.map(json.data, function (item) { return Category.unpack(item); }) 
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
        
        self.saveMainQuestion = function(mainQuestion) {
            BaseModel.save(
                mainQuestion, 
                function(data) {
                    self.MainQuestion(MainQuestion.unpack(data.data));
                    self.nextStep(2);  
                }
            );
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
                    var mainAnswerSaved = MainAnswer.unpack(data.data);
                    self.MainAnswerList.replace(mainAnswer, mainAnswerSaved);
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
                            var mainAnswerSaved = MainAnswer.unpack(data.data);
                            self.MainAnswerList.replace(mainAnswer, mainAnswerSaved);
                            tryNextStep();
                        }
                    );                
                } 
            });
        };        
        
        self.addSecondQuestion = function() {
            var newSecondQuestion = new SecondQuestion();
            newSecondQuestion.ParentId(self.MainQuestion().Id());
            newSecondQuestion.Editing(true);
            self.SecondQuestionList.push(newSecondQuestion);
            self.SecondQuestionIdx(self.SecondQuestionList().length - 1);
            newSecondQuestion.Order(self.SecondQuestionIdx());
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
                    var secondQuestionSaved = SecondQuestion.unpack(data.data);
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
                            var secondAnswerSaved = SecondAnswer.unpack(data.data);
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
                        mainAnswers.push(MainAnswer.unpack(item));
                    });  
                    secondAnswer.MainAnswers(self.MainAnswerList().filter(function(item) {
                        return mainAnswers.some(function(item2) { return item.Id() == item2.Id(); });
                    }));    
                    secondAnswer.Locked(false);             
                    callbackOnSuccess();
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
        
        self.MainQuestionList   = ko.observableArray();                
        self.IsEndOfList        = ko.observable(false);
        self.Loading            = ko.observable(false);  
        self.CategoryId         = ko.observable(categoryId);
        self.FilterActive       = ko.observable(admin ? NoYesAll.All : NoYesAll.Yes);
        self.LastMainQuestionId = ko.computed(function() {
            var mq = self.MainQuestionList()[self.MainQuestionList().length - 1];
            return mq ? mq.Id() : 2147483647;
        });      
        
        self.bind = function(mainQuestionList, collectionDocumentElement) {
            if (mainQuestionList) {
                mainQuestionList.forEach(function(item) {
                    self.MainQuestionList.push(MainQuestion.unpack(item));
                });  
            }
                      
            $(window).scroll(onWindowScroll);
            $(".list-item-static").hide();
            ko.applyBindings(self, document.getElementById("page-content-block"));
            
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
                        self.MainQuestionList.replace(mainQuestion, MainQuestion.unpack(data.data));                        
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
                                self.MainQuestionList.push(MainQuestion.unpack(item));
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
    function CurrentUserVM() {
        var self = this;
        
        self.UserData = ko.observable(new UserData); 
        self.Messages = ko.observableArray();
        
        self.bind = function(userData) {
            if (typeof userData != 'undefined') {
                ko.UserData(UserData.unpack(userData));    
            }
            
            ko.applyBindings(self, document.getElementById("page-navbar-user-block"));
        };
        
        self.register = function() {
            if (self.isRegisteredUser()) {
                self.Messages.push(new Message('Вы уже вошли под пользователем ' + self.UserData().login(), MessageType.ERROR));
                return;
            } 
            requestAjaxJson(
                'POST',
                apiUrlBase + '/user/current/register',
                self.UserData().pack(),
                function (data) {
                    if (data.data) {
                        self.UserData(UserData.unpack(data.data));
                    }
                }
            );
        };
        
        self.login = function() {
            if (self.isRegisteredUser()) {
                self.Messages.push(new Message('Вы уже вошли под пользователем ' + self.UserData().login(), MessageType.ERROR));
                return;
            }
            requestAjaxJson(
                'POST',
                apiUrlBase + '/user/current/login',
                self.UserData().pack(),
                function (data) {
                    if (data.data) {
                        self.UserData(UserData.unpack(data.data));
                    }
                }
            );
        };   
        
        self.logout = function() {
            if (!self.isRegisteredUser()) {
                return;
            }
            requestAjaxJson(
                'POST',
                apiUrlBase + '/user/current/logout',
                self.UserData().pack(),
                function (data) {
                    if (data.data) {
                        self.UserData(UserData.unpack(data.data));
                    }
                }
            );
        };              
        
        self.isRegisteredUser = ko.computed(function() {
            return self.UserData().Id() != 0;
        });            
    }    
    
    var apiUrlBase = '/api';
    
    var sortQuestionAnswerArray = function(left, right, desc) {
        desc = desc || false;
        kf = desc ? -1 : 1;
        
        return left.Order() == right.Order() 
            ? (left.Title() == right.Title() ? 0 : (left.Title() < right.Title() ? -1*kf : 1*kf))
            : (left.Order() < right.Order() ? -1*kf : 1*kf);
    };  
    
    var requestAjaxJson = function (requestType, serviceUrl, sendData, callback, callbackError) {
        console.log(serviceUrl);        
        callbackError = callbackError 
            || function (jqXHR, textStatus) {
                if (confirm(jqXHR.status 
                    + " "
                    + textStatus
                    + ":"
                    + jqXHR.statusText)) {
                    alert(jqXHR.responseText);
                }
            };
        $.ajax({
            url: serviceUrl,
            data: JSON.stringify(sendData),
            type: requestType,
            dataType: 'json',
            cache: false,
            contentType: 'application/json; charset=utf-8',
            success: callback,
            error: callbackError
        });
    };

    return {
        PassTestVM: PassTestVM,
        CreateTestVM: CreateTestVM,
        MainQuestionListVM: MainQuestionListVM,
        CurrentUserVM: CurrentUserVM,
        requestAjaxJson: requestAjaxJson
    };    
}();
