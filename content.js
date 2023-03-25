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

function createButtonsContainer() {
  const container = document.createElement('div');
  container.style.position = 'absolute';
  container.style.right = '10px';
  container.style.bottom = '20px';
  container.style.display = 'flex';
  container.style.gap = '4px';
  return container;
}

function getItemInfo(item) {
  const house_code = item.getAttribute('data-house_code');
  const name = item.querySelector('.content__list--item--aside').getAttribute('title');
  const href = item.querySelector('.content__list--item--aside').getAttribute('href');
  const price = item.querySelector('.content__list--item-price em').textContent;

  const neighborhoodLinkElement = item.querySelector('.content__list--item--des a:nth-child(3)');
  const neighborhoodTitle = neighborhoodLinkElement.textContent.trim();
  const neighborhoodHref = neighborhoodLinkElement.getAttribute('href');

  return { house_code, name, href, price, neighborhoodHref, neighborhoodTitle };
}

function updateStorage(key, value) {
  return new Promise((resolve) => {
    chrome.storage.local.set({ [key]: value }, resolve);
  });
}

function getStorage(key) {
  return new Promise((resolve) => {
    chrome.storage.local.get([key], (result) => resolve(result[key]));
  });
}

// 添加一个新的不关注的小区到列表中
async function addIgnoredNeighborhood(neighborhoodInfo) {
  const ignoredNeighborhoods = await getStorage('ignoredNeighborhoods') || [];
  ignoredNeighborhoods.push(neighborhoodInfo);
  await updateStorage('ignoredNeighborhoods', ignoredNeighborhoods);
}

// 从列表中移除一个不关注的小区
async function removeIgnoredNeighborhood(neighborhoodHref) {
  const ignoredNeighborhoods = await getStorage('ignoredNeighborhoods') || [];
  const index = ignoredNeighborhoods.findIndex((n) => n.neighborhoodHref === neighborhoodHref);

  if (index >= 0) {
    ignoredNeighborhoods.splice(index, 1);
    await updateStorage('ignoredNeighborhoods', ignoredNeighborhoods);
  }
}

async function toggleLike(button, house_code, item) {
  const likes = await getStorage('likes') || [];
  const index = likes.findIndex((like) => like.house_code === house_code);

  if (index >= 0) {
    likes.splice(index, 1);
    button.textContent = '加入关注';
  } else {
    likes.push(getItemInfo(item));
    button.textContent = '已关注';
  }

  await updateStorage('likes', likes);
}

function createLikeButton(house_code, item) {
  const button = createButton('检查中...', async () => {
    await toggleLike(button, house_code, item);
  });

  (async () => {
    const likes = await getStorage('likes') || [];
    const isLiked = likes.some((like) => like.house_code === house_code);
    button.textContent = isLiked ? '已关注' : '加入关注';
  })();

  return button;
}

function createDislikeButton(house_code, item) {
  const button = createButton('不看这个房子', async () => {
    bluredItem(item);
    const dislikes = await getStorage('dislikes') || [];

    dislikes.push(getItemInfo(item));
    await updateStorage('dislikes', dislikes);
  });

  return button;
}

function createIgnoreNeighborhoodButton(item) {
  const button = createButton("不看这个小区", async () => {
    // 获取房源信息，包括小区信息
    const itemInfo = getItemInfo(item);

    // 添加到 ignoredNeighborhoods 列表
    await addIgnoredNeighborhood({
      neighborhoodTitle: itemInfo.neighborhoodTitle,
      neighborhoodHref: itemInfo.neighborhoodHref,
    });

    // 使用 bluredItem 函数将房源变得模糊
    bluredItem(item);
  });

  return button;
}

function bluredItem(item) {
  item.style.height = '8px';
  item.style.overflow = 'hidden';
  item.style.filter = 'blur(3px) grayscale(1)';
}

function setupItem(item) {
  const { house_code } = getItemInfo(item);

  const buttonsContainer = createButtonsContainer();
  item.style.position = 'relative';
  item.appendChild(buttonsContainer);

  const dislikeButton = createDislikeButton(house_code, item);
  buttonsContainer.appendChild(dislikeButton);

  const ignoreNeighborhoodButton = createIgnoreNeighborhoodButton(item);
  buttonsContainer.appendChild(ignoreNeighborhoodButton);

  const likeButton = createLikeButton(house_code, item);
  buttonsContainer.appendChild(likeButton);
}

function init() {
  const items = document.querySelectorAll('.content__list--item');

  chrome.storage.local.get(['dislikes', 'ignoredNeighborhoods'], (result) => {
    const dislikes = result.dislikes || [];
    const ignoredNeighborhoods = result.ignoredNeighborhoods || [];

    items.forEach((item) => {
      const adElements = item.querySelectorAll('.content__list--item--ad');
      if (adElements.length > 0) {
        item.style.display = 'none';
      } else {
        const info = getItemInfo(item);

        const isDisliked = dislikes.some((dislike) => dislike.house_code === info.house_code);
        const isNeighborhoodIgnored = ignoredNeighborhoods.some(
          (ignoredNeighborhood) => ignoredNeighborhood.neighborhoodHref === info.neighborhoodHref
        );

        if (isDisliked || isNeighborhoodIgnored) {
          bluredItem(item);
        } else {
          setupItem(item);
        }

      }
    });
  });
}

init();

