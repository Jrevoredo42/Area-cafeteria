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
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            this.menuData = await response.json();
        } catch (error) {
            console.error('Erro ao carregar dados do cardápio:', error);
            this.loadEmbeddedData();
        }
    }

    loadEmbeddedData() {
        // Dados embutidos como fallback quando o fetch falha
        this.menuData = {
            "entradas": [
                {
                    "id": 1,
                    "nome": "Bruschetta Tradicional",
                    "descricao": "Pão artesanal tostado com tomates frescos, manjericão e azeite extra virgem",
                    "preco": 18.90,
                    "imagem": "../assets/cardapio/entradas/bruschetta.jpg",
                    "tags": ["Entradas", "Vegetariano"]
                },
                {
                    "id": 2,
                    "nome": "Carpaccio de Salmão",
                    "descricao": "Fatias finas de salmão fresco com rúcula, parmesão e molho de mostarda",
                    "preco": 32.50,
                    "imagem": "../assets/cardapio/entradas/carpaccio.jpg",
                    "tags": ["Entradas", "Peixe"]
                }
            ],
            "pratos-principais": [
                {
                    "id": 3,
                    "nome": "Risotto de Cogumelos",
                    "descricao": "Arroz arbóreo cremoso com mix de cogumelos frescos e parmesão",
                    "preco": 45.90,
                    "imagem": "../assets/cardapio/pratos-principais/risotto.jpg",
                    "tags": ["Pratos Principais", "Vegetariano"]
                },
                {
                    "id": 4,
                    "nome": "Salmão Grelhado",
                    "descricao": "Filé de salmão grelhado com legumes grelhados e molho de ervas",
                    "preco": 52.90,
                    "imagem": "../assets/cardapio/pratos-principais/salmao.jpg",
                    "tags": ["Pratos Principais", "Peixe"]
                }
            ],
            "sobremesas": [
                {
                    "id": 5,
                    "nome": "Tiramisu Clássico",
                    "descricao": "Sobremesa italiana com café, mascarpone e cacau em pó",
                    "preco": 22.90,
                    "imagem": "../assets/cardapio/sobremesas/tiramisu.jpg",
                    "tags": ["Sobremesas", "Italiana"]
                }
            ],
            "bebidas": [
                {
                    "id": 6,
                    "nome": "Suco de Laranja Natural",
                    "descricao": "Suco fresco de laranja espremido na hora",
                    "preco": 12.90,
                    "imagem": "../assets/cardapio/bebidas/suco-laranja.jpg",
                    "tags": ["Bebidas", "Natural"]
                }
            ]
        };
    }

    setupEventListeners() {
        const menuItems = document.querySelectorAll('header ul li a');
        
        menuItems.forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                
                // Remove active class from all items
                menuItems.forEach(menuItem => {
                    menuItem.parentElement.classList.remove('active');
                });
                
                // Add active class to clicked item
                item.parentElement.classList.add('active');
                
                // Get category from text content
                const category = this.getCategoryFromText(item.textContent.trim());
                this.currentCategory = category;
                this.renderMenu(category);
            });
        });
    }

    getCategoryFromText(text) {
        const categoryMap = {
            'Todos': 'todos',
            'Entradas': 'entradas',
            'Pratos Principais': 'pratos-principais',
            'Sobremesas': 'sobremesas',
            'Bebidas': 'bebidas'
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
            // Show all items from all categories
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
            'Entradas': 'tag-entradas',
            'Pratos Principais': 'tag-pratos-principais',
            'Sobremesas': 'tag-sobremesas',
            'Bebidas': 'tag-bebidas',
            'Vegetariano': 'tag-vegetariano',
            'Peixe': 'tag-peixe',
            'Carne': 'tag-carne',
            'Frutos do Mar': 'tag-frutos-mar',
            'Italiana': 'tag-italiana',
            'Americana': 'tag-americana',
            'Brasileira': 'tag-brasileira',
            'Natural': 'tag-natural',
            'Café': 'tag-cafe',
            'Água': 'tag-agua'
        };
        
        return tagClassMap[tagText] || 'tag-entradas';
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

// Adicionar estilos para o estado ativo dos botões do menu
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
