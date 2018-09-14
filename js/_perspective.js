class Perspective {
    constructor(element) {

        // Set the Perspective's root element
        this.element = element;

        // Get the first child of the perspective element and make sure that it has the class
        // rlv-perspective-body
        this.inner = this.element.children[0];
        if (!Array.from(this.inner.classList).includes('rlv-perspective-body')) {
            console.warn('Warning: rlv-perspective has no rlv-perspective-body child.');
        }
        
        // Iterate over all children of the perspective body. If any of them are images, make sure that
        // PerspectiveManager is called safely from within a document onload event. This ensures that
        // perspective element sizes are completely finished initializing.
        if (
            Array.from(this.inner.children).filter((el) => el.tagName === 'IMG' ).length > 0 &&
            document.readyState !== 'complete'
        ) {
            console.warn('Warning: You are using a <b>RelevanceCSS Perspective element with images. Make sure when initializing the PerspectiveManager, it is within a document load event callback.');
        }

        // An object to keep track of mouse position within the parent element
        this.mouse = {

            // The origin (center point) of the element
            origin: { x: 0, y: 0 },

            // The current position of the mouse
            position: { x: 0, y: 0 },

            // Given a mousemouse event, update the position of the mouse relative to the element
            update: function(e) {
                this.position.x = e.clientX - this.origin.x;
                this.position.y = (e.clientY - this.origin.y) * -1;
            },

            // Set the origin position
            setOrigin: function(el) {
                this.origin.x = el.offsetLeft + Math.floor(el.offsetWidth / 2);
                this.origin.y = el.offsetTop + Math.floor(el.offsetHeight / 2);
            }
        }

        // Initially set the origin
        this._resetOrigin();

        this.updateCounter = 0;

        // When the mouse enters the element, get the mouse position and animate once
        this.element.addEventListener('mouseenter', (e) => {
            this.mouse.update(e);
            this._animate();
        });

        // When the mouse is moved, update the mouse position.
        // Then, increment the update counter and if it should animate, then animate
        this.element.addEventListener('mousemove', (e) => {
            this.mouse.update(e);
            if (this._shouldUpdate()) this._animate();
        });

        // When the mouse leaves, reset the style of the perspective body
        this.element.addEventListener('mouseleave', (e) => {
            this.inner.style = "";
        });
    }

    // Convert the ratio of (x, y) coordinates into (x, y) rotation about the element's
    // origin. Then apply that rotation to the element as a transform.
    _animate() {
        let x = (this.mouse.position.y / this.inner.offsetHeight / 2).toFixed(2);
        let y = (this.mouse.position.x / this.inner.offsetWidth / 2).toFixed(2);

        let style = `rotateX(${x}deg) rotateY(${y}deg)`;
        this.inner.style.transform = style;
        this.inner.style.webkitTransform = style;
        this.inner.style.mozTransform = style;
        this.inner.style.msTransform = style;
        this.inner.style.oTransform = style;
    }

    // Increment the counter, and should the counter be divisible by 5,
    // return true to animate
    _shouldUpdate() {
        return this.updateCounter++ % 5 === 0;
    }

    // Calls a setOrigin on the mouse with the element.
    _resetOrigin() {
        this.mouse.setOrigin(this.element);
    }

    // Helper function to set the perspective style of the element.
    setPerspective(perspective) {
        if (typeof perspective === 'number') {
            this.element.style.perspective = `${perspective}px`;
        }
    }
}

class PerspectiveManager {
    constructor() {
        this. _perspectives = [];
        let perspectives = document.getElementsByClassName('rlv-perspective');
        for (var i = 0; i < perspectives.length; i++) {
            this.append(new Perspective(perspectives[i]));
        }
        window.addEventListener('resize', () => {
            for (var i = 0; i < this._perspectives.length; i++) {
                this._perspectives[i]._resetOrigin();
            }
        });
    }
    append(perspective) {
        this._perspectives.push(perspective);
    }
    getPerspectiveById(id) {
        let filtered = this._perspectives.filter(perspective => perspective.id == id);
        if (!filtered.length) throw new Error(`Could not find Tooltip of ID = ${id}`);
        return filtered[0];
    }
    getTooltips() {
        return this._tooltips;
    }
}