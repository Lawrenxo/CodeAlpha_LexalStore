class IconSvg extends HTMLElement {
    static observedAttributes = ["color", "size", "src"];
    
    connectedCallback() {
        const shadow = this.attachShadow({mode: "open"});
        const color = this.getAttribute("color") || "currentColor";
        const size = this.getAttribute("size") || "1.6rem";
        const src = this.getAttribute("src");
        shadow.innerHTML = `
            <style>
                .icon {
                    width: ${size};
                    aspect-ratio: 1;
                    background-color: ${color};
                    mask-image: url(${src});
                    mask-size: cover;
                }
            </style>
            
            <span part="icon" class="icon"></span>
        `;
    }
}

customElements.define("icon-svg", IconSvg);