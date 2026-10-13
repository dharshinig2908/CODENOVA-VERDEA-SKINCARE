document.addEventListener("DOMContentLoaded", function () {
  "use strict";

  // ========================================
  // PRODUCT DATA
  // ========================================

  const products = {
    cleanser: {
      id: "cleanser",
      name: "Botanical Cleanser",
      price: 599,
      image: "verdea cleanser.jpeg",
      category: "skincare",
      description: "An everyday essential for your skincare ritual."
    },

    serum: {
      id: "serum",
      name: "Dew Drop Serum",
      price: 899,
      image: "serum.jpeg",
      category: "skincare",
      description: "A skincare essential for your daily beauty routine."
    },

    cream: {
      id: "cream",
      name: "Cloud Cream",
      price: 749,
      image: "cream.jpeg",
      category: "skincare",
      description: "A comforting addition to your everyday skincare routine."
    },

    "lip-tint": {
      id: "lip-tint",
      name: "Velvet Lip Tint",
      price: 499,
      image: "lip tint.jpeg",
      category: "makeup",
      description: "An easy everyday addition to your makeup collection."
    },

    foundation: {
      id: "foundation",
      name: "Silk Foundation",
      price: 799,
      image: "foundation.jpeg",
      category: "makeup",
      description: "A makeup essential for your everyday look."
    },

    blush: {
      id: "blush",
      name: "Rose Blush",
      price: 599,
      image: "rose blush.jpeg",
      category: "makeup",
      description: "Add a touch of colour to your everyday makeup routine."
    }
  };

  // ========================================
  // HELPER FUNCTIONS
  // ========================================

  const getElement = (selector) =>
    document.querySelector(selector);

  const getAll = (selector) =>
    document.querySelectorAll(selector);

  const formatPrice = (amount) =>
    "₹" + amount.toLocaleString("en-IN");

  // ========================================
  // TOAST NOTIFICATIONS
  // ========================================

  let toastTimer;

  function showToast(message) {
    const toast = getElement("#toast");

    if (!toast) return;

    toast.textContent = message;
    toast.classList.add("show");

    clearTimeout(toastTimer);

    toastTimer = setTimeout(function () {
      toast.classList.remove("show");
    }, 2500);
  }

  // ========================================
  // PRODUCT FILTERS
  // ========================================

  const filterButtons = getAll("[data-filter]");
  const productCards = getAll(".product-card");

  filterButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      const selectedFilter = button.dataset.filter;

      filterButtons.forEach(function (filterButton) {
        const isActive = filterButton === button;

        filterButton.classList.toggle("active", isActive);
        filterButton.setAttribute(
          "aria-pressed",
          String(isActive)
        );
      });

      productCards.forEach(function (card) {
        const category = card.dataset.category;

        card.hidden =
          selectedFilter !== "all" &&
          category !== selectedFilter;
      });
    });
  });

  // ========================================
  // SHOPPING BAG
  // ========================================

  const bag = {};

  const bagDrawer = getElement("#bag-drawer");
  const bagOverlay = getElement("#bag-overlay");
  const bagItems = getElement("#bag-items");
  const bagCount = getElement("#bag-count");
  const bagTotal = getElement("#bag-total");

  function getBagQuantity() {
    return Object.values(bag).reduce(function (total, item) {
      return total + item.quantity;
    }, 0);
  }

  function getBagTotal() {
    return Object.values(bag).reduce(function (total, item) {
      return total + item.price * item.quantity;
    }, 0);
  }

  function renderBag() {
    if (bagCount) {
      bagCount.textContent = getBagQuantity();
    }

    if (bagTotal) {
      bagTotal.textContent = formatPrice(getBagTotal());
    }

    if (!bagItems) return;

    bagItems.replaceChildren();

    const bagProducts = Object.values(bag);

    if (bagProducts.length === 0) {
      const emptyMessage = document.createElement("p");

      emptyMessage.className = "empty-bag";
      emptyMessage.textContent = "Your bag is empty.";

      bagItems.appendChild(emptyMessage);
      return;
    }

    bagProducts.forEach(function (item) {
      const row = document.createElement("div");
      row.className = "bag-item";

      const image = document.createElement("img");
      image.src = item.image;
      image.alt = item.name;
      image.width = 65;
      image.height = 65;

      const details = document.createElement("div");
      details.className = "bag-item-details";

      const name = document.createElement("h3");
      name.textContent = item.name;

      const price = document.createElement("p");
      price.textContent = formatPrice(item.price);

      const quantity = document.createElement("div");
      quantity.className = "bag-item-quantity";

      const decrease = document.createElement("button");
      decrease.type = "button";
      decrease.textContent = "−";
      decrease.setAttribute(
        "aria-label",
        "Remove one " + item.name
      );

      decrease.addEventListener("click", function () {
        changeQuantity(item.id, -1);
      });

      const quantityText = document.createElement("span");
      quantityText.textContent = item.quantity;

      const increase = document.createElement("button");
      increase.type = "button";
      increase.textContent = "+";
      increase.setAttribute(
        "aria-label",
        "Add one " + item.name
      );

      increase.addEventListener("click", function () {
        changeQuantity(item.id, 1);
      });

      const remove = document.createElement("button");
      remove.type = "button";
      remove.textContent = "Remove";
      remove.className = "remove-bag-item";

      remove.addEventListener("click", function () {
        delete bag[item.id];
        renderBag();
        showToast(item.name + " removed from your bag.");
      });

      quantity.append(
        decrease,
        quantityText,
        increase
      );

      details.append(
        name,
        price,
        quantity,
        remove
      );

      row.append(image, details);
      bagItems.appendChild(row);
    });
  }

  function addToBag(productId) {
    const product = products[productId];

    if (!product) {
      showToast("This product could not be found.");
      return;
    }

    if (bag[productId]) {
      bag[productId].quantity += 1;
    } else {
      bag[productId] = {
        ...product,
        quantity: 1
      };
    }

    renderBag();
    showToast(product.name + " added to your bag.");
  }

  function changeQuantity(productId, change) {
    if (!bag[productId]) return;

    bag[productId].quantity += change;

    if (bag[productId].quantity <= 0) {
      delete bag[productId];
    }

    renderBag();
  }

  function openBag() {
    if (!bagDrawer) return;

    bagDrawer.classList.add("open");
    bagDrawer.setAttribute("aria-hidden", "false");

    if (bagOverlay) {
      bagOverlay.hidden = false;
      bagOverlay.classList.add("show");
    }

    document.body.classList.add("bag-open");
  }

  function closeBag() {
    if (!bagDrawer) return;

    bagDrawer.classList.remove("open");
    bagDrawer.setAttribute("aria-hidden", "true");

    if (bagOverlay) {
      bagOverlay.classList.remove("show");
      bagOverlay.hidden = true;
    }

    document.body.classList.remove("bag-open");
  }

  getAll("[data-add]").forEach(function (button) {
    button.addEventListener("click", function () {
      addToBag(button.dataset.add);

      // Close the Quick View after adding the product.
      const quickView = getElement("#quick-view-modal");

      if (quickView && button.id === "quick-view-add") {
        quickView.hidden = true;
      }
    });
  });

  getElement("#bag-button")?.addEventListener(
    "click",
    openBag
  );

  getElement("#close-bag")?.addEventListener(
    "click",
    closeBag
  );

  bagOverlay?.addEventListener("click", closeBag);

  // ========================================
  // CHECKOUT
  // ========================================

  getElement("#checkout-button")?.addEventListener(
    "click",
    function () {
      if (getBagQuantity() === 0) {
        showToast("Your bag is empty. Add a product first.");
        return;
      }

      showToast(
        "Your total is " +
        formatPrice(getBagTotal()) +
        ". Checkout payment is not connected yet."
      );
    }
  );

  // ========================================
  // QUICK VIEW
  // ========================================

  const quickView = getElement("#quick-view-modal");
  const quickViewImage = getElement("#quick-view-image");
  const quickViewTitle = getElement("#quick-view-title");
  const quickViewPrice = getElement("#quick-view-price");
  const quickViewDescription =
    getElement("#quick-view-description");
  const quickViewAdd = getElement("#quick-view-add");

  getAll("[data-view]").forEach(function (button) {
    button.addEventListener("click", function () {
      const product = products[button.dataset.view];

      if (!product || !quickView) return;

      if (quickViewImage) {
        quickViewImage.src = product.image;
        quickViewImage.alt = product.name;
      }

      if (quickViewTitle) {
        quickViewTitle.textContent = product.name;
      }

      if (quickViewPrice) {
        quickViewPrice.textContent = formatPrice(product.price);
      }

      if (quickViewDescription) {
        quickViewDescription.textContent = product.description;
      }

      if (quickViewAdd) {
        quickViewAdd.dataset.add = product.id;
        quickViewAdd.textContent =
          "Add to Bag — " + formatPrice(product.price);
      }

      quickView.hidden = false;
    });
  });

  getElement("#close-quick-view")?.addEventListener(
    "click",
    function () {
      if (quickView) quickView.hidden = true;
    }
  );

  quickView?.addEventListener("click", function (event) {
    if (event.target === quickView) {
      quickView.hidden = true;
    }
  });

  // ========================================
  // ROUTINE QUIZ
  // ========================================

  const quizModal = getElement("#routine-quiz-modal");

  getElement("#routine-quiz-button")?.addEventListener(
    "click",
    function () {
      if (quizModal) quizModal.hidden = false;
    }
  );

  getElement("#close-routine-quiz")?.addEventListener(
    "click",
    function () {
      if (quizModal) quizModal.hidden = true;
    }
  );

  quizModal?.addEventListener("click", function (event) {
    if (event.target === quizModal) {
      quizModal.hidden = true;
    }
  });

  getElement("#routine-quiz-form")?.addEventListener(
    "submit",
    function (event) {
      event.preventDefault();

      const formData = new FormData(event.currentTarget);
      const skinType = formData.get("skin-type");
      const skinGoal = formData.get("skin-goal");
      const result = getElement("#routine-quiz-result");

      if (!result) return;

      let recommendedIds = ["cleanser"];

      if (skinGoal === "hydration") {
        recommendedIds = ["cleanser", "serum", "cream"];
      } else if (skinGoal === "glow") {
        recommendedIds = ["cleanser", "serum", "blush"];
      } else if (skinGoal === "simple") {
        recommendedIds = ["cleanser", "cream"];
      }

      const heading = document.createElement("h3");
      heading.textContent = "Your VERDÉA routine";

      const explanation = document.createElement("p");
      explanation.textContent =
        "Based on your selected skin type (" +
        skinType +
        "), here are some products to explore. " +
        "These are general suggestions, not medical advice.";

      const list = document.createElement("ul");

      recommendedIds.forEach(function (id) {
        const product = products[id];
        const item = document.createElement("li");

        item.textContent =
          product.name + " — " + formatPrice(product.price);

        list.appendChild(item);
      });

      result.replaceChildren(heading, explanation, list);

      showToast("Your routine is ready.");
    }
  );

  // ========================================
  // NEWSLETTER FORM
  // ========================================

  getElement("#newsletter-form")?.addEventListener(
    "submit",
    function (event) {
      event.preventDefault();

      const emailInput = getElement("#newsletter-email");

      if (!emailInput || !emailInput.checkValidity()) {
        emailInput?.reportValidity();
        return;
      }

      showToast(
        "Thank you for your interest! Newsletter signup needs a mailing service."
      );

      // No email is sent or saved by this front-end form.
      event.currentTarget.reset();
    }
  );

  // ========================================
  // ESCAPE KEY SUPPORT
  // ========================================

  document.addEventListener("keydown", function (event) {
    if (event.key !== "Escape") return;

    if (quickView && !quickView.hidden) {
      quickView.hidden = true;
    }

    if (quizModal && !quizModal.hidden) {
      quizModal.hidden = true;
    }

    if (
      bagDrawer &&
      bagDrawer.classList.contains("open")
    ) {
      closeBag();
    }
  });

  // ========================================
  // INITIALIZE
  // ========================================

  renderBag();
});