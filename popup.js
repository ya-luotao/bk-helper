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
    dislikes.forEach(({ house_code, name }, index) => {
      const listItem = document.createElement('li');
      listItem.className = 'dislike-item';

      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.className = 'dislike-checkbox';
      listItem.appendChild(checkbox);

      const text = document.createElement('span');
      text.className = 'dislike-text';
      text.textContent = `房子代码: ${house_code}, 名称: ${name}`;
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
    likes.forEach(({ house_code, name }, index) => {
      const listItem = document.createElement('li');
      listItem.className = 'like-item';

      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.className = 'like-checkbox';
      listItem.appendChild(checkbox);

      const text = document.createElement('span');
      text.className = 'like-text';
      text.textContent = `房子代码: ${house_code}, 名称: ${name}`;
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
