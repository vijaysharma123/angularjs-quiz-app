var turtlefacts=angular.module("turtlefacts",[]);/*creat a module that store the application data*/

turtlefacts.controller("thecontroller",["$scope","quizMetrics","DataService",function($scope,quizMetrics,DataService)
{
	$scope.activeturtle={};/*creat a empty activeturtle object that hold the info of active turtle*/
	$scope.Search="";/*search variable use for holding the user input in search bar*/
	$scope.quizMetrics=quizMetrics;
	$scope.Activatequize=function()
	{
		quizMetrics.changeState("quiz",true);
	}
	$scope.changeActiveturtle=function(index)
	{
		/* activeturtle hold the info about active turtle */
          $scope.activeturtle=index;
	}
      
      
        $scope.turtlesData = DataService.turtlesData;
    

 }]);



/* quizecontroller*/

 turtlefacts.controller("quizcntrl",["$scope","quizMetrics","DataService",function($scope,quizMetrics,DataService)
 {

        $scope.quizMetrics=quizMetrics;
        $scope.DataService=DataService;
         $scope.activeQuestion=0;
         var numQuestionsAnswered=0;
         $scope.error=false;
         $scope.finalise=false;



         // setActiveQuestion function find the next unanswered question
         $scope.setActiveQuestion=function(index)
         {
         	if(index===undefined)
         	{
	         	var breakout=false;
	         	var quizLength=DataService.quizQuestions.length-1;
	         	while(!breakout)
	         	{
	         		$scope.activeQuestion=$scope.activeQuestion<quizLength?++$scope.activeQuestion:0;

	         		if($scope.activeQuestion===0)
	         		{
	         			$scope.error=true;
	         		}
	         		if(DataService.quizQuestions[$scope.activeQuestion].selected==null)
	         		{
	         			breakout=true;
	         		}
	         	}
            }
           else{
           	     $scope.activeQuestion=index;
               }
         }


        $scope.questionAnswered=function()
        {
        	var quizLength = DataService.quizQuestions.length;
        	if(DataService.quizQuestions[$scope.activeQuestion].selected !==null)
        	{
        		numQuestionsAnswered++;
        		if(numQuestionsAnswered >= quizLength)
        		{
        			//finalize the quize
        			for(var i=0;i<quizLength;i++)
        			{
        				if(DataService.quizQuestions[i].selected===null)
        				{
        					setActiveQuestion(i);
        					return;
        				}
        			}
        			$scope.error=false;
        			$scope.finalise=true;
        			return;
        		}
        	}	
        	$scope.setActiveQuestion();
        }
       //for blue the selected answer bckground
        $scope. selectAnswer=function(index)
        {
          DataService.quizQuestions[$scope.activeQuestion].selected = index;
        }
         
         $scope. finaliseAnswers=function()
         {
         	$scope.finalise=false;
         	numQuestionsAnswered=0;
         	$scope.activeQuestion=0;
         	quizMetrics.markQuiz();
         	quizMetrics.changeState("quiz",false);
         	quizMetrics.changeState("results",true);

         }

       
 }]);

 /*define factory*/
 turtlefacts.factory("quizMetrics",QuizMetrics);
      QuizMetrics.$inject =['DataService'];
      function QuizMetrics(DataService)
 {
      var quizobj=
      {
      	 quizeActive:false,
      	 resultsActive:false,
      	 correctAnswers:[],
      	 numCorrect:0,
      	 changeState:function(metric,state)
      	 {
      	 	if(metric==='quiz')
      	 	{
      	 		quizobj.quizeActive=state;

      	 	}else if(metric==='results')
      	 	{
      	 		quizobj.resultsActive=state;
      	 	}else
      	 	{
      	 		return false;
      	 	}
            
      	 },

         markQuiz:function()
         {
         	quizobj.correctAnswers = DataService.correctAnswers;

			    for(var i = 0; i < DataService.quizQuestions.length; i++)
			    {
			        if(DataService.quizQuestions[i].selected === DataService.correctAnswers[i])
			        {
			            DataService.quizQuestions[i].correct = true;
			            quizobj.numCorrect++;
			        }
			        else
			        {
			            DataService.quizQuestions[i].correct = false;
			        }
			    }
         }
      };

      return quizobj;
 };

     //resultcntrl

     turtlefacts.controller("resultsCtrl",["$scope","quizMetrics","DataService",function($scope,quizMetrics,DataService)
 {
       $scope.quizMetrics=quizMetrics;
       $scope.DataService=DataService;
       $scope.activeQuestion=0;

       $scope.getAnswerClass=function getAnswerClass(index)
       {
              if(index === quizMetrics.correctAnswers[$scope.activeQuestion]){
               return "bg-success";
			    }else if(index === DataService.quizQuestions[$scope.activeQuestion].selected){
			        return "bg-danger";
			    }
       }
        $scope.setActiveQuestion=function setActiveQuestion(index)
        {
        	$scope.activeQuestion = index;
        }
        $scope.calculatePerc=function calculatePerc()
        {
        	return quizMetrics.numCorrect / DataService.quizQuestions.length * 100;

        }

        $scope.reset=function reset()
        {
        	 quizMetrics.changeState("results", false);
			    quizMetrics.numCorrect = 0;

			    for(var i = 0; i < DataService.quizQuestions.length; i++)
			    {
			        var data = DataService.quizQuestions[i]; //binding the current question to data to keep code clean

			        data.selected = null;
			        data.correct = null;
			    }
        }

 }]);
  /*define another factory*/
 turtlefacts.factory("DataService",function()
 {
      var dataobj=
      {
      	turtlesData:turtlesData,
      	quizQuestions:quizQuestions,
      	correctAnswers:correctAnswers
      };
    return dataobj;

 });


   /* quize question data*/

