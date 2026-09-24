class TabLayout extends HTMLElement {
    static observedAttributes = ["count", "name"];
    static tabCount = 0;
    
    connectedCallback() {
        const shadow = this.attachShadow({ mode: "open" });
        const count = parseInt(this.getAttribute("count") || "0");
        shadow.innerHTML = `
            <style>
                * {
                    box-sizing: border-box;
                }
                
                .tabs {
                    display: flex;
                    flex-wrap: wrap;
                    background-color: #ECE6E0;
                    border-radius: 0.5rem;
                    overflow: clip;
                }
                
                .tab {
                    display: contents;
                }
                
                .tab[open] {
                    --details-link-bg: #fff;
                    --details-pointer-events: none;
                    --details-link-border-radius: .5rem .5rem 0 0;
                }
                
                .tab[open]::details-content {
                    display: contents;
                }
                
                .tab-head {
                    display: block;
                    width: calc(100% / ${count});
                    min-width: calc(100% / clamp(3, calc(100% / 8rem), 10));
                    padding: 0.5rem 1.5rem;
                    background-color: var(--details-link-bg, #ECE6E0);
                    border-radius: var(--details-link-border-radius, 0);
                    list-style: none;
                    order: 0;
                    cursor: pointer;
                    font-weight: 600;
                    pointer-events: var(--details-pointer-events);
                }
                
                .tab-body {
                    order: 1;
                    padding: 2rem;
                    width: 100%;
                    background-color: #ffffff;
                }
                
            </style>
            
            <div part="tabs" class="tabs"></div>
        `;
        
        const name = this.getAttribute("name") || `name-${TabLayout.tabCount}`;
        const tabs = shadow.querySelector(".tabs");
        for (let i = 0; i < count; i++) {
            const open = (i == 0) ? "open" : "";
            tabs.innerHTML += `
                <details class="tab" part="tab" name="${name}" ${open}>
                    <summary class="tab-head" part="head">
                        <slot name="tab-head-${i}"></slot>
                    </summary>
                    <div class="tab-body" part="body">
                        <slot name="tab-body-${i}"></slot>
                    </div>
                </details>
            `;
        }
        TabLayout.tabCount++;
    }
}

customElements.define("tab-layout", TabLayout);