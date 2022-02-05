// Global Variables
const openMenuBtn = document.getElementById("open-menu");
const closeMenuBtn = document.getElementById("close-menu");
const mobileNavBar = document.getElementById("mobile-navbar");
const mobileCloseBtn = document.getElementById("menu-close-button");
const mobileMenu = document.getElementById("mobile-menu");
const mobileNav = document.getElementById("mobile-nav");
const modalOverlay = document.getElementById("modal-overlay");
const modal = document.getElementById("modal");
const numbersSection = document.querySelector("#numbers .container");
const progressBar = document.querySelector("#progress-bar div");
const openButtons = document.querySelectorAll("main button");
const specificButtons = {
  button0: "#no-reward",
  button1: "#bamboo",
  button2: "#black",
  button3: "#mahogany",
};
const modalCloseBtn = document.getElementById("modal-close-button");
const selections = document.querySelectorAll(".selection");
const selects = document.querySelectorAll(".select input");
const enterPledge = document.querySelectorAll(".enter-pledge");
const continueButtons = document.querySelectorAll(".continue-button");
const inputConditions = { option1: 0, option2: 25, option3: 75, option4: 200 };
const finalButton = document.getElementById("final-button");
const totalRaised = document.getElementById("total-raised");
const totalBackers = document.getElementById("total-backers");
const main = document.getElementsByTagName("main");
const bookmark = document.getElementById("bookmark");
const bookmarkCircle = document.querySelector("#bookmark circle");
const bookmarkLabel = document.querySelector("#bookmark p");

let pledge = 0;

// Events
window.addEventListener("scroll", fixedNav);

openMenuBtn.addEventListener("click", () => {
  menuOpen();
});

closeMenuBtn.addEventListener("click", () => {
  menuClose();
});

modalOverlay.addEventListener("click", () => {
  closeModal();
});

openButtons.forEach((button) => {
  button.addEventListener("click", () => {
    openModal();
    let inputID = specificButtons[button.id];
    let checkedOption = document.querySelector(inputID);
    checkedOption.checked = true;

    selectNew(checkedOption);
  });
});

modalCloseBtn.addEventListener("click", () => {
  closeModal();
});

bookmark.addEventListener("click", () => {
  bookmark.classList.toggle("bookmarked");
  if (bookmark.classList.contains("bookmarked")) {
    bookmark.classList.remove("bg-[#2F2F2F]/5", "xl:w-[10.875rem]");
    bookmark.classList.add("bg-[#147A73]/5", "xl:w-[11.875rem]");
    bookmarkCircle.classList.remove(
      "group-hover:fill-[#bbacac]",
      "group-active:fill-[#707070]"
    );
    bookmarkCircle.classList.add(
      "group-hover:fill-[#147A73]/80",
      "group-active:fill-[#147A73]/80"
    );
    bookmarkCircle.setAttribute("fill", "#147A73");
    bookmarkLabel.classList.remove("text-[#7A7A7A]");
    bookmarkLabel.classList.add("text-[#147A73]");
    bookmarkLabel.innerText = "Bookmarked";
  } else {
    bookmark.classList.remove("bg-[#147A73]/5", "xl:w-[11.875rem]");
    bookmark.classList.add("bg-[#2F2F2F]/5", "xl:w-[10.875rem]");
    bookmarkCircle.classList.remove(
      "group-hover:fill-[#147A73]/80",
      "group-active:fill-[#147A73]/80"
    );
    bookmarkCircle.classList.add(
      "group-hover:fill-[#bbacac]",
      "group-active:fill-[#707070]"
    );
    bookmarkCircle.setAttribute("fill", "#2F2F2F");
    bookmarkLabel.classList.remove("text-[#147A73]");
    bookmarkLabel.classList.add("text-[#7A7A7A]");

    bookmarkLabel.innerText = "Bookmark";
  }
});

selects.forEach((select) => {
  select.addEventListener("change", () => {
    clearSelect();
    selectNew(select);
  });
});

continueButtons.forEach((button) => {
  button.addEventListener("click", (e) => {
    e.preventDefault();

    let input = document.querySelector(
      ".selection.selected .enter-pledge input"
    );
    let inputID = input.id;
    let errorMessage = document.querySelector(
      ".selection.selected .enter-pledge .error-message"
    );
    pledge = Number(input.value);

    if (!pledge || pledge < inputConditions[inputID]) {
      input.parentElement.classList.remove("border-black/[0.15]");
      input.parentElement.classList.add("border-red-500");
      errorMessage.classList.remove("hidden");
    } else {
      input.parentElement.classList.remove("border-red-500");
      input.parentElement.classList.add("border-black/[0.15]");
      errorMessage.classList.add("hidden");
      updateStock();
      closeModal();
      setTimeout(() => {
        showConfirmation();
      }, 1500);
    }
  });
});