var correctAnswers = [1, 2, 3, 0, 2, 0, 3, 2, 0, 3];
   
var quizQuestions  = [
        {
            type: "text",
            text: "How much can a loggerhead weigh?",
            possibilities: [
                {
                    answer: "Up to 20kg"
                },
                {
                    answer: "Up to 115kg"
                },
                {
                    answer: "Up to 220kg"
                },
                {
                    answer: "Up to 500kg"
                }
            ],
            selected: null,
            correct: null
        },
        {
            type: "text",
            text: "What is the typical lifespan of a Green Sea Turtle?",
            possibilities: [
                {
                    answer: "150 years"
                },
                {
                    answer: "10 years"
                },
                {
                    answer: "80 years"
                },
                {
                    answer: "40 years"
                }
            ],
            selected: null,
            correct: null
        },
        {
            type: "image",
            text: "Which of these is the Alligator Snapping Turtle?",
            possibilities: [
                {
                    answer: "https://c1.staticflickr.com/3/2182/2399413165_bcc8031cac_z.jpg?zz=1"
                },
                {
                    answer: "http://images.nationalgeographic.com/wpf/media-live/photos/000/006/cache/ridley-sea-turtle_688_600x450.jpg"
                },
                {
                    answer: "https://static-secure.guim.co.uk/sys-images/Guardian/Pix/pictures/2011/8/13/1313246505515/Leatherback-turtle-007.jpg"
                },
                {
                    answer: "https://upload.wikimedia.org/wikipedia/commons/e/e3/Alligator_snapping_turtle_-_Geierschildkr%C3%B6te_-_Alligatorschildkr%C3%B6te_-_Macrochelys_temminckii_01.jpg"
                }
            ],
            selected: null,
            correct: null
        },
        {
            type: "image",
            text: "Which of these is the Green Turtle?",
            possibilities: [
                {
                    answer: "ss.jpg"
                },
                {
                    answer: "https://upload.wikimedia.org/wikipedia/commons/7/7f/Kemp's_Ridley_sea_turtle_nesting.JPG"
                },
                {
                    answer: "https://upload.wikimedia.org/wikipedia/commons/e/e3/Alligator_snapping_turtle_-_Geierschildkr%C3%B6te_-_Alligatorschildkr%C3%B6te_-_Macrochelys_temminckii_01.jpg"
                },
                {
                    answer: "http://assets.worldwildlife.org/photos/163/images/carousel_small/SCR_290360hawskbill-why-matter-LG.jpg?1345565532"
                }
            ],
            selected: null,
            correct: null
        },
        {
            type: "text",
            text: "Where does the Kemp's Ridley Sea Turtle live?'",
            possibilities: [
                {
                    answer: "Tropical waters all around the world"
                },
                {
                    answer: "Eastern Australia"
                },
                {
                    answer: "Coastal North Atlantic"
                },
                {
                    answer: "South pacific islands"
                }
            ],
            selected: null,
            correct: null
        },
        {
            type: "text",
            text: "What is the most common turtle in US waters?",
            possibilities: [
                {
                    answer: "Loggerhead turtle"
                },
                {
                    answer: "Leatherback turtle"
                },
                {
                    answer: "Hawksbill Turtle"
                },
                {
                    answer: "Alligator Snapping Turtle"
                }
            ],
            selected: null,
            correct: null
        },
        {
            type: "text",
            text: "What is the largest sea turtle on earth?",
            possibilities: [
                {
                    answer: "Eastern Snake Necked Turtle"
                },
                {
                    answer: "Olive Ridley Sea Turtle"
                },
                {
                    answer: "Kemp's Ridley Sea Turtle'"
                },
                {
                    answer: "Leatherback"
                }
            ],
            selected: null,
            correct: null
        },
        {
            type: "image",
            text: "Which of these is the Olive Ridley Turtle?",
            possibilities: [
                {
                    answer: "http://i.telegraph.co.uk/multimedia/archive/02651/loggerheadTurtle_2651448b.jpg"
                },
                {
                    answer: "http://assets.worldwildlife.org/photos/163/images/carousel_small/SCR_290360hawskbill-why-matter-LG.jpg?1345565532"
                },
                {
                    answer: "http://images.nationalgeographic.com/wpf/media-live/photos/000/006/cache/ridley-sea-turtle_688_600x450.jpg"
                },
                {
                    answer: "https://upload.wikimedia.org/wikipedia/commons/7/7f/Kemp's_Ridley_sea_turtle_nesting.JPG"
                }
            ],
            selected: null,
            correct: null
        },
        {
            type: "text",
            text: "How Heavy can a leatherback turtle be?",
            possibilities: [
                {
                    answer: "900kg"
                },
                {
                    answer: "40kg"
                },
                {
                    answer: "110kg"
                },
                {
                    answer: "300kg"
                }
            ],
            selected: null,
            correct: null
        },
        {
            type: "text",
            text: "Which of these turtles are herbivores?",
            possibilities: [
                {
                    answer: "Loggerhead Turtle"
                },
                {
                    answer: "Hawksbill Turtle"
                },
                {
                    answer: "Leatherback Turtle"
                },
                {
                    answer: "Green Turtle"
                }
            ],
            selected: null,
            correct: null
        }
    ];

     /*json data*/
    var turtlesData = 
    
     [
        

        {
            type: "Green Turtle",
            image_url:"ss.jpg",
            locations: "Tropical and subtropical oceans worldwide",
            size: "Up to 1.5m and up to 300kg",
            lifespan: "Over 80 years",
            diet: "Herbivore",
            description: "The green turtle is a large, weighty sea turtle with a wide, smooth carapace, or shell. It inhabits tropical and subtropical coastal waters around the world and has been observed clambering onto land to sunbathe. It is named not for the color of its shell, which is normally brown or olive depending on its habitat, but for the greenish color of its skin. There are two types of green turtles—scientists are currently debating whether they are subspecies or separate species—including the Atlantic green turtle, normally found off the shores of Europe and North America, and the Eastern Pacific green turtle, which has been found in coastal waters from Alaska to Chile."
        },
        {
            type: "Loggerhead Turtle",
            image_url: "http://i.telegraph.co.uk/multimedia/archive/02651/loggerheadTurtle_2651448b.jpg",
            locations: "Tropical and subtropical oceans worldwide",
            size: "90cm, 115kg",
            lifespan: "More than 50 years",
            diet: "Carnivore",
            description: "Loggerhead turtles are the most abundant of all the marine turtle species in U.S. waters. But persistent population declines due to pollution, shrimp trawling, and development in their nesting areas, among other factors, have kept this wide-ranging seagoer on the threatened species list since 1978. Their enormous range encompasses all but the most frigid waters of the world's oceans. They seem to prefer coastal habitats, but often frequent inland water bodies and will travel hundreds of miles out to sea."
        },
        {
            type: "Leatherback Turtle",
            image_url: "https://static-secure.guim.co.uk/sys-images/Guardian/Pix/pictures/2011/8/13/1313246505515/Leatherback-turtle-007.jpg",
            locations: "All tropical and subtropical oceans",
            size: "Up to 2m, up to 900kg",
            lifespan: "45 years",
            diet: "Carnivore",
            description: "Leatherbacks are the largest turtles on Earth, growing up to seven feet (two meters) long and exceeding 2,000 pounds (900 kilograms). These reptilian relics are the only remaining representatives of a family of turtles that traces its evolutionary roots back more than 100 million years. Once prevalent in every ocean except the Arctic and Antarctic, the leatherback population is rapidly declining in many parts of the world. While all other sea turtles have hard, bony shells, the inky-blue carapace of the leatherback is somewhat flexible and almost rubbery to the touch. Ridges along the carapace help give it a more hydrodynamic structure. Leatherbacks can dive to depths of 4,200 feet (1,280 meters)—deeper than any other turtle—and can stay down for up to 85 minutes."
        },
        {
            type: "Hawksbill Sea Turtle",
            image_url: "http://assets.worldwildlife.org/photos/163/images/carousel_small/SCR_290360hawskbill-why-matter-LG.jpg?1345565532",
            locations: "Tropical Coastal areas around the world",
            size: "Over 1m, 45-68kg",
            lifespan: "30-50 Years",
            diet: "Carnivore",
            description: "Dolor possimus voluptas hic aliquam rem doloremque minus maiores accusantium? Laborum perferendis harum blanditiis quod quia? Aspernatur sunt et fuga delectus ab rem excepturi. Ipsa quibusdam facere consequuntur magnam vitae? Consectetur consectetur necessitatibus beatae delectus quibusdam in! Est nobis omnis iusto illum fugiat maxime! Neque fugiat reiciendis sequi corrupti minima facere distinctio aliquam est voluptatibus. Sint incidunt soluta atque ducimus."
        },
        {
            type: "Alligator Snapping Turtle",
            image_url: "https://upload.wikimedia.org/wikipedia/commons/e/e3/Alligator_snapping_turtle_-_Geierschildkr%C3%B6te_-_Alligatorschildkr%C3%B6te_-_Macrochelys_temminckii_01.jpg",
            locations: "Along the Atlantic Coast of USA",
            size: "around 60cm, up to 100kg",
            lifespan: "20-70 years",
            diet: "Carnivore",
            description: "The prehistoric-looking alligator snapping turtle is the largest freshwater turtle in North America and among the largest in the world. With its spiked shell, beaklike jaws, and thick, scaled tail, this species is often referred to as the 'dinosaur of the turtle world.' Found almost exclusively in the rivers, canals, and lakes of the southeastern United States, alligator snappers can live to be 50 to 100 years old. Males average 26 inches (66 centimeters) in shell length and weigh about 175 pounds (80 kilograms), although they have been known to exceed 220 pounds (100 kilograms). The much smaller females top out at around 50 pounds (23 kilograms)."
        },
        {
            type: "Kemp's Ridley Sea Turtle",
            image_url: "https://upload.wikimedia.org/wikipedia/commons/7/7f/Kemp's_Ridley_sea_turtle_nesting.JPG",
            locations: "Coastal areas of the North Atlantic",
            size: "65cm, up to 45kg",
            lifespan: "Around 50 years",
            diet: "Omnivore",
            description: "The Kemp’s ridley turtle is the world’s most endangered sea turtle, and with a worldwide female nesting population roughly estimated at just 1,000 individuals, its survival truly hangs in the balance. Their perilous situation is attributed primarily to the over-harvesting of their eggs during the last century. And though their nesting grounds are protected and many commercial fishing fleets now use turtle excluder devices in their nets, these turtles have not been able to rebound. For this reason, their nesting processions, called arribadas, make for especially high drama. During an arribada, females take over entire portions of beaches, lugging their big bodies through the sand with their flippers until they find a satisfying spot to lay their eggs. Even more riveting is the later struggle to the ocean of each tiny, vulnerable hatchling. Beset by predators, hatchlings make this journey at night, breaking out of their shells using their caruncle, a single temporary tooth grown just for this purpose."
        },
        {
            type: "Olive Ridley Turtle",
            image_url: "http://images.nationalgeographic.com/wpf/media-live/photos/000/006/cache/ridley-sea-turtle_688_600x450.jpg",
            locations: "Tropical coastal areas around the world",
            size: "70cm, 45kg",
            lifespan: "50 years",
            diet: "Omnivore",
            description: "The olive ridley turtle is named for the generally greenish color of its skin and shell, or carapace. It is closely related to the Kemp’s ridley, with the primary distinction being that olive ridleys are found only in warmer waters, including the southern Atlantic, Pacific and Indian Oceans. Olive and Kemp’s ridleys are the smallest of the sea turtles, weighing up to 100 pounds (45 kilograms) and reaching only about 2 feet (65 centimeters) in shell length. The olive ridley has a slightly smaller head and smaller shell than the Kemp’s."
        },
        {
            type: "Eastern Snake Necked Turtle",
            image_url: "https://c1.staticflickr.com/3/2182/2399413165_bcc8031cac_z.jpg?zz=1",
            locations: "Eastern Australia",
            size: "Up to 30cm",
            lifespan: "25 years",
            diet: "Carnivore",
            description: "Snake-necked turtles, as the name suggests, have an unusually long neck. Their necks may be up to 60 percent of their carapace length. Their carapace is oval and flattened, usually dark-brown to black measuring up to 11 inches (27.5 cm) in length. Scutes are shed as the animals grow. The males have a longer, thicker tail than females and a concave plastron. They are excellent swimmers; they have large, webbed feet with sharp claws used to tear apart food."
        }
];
      
      /* end of json data*/

