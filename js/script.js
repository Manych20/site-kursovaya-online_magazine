const cartButtons = document.querySelectorAll('.cart-btn')
const mainCartButtons = document.querySelectorAll('.add-to-cart-main')
const cartCountElement = document.getElementById('cart-count')
const cartItemsContainer = document.getElementById('cart-items')
const emptyCartMessage = document.getElementById('empty-cart-message')
const clearCartBtn = document.getElementById('clear-cart-btn')
const checkoutBtn = document.getElementById('checkout-btn')

const summaryItemsCount = document.getElementById('summary-items-count')
const summarySubtotal = document.getElementById('summary-subtotal')
const summaryDelivery = document.getElementById('summary-delivery')
const summaryTotal = document.getElementById('summary-total')

const productsData = {
	1: {
		id: 1,
		name: 'Базовая футболка Oversize',
		price: 3990,
		image: 'img/t_shirt_amiri.jpg',
		description:
			'Стильная футболка свободного кроя с принтом на спине. Выполнена из качественного хлопка. Идеально подходит для повседневного образа в стиле streetwear. Хорошо сочетается с джинсами и брюками.',
		sizes: 'S, M, L, XL',
		color: 'Белый',
		material: 'Хлопок',
	},
	2: {
		id: 2,
		name: 'Спортивный костюм',
		price: 5990,
		image: 'img/costume_sport.jpg',
		description:
			'Удобный спортивный костюм для активного образа жизни и повседневной носки. Модель сочетает практичность, современный стиль и комфортную посадку. Подходит как для прогулок, так и для отдыха.',
		sizes: 'M, L, XL',
		color: 'Чёрный',
		material: 'Хлопок / полиэстер',
	},
	3: {
		id: 3,
		name: 'Худи Raflimited',
		price: 5500,
		image: 'img/hoodies_light.jpg',
		description:
			'Светлое худи в минималистичном стиле для создания актуального городского образа. Ткань приятна к телу, а свободный крой обеспечивает комфорт в течение всего дня. Отлично смотрится с джинсами и спортивными брюками.',
		sizes: 'S, M, L',
		color: 'Светло-бежевый',
		material: 'Хлопок / полиэстер',
	},
	4: {
		id: 4,
		name: 'Джинсы бананки',
		price: 4990,
		image: 'img/jeans.jpg',
		description:
			'Джинсы бананки с удобной посадкой и современным силуэтом. Универсальная модель, которая подходит для повседневного гардероба и легко сочетается с футболками, рубашками и худи.',
		sizes: '46, 48, 50, 52',
		color: 'Голубой деним',
		material: 'Деним',
	},
}

function getCart() {
	try {
		const cart = JSON.parse(localStorage.getItem('cart'))
		return Array.isArray(cart) ? cart : []
	} catch (error) {
		return []
	}
}

function saveCart(cart) {
	localStorage.setItem('cart', JSON.stringify(cart))
}

function formatPrice(price) {
	return Number(price).toLocaleString('ru-RU') + ' ₽'
}

function updateCartCount() {
	const cart = getCart()
	const totalCount = cart.reduce((sum, item) => sum + item.quantity, 0)

	if (cartCountElement) {
		cartCountElement.textContent = totalCount
	}
}

function addToCart(product) {
	const cart = getCart()
	const existingProduct = cart.find(item => item.id === product.id)

	if (existingProduct) {
		existingProduct.quantity += 1
	} else {
		cart.push({
			...product,
			quantity: 1,
		})
	}

	saveCart(cart)
	updateCartCount()
	alert(`Товар "${product.name}" добавлен в корзину`)
}

function removeFromCart(productId) {
	let cart = getCart()
	cart = cart.filter(item => item.id !== productId)
	saveCart(cart)
	updateCartCount()
	renderCartPage()
}

function changeQuantity(productId, delta) {
	const cart = getCart()
	const product = cart.find(item => item.id === productId)

	if (!product) return

	product.quantity += delta

	if (product.quantity <= 0) {
		removeFromCart(productId)
		return
	}

	saveCart(cart)
	updateCartCount()
	renderCartPage()
}

function clearCart() {
	saveCart([])
	updateCartCount()
	renderCartPage()
}

function calculateSummary(cart) {
	const itemsCount = cart.reduce((sum, item) => sum + item.quantity, 0)
	const subtotal = cart.reduce(
		(sum, item) => sum + item.price * item.quantity,
		0,
	)
	const delivery = subtotal > 0 ? 500 : 0
	const total = subtotal + delivery

	return { itemsCount, subtotal, delivery, total }
}

