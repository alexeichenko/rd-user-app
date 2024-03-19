function UsersService(baseUrl) {
  this.baseUrl = baseUrl;
}

UsersService.prototype.getAllUsers = async function () {
  try {
    const response = await fetch(this.baseUrl);
    if (response.ok) {
      const data = response.json();
      return data;
    } else {
      throw new Error(`Something went wrong... Reason: ${response.status}`);
    }
  } catch (error) {
    console.error(`Could not get user list.`, error);
    return {};
  };
};

UsersService.prototype.getUserById = async function (id) {
  try {
    const response = await fetch(`${this.baseUrl}/${id}`);
    if (response.ok) {
      const data = response.json();
      return data;
    } else {
      throw new Error(`Something went wrong... Reason: ${response.status}`);
    }
  } catch (error) {
    console.error(`Could not get user.`, error);
    return {};
  };
};

UsersService.prototype.renderUsersList = function (list) {

  const singleUser = document.querySelector('.user');
  const loadingStatus = document.createElement('div');
  loadingStatus.innerHTML = '<p>Loading...</p>'
  loadingStatus.classList.add('user__loading');
  singleUser.appendChild(loadingStatus);

  list.forEach((user) => {

    // Users list and users item:
    const usersList = document.querySelector('.users__list');
    const usersItem = document.createElement('li');
    usersItem.classList.add('users__item');
    const userItem = document.createElement('div');
    userItem.classList.add('user__item');
    // ====================================================

    // USER IMAGES
    const imgUrlParams = new URLSearchParams({ w: 120, h: 120 });
    imgUrlParams.append('r', user.id);
    const imgSrc = `https://api.lorem.space/image/face?${imgUrlParams.toString()}`;
    const imgAlt = `${user.name} profile picture`;
    // ====================================================

    // USER CARD
    function createUserCard(key, value) {
      const figure = document.createElement('figure');
      const img = document.createElement('img');
      const figcaption = document.createElement('figcaption');
      const title = document.createElement('h3');
      const list = document.createElement('ul');
      const liKey = document.createElement('li');
      const liValue = document.createElement('li');

      img.src = imgSrc;
      img.alt = imgAlt;
      title.textContent = `${user.name}`;
      liKey.textContent = key;
      liValue.textContent = value;

      figure.appendChild(img);
      figure.appendChild(figcaption);
      figcaption.appendChild(title);
      figcaption.appendChild(list);
      list.appendChild(liKey);
      list.appendChild(liValue);

      figure.className = 'card-user'
      img.className = 'card-user__image'
      figcaption.className = 'card-user__description'
      title.className = 'card-user__name'
      list.className = 'card-user__caption'
      liKey.className = 'card-user__value'
      liValue.className = 'card-user__value'
      const userCardDF = new DocumentFragment();
      userCardDF.appendChild(figure);
      return userCardDF;
    };
    usersItem.appendChild(createUserCard('Company: ', `${user.company.name}`));
    usersList.appendChild(usersItem);
    // ====================================================

    // GET ADDITIONAL DATA
    const getUserInfo = async () => {
      usersItem.removeEventListener('click', getUserInfo);
      const userInfo = await this.getUserById(user.id);
      singleUser.innerHTML = '';
      // ====================================================
      // Adding user card

      userItem.appendChild(createUserCard(`Username: `, `${userInfo.username}`))
      // ====================================================

      // Adding additional info list
      function getAdditionalInfo() {
        let userKeysMapDF = new DocumentFragment();

        const userProfileValues = new Map([['Company', `${userInfo.company.name}`],
        ['Phone', `${userInfo.phone}`],
        ['Email', `${userInfo.email}`],
        ['Address', `${userInfo.address.suite}, ${userInfo.address.street}, ${userInfo.address.city} / ${userInfo.address.zipcode}`],
        ]);

        for (const [key, value] of userProfileValues) {
          let ul = document.createElement('ul');
          let liKey = document.createElement('li');
          let liValue = document.createElement('li');
          liKey.textContent = `${key}`;
          liValue.textContent = `${value}`;
          liKey.className = 'profile-user__item';
          liValue.className = 'profile-user__item';
          if (key === 'Email') {
            liValue.innerHTML = `<a href="mailto:${value}" class="profile-user__link">${value}</a>`;
          }
          ul.appendChild(liKey);
          ul.appendChild(liValue);
          ul.className = 'profile-user__list';
          userKeysMapDF.appendChild(ul);
        }

        return userKeysMapDF;
      };
      // ====================================================
      // Append childs
      const profileUser = document.createElement('div');
      profileUser.classList.add('profile-user');
      profileUser.appendChild(getAdditionalInfo());
      userItem.appendChild(profileUser);
      singleUser.appendChild(userItem);
      singleUser.removeChild(loadingStatus);
    };

    // =====================================================
    // EVENT LISTENER ON SINGLE USER
    usersItem.addEventListener('click', getUserInfo);
  });

};