finalButton.addEventListener("click", () => {
  hideConfirmation();
  numbersSection.classList.add("opacity-0");
  let newTotal = Math.round(
    parseFloat(totalRaised.innerText.replace(",", "")) + pledge
  );
  let totalString = newTotal.toString();
  let newBackers = (
    parseFloat(totalBackers.innerText.replace(",", "")) + 1
  ).toString();
  let backersString = newBackers.toString();
  for (let i = 3; i < totalString.length; i += 4) {
    totalString = totalString.slice(0, -i) + "," + totalString.slice(-i);
  }
  for (let i = 3; i < backersString.length; i += 3) {
    backersString = backersString.slice(0, -i) + "," + backersString.slice(-i);
  }
  setTimeout(() => {
    window.scrollTo({
      top: 200,
      behavior: "smooth",
    });
    progressBar.style.transition = "width 0s ease-out";
    progressBar.style.maxWidth = 0;
    progressBar.style.width = 0;
    setTimeout(() => {
      totalRaised.innerHTML = totalString;
      totalBackers.innerHTML = backersString;
      numbersSection.classList.remove("opacity-0");
      progressBar.style.maxWidth = "100%";
      let newWidth = (newTotal * 100) / 100000;
      if (newWidth < 100) {
        progressBar.style.transition = `width ${newWidth * 0.01 * 2}s ease-out`;
        progressBar.style.width = newWidth + "%";
      } else {
        progressBar.style.transition = "width 2s ease-out";
        progressBar.style.width = "100%";
      }
    }, 1000);
  }, 500);
});

// Helper functions

function selectNew(select) {
  let parentSelection = select.parentElement.parentElement.parentElement;
  parentSelection.classList.remove("border", "border-black/[0.15]");
  parentSelection.classList.add("border-2", "border-[#3CB3AB]", "selected");
  let pledge = document.querySelector(".selection.selected .enter-pledge");
  pledge.classList.remove("hidden");
  pledge.classList.add("flex");
  select.checked = true;
  setTimeout(() => parentSelection.scrollIntoView({ behavior: "smooth" }), 500);
}

function clearSelect() {
  let currentSelection = document.querySelector(".selection.selected ");
  if (currentSelection) {
    let radio = document.querySelector(".selection.selected .select input");
    let pledge = document.querySelector(".selection.selected .enter-pledge");
    let currentInput = document.querySelector(
      ".selection.selected .enter-pledge input"
    );

    currentSelection.classList.remove(
      "border-2",
      "border-[#3CB3AB]",
      "selected"
    );
    currentSelection.classList.add("border", "border-black/[0.15]");
    radio.checked = false;
    pledge.classList.remove("flex");
    pledge.classList.add("hidden");
    setTimeout(() => {
      currentInput.parentElement.parentElement.classList.remove("error");
      currentInput.value = "";
    }, 500);
  }
}

function updateStock() {
  let selector = document
    .querySelector(".selection.selected .select input")
    .getAttribute("value");

  let options = document.querySelectorAll(`.option.${selector}`);
  let stock = document.querySelectorAll(`.option.${selector} span`);

  if (selector !== "noReward") {
    let newStock = Number(stock[0].innerText) - 1;
    stock.forEach((stock) => {
      stock.innerText = newStock.toString();
    });

    if (newStock === 0) {
      options.forEach((option) => {
        option.classList.add("opacity-50", "pointer-events-none");
        document
          .querySelectorAll(".opacity.pointer-events-none button")
          .forEach((button) => {
            button.innerText = "Out of Stock";
            button.classList.remove("bg-[#3CB3AB]");
            button.classList.add("bg-[#3CB3AB]", "pointer-events-none");
          });
      });
    }
  }
}

function openModal() {
  modalOverlay.classList.remove("opacity-0", "pointer-events-none");
  mobileNavBar.classList.add("pointer-events-none");
  modal.classList.remove("opacity-0", "scale-0", "pointer-events-none");
  modal.classList.add("opacity-100", "scale-100");
}

function closeModal() {
  resetModal();
  modalOverlay.classList.add("opacity-0", "pointer-events-none");
  mobileNavBar.classList.remove("pointer-events-none");
  modal.classList.remove("opacity-100", "scale-100");
  modal.classList.add("opacity-0", "scale-0", "pointer-events-none");
}

function resetModal() {
  setTimeout(() => {
    clearSelect();
  }, 500);
}

function menuOpen() {
  openMenuBtn.classList.remove("opacity-100", "scale-100");
  openMenuBtn.classList.add("opacity-0", "scale-0", "pointer-events-none");
  closeMenuBtn.classList.remove("opacity-0", "scale-0", "pointer-events-none");
  closeMenuBtn.classList.add("opacity-100", "scale-100");
  mobileMenu.classList.remove("opacity-0", "pointer-events-none");
  mobileNav.classList.remove("scale-0");
}

function menuClose() {
  closeMenuBtn.classList.remove("opacity-100", "scale-100");
  closeMenuBtn.classList.add("opacity-0", "scale-0", "pointer-events-none");
  openMenuBtn.classList.remove("opacity-0", "scale-0", "pointer-events-none");
  openMenuBtn.classList.add("opacity-100", "scale-100");
  mobileMenu.classList.add("opacity-0", "pointer-events-none");
  mobileNav.classList.add("scale-0");
}

function showConfirmation() {
  confirmation.classList.remove("opacity-0", "pointer-events-none");
  confirmation.classList.add("opacity-100");
  confirmation.scrollIntoView({ behavior: "smooth" });
}

function hideConfirmation() {
  confirmation.classList.remove("opacity-100");
  confirmation.classList.add("opacity-0", "pointer-events-none");
}

function fixedNav() {
  if (window.scrollY > mobileNavBar.offsetHeight / 3) {
    mobileNavBar.classList.remove("py-8");
    mobileNavBar.classList.add("bg-black", "py-5");
    closeMenuBtn.classList.remove("top-[2.188rem]");
    closeMenuBtn.classList.add("top-[1.438rem]");
  } else {
    mobileNavBar.classList.remove("bg-black", "py-5");
    mobileNavBar.classList.add("py-8");
    closeMenuBtn.classList.remove("top-[1.438rem]");
    closeMenuBtn.classList.add("top-[2.188rem]");
  }
}