function renderEmptyCart() {
	if (!cartItemsContainer) return

	cartItemsContainer.innerHTML = ''
	emptyCartMessage?.classList.remove('hidden')

	if (summaryItemsCount) summaryItemsCount.textContent = '0'
	if (summarySubtotal) summarySubtotal.textContent = '0 ₽'
	if (summaryDelivery) summaryDelivery.textContent = '0 ₽'
	if (summaryTotal) summaryTotal.textContent = '0 ₽'
}

function renderCartPage() {
	if (!cartItemsContainer) return

	const cart = getCart()
	cartItemsContainer.innerHTML = ''

	if (cart.length === 0) {
		renderEmptyCart()
		return
	}

	emptyCartMessage?.classList.add('hidden')

	cart.forEach(item => {
		const cartItem = document.createElement('div')
		cartItem.className = 'cart-item'

		cartItem.innerHTML = `
      <div class="cart-item__image">
        <img src="${item.image}" alt="${item.name}">
      </div>

      <div class="cart-item__info">
        <h3>${item.name}</h3>
        <p class="cart-item__price">${formatPrice(item.price)}</p>
      </div>

      <div class="cart-item__quantity">
        <button class="qty-btn" data-id="${item.id}" data-action="minus">−</button>
        <span>${item.quantity}</span>
        <button class="qty-btn" data-id="${item.id}" data-action="plus">+</button>
      </div>

      <div class="cart-item__total">
        ${formatPrice(item.price * item.quantity)}
      </div>

      <button class="remove-btn" data-id="${item.id}" aria-label="Удалить товар">
        <i class="fa-solid fa-trash"></i>
      </button>
    `

		cartItemsContainer.appendChild(cartItem)
	})

	const { itemsCount, subtotal, delivery, total } = calculateSummary(cart)

	if (summaryItemsCount) summaryItemsCount.textContent = itemsCount
	if (summarySubtotal) summarySubtotal.textContent = formatPrice(subtotal)
	if (summaryDelivery) summaryDelivery.textContent = formatPrice(delivery)
	if (summaryTotal) summaryTotal.textContent = formatPrice(total)

	document.querySelectorAll('.qty-btn').forEach(button => {
		button.addEventListener('click', () => {
			const productId = Number(button.dataset.id)
			const action = button.dataset.action

			if (action === 'plus') {
				changeQuantity(productId, 1)
			} else {
				changeQuantity(productId, -1)
			}
		})
	})

	document.querySelectorAll('.remove-btn').forEach(button => {
		button.addEventListener('click', () => {
			const productId = Number(button.dataset.id)
			removeFromCart(productId)
		})
	})
}

function getProductFromButton(button) {
	return {
		id: Number(button.dataset.id),
		name: button.dataset.name,
		price: Number(button.dataset.price),
		image: button.dataset.image,
	}
}

function renderSingleProductPage() {
	const productImage = document.getElementById('product-image')
	const productTitle = document.getElementById('product-title')
	const productPrice = document.getElementById('product-price')
	const productDescription = document.getElementById('product-description')
	const productSizes = document.getElementById('product-sizes')
	const productColor = document.getElementById('product-color')
	const productMaterial = document.getElementById('product-material')
	const productAddBtn = document.getElementById('product-add-btn')

	if (
		!productImage ||
		!productTitle ||
		!productPrice ||
		!productDescription ||
		!productSizes ||
		!productColor ||
		!productMaterial ||
		!productAddBtn
	) {
		return
	}

	const params = new URLSearchParams(window.location.search)
	const productId = Number(params.get('id')) || 1
	const product = productsData[productId]

	if (!product) return

	productImage.src = product.image
	productImage.alt = product.name
	productTitle.textContent = product.name
	productPrice.textContent = formatPrice(product.price)
	productDescription.textContent = product.description
	productSizes.textContent = product.sizes
	productColor.textContent = product.color
	productMaterial.textContent = product.material

	productAddBtn.dataset.id = product.id
	productAddBtn.dataset.name = product.name
	productAddBtn.dataset.price = product.price
	productAddBtn.dataset.image = product.image
}

cartButtons.forEach(button => {
	button.addEventListener('click', () => {
		const product = getProductFromButton(button)
		addToCart(product)
	})
})

mainCartButtons.forEach(button => {
	button.addEventListener('click', () => {
		const product = getProductFromButton(button)
		addToCart(product)
	})
})

