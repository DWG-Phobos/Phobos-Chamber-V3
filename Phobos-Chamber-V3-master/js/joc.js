function shuffleArray(array) {
	// Funció que desordena un array
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var aux = array[i];
        array[i] = array[j];
        array[j] = aux;
    }
    return array;
}

function joc() {
	// Lògica del Joc

    /******* VARIABLES PART PREGUNTES *****/
    $("#pregunta").hide();			// Amagar div #pregunta
    $("#resposta").hide();			// Amagar div #resposta
    $("#missatge").hide();			// Amagar div #missatge

	// Obtenir les preguntes de l'arxiu JSON
    var p = JSON.parse(preguntes);
    var preguntaGenerada = false;
    var respostaSeleccionada = false;

    var randomIndex = null;			// Index generat aleatoriament per triar una pregunta
    var shuffledArray = shuffleArray([0, 1, 2, 3]);		// Desordenar array amb index de les respostes
    ////////////////////////////////////////

    var scene = new THREE.Scene(); // Crear una nova escena

    var camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.5, 1000);	// Crear una nova camara
    camera.rotation.x = -25 * Math.PI / 180;


    var renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight); // Tamany de la pantalla de renderitzat
    document.body.appendChild(renderer.domElement); // Coloquem el render al document web


    //Free camera: uncoment to freely navigate the zone
    //var controls = new THREE.OrbitControls(camera);

    // Carregar model
    var loadingManager = new THREE.LoadingManager(function() {

        scene.add(player);

    });

    var loader = new THREE.ColladaLoader(loadingManager);
    var clock = new THREE.Clock(), mixer;
    var keyboard = new THREEx.KeyboardState();
    var actions = [];
    var sceneAnimation;

	// Flags per determinar les animacions de salt
    var ascend = false;
    var descend = false;
    var limit = 0;

	// Carregar model collada
    loader.options.convertUpAxis = true;
    loader.load('models/Hero_alter/Hero.dae', function(collada) {

        player = collada.scene;
        player.position.set(0, 0, 10)
        player.scale.set(0.025, 0.025, 0.025);

        var sceneAnimationClip = collada.animations[0];
        mixer = new THREE.AnimationMixer(player);

        var idle = THREE.AnimationUtils.subclip(sceneAnimationClip, 'idle', 0, 89)
        var run = THREE.AnimationUtils.subclip(sceneAnimationClip, 'run', 90, 110)

        actions.push(mixer.clipAction(idle));
        actions.push(mixer.clipAction(run));

        sceneAnimation = actions[0];
        sceneAnimation.play();
    });

    var ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    var light1 = new THREE.PointLight(0xcc0000, 0.4, 100);
    light1.position.set(10, 0, 20);
    scene.add(light1);

    var light2 = new THREE.PointLight(0x00cc00, 0.4, 100);
    light2.position.set(0, 0, 20);
    scene.add(light2);

    var light3 = new THREE.PointLight(0x0000cc, 0.4, 100);
    light3.position.set(-10, 0, 10);
    scene.add(light3);

    var lightX = new THREE.PointLight(0x00ff00, 0.7, 15);
    lightX.position.set(0, 0, 0);
    scene.add(lightX);

	// Crear la Mesh
    var mesh = new THREE.Object3D();


    //Crear obstacles
    //Creating Cubes
    var largeCubeGeometry = new THREE.BoxGeometry(5, 2, 1); //Crear Geometria
    var halfGiantGeometry = new THREE.BoxGeometry(9, 2.5, 5);
    var cubeGeometry = new THREE.BoxGeometry(1, 1, 1); //Crear Geometria
    var tallCubeGeometry = new THREE.BoxGeometry(1, 2, 1); //Crear Geometria
    var giantGeometry = new THREE.BoxGeometry(9, 5, 10);
    var platformGeometry = new THREE.BoxGeometry(2, 1, 2);

    var texture2 = THREE.ImageUtils.loadTexture('assets/metal_floor.jpg');
    texture2.wrapS = THREE.RepeatWrapping;
    texture2.wrapT = THREE.RepeatWrapping;
    texture2.repeat.set(1, 1);
    var material2 = new THREE.MeshBasicMaterial({
        map: texture2
    });



    //LARGE CUBE TEXTURE CREATION

    var cubeTextures = [

        THREE.ImageUtils.loadTexture('assets/hazard.jpeg'), //RIGHT SIDE
        THREE.ImageUtils.loadTexture('assets/hazard.jpeg'), //LEFT SIDE
        THREE.ImageUtils.loadTexture('assets/hazard.jpeg'), //TOP SIDE
        THREE.ImageUtils.loadTexture('assets/hazard.jpeg'), //BOTTOM SIDE
        THREE.ImageUtils.loadTexture('assets/hazard.jpeg'), //FRONT SIDE
        THREE.ImageUtils.loadTexture('assets/hazard.jpeg') //BACK SIDE
    ];


    var cubeFacesSizes = [

        [1, 2],
        [1, 3],
        [1, 5],
        [1, 6],
        [1, 1],
        [0.5, 0.5]
    ];

    for (i = 0; i < cubeFacesSizes.length; i++) {

        cubeTextures[i].wrapS = THREE.RepeatWrapping;
        cubeTextures[i].wrapT = THREE.RepeatWrapping;
        cubeTextures[i].repeat.set(cubeFacesSizes[i][0], cubeFacesSizes[i][1]);

    }

    //MATERIAL CREATION

    var cubeMaterials = [
        new THREE.MeshBasicMaterial({
            map: cubeTextures[0]
        }),
        new THREE.MeshBasicMaterial({
            map: cubeTextures[1]
        }),
        new THREE.MeshBasicMaterial({
            map: cubeTextures[2]
        }),
        new THREE.MeshBasicMaterial({
            map: cubeTextures[3]
        }),
        new THREE.MeshBasicMaterial({
            map: cubeTextures[4]
        }),
        new THREE.MeshBasicMaterial({
            map: cubeTextures[5]
        })
    ];

    var texture = THREE.ImageUtils.loadTexture('assets/hazard.jpeg');
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(1, 1);
    var material = new THREE.MeshBasicMaterial({
        map: texture
    });

    var largeCube1 = new THREE.Mesh(largeCubeGeometry, cubeMaterials); //Crear objecte
    var largeCube2 = new THREE.Mesh(largeCubeGeometry, material); //Crear objecte
    var largeCube3 = new THREE.Mesh(largeCubeGeometry, material); //Crear objecte
    var largeCube4 = new THREE.Mesh(largeCubeGeometry, material); //Crear objecte
    var largeCube5 = new THREE.Mesh(largeCubeGeometry, material); //Crear objecte
    var cube1 = new THREE.Mesh(cubeGeometry, material); //Crear objecte
    var cube2 = new THREE.Mesh(cubeGeometry, material); //Crear objecte
    var tallCube = new THREE.Mesh(tallCubeGeometry, material); //Crear objecte
    var giantCube = new THREE.Mesh(giantGeometry, material); //Crear objecte
    var giantCube2 = new THREE.Mesh(giantGeometry, material); //Crear objecte
    var platform = new THREE.Mesh(platformGeometry, material);
    var platform2 = new THREE.Mesh(platformGeometry, material);
    var step1 = new THREE.Mesh(halfGiantGeometry, material);
    //Cubes values
    cube1.position.set(-0.5, 2.5, -30);
    cube2.position.set(-2, 0.5, -31);
    tallCube.position.set(0.5, 3, -30);
    largeCube1.position.set(-5, 1, -10);
    largeCube2.position.set(-7.5, 1, -20);
    largeCube3.position.set(-1.5, 1, -30);
    largeCube4.position.set(-5, 1, -40);
    largeCube5.position.set(-7.5, 1, -50);
    giantCube.position.set(5.5, 2.5, -11);
    giantCube2.position.set(5.5, 2.5, -30);
    platform.position.set(2, 4.5, -19);
    platform2.position.set(5, 4.5, -22);
    step1.position.set(5.5, 1.2, -37.5)
    //Adding Cubes to the Mesh

    //Creating Triangles
    var geometry = new THREE.Geometry();

    geometry.vertices = [
        new THREE.Vector3(1, 0, -1),
        new THREE.Vector3(10, 0, -1),
        new THREE.Vector3(1, 0, -6),
        new THREE.Vector3(10, 0, -6),
        new THREE.Vector3(1, 5, -6),
        new THREE.Vector3(10, 5, -6)
    ];

    geometry.faces = [
        new THREE.Face3(1, 0, 2),
        new THREE.Face3(2, 3, 1),
        new THREE.Face3(2, 0, 4),
        new THREE.Face3(3, 5, 1),
        new THREE.Face3(1, 4, 0),
        new THREE.Face3(4, 1, 5),
        new THREE.Face3(5, 5, 2, ),
        new THREE.Face3(3, 2, 5, )
    ];

    var triangle = new THREE.Mesh(geometry, material);
    //mesh.add(triangle);

    //Creating World

    //Creating the ground
    var groundGeometry = new THREE.PlaneGeometry(20, 800);
    var roofGeometry = new THREE.PlaneGeometry(20, 800);
    var material1 = new THREE.MeshBasicMaterial({
        color: "red"
    }); //Crear color

    //var materialGround = new THREE.MeshBasicMaterial( {color: 0xaa3f39});

    var groundTexture = THREE.ImageUtils.loadTexture('assets/neon_floor.jpg');

    groundTexture.wrapS = THREE.RepeatWrapping;
    groundTexture.wrapT = THREE.RepeatWrapping;
    groundTexture.repeat.set(1, 40);
    var materialGround = new THREE.MeshBasicMaterial({
        map: groundTexture
    });

    var roofTexture = THREE.ImageUtils.loadTexture('assets/metal.jpg');

    roofTexture.wrapS = THREE.RepeatWrapping;
    roofTexture.wrapT = THREE.RepeatWrapping;
    roofTexture.repeat.set(1, 40);
    var materialRoof = new THREE.MeshBasicMaterial({
        map: roofTexture
    });

    var ground = new THREE.Mesh(groundGeometry, materialGround);
    var roof = new THREE.Mesh(roofGeometry, materialRoof);

    //Creating the walls
    var wallGeometry = new THREE.PlaneGeometry(800, 20);

    //var wallMaterial = new THREE.MeshBasicMaterial( { color: "blue" } ); //Crear color

    var wallTexture = THREE.ImageUtils.loadTexture('assets/metal.jpg');
    wallTexture.wrapS = THREE.RepeatWrapping;
    wallTexture.wrapT = THREE.RepeatWrapping;
    wallTexture.repeat.set(20, 1);
    var wallMaterial = new THREE.MeshBasicMaterial({
        map: wallTexture
    });

    var rightWall = new THREE.Mesh(wallGeometry, wallMaterial);
    var leftWall = new THREE.Mesh(wallGeometry, wallMaterial);

    //Ground values
    //ground.position.y = 30;
    ground.rotation.x = -Math.PI / 2;
    roof.rotation.x = Math.PI / 2;
    roof.position.y = 20;

    //Right Wall Values
    rightWall.position.x = 10;
    rightWall.position.y = 10;
    rightWall.position.z = 5;

    rightWall.rotation.y = -Math.PI / 2;

    //Left Wall Values

    leftWall.position.x = -10;
    leftWall.position.y = 10;
    leftWall.position.z = 5;

    leftWall.rotation.y = Math.PI / 2;

    mesh.add(roof);
    mesh.add(ground);

    var obstacles = [
        cube1,
        cube2,
        largeCube1,
        largeCube2,
        largeCube3,
        largeCube4,
        largeCube5,
        tallCube,
        giantCube,
        giantCube2,
        platform,
        platform2,
        step1,
        leftWall,
        rightWall

    ]

    for (i = 0; i < obstacles.length; i += 1) {

        mesh.add(obstacles[i]);
    }

    //CREAR QUADRES DE RESPOSTA
    var answerBoxGeometry = new THREE.BoxGeometry(5, 0.5, 5);					// Crear geometria

	var textures = new Array();													// Vector de textures
	var materials = new Array();												// Vector de materials
	var caixesRespostes = new Array();											// Vector de caixes de resposta

	for(var i = 0; i < 4; i++){
		textures.push(new Object());
		textures[i].normal = THREE.ImageUtils.loadTexture( 'assets/' + (i+1) + '.jpg');					// Carregar textura de casella normal
		textures[i].selected = THREE.ImageUtils.loadTexture( 'assets/' + (i+1) + '_selected.jpg');		// Carregar textura de casella seleccionada
		textures[i].correct = THREE.ImageUtils.loadTexture( 'assets/' + (i+1) + '_correct.jpg');		// Carregar textura de casella correcta

		// Wrapping textures casella normal
		textures[i].normal.wrapS = THREE.RepeatWrapping;
		textures[i].normal.wrapT = THREE.RepeatWrapping;
		textures[i].normal.repeat.set(1, 1);

		// Wrapping textures casella seleccionada
		textures[i].selected.wrapS = THREE.RepeatWrapping;
		textures[i].selected.wrapT = THREE.RepeatWrapping;
		textures[i].selected.repeat.set(1, 1);

		// Wrapping textures casella correcta
		textures[i].correct.wrapS = THREE.RepeatWrapping;
		textures[i].correct.wrapT = THREE.RepeatWrapping;
		textures[i].correct.repeat.set(1, 1);

		materials.push(new Object());
		materials[i].normal = new THREE.MeshBasicMaterial({
			map: textures[i].normal															// Nou material a partir de la textura normal
		});
		materials[i].selected = new THREE.MeshBasicMaterial({
			map: textures[i].selected														// Nou material a partir de la textura seleccionada
		});
		materials[i].correct = new THREE.MeshBasicMaterial({
			map: textures[i].correct														// Nou material a partir de la textura correcta
		});

		caixesRespostes.push(new THREE.Mesh(answerBoxGeometry, materials[i].normal ));		// Afegir la caixa amb el material normal al vector de caixes

		mesh.add(caixesRespostes[i]);														// Afegir les caixes a la mesh
	}

	// Definir posicions de les caixes
    caixesRespostes[0].position.set(-7.5, 0.25, -60);
    caixesRespostes[1].position.set(-2.5, 0.25, -60);
    caixesRespostes[2].position.set(2.5, 0.25, -60);
    caixesRespostes[3].position.set(7.5, 0.25, -60);

    scene.add(mesh);	//Afegir tots els objectes de la mesh a l'escena

    //Function that renders the scene
    var animate = function() {

        requestAnimationFrame(animate);
        update();

        renderer.render(scene, camera);
    };

    //Col·lisions **********************************
    var caster1 = new THREE.Raycaster();
    var caster2 = new THREE.Raycaster();
    var caster3 = new THREE.Raycaster();
    var caster4 = new THREE.Raycaster();
    var caster5 = new THREE.Raycaster();

    var dummy = new THREE.Object3D();
    var distance = 1;

    function update() {
        // delta = change in time since last call (seconds)
        var delta = clock.getDelta();
        var moveDistance = 10 * delta;
        walking = false;
        var lastAction = sceneAnimation;
        if (keyboard.pressed("w") || keyboard.pressed("s")) {
            if (lastAction == actions[0]) {
                sceneAnimation = actions[1];
                lastAction.stop();
                sceneAnimation.fadeIn(0.2).play();
            }
        } else {
            if (lastAction == actions[1]) {
                sceneAnimation = actions[0];
                lastAction.stop();
                sceneAnimation.fadeIn(0.2).play();
            }
        }


        /*** IMPLEMENTACIÓ CONTROL DE PREGUNTES ***/
        if (player.position.z < -50 && !respostaSeleccionada) {
			// Posar els materials de les caixes normals
			for(var i = 0; i < 4; i++){
				caixesRespostes[i].material = materials[i].normal;
			}

            if (!preguntaGenerada) {
                // Si el jugador entra a la zona de preguntes i no s'ha
                // generat cap resposta obté una pregunta aleatoria i la
                // mostra juntament amb les seves respostes.
                // Activa un flag per evitar seguir generant preguntes
                preguntaGenerada = true;
                //console.log("Mostrar pregunta");
                randomIndex = Math.floor((Math.random() * 5));					// Generar un index del vector de preguntes aleatori
                //console.log(randomIndex);
                $("#pregunta").html(p[randomIndex].text);						// Modificar el contingut del div per la pregunta
                //console.log(shuffledArray);
				// Modificar el contingut del div amb les respostes i el nombre
                $("#resposta").html("1." + p[randomIndex].respostes[shuffledArray[0]] + "	2." + p[randomIndex].respostes[shuffledArray[1]] + "	3." + p[randomIndex].respostes[shuffledArray[2]] + "	4." + p[randomIndex].respostes[shuffledArray[3]]);
				// Mostrar les preguntes i les respostes
				$("#pregunta").show();
                $("#resposta").show();
            } else {
				// El jugador entra a la zona de preguntes però ja s'havia generat una pregunta
                var opcioSeleccionada = null;
                var opcioPossible = null;

                if (player.position.z < (-57.5) && player.position.z > (-62.5)) {
					// El jugador està situat en una posició Z dintre de les caixes de espostes
                    if (player.position.x < (-5) && player.position.x >= (-9)) {
						// El jugador està situat sobre la esposta 1
                        console.log("Resposta 1");
                        opcioPossible = 0;
                        //console.log(p[randomIndex].respostes[shuffledArray[0]], p[randomIndex].respostaCorrecta);
                    } else if (player.position.x < (0) && player.position.x >= (-5)) {
						// El jugador està situat sobre la resposta 2
                        console.log("Resposta 2");
                        opcioPossible = 1;
                        //console.log(p[randomIndex].respostes[shuffledArray[1]], p[randomIndex].respostaCorrecta);
                    } else if (player.position.x > (0) && player.position.x <= (5)) {
						// El jugador està situat sobre la resposta 3
                        console.log("Resposta 3");
                        opcioPossible = 2;
                        //console.log(p[randomIndex].respostes[shuffledArray[2]], p[randomIndex].respostaCorrecta);
                    } else if (player.position.x > (5) && player.position.x <= (9)) {
						// El jugador està situat sobre la resopsta 4
                        console.log("Resposta 4");
                        opcioPossible = 3;
                        //console.log(p[randomIndex].respostes[shuffledArray[3]], p[randomIndex].respostaCorrecta);
                    }
					if(opcioPossible !== null){
						// El jugador està situat sobre alguna casella de resposta
						caixesRespostes[opcioPossible].material = materials[opcioPossible].selected;			// Canvia el material de la casella de resposta a casella seleccionada
					}

                    // PREMER BOTÓ PER CONTESTAR PREGUNTA
                    if (keyboard.pressed("enter") && preguntaGenerada) {
                        console.log("Resposta seleccionada", player.position.x, player.position.y, player.position.z)
                        if (!respostaSeleccionada && opcioPossible !== null) {
							// no s'ha seleccionat cap resposta i el jugador està sobre alguna casella
                            opcioSeleccionada = opcioPossible;					// Opcio seleccionada passa a valdre l'opció de la casella on està el jugador al premer enter
                            respostaSeleccionada = true;
                            if (shuffledArray[opcioSeleccionada] == p[randomIndex].respostaCorrecta) {
								// Comprovar que la resposta sigui correcta
                                console.log("CORRECTE");
                                $("#missatge").html("Resposta correcta, has guanyat!");			// Modificar div
                            } else {
                                console.log("INCORRECTE");
								// Si falla buscar la resposta correcta i marcar-la
                                for (var i = 0; i < shuffledArray.length; i++) {
                                    if (shuffledArray[i] == p[randomIndex].respostaCorrecta) {
										caixesRespostes[i].material = materials[i].correct;				// Canvia el material de la casella correcta pel material de correcta
                                    }
                                }
                                $("#missatge").html("Resposta incorrecta, has perdut! <br> La resposta correcta era: " + p[randomIndex].respostes[p[randomIndex].respostaCorrecta]);
                            }
                            $("#pregunta").hide();
                        }
                    }
                }
                if (respostaSeleccionada) {
                    $("#resposta").hide();
                    $("#missatge").show();
                } else {
                    $("#pregunta").show();
                    $("#resposta").show();
                }
            }
        } else {
            //if(player.position.z > -50 && preguntaGenerada){
            // Si el jugador surt de la zona de preguntes
            // amaga l'enunciat i les respostes, però manté
            // la mateixa pregunta
            $("#pregunta").hide();
            $("#resposta").hide();
        }


        //Detector de col·lisions ***************************************************************************************************************
        dummy.position.x = player.position.x
        dummy.position.y = player.position.y
        dummy.position.z = player.position.z

        dummy.rotation.x = player.rotation.x
        dummy.rotation.y = player.rotation.y
        dummy.rotation.z = player.rotation.z

        if (keyboard.pressed("s"))
            dummy.translateZ(moveDistance)
        if (keyboard.pressed("w"))
            dummy.translateZ(-moveDistance);

        var matrix = new THREE.Matrix4();
        matrix.extractRotation(mesh.matrix);

        var direction1 = new THREE.Vector3(0, 0, -1);
        var final_cam_vectorc1 = direction1.applyMatrix4(matrix);

        var direction2 = new THREE.Vector3(1, 0, 0);
        var final_cam_vectorc2 = direction2.applyMatrix4(matrix);

        var direction3 = new THREE.Vector3(0, 0, 1);
        var final_cam_vectorc3 = direction3.applyMatrix4(matrix);

        var direction4 = new THREE.Vector3(-1, 0, 0);
        var final_cam_vectorc4 = direction4.applyMatrix4(matrix);

        var direction5 = new THREE.Vector3(0, -1, 0);
        var final_cam_vectorc5 = direction5.applyMatrix4(matrix);


        //direccio = new  THREE.Vector3(dummy.position.x, dummy.position.y, dummy.position.z)
        var colisionant = false
        var surface = false

        caster1.set(dummy.position, final_cam_vectorc1);
        var collisions1 = caster1.intersectObjects(obstacles);

        caster2.set(dummy.position, final_cam_vectorc2);
        var collisions2 = caster2.intersectObjects(obstacles);

        caster3.set(dummy.position, final_cam_vectorc3);
        var collisions3 = caster3.intersectObjects(obstacles);

        caster4.set(dummy.position, final_cam_vectorc4);
        var collisions4 = caster4.intersectObjects(obstacles);

        caster5.set(dummy.position, final_cam_vectorc5);
        var collisions5 = caster5.intersectObjects(obstacles);

        console.log(player.position.y)


        if ((collisions1.length > 0 && collisions1[0].distance <= distance)) {
            colisionant = true;
        };
        if ((collisions2.length > 0 && collisions2[0].distance <= distance)) {
            colisionant = true;
        };
        if ((collisions3.length > 0 && collisions3[0].distance <= distance)) {
            colisionant = true;
        };
        if ((collisions4.length > 0 && collisions4[0].distance <= distance)) {
            colisionant = true;
        };
        if ((collisions5.length > 0 && collisions5[0].distance <= distance)) {
            surface = true;
        };

        if (colisionant == false) {
            if (keyboard.pressed("s"))
                player.translateZ(moveDistance);
            if (keyboard.pressed("w"))
                player.translateZ(-moveDistance);
        };
        if (keyboard.pressed("a"))
            player.rotation.y += delta;

        if (keyboard.pressed("d"))
            player.rotation.y -= delta;

        if (keyboard.pressed("space")) {
            if (ascend == false && descend == false) {
                ascend = true;
            }
        }

        if (ascend == true && descend == false) {
            player.position.y += 0.4
            limit += 0.2
        }
        if (limit >= 5) {
            ascend = false
            descend = true
            limit = 0
        }
        if (ascend == false && descend == true) {
            player.position.y -= 0.3
        }
        if (player.position.y <= 0) {
            player.position.y = 0
            descend = false
        }
        if (surface == true) {
            descend = false
        }
        if (colisionant == false && surface == false && player.position.y > 0 && ascend == false) {
            descend = true
        }

        camera.position.set(0,
            player.position.y + 12,
            player.position.z + 15);

        if (mixer) {
            mixer.update(delta);
        }




    }

    animate();
}
