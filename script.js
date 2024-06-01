var schedule = []
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
  
  readJSONFromURL('./schedule.json', (err, json) => {
    if (err) {
      console.error('Ошибка загрузки JSON:', err);
      return;
    }
    console.log('Загруженный JSON:', json);
    schedule = json;
  });

  setTimeout(() => {
      
    const ul = document.createElement('ul');

    schedule.forEach(function(event) {
      const li = document.createElement('li');
      li.textContent = event.name + ' в ' + event.time + ' (занято ' + event.current + ' из ' + event.max + ')' + ' (Вы не записаны)';
    
      const button = document.createElement('button');
      button.textContent = 'Участвовать в этом безобразии';

      const buttonOut = document.createElement('button');
      buttonOut.textContent = 'Отказаться от участия';
    
      buttonOut.addEventListener('click', function() {
          event.current--;
          li.textContent = event.name + ' в ' + event.time + ' (занято ' + event.current + ' из ' + event.max + ')' + ' (Вы не записаны)';
          li.appendChild(button);
        }
      );
      if (event.yourParticipation === true) {
        li.textContent = event.name + ' в ' + event.time + ' (занято ' + event.current + ' из ' + event.max + ')' + ' (Вы не записаны)';
        event.yourParticipation === false;
        li.appendChild(buttonOut);
      }

      if (event.current < event.max) {
        button.disabled = false;
        button.addEventListener('click', function() {
          if (event.current < event.max || event.yourParticipation === false) {
            event.current++;
            li.textContent = event.name + ' в ' + event.time + ' (занято ' + event.current + ' из ' + event.max + ')' + ' (Вы записаны)';
            event.yourParticipation === true;
            li.appendChild(buttonOut);
          }
        });
      } else {
        button.disabled = true;
        button.textContent = 'Запись на безобразие недоступна, группа не резиновая';
      }
    
      li.appendChild(button);
      ul.appendChild(li);
    });
    
    const divHolder = document.querySelector('.sports_activities__schedule-holder');
    divHolder.appendChild(ul);

  }, 1000);

