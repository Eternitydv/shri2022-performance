(() => {
    function bind(nodes, event, handler) {
        for(let i = 0; i < nodes.length; i++) {
            nodes[i].addEventListener(event, handler);
        }
    }

    
    function makeTabs(node) {
        const select = node.querySelector('.section__select');
        const tabs = node.querySelectorAll('.section__tab');
        const list = [];
        const tabMap = new Map();
        const panelMap = new Map();
        for(let i = 0; i < tabs.length; i++) {
            list.push(tabs[i].dataset.id);
            tabMap.set(tabs[i].dataset.id, node.querySelector(`.section__tab[data-id=${tabs[i].dataset.id}]`)) ;
            panelMap.set(tabs[i].dataset.id, node.querySelector(`.section__panel[data-id=${tabs[i].dataset.id}]`));
        }
        function selectTab(newId) {
            const newTab = tabMap.get(newId);
            const newPanel = panelMap.get(newId);
            const oldTab = node.querySelector('.section__tab_active');
            const oldPanel = node.querySelector('.section__panel:not(.section__panel_hidden)');

            oldTab.classList.remove('section__tab_active');
            oldTab.setAttribute('aria-selected', 'false');
            oldTab.removeAttribute('tabindex');
            newTab.classList.add('section__tab_active');
            newTab.setAttribute('aria-selected', 'true');
            newTab.setAttribute('tabindex', '0');
            newTab.focus({
                preventScroll: true
            });

            oldPanel.classList.add('section__panel_hidden');
            oldPanel.setAttribute('aria-hidden', 'true');
            newPanel.classList.remove('section__panel_hidden');
            newPanel.setAttribute('aria-hidden', 'false');

            select.value = newId;
        }

        select.addEventListener('input', () => {
            selectTab(select.value);
        });

        bind(tabs, 'click', event => {
            const newId = event.target.dataset.id;
            selectTab(newId);
        });

        bind(tabs, 'keydown', event => {
            if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) {
                return;
            }

            let index = list.indexOf(selected);
            switch(event.which){
                case 37:
                    --index;
                    break;
                case 39:
                    ++index;
                    break;
                case 36:
                    index = 0;
                    break;
                case 35:
                    index = list.length - 1;
                    break;
                default:
                    return;
            };

            if (index >= list.length) {
                index = 0;
            } else if (index < 0) {
                index = list.length - 1;
            }

            selectTab(list[index]);
            event.preventDefault();
        });
    }

    function makeMenu(node) {
        let expanded = false;
        const links = document.querySelector('.header__links');
        const headerText = node.querySelector('.header__menu-text');

        node.addEventListener('click', () => {
            expanded = !expanded;
            node.setAttribute('aria-expanded', expanded ? 'true' : 'false');
            headerText.textContent = expanded ? 'Закрыть меню' : 'Открыть меню';
            links.classList.toggle('header__links_opened', expanded);
            links.classList.add('header__links-toggled');
        });
    }

    document.addEventListener('DOMContentLoaded', () => {
        document.querySelectorAll('.main__devices').forEach(makeTabs);
        document.querySelectorAll('.header__menu').forEach(makeMenu);
    });
})();
