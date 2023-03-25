function getSelectedIndexes() {
  const checkboxes = document.querySelectorAll('.dislike-checkbox');
  const selectedIndexes = Array.from(checkboxes)
    .map((checkbox, index) => (checkbox.checked ? index : -1))
    .filter((index) => index >= 0);
  return selectedIndexes;
}

function removeSelectedDislikes() {
  chrome.storage.local.get(['dislikes'], function (result) {
    const dislikes = result.dislikes || [];
    const selectedIndexes = getSelectedIndexes();
    const newDislikes = dislikes.filter((_, index) => !selectedIndexes.includes(index));
    chrome.storage.local.set({ dislikes: newDislikes }, function () {
      console.log('Removed selected dislikes');
      displayDislikes();
    });
  });
}

// 获取选中的不关注小区的索引
function getSelectedIgnoredNeighborhoodIndexes() {
  const checkboxes = document.querySelectorAll('.ignored-neigh-checkbox');
  const selectedIndexes = Array.from(checkboxes)
    .map((checkbox, index) => (checkbox.checked ? index : -1))
    .filter((index) => index >= 0);
  return selectedIndexes;
}

// 删除选中的不关注小区
function removeSelectedIgnoredNeighborhoods() {
  chrome.storage.local.get(['ignoredNeighborhoods'], function (result) {
    const ignoredNeighborhoods = result.ignoredNeighborhoods || [];
    const selectedIndexes = getSelectedIgnoredNeighborhoodIndexes();
    const newIgnoredNeighborhoods = ignoredNeighborhoods.filter((_, index) => !selectedIndexes.includes(index));
    chrome.storage.local.set({ ignoredNeighborhoods: newIgnoredNeighborhoods }, function () {
      console.log('Removed selected ignored neighborhoods');
      displayIgnoredNeighborhoods();
    });
  });
}

// 根据索引删除不关注小区
function removeIgnoredNeighborhoodAtIndex(index) {
  chrome.storage.local.get(['ignoredNeighborhoods'], function (result) {
    const ignoredNeighborhoods = result.ignoredNeighborhoods || [];
    ignoredNeighborhoods.splice(index, 1);
    chrome.storage.local.set({ ignoredNeighborhoods: ignoredNeighborhoods }, function () {
      console.log('Removed ignored neighborhood at index:', index);
      displayIgnoredNeighborhoods();
    });
  });
}

// 切换所有不关注小区的复选框
function toggleAllIgnoredNeighCheckboxes(checked) {
  const checkboxes = document.querySelectorAll('.ignored-neigh-checkbox');
  checkboxes.forEach((checkbox) => {
    checkbox.checked = checked;
  });
}

// 显示不关注的小区列表
function displayIgnoredNeighborhoods() {
  const listElement = document.querySelector(".ignored-neighborhoods-list");
  listElement.innerHTML = ""; // 清空列表，以便重新渲染
  chrome.storage.local.get(["ignoredNeighborhoods"], function (result) {
    const ignoredNeighborhoods = result.ignoredNeighborhoods || [];
    ignoredNeighborhoods.forEach(
      ({ neighborhoodTitle, neighborhoodHref }, index) => {
        const listItem = document.createElement("li");
        listItem.className = "dislike-item";

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.className = "ignored-neigh-checkbox";
        listItem.appendChild(checkbox);

        const text = document.createElement("span");
        text.className = "dislike-text";
        text.innerHTML = `<a href="https://sh.zu.ke.com${neighborhoodHref}" target="_blank">${neighborhoodTitle}</a>`;
        listItem.appendChild(text);

        const deleteButton = document.createElement("button");
        deleteButton.className = "delete-button";
        deleteButton.textContent = "删除";
        deleteButton.onclick = () => removeIgnoredNeighborhoodAtIndex(index);
        listItem.appendChild(deleteButton);

        listElement.appendChild(listItem);
      }
    );

    const deleteSelectedIgnoredNeighButton = document.querySelector(
      ".delete-selected-ignored-neigh-button"
    );
    deleteSelectedIgnoredNeighButton.onclick =
      removeSelectedIgnoredNeighborhoods;
    const selectAllIgnoredNeighButton = document.querySelector(
      ".select-all-ignored-neigh-button"
    );
    selectAllIgnoredNeighButton.onclick = () => {
      const allChecked =
        getSelectedIgnoredNeighborhoodIndexes().length ===
        ignoredNeighborhoods.length;
      toggleAllIgnoredNeighCheckboxes(!allChecked);
    };
  });
}

// 在现有的 displayDislikes() 和 displayLikes() 之后调用 displayIgnoredNeighborhoods()


function removeDislikeAtIndex(index) {
  chrome.storage.local.get(['dislikes'], function (result) {
    const dislikes = result.dislikes || [];
    dislikes.splice(index, 1);
    chrome.storage.local.set({ dislikes: dislikes }, function () {
      console.log('Removed dislike at index:', index);
      displayDislikes();
    });
  });
}

