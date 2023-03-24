const elements = document.getElementsByClassName('content__list--item');

for (let i = 0; i < elements.length; i++) {

  const adElements = elements[i].getElementsByClassName('content__list--item--ad')
  if (adElements.length > 0) {

    elements[i].style.display = 'none';
  } else {
    createFloatingButtons();
  }
}

function createFloatingButtons() {
  const items = document.querySelectorAll('.content__list--item:not(.content__list--item--ad)');

  items.forEach((item) => {
    const house_code = item.getAttribute('data-house_code');

    const buttonsContainer = document.createElement('div');
    buttonsContainer.style.position = 'absolute';
    buttonsContainer.style.right = '10px';
    buttonsContainer.style.top = '10px';
    buttonsContainer.style.display = 'flex';
    buttonsContainer.style.gap = '4px';
    item.style.position = 'relative';
    item.appendChild(buttonsContainer);

    const dislikeButton = document.createElement('button');
    dislikeButton.textContent = '不看这个房子';
    dislikeButton.onclick = () => {
      hideItem(item);
      addToDislikes(house_code, name);
    };
    buttonsContainer.appendChild(dislikeButton);

    const ignoreCommunityButton = document.createElement('button');
    ignoreCommunityButton.textContent = '不看这个小区';
    ignoreCommunityButton.onclick = () => {
      // 在这里添加不看这个小区的逻辑
    };
    //buttonsContainer.appendChild(ignoreCommunityButton);

    const likeButton = document.createElement('button');
    const name = item.querySelector('.content__list--item--aside').getAttribute('title');
    isLiked(house_code, (liked) => {
      likeButton.textContent = liked ? '已关注' : '加入关注';
    });
    likeButton.onclick = () => {
      toggleLike(likeButton, house_code, name);
    };
    buttonsContainer.appendChild(likeButton);

    const followCommunityButton = document.createElement('button');
    followCommunityButton.textContent = '关注小区';
    followCommunityButton.onclick = () => {
      // 在这里添加关注小区的逻辑
    };
    // buttonsContainer.appendChild(followCommunityButton);
  });
}


function removeLike(house_code) {
  chrome.storage.local.get(['likes'], function (result) {
    const likes = result.likes || [];
    const index = likes.findIndex((like) => like.house_code === house_code);
    if (index >= 0) {
      likes.splice(index, 1);
      chrome.storage.local.set({ likes: likes }, function () {
        console.log('Removed like:', house_code);
      });
    }
  });
}

function isLiked(house_code, callback) {
  chrome.storage.local.get(['likes'], function (result) {
    const likes = result.likes || [];
    const index = likes.findIndex((like) => like.house_code === house_code);
    callback(index >= 0);
  });
}

function toggleLike(button, house_code, name) {
  isLiked(house_code, (liked) => {
    if (liked) {
      removeLike(house_code);
      button.textContent = '加入关注';
    } else {
      addLike(house_code, name);
      button.textContent = '已关注';
    }
  });
}

function createButton(text, onClick) {
  const button = document.createElement('button');
  button.style.backgroundColor = '#f0f0f0';
  button.style.border = '1px solid #ccc';
  button.style.borderRadius = '3px';
  button.style.padding = '5px 10px';
  button.style.cursor = 'pointer';
  button.style.marginLeft = '5px';
  button.textContent = text;
  button.onclick = onClick;
  return button;
}

function addLike(house_code, name) {
  chrome.storage.local.get(['likes'], function (result) {
    const likes = result.likes || [];
    likes.push({ house_code, name });
    chrome.storage.local.set({ likes: likes }, function () {
      console.log('Added like:', house_code, name);
    });
  });
}

function addToDislikes(house_code, name, itemElement) {
  chrome.storage.local.get(['dislikes'], function (result) {
    const dislikes = result.dislikes || [];
    dislikes.push({ house_code, name });
    chrome.storage.local.set({ dislikes }, function () {
      console.log('Added to dislikes:', { house_code, name });
    });
  });
}

function hideItem(item) {
  item.style.borderRaidus = '5px';
  item.style.height = '12px';
  item.style.filter = 'grayscale(100%) blur(3px)';
  item.style.overflow = 'hidden';
  item.style.border = '1px solid gray';
}

function hideDislikedItems() {
  chrome.storage.local.get(['dislikes'], function (result) {
    const dislikes = result.dislikes || [];
    const items = document.getElementsByClassName('content__list--item');

    for (let i = 0; i < items.length; i++) {
      const house_code = items[i].getAttribute('data-house_code');
      const name = items[i].querySelector('.content__list--item--aside').getAttribute('title');

      if (dislikes.some(dislike => dislike.house_code === house_code)) {
        items[i].style.borderRaidus = '5px';
        items[i].style.height = '12px';
        items[i].style.filter = 'grayscale(100%) blur(3px)';
        items[i].style.overflow = 'hidden';
        items[i].style.border = '1px solid gray';
      } else {
      }
    }
  });
}

hideDislikedItems();
