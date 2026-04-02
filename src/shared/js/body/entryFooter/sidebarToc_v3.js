'use strict';

{
  const stoc = document.querySelector('nav');
  const toc  = document.createElement('div');
  toc.classList.add('toc');
  stoc.appendChild(toc);

  const line = [];
  const h3Els = document.querySelectorAll('h3');
  for (let i = 0; i < h3Els.length; i++) {
    if (!h3Els) continue;
    line.push[h3Els[i].textContent];

    const h4Els = document.querySelectorAll('h4');
    if (!h4Els) continue;
    for (let j = 0; j < h4Els.length; j++) {
      line.push(h4Els[j].textContent);

      const h5Els = document.querySelectorAll('h5');
      if (!h5Els) continue;
      for (let k = 0; k < h5Els.length; k++) {
        line.push(h5Els[k].textContent);

        const h6Els = document.querySelectorAll('h6');
        for (let l = 0; l < h6Els.length; l++) {
          if (!h6Els[i]) continue;
          line.push(h6Els[l].textContent);
        }
      }
    }
  }

  console.log(line);

  const ulH3 = document.createElement('ul');
  ulH3.classList.add('ul-h3');

  const liH3 = document.createElement('li');
  liH3.classList.add('li-h3');
  liH3.textContent = line[0];

  const ulH4 = document.createElement('ul');
  ulH4.classList.add('ul-h4');

  const liH4 = document.createElement('li');
  liH4.classList.add('li-h4');
  liH4.textContent = line[1];

  stoc.appendChild(ulH3).appendChild(liH3).appendChild(ulH4).appendChild(liH4);
}

// export { index };