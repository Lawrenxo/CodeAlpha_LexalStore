class DropdownMenu extends HTMLElement {
    static observedAttributes = ["src"];
    
    connectedCallback() {
        const shadow = this.attachShadow({mode: "open"});
        shadow.innerHTML = `
            <style>
                .menu {
                    position: relative;
                }
                
                .content {
                    display: none;
                    position: absolute;
                    top: 100%;
                    min-width: 8rem;
                    padding: 0.5rem;
                    margin: 0.5rem;
                    border-radius: 0.5rem;
                    background-color: light-dark(#FFFFFF, #1E1E1E);
                    box-shadow: 0 0 5px #1654FE55;
                }
                
                .content.open {
                    display: block;
                }
                
                .toggle {
                    background-color: transparent;
                    border: none;
                    border-radius: 50%;
                    transition: background-color 0.3s;
                }
                
                .toggle:active {
                    background-color: lightgray;
                }
                
            </style>
            
            <span part="menu" class="menu">
                <button part="toogle" class="toggle">
                    <span part="icon" class="icon">&#x205D;</span>
                </button>
                <div class="content" part="content">
                    <slot></slot>
                </div>
            </span>
        `;
        const toggle = shadow.querySelector(".toggle");
        toggle.addEventListener("click", this.toggleMenu);
    }
    
    /**
     * @param {MouseEvent} event
     */
    toggleMenu = (event) => {
        event.stopImmediatePropagation();
        const content = this.shadowRoot.querySelector(".content");
        const open = content.classList.toggle("open");
        
        if (open) {
            document.addEventListener("scroll", this.toggleMenu, true);
            document.addEventListener("click", this.toggleMenu);
            if (event.clientX > (window.innerWidth / 2)) { content.style.right = "0"; }
            if (event.clientY > (window.innerHeight / 1.5)) {
                content.style.top = "none";
                content.style.bottom = "0";
            }
        } else {
            document.removeEventListener("scroll", this.toggleMenu, true);
            document.removeEventListener("click", this.toggleMenu);
        }
    }
}

customElements.define("dropdown-menu", DropdownMenu);