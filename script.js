var schedule = [];

function readJSONFromURL(url, callback) {
  fetch(url)
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(json => {
      callback(null, json);
    })
    .catch(error => {
      callback(error, null);
    });
}

function attachEventHandlers() {
  const ul = document.createElement('ul');
  schedule.forEach(function(event) {
    const li = document.createElement('li');
    li.textContent = event.name + ' в ' + event.time + ' (занято ' + event.current + ' из ' + event.max + ')' + (event.yourParticipation === false ? ' (Вы не записаны)' : ' (Вы записаны)');

    const button = document.createElement('button');
    button.textContent = 'Участвовать в этом безобразии';
    button.classList.add('btn');
    button.classList.add('btn-outline-success');

    const buttonOut = document.createElement('button');
    buttonOut.textContent = 'Отказаться от участия';
    buttonOut.classList.add('btn');
    buttonOut.classList.add('btn-outline-danger');

    buttonOut.addEventListener('click', function() {
      event.current--;
      li.textContent = event.name + ' в ' + event.time + ' (занято ' + event.current + ' из ' + event.max + ')' + ' (Вы не записаны)';
      event.yourParticipation = false;
      localStorage.setItem('schedule', JSON.stringify(schedule));
      updateUI();
    });

    if (event.yourParticipation === true) {
      li.textContent = event.name + ' в ' + event.time + ' (занято ' + event.current + ' из ' + event.max + ')' + ' (Вы записаны)';
      li.appendChild(buttonOut);
      localStorage.setItem('schedule', JSON.stringify(schedule));
    }

    if (event.current < event.max && event.yourParticipation === false) {
      button.disabled = false;
      button.addEventListener('click', function() {
        event.current++;
        li.textContent = event.name + ' в ' + event.time + ' (занято ' + event.current + ' из ' + event.max + ')' + ' (Вы записаны)';
        event.yourParticipation = true;
        localStorage.setItem('schedule', JSON.stringify(schedule));
        li.appendChild(buttonOut);
        updateUI();
      });
    } else if (event.current >= event.max) {
      button.disabled = true;
      button.textContent = 'Запись на безобразие недоступна, группа не резиновая';
      button.classList.add('btn');
      button.classList.add('btn-outline-warning');
    }

    event.yourParticipation === true ? li.appendChild(buttonOut) : li.appendChild(button);
    ul.appendChild(li);
  });

  const divHolder = document.querySelector('.sports_activities__schedule-holder');
  divHolder.innerHTML = '';
  divHolder.appendChild(ul);
}

function updateUI() {
  attachEventHandlers(); 
}

readJSONFromURL('./schedule.json', (err, json) => {
  if (err) {
    console.error('Ошибка загрузки JSON:', err);
    return;
  }
  console.log('Загруженный JSON:', json);
  schedule = json;
  if (localStorage.getItem('schedule')) {
    schedule = JSON.parse(localStorage.getItem('schedule'));
  } else {
    localStorage.setItem('schedule', JSON.stringify(schedule));
  }
  attachEventHandlers(); 
});