function toggleAllCheckboxes(checked) {
  const checkboxes = document.querySelectorAll('.dislike-checkbox');
  checkboxes.forEach((checkbox) => {
    checkbox.checked = checked;
  });
}

function displayDislikes() {
  const listElement = document.querySelector('.dislikes-list');
  listElement.innerHTML = ''; // 清空列表，以便重新渲染
  chrome.storage.local.get(['dislikes'], function (result) {
    const dislikes = result.dislikes || [];
    dislikes.forEach(({ house_code, name, price, href }, index) => {
      const listItem = document.createElement('li');
      listItem.className = 'dislike-item';

      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.className = 'dislike-checkbox';
      listItem.appendChild(checkbox);

      const text = document.createElement('span');
      text.className = 'dislike-text';
      text.innerHTML = `<a href="https://sh.zu.ke.com${href}" target="_blank">${name}</a> ${price}元/月`;
      listItem.appendChild(text);

      const deleteButton = document.createElement('button');
      deleteButton.className = 'delete-button';
      deleteButton.textContent = '删除';
      deleteButton.onclick = () => removeDislikeAtIndex(index);
      listItem.appendChild(deleteButton);

      listElement.appendChild(listItem);
    });

    const deleteSelectedButton = document.querySelector('.delete-selected-button');
    deleteSelectedButton.onclick = removeSelectedDislikes;

    const selectAllButton = document.querySelector('.select-all-button');
    selectAllButton.onclick = () => {
      const allChecked = getSelectedIndexes().length === dislikes.length;
      toggleAllCheckboxes(!allChecked);
    };
  });
}

function switchTab() {
  const tabs = document.querySelectorAll('.tab');
  const tabContents = document.querySelectorAll('.tab-content');

  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      const target = tab.getAttribute('data-target');

      tabs.forEach((t) => t.classList.remove('active'));
      tabContents.forEach((content) => content.classList.remove('active'));

      tab.classList.add('active');
      document.querySelector(`.${target}`).classList.add('active');
    });
  });
}

function getSelectedLikesIndexes() {
  const checkboxes = document.querySelectorAll('.like-checkbox');
  const selectedIndexes = Array.from(checkboxes)
    .map((checkbox, index) => (checkbox.checked ? index : -1))
    .filter((index) => index >= 0);
  return selectedIndexes;
}

function removeSelectedLikes() {
  chrome.storage.local.get(['likes'], function (result) {
    const likes = result.likes || [];
    const selectedIndexes = getSelectedLikesIndexes();
    const newLikes = likes.filter((_, index) => !selectedIndexes.includes(index));
    chrome.storage.local.set({ likes: newLikes }, function () {
      console.log('Removed selected likes');
      displayLikes();
    });
  });
}

function removeLikeAtIndex(index) {
  chrome.storage.local.get(['likes'], function (result) {
    const likes = result.likes || [];
    likes.splice(index, 1);
    chrome.storage.local.set({ likes: likes }, function () {
      console.log('Removed like at index:', index);
      displayLikes();
    });
  });
}

function toggleAllLikesCheckboxes(checked) {
  const checkboxes = document.querySelectorAll('.like-checkbox');
  checkboxes.forEach((checkbox) => {
    checkbox.checked = checked;
  });
}

function displayLikes() {
  const listElement = document.querySelector('.likes-list');
  listElement.innerHTML = ''; // 清空列表，以便重新渲染
  chrome.storage.local.get(['likes'], function (result) {
    const likes = result.likes || [];
    likes.forEach(({ house_code, name, price, href }, index) => {
      const listItem = document.createElement('li');
      listItem.className = 'like-item';

      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.className = 'like-checkbox';
      listItem.appendChild(checkbox);

      const text = document.createElement('span');
      text.className = 'like-text';
      text.innerHTML = `<a href="https://sh.zu.ke.com${href}" target="_blank">${name}</a> ${price}元/月`;
      listItem.appendChild(text);

      const deleteButton = document.createElement('button');
      deleteButton.className = 'delete-button';
      deleteButton.textContent = '删除';
      deleteButton.onclick = () => removeLikeAtIndex(index);
      listItem.appendChild(deleteButton);

      listElement.appendChild(listItem);
    });

    const deleteSelectedLikesButton = document.querySelector('.delete-selected-likes-button');
    deleteSelectedLikesButton.onclick = removeSelectedLikes;

    const selectAllLikesButton = document.querySelector('.select-all-likes-button');
    selectAllLikesButton.onclick = () => {
      const allChecked = getSelectedLikesIndexes().length === likes.length;
      toggleAllLikesCheckboxes(!allChecked);
    };
  });
}

displayDislikes();
displayLikes();
displayIgnoredNeighborhoods();
switchTab();