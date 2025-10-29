// Sistema de Cardápio Dinâmico
class MenuManager {
    constructor() {
        this.menuData = null;
        this.currentCategory = 'todos';
        this.init();
    }

    async init() {
        await this.loadMenuData();
        this.setupEventListeners();
        this.renderMenu('todos');
    }

    async loadMenuData() {
        try {
            const response = await fetch('../data/menu.json');

            if (!response.ok) {
                throw new Error(`Erro HTTP: ${response.status}`);
            }

            this.menuData = await response.json();
        } catch (error) {
            console.error('Erro ao carregar dados do cardápio:', error);
            this.showError('Não foi possível carregar o cardápio. Tente novamente mais tarde.');
        }
    }

    setupEventListeners() {
        const menuItems = document.querySelectorAll('header ul li a');
        
        menuItems.forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                
                // Remove classe ativa de todos
                menuItems.forEach(menuItem => {
                    menuItem.parentElement.classList.remove('active');
                });
                
                // Adiciona classe ativa ao item clicado
                item.parentElement.classList.add('active');
                
                const category = this.getCategoryFromText(item.textContent.trim());
                this.currentCategory = category;
                this.renderMenu(category);
            });
        });
    }

    getCategoryFromText(text) {
        const categoryMap = {
            'Todos': 'todos',
            'Cappuccinos': 'cappuccinos',
            'Espressos': 'espressos',
            'Chocolate Quente': 'chocolate-quente',
            'Bebidas Geladas': 'bebidas-geladas',
            'Pratos Principais': 'pratos-principais',
            'Sobremesas': 'sobremesas'
        };
        
        return categoryMap[text] || 'todos';
    }

    renderMenu(category) {
        const menuContainer = document.getElementById('menu-container');
        
        if (!this.menuData) {
            menuContainer.innerHTML = '<div class="loading">Carregando cardápio...</div>';
            return;
        }

        let itemsToShow = [];
        
        if (category === 'todos') {
            Object.values(this.menuData).forEach(categoryItems => {
                itemsToShow = itemsToShow.concat(categoryItems);
            });
        } else {
            itemsToShow = this.menuData[category] || [];
        }

        if (itemsToShow.length === 0) {
            menuContainer.innerHTML = `
                <div class="empty-state">
                    <h3>Nenhum item encontrado</h3>
                    <p>Não há itens disponíveis nesta categoria no momento.</p>
                </div>
            `;
            return;
        }

        menuContainer.innerHTML = `
            <div class="menu-grid">
                ${itemsToShow.map(item => this.createMenuItemCard(item)).join('')}
            </div>
        `;
    }

    createMenuItemCard(item) {
        return `
            <div class="menu-card">
                <img src="${item.imagem}" alt="${item.nome}" class="card-image" 
                     onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjVmNWY1Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkltYWdlbSBuw6NvIGVuY29udHJhZGE8L3RleHQ+PC9zdmc+'">
                <div class="card-content">
                    <div class="card-header">
                        <h3 class="card-title">${item.nome}</h3>
                        <div class="card-price">
                            <span class="card-price-symbol">R$</span><br>
                            ${item.preco.toFixed(2).replace('.', ',')}
                        </div>
                    </div>
                    <p class="card-description">${item.descricao}</p>
                    <div class="card-tags">
                        ${item.tags.map(tag => this.createTag(tag)).join('')}
                    </div>
                </div>
            </div>
        `;
    }

    createTag(tagText) {
        const tagClass = this.getTagClass(tagText);
        return `<span class="tag ${tagClass}">${tagText}</span>`;
    }

    getTagClass(tagText) {
        const tagClassMap = {
            'Pratos Principais': 'tag-pratos-principais',
            'Sobremesas': 'tag-sobremesas',
            'Bebidas': 'tag-bebidas',
            'Cappuccinos': 'tag-cappuccinos',
            'Espressos': 'tag-espressos',
            'Chocolate Quente': 'tag-chocolate',
            'Bebidas Geladas': 'tag-bebidas-geladas'
        };
        
        return tagClassMap[tagText] || 'tag-default';
    }

    showError(message) {
        const menuContainer = document.getElementById('menu-container');
        menuContainer.innerHTML = `
            <div class="empty-state">
                <h3>Erro</h3>
                <p>${message}</p>
            </div>
        `;
    }
}

// Inicializar o sistema quando a página carregar
document.addEventListener('DOMContentLoaded', () => {
    new MenuManager();
});

// Estilo do botão ativo
const style = document.createElement('style');
style.textContent = `
    header ul li.active {
        background-color: rgba(0, 0, 0, 0.8) !important;
        transform: translateY(-2px) !important;
    }
    
    header ul li.active a {
        color: white !important;
    }
`;
document.head.appendChild(style);
