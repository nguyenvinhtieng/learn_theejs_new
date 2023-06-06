import * as THREE from "three";
import Experience from "../Experience";

export default class Fox {
    constructor() {
        this.experience = new Experience();
        this.scene = this.experience.scene;
        this.resources = this.experience.resources;
        this.resource = this.resources.items.foxModel

        this.debug = this.experience.debug
        if(this.debug.active) {
            this.debugFolder = this.debug.ui.addFolder('Fox')
        }

        this.setModel();
        this.setAnimation();
    }

    setModel() {
        this.model = this.resource.scene
        this.model.scale.set(0.02, 0.02, 0.02)
        this.scene.add(this.model)

        this.model.traverse((child) => {
            if(child instanceof THREE.Mesh) {
                child.castShadow = true
                child.receiveShadow = true
            }
        })
    }

    setAnimation() {
        this.animation = {};
        this.animation.mixer = new THREE.AnimationMixer(this.model)
        this.animation.actions = {}
        this.animation.actions.idle = this.animation.mixer.clipAction(this.resource.animations[0])
        this.animation.actions.walk = this.animation.mixer.clipAction(this.resource.animations[1])
        this.animation.actions.run = this.animation.mixer.clipAction(this.resource.animations[2])

        this.animation.actions.current = this.animation.actions.idle

        this.animation.actions.current.play()

        this.animation.play = (name) => {
            const nextAction = this.animation.actions[name]
            const currentAction = this.animation.actions.current

            if(nextAction == currentAction) return

            nextAction.reset()
            // nextAction.enabled = true
            // nextAction.time = 0
            nextAction.play()
            nextAction.crossFadeFrom(currentAction, 1)
        }

        if(this.debug.active) {
            const debugObject = {
                playIdle: () => { this.animation.play('idle') },
                playWalk: () => { this.animation.play('walk') },
                playRun: () => { this.animation.play('run') },
            }
            this.debugFolder.add(debugObject, 'playIdle')
            this.debugFolder.add(debugObject, 'playWalk')
            this.debugFolder.add(debugObject, 'playRun')
        }
    }
    update() {
        if(this.animation) {
            this.animation.mixer.update(this.experience.time.delta * 0.001)
        }
    }
}