if (clearCartBtn) {
	clearCartBtn.addEventListener('click', () => {
		const cart = getCart()

		if (cart.length === 0) {
			alert('Корзина уже пуста')
			return
		}

		clearCart()
		alert('Корзина очищена')
	})
}

if (checkoutBtn) {
	checkoutBtn.addEventListener('click', () => {
		const cart = getCart()

		if (cart.length === 0) {
			alert('Корзина пуста')
			return
		}

		alert(
			'Заказ оформлен! В учебной версии можно позже добавить форму с ФИО, телефоном и адресом.',
		)
		clearCart()
	})
}

/* AUTH */

const loginTabBtn = document.getElementById('login-tab-btn')
const registerTabBtn = document.getElementById('register-tab-btn')
const loginFormBlock = document.getElementById('login-form-block')
const registerFormBlock = document.getElementById('register-form-block')

const loginForm = document.getElementById('login-form')
const registerForm = document.getElementById('register-form')

function showLoginTab() {
	if (loginTabBtn) loginTabBtn.classList.add('active')
	if (registerTabBtn) registerTabBtn.classList.remove('active')
	if (loginFormBlock) loginFormBlock.classList.remove('hidden')
	if (registerFormBlock) registerFormBlock.classList.add('hidden')
}

function showRegisterTab() {
	if (registerTabBtn) registerTabBtn.classList.add('active')
	if (loginTabBtn) loginTabBtn.classList.remove('active')
	if (registerFormBlock) registerFormBlock.classList.remove('hidden')
	if (loginFormBlock) loginFormBlock.classList.add('hidden')
}

if (loginTabBtn) {
	loginTabBtn.addEventListener('click', showLoginTab)
}

if (registerTabBtn) {
	registerTabBtn.addEventListener('click', showRegisterTab)
}

if (registerForm) {
	registerForm.addEventListener('submit', event => {
		event.preventDefault()

		const name = document.getElementById('register-name').value.trim()
		const email = document.getElementById('register-email').value.trim()
		const password = document.getElementById('register-password').value.trim()

		if (!name || !email || !password) {
			alert('Пожалуйста, заполните все поля')
			return
		}

		const userData = {
			name,
			email,
			password,
		}

		localStorage.setItem('raflimitedUser', JSON.stringify(userData))
		alert('Регистрация прошла успешно!')
		window.location.href = 'account.html'
	})
}

if (loginForm) {
	loginForm.addEventListener('submit', event => {
		event.preventDefault()

		const email = document.getElementById('login-email').value.trim()
		const password = document.getElementById('login-password').value.trim()

		const savedUser = JSON.parse(localStorage.getItem('raflimitedUser'))

		if (!savedUser) {
			alert('Пользователь не найден. Сначала зарегистрируйтесь.')
			return
		}

		if (savedUser.email === email && savedUser.password === password) {
			alert('Вход выполнен успешно!')
			window.location.href = 'account.html'
		} else {
			alert('Неверный e-mail или пароль')
		}
	})
}

/* ACCOUNT */

function loadAccountData() {
	const accountUserName = document.getElementById('account-user-name')
	const accountUserEmail = document.getElementById('account-user-email')
	const profileName = document.getElementById('profile-name')
	const profileEmail = document.getElementById('profile-email')

	if (!accountUserName || !accountUserEmail || !profileName || !profileEmail)
		return

	const savedUser = JSON.parse(localStorage.getItem('raflimitedUser'))

	if (!savedUser) {
		window.location.href = 'login.html'
		return
	}

	accountUserName.textContent = savedUser.name
	accountUserEmail.textContent = savedUser.email
	profileName.textContent = savedUser.name
	profileEmail.textContent = savedUser.email
}

const accountMenuButtons = document.querySelectorAll('.account-menu-btn')
const accountTabs = document.querySelectorAll('.account-tab')

accountMenuButtons.forEach(button => {
	button.addEventListener('click', () => {
		const tabName = button.dataset.accountTab

		accountMenuButtons.forEach(btn => btn.classList.remove('active'))
		button.classList.add('active')

		accountTabs.forEach(tab => tab.classList.add('hidden'))

		const currentTab = document.getElementById(`${tabName}-tab`)
		if (currentTab) {
			currentTab.classList.remove('hidden')
		}
	})
})

const logoutBtn = document.getElementById('logout-btn')

if (logoutBtn) {
	logoutBtn.addEventListener('click', () => {
		localStorage.removeItem('raflimitedUser')
		alert('Вы вышли из аккаунта')
		window.location.href = 'login.html'
	})
}

