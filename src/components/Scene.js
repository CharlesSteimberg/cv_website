import {useState, useRef, useEffect} from "react";
import * as THREE from "three";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader.js';

const modelPath = 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/1376484/stacy_lightweight.glb';

const Scene = () => {
    const mount = useRef(null);
    const [coord, setCoord] = useState({x: null, y: null});

    useEffect(() => {
        // BUILDING THE SCENE
        const width = mount.current.clientWidth;
        const height = mount.current.clientHeight;
        const scene = new THREE.Scene();
        const backgroundColor = 0x1B1B1D;
        scene.background = new THREE.Color(backgroundColor);
        const camera = new THREE.PerspectiveCamera(
            75, // fov = field of view
            width / height, // aspect ratio
            0.1, // near plane
            1000 // far plane
        );
        camera.position.z = 3; // is used here to set some distance from a cube that is located at z = 0

        // OrbitControls allow a camera to orbit around the object
        //const controls = new OrbitControls( camera, mount.current );
        const clock = new THREE.Clock();
        const renderer = new THREE.WebGLRenderer({antialias: true });
        renderer.setSize( width, height );
        renderer.shadowMap.enabled = true;
        renderer.setPixelRatio(window.devicePixelRatio);
        mount.current.appendChild( renderer.domElement );

        //ADDING ELEMENTS
        let stacy_txt = new THREE.TextureLoader().load('https://s3-us-west-2.amazonaws.com/s.cdpn.io/1376484/stacy.jpg');

        stacy_txt.flipY = false; // we flip the texture so that its the right way up

        const stacy_mtl = new THREE.MeshPhongMaterial({
            map: stacy_txt,
            color: 0xffffff
        });

        //load model
        var mixer;
        var neck;
        var waist;
        const loader = new GLTFLoader();
        loader.load(
            modelPath,
            ( gltf ) => {
                const model = gltf.scene;
                const fileAnimations = gltf.animations;
                model.traverse(o => {
                    if (o.isMesh) {
                        o.castShadow = true;
                        o.receiveShadow = true;
                        o.material = stacy_mtl;
                    }
                    // Reference the neck and waist bones
                    if (o.isBone && o.name === 'mixamorigNeck') { 
                        neck = o;
                    }
                    if (o.isBone && o.name === 'mixamorigSpine') { 
                        waist = o;
                    }
                    });
                model.position.y = -1;
                scene.add(model);
                mixer = new THREE.AnimationMixer(model);
                const idleAnim = THREE.AnimationClip.findByName(fileAnimations, 'idle');
                idleAnim.tracks.splice(3, 3);
                idleAnim.tracks.splice(9, 3);
                const idle = mixer.clipAction(idleAnim);
                idle.play();
            },
            ( xhr ) => {    
                //console.log(xhr);
            }, 
            ( error ) => {
                console.error(error);
            }
        );

        const lights = [];
        lights[ 0 ] = new THREE.PointLight( 0xffffff, 1, 0 );
        lights[ 1 ] = new THREE.PointLight( 0xffffff, 1, 0 );
        lights[ 2 ] = new THREE.PointLight( 0xffffff, 1, 0 );

        lights[ 0 ].position.set( 0, 200, 0 );
        lights[ 1 ].position.set( 100, 200, 100 );
        lights[ 2 ].position.set( - 100, - 200, - 100 );

        scene.add( lights[ 0 ] );
        scene.add( lights[ 1 ] );
        scene.add( lights[ 2 ] );

        const startAnimationLoop = () => {
            if(mixer){
                mixer.update(clock.getDelta());
            }
    
            renderer.render( scene, camera );
            window.requestAnimationFrame(startAnimationLoop);
        }

        const handleWindowResize = () => {
            const width = mount.current.clientWidth ? mount.current.clientWidth : 1;
            const height = mount.current.clientHeight ? mount.current.clientHeight : 1;
    
            renderer.setSize( width, height );
            camera.aspect = width / height;
    
            camera.updateProjectionMatrix();
        }

        const follow = (e) => {
            const x = (e.type === "mousemove") ? e.clientX : e.touches[0].clientX;
            const y = (e.type === "mousemove") ? e.clientY : e.touches[0].clientY;
            if (neck && waist) {
                moveJoint(x, y, neck, 50);
                moveJoint(x, y, waist, 30);
            }
        }

        const moveJoint = (x, y, joint, degreeLimit) => {
            const degrees = getMouseDegrees(x, y, degreeLimit);
            joint.rotation.y = degrees.x * Math.PI/180;
            joint.rotation.x = degrees.y * Math.PI/180;
        }

        const getMouseDegrees = (x, y, degreeLimit) => {
            let dx = 0,
                dy = 0,
                xdiff,
                xPercentage,
                ydiff,
                yPercentage;
          
            let w = { x: window.innerWidth, y: window.innerHeight };

            // Left (Rotates neck left between 0 and -degreeLimit)
             // 1. If cursor is in the left half of screen
            if (x <= w.x / 2) {
              // 2. Get the difference between middle of screen and cursor position
              xdiff = w.x / 2 - x;  
              // 3. Find the percentage of that difference (percentage toward edge of screen)
              xPercentage = (xdiff / (w.x / 2)) * 100;
              // 4. Convert that to a percentage of the maximum rotation we allow for the neck
              dx = ((degreeLimit * xPercentage) / 100) * -1; }
            // Right (Rotates neck right between 0 and degreeLimit)
            if (x >= w.x / 2) {
              xdiff = x - w.x / 2;
              xPercentage = (xdiff / (w.x / 2)) * 100;
              dx = (degreeLimit * xPercentage) / 100;
            }
            // Up (Rotates neck up between 0 and -degreeLimit)
            if (y <= w.y / 2) {
              ydiff = w.y / 2 - y;
              yPercentage = (ydiff / (w.y / 2)) * 100;
              // Note that I cut degreeLimit in half when she looks up
              dy = (((degreeLimit * 0.5) * yPercentage) / 100) * -1;
              }
            
            // Down (Rotates neck down between 0 and degreeLimit)
            if (y >= w.y / 2) {
              ydiff = y - w.y / 2;
              yPercentage = (ydiff / (w.y / 2)) * 100;
              dy = (degreeLimit * yPercentage) / 100;
            }
            return { x: dx, y: dy };
        }

        window.addEventListener("resize", handleWindowResize, false);
        window.addEventListener('mousemove', follow);
        window.addEventListener('touchmove', follow);
        startAnimationLoop();
    }, []);

    return <div className="Scene" ref={mount} />;
}

export default Scene;