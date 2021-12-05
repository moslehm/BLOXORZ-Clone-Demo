class Game {
    constructor(state) {
        this.state = state;
        this.spawnedObjects = [];
        this.collidableObjects = [];
        this.direction = 0.02;  // for the npc cube translation
        this.wallUp = 0.01; // wall for button interaction
        this.counter = 0;  // a work around for now for button interation
    }

    // example - we can add our own custom method to our game and call it using 'this.customMethod()'
    customMethod() {
        console.log("Custom method!");
    }

    // AUTO MOVE THE CUBE -- translates back and forth -- collision object
    directionCube(object) {

        // if hit 1, switch directions
        if (this.collideCube.model.position[2] > 2) {
            this.direction = -0.02;
        }

        // if starting position
        if (this.collideCube.model.position[2] == 0) {
            this.direction = 0.02;
        }

        if (this.collideCube.model.position[2] < 0) {
            this.direction = 0.02;
        }

        return (this.direction);
    }

    setTimer() {
        setTimeout(
            () => {
                //this.wall.translate(vec3.fromValues(0, 0.02, 0));
                this.wall.translate(vec3.fromValues(0, 0.2, 0));
                this.button.collider.flag = false;
                //this.counter = 0;
                //this.wall.translate(vec3.fromValues(0, 0.02, 0));
            },
            2 * 1000
        );

    }

    disableButton(){
        setInterval(
            () => {
                this.button.collider.flag = false;
                //console.log("hello");
            },
            5 * 1000
        );

    }


    // // toggle wall when button is pressed
    // toggleWall(){

    //     this.wallUp *= -1;

    //     if (this.wallUp < 0){
    //         console.log("wall was up toggle down ");
    //         this.wallUp= -0.01;
    //         return this.wallUp;
    //     }

    //     else{
    //         console.log("wall down toggle up ")
    //         this.wallUp = 0.01;
    //         return this.wallUp;
    //     }

    //     // if (!this.wallUp) {
    //     //     console.log("wall was down put back up ");
    //     //     this.wallUp = true;

    //     //     //wall was down, move it back up
    //     //     this.wall.translate(vec3.fromValues(0, 1, 0));

    //     //     return true;

    //     // }
    // }

    // example - create a collider on our object with various fields we might need (you will likely need to add/remove/edit how this works)
    createSphereCollider(object, radius, onCollide = null) {
        object.collider = {
            type: "SPHERE",
            radius: radius,
            onCollide: onCollide ? onCollide : (otherObject) => {
                console.log(`Collided with ${otherObject.name}`);
            },
            flag: false,
        };
        this.collidableObjects.push(object);
    }

    // example - function to check if an object is colliding with collidable objects
    checkCollision(object) {
        // loop over all the other collidable objects
        this.collidableObjects.forEach(otherObject => {
            // do a check to see if we have collided, if we have we can call object.onCollide(otherObject) which will
            // call the onCollide we define for that specific object. This way we can handle collisions identically for all
            // objects that can collide but they can do different things (ie. player colliding vs projectile colliding)
            // use the modeling transformation for object and otherObject to transform position into current location
            if (object.name === otherObject.name) {
                return;
            }

            object.collider.flag = false;

            var A = vec3.fromValues(object.model.position[0], object.model.position[1], object.model.position[2]);
            vec3.transformMat4(A, A, object.modelMatrix);

            var B = vec3.fromValues(otherObject.model.position[0], otherObject.model.position[1], otherObject.model.position[2]);
            vec3.transformMat4(B, B, otherObject.modelMatrix);

            var distance = vec3.distance(A, B);

            //console.log(distance);
            // console.log("rad", object.collider.radius);

            if (distance < (object.collider.radius + otherObject.collider.radius)) {
                console.log("objects collide", A, B, object.name, otherObject.name);
                object.onCollide;
                // console.log("collide", object.collider.flag);
                // return object.onCollide;
                object.collider.flag = true; //WE COLLIDED
                console.log("collide", object.collider.flag);
            }

            // return object.collider.flag;

        });
    }


    // runs once on startup after the scene loads the objects
    async onStart() {
        console.log("On start");

        // this just prevents the context menu from popping up when you right click
        document.addEventListener("contextmenu", (e) => {
            e.preventDefault();
        }, false);

        // example - set an object in onStart before starting our render loop!
        // const otherCube = getObject(this.state, "cube2"); // we wont save this as instance var since we dont plan on using it in update

        // example - create sphere colliders on our two objects as an example, we give 2 objects colliders otherwise
        // no collision can happen
        // this.createSphereCollider(this.cube, 0.5, (otherObject) => {
        //     console.log(`This is a custom collision of ${otherObject.name}`)
        // });
        // this.createSphereCollider(otherCube, 0.5);

        // OUR BLOCK
        const player = getObject(this.state, "playerBlock");
        const collideCube = getObject(this.state, "collideCube"); // OUR NPC CUBE
        const button = getObject(this.state, "button1"); // BUTTON
        //const wall = getObject(this.state, "wall1");
        // const player = getObject(this.state, "tempCube");
        //let camera = this.state.camera;

        // collision detection radius
        this.createSphereCollider(player, 0.25);
        this.createSphereCollider(collideCube, 0.2);
        this.createSphereCollider(button, 0.01);
        // 0 = standing, 1 = rolling along z, 2 = rolling along x
        this.board = new Board(player.model.position[2], player.model.position[0]);
        // 0 = standing, 1 = along x, 2 = along z
        player.rolling = 0;
        let camera = this.state.camera;

        let worldToLocalRotation = mat4.transpose(mat4.create(), player.model.rotation);

        // example - setting up a key press event to move an object in the scene
        document.addEventListener("keydown", (e) => {
            e.preventDefault();
            console.log(e.key.toLowerCase());
            let axis;
            let at;
            let up;
            let right;
            switch (e.key.toLowerCase()) {
                case "a":
                    if (!player.rolling){
                        // player.centroid = vec3.fromValues(1.0, 0.0, 0.25);
                        // Player is standing, tip over the block
                        player.rotate('z', -90.0 * Math.PI / 180.0);
                        player.translate(vec3.fromValues(0.75, -0.25, 0));
                        player.rolling = 1;
                    } else if (player.rolling == 1) {
                        // Player is sideways, bring it back up
                        player.rotate('z', -90.0 * Math.PI / 180.0);
                        player.translate(vec3.fromValues(0.75, 0.25, 0));
                        player.rolling = 0;
                    } else {
                        // Player is sideways, roll it along z
                        player.rotate('z', -90.0 * Math.PI / 180.0);
                        player.translate(vec3.fromValues(0.5, 0.0, 0.0));
                    }
                    this.board.movePlayer("left");
                    break;
                case "d":
                    if (!player.rolling){
                        // player.centroid = vec3.fromValues(0.5, 0.0, 0.25);
                        player.rotate('z', 90.0 * Math.PI / 180.0);
                        player.translate(vec3.fromValues(-0.75, -0.25, 0));
                        player.rolling = 1;
                    } else if (player.rolling == 1) {
                        player.rotate('z', 90.0 * Math.PI / 180.0);
                        player.translate(vec3.fromValues(-0.75, 0.25, 0));
                        player.rolling = 0;
                    } else {
                        player.rotate('z', 90.0 * Math.PI / 180.0);
                        player.translate(vec3.fromValues(-0.5, 0.0, 0.0));
                    }
                    this.board.movePlayer("right");
                    break;
                case "w":
                    if (!player.rolling){
                        // player.centroid = vec3.fromValues(0.25, 0.0, 0.5);
                        player.rotate('x', 90.0 * Math.PI / 180.0);
                        player.translate(vec3.fromValues(0.0, -0.25, 0.75));
                        player.rolling = 2;
                    } else if (player.rolling == 2) {
                        player.rotate('x', 90.0 * Math.PI / 180.0);
                        player.translate(vec3.fromValues(0.0, 0.25, 0.75));
                        player.rolling = 0;
                    } else {
                        player.rotate('x', 90.0 * Math.PI / 180.0);
                        player.translate(vec3.fromValues(0.0, 0.0, 0.5));
                    }
                    this.board.movePlayer("up");
                    break;
                case "s":
                    if (!player.rolling){
                        // player.centroid = vec3.fromValues(0.25, 0.0, 0.0);
                        player.rotate('x', -90.0 * Math.PI / 180.0);
                        player.translate(vec3.fromValues(0.0, -0.25, -0.75));
                        player.rolling = 2;
                    } else if (player.rolling == 2) {
                        player.rotate('x', -90.0 * Math.PI / 180.0);
                        player.translate(vec3.fromValues(0.0, 0.25, -0.75));
                        player.rolling = 0;
                    } else {
                        player.rotate('x', -90.0 * Math.PI / 180.0);
                        player.translate(vec3.fromValues(0.0, 0.0, -0.5));
                    }
                    this.board.movePlayer("down");
                    break;
                case "=":
                    vec3.copy(player.model.position, player.original.position);
                    player.model.rotation = [...player.original.rotation];
                    this.board.reset(player.model.position[2], player.model.position[0]);
                    player.rolling = 0;
                    break;
                case "arrowright":
                    // Get look-at vector by subtracting position from center and normalizing
                    at = vec3.normalize([], vec3.subtract([], state.camera.center, state.camera.position));
                    // Make sure up is normalized
                    up = vec3.normalize([], state.camera.up);
                    // Get right vector by doing the cross product of at and up
                    right = vec3.cross([], at, up);
                    if (event.getModifierState("Control")) {
                        // Rotate camera around Y (other direction)
                        vec3.add(state.camera.center, state.camera.center, vec3.scale([], right, 0.1));
                    } else {
                        vec3.add(camera.position, camera.position, vec3.scale([], right, 0.1));
                        vec3.add(camera.center, camera.center, vec3.scale([], right, 0.1));
                    }
                    break;
                case "arrowleft":
                    // Get look-at vector by subtracting position from center and normalizing
                    at = vec3.normalize([], vec3.subtract([], state.camera.center, state.camera.position));
                    // Make sure up is normalized
                    up = vec3.normalize([], state.camera.up);
                    // Get right vector by doing the cross product of at and up
                    right = vec3.cross([], at, up);
                    if (event.getModifierState("Control")) {
                        // Rotate camera around Y
                        vec3.subtract(state.camera.center, state.camera.center, vec3.scale([], right, 0.1));
                    } else {
                        vec3.add(camera.position, camera.position, vec3.scale([], right, -0.1));
                        vec3.add(camera.center, camera.center, vec3.scale([], right, -0.1));

                    }
                    break;
                case "arrowup":
                    if (event.getModifierState("Control")) {
                        // Rotate camera about X axis (pitch)
                        // Get look-at vector by subtracting position from center and normalizing
                        let at = vec3.normalize([], vec3.subtract([], camera.center, camera.position));
                        // Make sure up is normalized
                        let up = vec3.normalize([], camera.up);
                        let right = vec3.cross([], at, up);
                        // Get new center, update it, then use it to update up
                        let new_center = vec3.add(camera.center, camera.center, vec3.scale([], up, 0.1));
                        let new_at = vec3.normalize([], vec3.subtract([], new_center, camera.position));
                        vec3.normalize(camera.up, vec3.cross([], right, new_at));
                    } else {
                        let at = vec3.scale([], vec3.normalize([], vec3.subtract([], camera.position, camera.center)), -0.1);
                        vec3.add(camera.center, camera.center, at);
                        vec3.add(camera.position, camera.position, at);
                    }
                    break;
                case "arrowdown":
                    if (event.getModifierState("Control")) {
                        // Rotate camera about X axis (pitch)
                        // Get look-at vector by subtracting position from center and normalizing
                        at = vec3.normalize([], vec3.subtract([], state.camera.center, state.camera.position));
                        // Make sure up is normalized
                        up = vec3.normalize([], state.camera.up);
                        right = vec3.cross([], at, up);
                        // Get new center, update it, then use it to update up
                        let new_center = vec3.subtract(state.camera.center, state.camera.center, vec3.scale([], up, 0.1));
                        let new_at = vec3.normalize([], vec3.subtract([], new_center, state.camera.position));
                        vec3.normalize(state.camera.up, vec3.cross([], right, new_at));
                    } else {
                        let at = vec3.scale([], vec3.normalize([], vec3.subtract([], camera.position, camera.center)), 0.1);
                        vec3.add(camera.center, camera.center, at);
                        vec3.add(camera.position, camera.position, at);
                    }
                    break;
                case " ":
                    vec3.add(camera.center, camera.center, vec3.fromValues(0.0, 0.1, 0.0));
                    vec3.add(camera.position, camera.position, vec3.fromValues(0.0, 0.1, 0.0));
                    break;
                case "shift":
                    vec3.add(camera.center, camera.center, vec3.fromValues(0.0, -0.1, 0.0));
                    vec3.add(camera.position, camera.position, vec3.fromValues(0.0, -0.1, 0.0));
                    break;
                case "i": //up
                    // if (this.collideCube.collider.flag == false) {
                    this.collideCube.translate(vec3.fromValues(0, 0, 0.5));
                    // }
                    break;

                case "j": //left
                    //if (this.collideCube.collider.flag == false) {
                    this.collideCube.translate(vec3.fromValues(0.5, 0, 0));
                    //}

                    break;

                case "k": //down
                    this.collideCube.translate(vec3.fromValues(0, 0, -0.5));
                    break;

                case "l": //right
                    this.collideCube.translate(vec3.fromValues(-0.5, 0, 0));
                    break;

                // case "t": // set the button colliding to true
                //     //this.wallUp = false;

                //     button.collider.flag = true;
                //     //console.log("t", button.collider.flag);
                //     wall.translate(vec3.fromValues(0, 1, 0));
                //     this.toggleWall(wall)
                //     break;

                // case "y":
                //     button.collider.flag = false;
                //     //console.log("y", button.collider.flag);
                //     wall.translate(vec3.fromValues(0, -1, 0));
                //     this.toggleWall(wall)
                //     break;

                default:
                    break;
            }
        });

        // this.customMethod(); // calling our custom method! (we could put spawning logic, collision logic etc in there ;) )

        // example: spawn some stuff before the scene starts
        // for (let i = 0; i < 10; i++) {
        //     for (let j = 0; j < 10; j++) {
        //         for (let k = 0; k < 10; k++) {
        //             spawnObject({
        //                 name: `new-Object${i}${j}${k}`,
        //                 type: "cube",
        //                 material: {
        //                     diffuse: randomVec3(0, 1)
        //                 },
        //                 position: vec3.fromValues(4 - i, 5 - j, 10 - k),
        //                 scale: vec3.fromValues(0.5, 0.5, 0.5)
        //             }, this.state);
        //         }
        //     }
        // }

        // for (let i = 0; i < 10; i++) {
        //     let tempObject = await spawnObject({
        //         name: `new-Object${i}`,
        //         type: "cube",
        //         material: {
        //             diffuse: randomVec3(0, 1)
        //         },
        //         position: vec3.fromValues(4 - i, 0, 0),
        //         scale: vec3.fromValues(0.5, 0.5, 0.5)
        //     }, this.state);


        // tempObject.constantRotate = true; // lets add a flag so we can access it later
        // this.spawnedObjects.push(tempObject); // add these to a spawned objects list

        // tempObject.collidable = true;
        // tempObject.onCollide = (object) => { // we can also set a function on an object without defining the function before hand!
        //     console.log(`I collided with ${object.name}!`);
        // };
        // }
    }

    // Runs once every frame non stop after the scene loads
    onUpdate(deltaTime) {
        // TODO - Here we can add game logic, like moving game objects, detecting collisions, you name it. Examples of functions can be found in sceneFunctions
        // console.log(deltaTime)
        // example: Rotate a single object we defined in our start method
        // this.cube.rotate('x', deltaTime * 0.5);


        // Make our npc cube rotate
        this.collideCube = getObject(this.state, "collideCube");
        this.collideCube.rotate('x', deltaTime * 1);
        this.collideCube.rotate('y', deltaTime * 1);
        this.collideCube.rotate('z', deltaTime * 1);

        // Get the npc wall
        this.wall = getObject(this.state, "wall1");
        this.button = getObject(this.state, "button1");
        this.player = getObject(this.state, "playerBlock");

        // Make our npc cube translate automatically -- moves back and forth
        this.collideCube.translate(vec3.fromValues(0, 0, this.directionCube(this.collideCube)));

        //call our collision check method on our BUTTON
        // if the button is "pressed", collided w, toggle the wall
        this.checkCollision(this.button); //use key presses for now...

        if (this.button.collider.flag == true) {
            console.log("button collision");
            //this.disableButton();
            //console.log("wall toggled");
            if (this.counter < 1) {
                //this.wall.translate(vec3.fromValues(0, -0.5, 0));
                this.wall.translate(vec3.fromValues(0, -0.2, 0));
            }
            //this.toggleWall();  // flips the sign
            //this.disableButton();
            //this.counter += 1;
            this.disableButton();
            this.setTimer();  //wall comes back up when timer hits
            //this.disableButton();

        }


        this.checkCollision(this.player);

        if(this.player.collider.flag == true){
            console.log("player collision");
            //this.disableButton();
            //console.log("wall toggled");
            if (this.counter < 1) {
                //this.wall.translate(vec3.fromValues(0, -0.5, 0));
                this.wall.translate(vec3.fromValues(0, -0.2, 0));
            }
            //this.toggleWall();  // flips the sign
            //this.disableButton();
            //this.counter += 1;
            this.disableButton();
            this.setTimer();  //wall comes back up when timer hits
            //this.disableButton();
        }


        // example: Rotate all objects in the scene marked with a flag
        // this.state.objects.forEach((object) => {
        //     if (object.constantRotate) {
        //         object.rotate('y', deltaTime * 0.5);
        //     }
        // });

        // simulate a collision between the first spawned object and 'cube'
        // if (this.spawnedObjects[0].collidable) {
        //     this.spawnedObjects[0].onCollide(this.cube);
        // }

        // example: Rotate all the 'spawned' objects in the scene
        // this.spawnedObjects.forEach((object) => {
        //     object.rotate('y', deltaTime * 0.5);
        // });


        // example - call our collision check method on our cube
        // this.checkCollision(this.cube);


    }
}