/* USER LINK IN HEADER */

function updateUserLink() {
	const userLink = document.getElementById('user-link')
	if (!userLink) return

	const savedUser = JSON.parse(localStorage.getItem('raflimitedUser'))

	if (savedUser) {
		userLink.setAttribute('href', 'account.html')
		userLink.setAttribute('title', `Личный кабинет: ${savedUser.name}`)
	} else {
		userLink.setAttribute('href', 'login.html')
		userLink.setAttribute('title', 'Войти в аккаунт')
	}
}

/* SEARCH */

function initSearch() {
	const searchInput = document.getElementById('site-search')
	const productCards = document.querySelectorAll('.searchable-product')
	const emptyMessage = document.getElementById('search-empty-message')

	if (!searchInput || productCards.length === 0) return

	searchInput.addEventListener('input', () => {
		const query = searchInput.value.trim().toLowerCase()
		let visibleCount = 0

		productCards.forEach(card => {
			const searchText = (card.dataset.search || '').toLowerCase()
			const categoryText = (card.dataset.category || '').toLowerCase()

			const isMatch =
				query === '' ||
				searchText.includes(query) ||
				categoryText.includes(query)

			if (isMatch) {
				card.classList.remove('search-hidden')
				visibleCount += 1
			} else {
				card.classList.add('search-hidden')
			}
		})

		if (emptyMessage) {
			if (visibleCount === 0) {
				emptyMessage.classList.remove('hidden')
			} else {
				emptyMessage.classList.add('hidden')
			}
		}
	})
}

/* FILTERS + SORT */

function initCatalogFiltersAndSort() {
	const productsGrid = document.getElementById('products-grid')
	const searchInput = document.getElementById('site-search')
	const emptyMessage = document.getElementById('search-empty-message')
	const filterButtons = document.querySelectorAll('.filter-btn')
	const sortSelect = document.getElementById('sort-select')

	if (!productsGrid) return

	const allCards = Array.from(
		productsGrid.querySelectorAll('.searchable-product'),
	)
	let activeFilter = 'all'

	function applyFiltersSortAndSearch() {
		const query = searchInput ? searchInput.value.trim().toLowerCase() : ''
		let visibleCount = 0

		allCards.forEach(card => {
			const searchText = (card.dataset.search || '').toLowerCase()
			const categoryText = (card.dataset.category || '').toLowerCase()

			const matchesSearch =
				query === '' ||
				searchText.includes(query) ||
				categoryText.includes(query)

			const matchesFilter =
				activeFilter === 'all' || categoryText === activeFilter

			if (matchesSearch && matchesFilter) {
				card.classList.remove('search-hidden')
				visibleCount += 1
			} else {
				card.classList.add('search-hidden')
			}
		})

		let visibleCards = allCards.filter(
			card => !card.classList.contains('search-hidden'),
		)

		const sortValue = sortSelect ? sortSelect.value : 'default'

		if (sortValue === 'price-asc') {
			visibleCards.sort(
				(a, b) => Number(a.dataset.price) - Number(b.dataset.price),
			)
		} else if (sortValue === 'price-desc') {
			visibleCards.sort(
				(a, b) => Number(b.dataset.price) - Number(a.dataset.price),
			)
		} else if (sortValue === 'name-asc') {
			visibleCards.sort((a, b) =>
				(a.dataset.name || '').localeCompare(b.dataset.name || '', 'ru'),
			)
		} else {
			visibleCards.sort((a, b) => Number(a.dataset.id) - Number(b.dataset.id))
		}

		visibleCards.forEach(card => productsGrid.appendChild(card))

		if (emptyMessage) {
			if (visibleCount === 0) {
				emptyMessage.classList.remove('hidden')
			} else {
				emptyMessage.classList.add('hidden')
			}
		}
	}

	if (searchInput) {
		searchInput.addEventListener('input', applyFiltersSortAndSearch)
	}

	filterButtons.forEach(button => {
		button.addEventListener('click', () => {
			filterButtons.forEach(btn => btn.classList.remove('active'))
			button.classList.add('active')
			activeFilter = button.dataset.filter
			applyFiltersSortAndSearch()
		})
	})

	if (sortSelect) {
		sortSelect.addEventListener('change', applyFiltersSortAndSearch)
	}

	applyFiltersSortAndSearch()
}

initCatalogFiltersAndSort()
initSearch()
updateCartCount()
renderCartPage()
renderSingleProductPage()
loadAccountData()
updateUserLink()
