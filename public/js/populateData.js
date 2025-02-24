const socket = io();

socket.on('prices', (result) => {

    let previousPrice = {};
    let previousDelta24 = {};   
    result.data.forEach((coin) => {

        const row = $(`.data [data-name="${coin.slug}"]`);
        const up = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-caret-up-square" viewBox="0 0 16 16">
        <path d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2z"/>
        <path d="M3.544 10.705A.5.5 0 0 0 4 11h8a.5.5 0 0 0 .374-.832l-4-4.5a.5.5 0 0 0-.748 0l-4 4.5a.5.5 0 0 0-.082.537"/>
      </svg>`;
        const down = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-caret-down-square" viewBox="0 0 16 16">
        <path d="M3.626 6.832A.5.5 0 0 1 4 6h8a.5.5 0 0 1 .374.832l-4 4.5a.5.5 0 0 1-.748 0z"/>
        <path d="M0 2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2zm15 0a1 1 0 0 0-1-1H2a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1z"/>
      </svg>`;

        let market_cap;
        if (coin.quote.USD.market_cap < 1000) {
            market_cap = coin.quote.USD.market_cap.toString();
        } else if (coin.quote.USD.market_cap < 1_000_000) {
            market_cap = (coin.quote.USD.market_cap / 1_000).toFixed(1) + 'K';
        } else if (coin.quote.USD.market_cap < 1_000_000_000) {
            market_cap = (coin.quote.USD.market_cap / 1_000_000).toFixed(1) + 'M';
        } else if (coin.quote.USD.market_cap < 1_000_000_000_000) {
            market_cap = (coin.quote.USD.market_cap / 1_000_000_000).toFixed(1) + 'B';
        } else {
            market_cap = (coin.quote.USD.market_cap / 1_000_000_000_000).toFixed(1) + 'T';
        }

        if (row.length) { //after 1st api call
            const priceElement = document.querySelector(`[data-name="${coin.slug}"] .price .price-icon`);
            const caretDown = priceElement.querySelector(".bi-caret-down-square");
            const caretUp = priceElement.querySelector(".bi-caret-up-square");


            if (parseFloat(coin.quote.USD.price.toFixed(2)) > previousPrice[coin.slug]) { //if new price went up compared to prevPrice
                console.log("Price went up");
                console.log(parseFloat(coin.quote.USD.price.toFixed(2)), previousPrice);
                previousPrice[coin.slug] = parseFloat(coin.quote.USD.price.toFixed(2));

                if (caretDown) {
                    priceElement.outerHTML = up;
                }
                else if (caretUp) {
                    console.log("Price went up and went up again");
                }
                else {
                    priceElement.innerHTML += up;
                }
            }
            else if (parseFloat(coin.quote.USD.price.toFixed(2)) < previousPrice[coin.slug]) { //new price lower than or equal to prevPrice
                console.log("Price went down");
                console.log(parseFloat(coin.quote.USD.price.toFixed(2)), previousPrice);
                previousPrice[coin.slug] = parseFloat(coin.quote.USD.price.toFixed(2));
                if (caretUp) {
                    priceElement.outerHTML = down;
                }
                else if (caretDown) {
                    console.log("Price went down before and price went down again");
                }
                else {
                    priceElement.innerHTML += down;
                }
            }
            else {
                console.log("No change in price");
            }

            if (parseFloat(coin.quote.USD.percent_change_24h.toFixed(2)) > previousDelta24[coin.slug]) { //if new delta24 went up
                previousDelta24 = coin.quote.USD.percent_change_24h.toFixed(2);
                if (document.querySelector(`[data-name="${coin.slug}"] .delta_24h`).innerHTML.includes("bi-caret-down-square")) {
                    document.querySelector(`[data-name="${coin.slug}"] .delta_24h`).innerHTML = document.querySelector(`[data-name="${coin.slug}"] .delta_24h`).innerHTML.replace(down, up);
                }
                else if (document.querySelector(`[data-name="${coin.slug}"] .delta_24h`).innerHTML.includes("bi-caret-up-square")) {
                    console.log("delta24 went up before and delta24 went up again");
                }
                else {
                    document.querySelector(`[data-name="${coin.slug}"] .delta_24h`).innerHTML += up;
                }
            }
            else if (parseFloat(coin.quote.USD.percent_change_24h.toFixed(2)) < previousDelta24[coin.slug]) { //new delta24h lowered or equal to prevDelta24
                previousDelta24 = coin.quote.USD.percent_change_24h.toFixed(2);
                if (document.querySelector(`[data-name="${coin.slug}"] .delta_24h`).innerHTML.includes("bi-caret-up-square")) {
                    document.querySelector(`[data-name="${coin.slug}"] .delta_24h`).innerHTML = document.querySelector(`[data-name="${coin.slug}"] .delta_24h`).innerHTML.replace(up, down);
                }
                else if (document.querySelector(`[data-name="${coin.slug}"] .delta_24h`).innerHTML.includes("bi-caret-down-square")) {
                    console.log("delta24 went down before and delta24 went down again");
                }
                else {
                    document.querySelector(`[data-name="${coin.slug}"] .delta_24h`).innerHTML += down;
                }
            }
            else {
                console.log("No change in delta24h");
            }

            row.find('.price').text(parseFloat(coin.quote.USD.price.toFixed(2)));
            row.find('.delta_24h').text(parseFloat(coin.quote.USD.percent_change_24h.toFixed(2)));
            row.find('.market_cap').text(market_cap);
        }

        else { //first ever api call
            previousPrice[coin.slug] = parseFloat(coin.quote.USD.price.toFixed(2));
            previousDelta24[coin.slug] = parseFloat(coin.quote.USD.percent_change_24h.toFixed(2));

            const newRow = `<tr data-name="${coin.slug}">
                <th>${coin.name}</th>
                <td class="price"><span class="price-icon"></span>${coin.quote.USD.price.toFixed(2)}</td>
                <td class="delta_24h"> ${coin.quote.USD.percent_change_24h.toFixed(2)}</td>
                <td class="market_cap">${market_cap}</td>
                </tr>`;

            $(".data").append(newRow);
        }
    });

});






// socket.on('prices', (result) => {
//     let previousPrice = {};
//     let previousDelta24 = {};

//     result.data.forEach((coin) => {
//         const row = $(`.data [data-name="${coin.slug}"]`);

//         const upIcon = `<svg width="16" height="16" class="bi bi-caret-up-square"> viewBox="0 0 16 16">
//                  <path d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2z"/>
//                  <path d="M3.544 10.705A.5.5 0 0 0 4 11h8a.5.5 0 0 0 .374-.832l-4-4.5a.5.5 0 0 0-.748 0l-4 4.5a.5.5 0 0 0-.082.537"/></svg>`;
//         const downIcon = `<svg width="16" height="16" class="bi bi-caret-down-square"> viewBox="0 0 16 16">
//                  <path d="M3.626 6.832A.5.5 0 0 1 4 6h8a.5.5 0 0 1 .374.832l-4 4.5a.5.5 0 0 1-.748 0z"/>
//                  <path d="M0 2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2zm15 0a1 1 0 0 0-1-1H2a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1z"/></svg>`;

//         if (row.length) {
//             const priceElement = document.querySelector(`[data-name="${coin.slug}"] .price`);
//             const deltaElement = document.querySelector(`[data-name="${coin.slug}"] .delta_24h`);

//             updateTrendIcon(priceElement, parseFloat(coin.quote.USD.price.toFixed(2)), previousPrice, coin.slug, upIcon, downIcon);
//             updateTrendIcon(deltaElement, parseFloat(coin.quote.USD.percent_change_24h.toFixed(2)), previousDelta24, coin.slug, upIcon, downIcon);

//             row.find('.price').text(parseFloat(coin.quote.USD.price.toFixed(2)));
//             row.find('.delta_24h').text(parseFloat(coin.quote.USD.percent_change_24h.toFixed(2)));
//         } else {
//             previousPrice[coin.slug] = parseFloat(coin.quote.USD.price.toFixed(2));
//             previousDelta24[coin.slug] = parseFloat(coin.quote.USD.percent_change_24h.toFixed(2));

//             $(".data").append(`
//                 <tr data-name="${coin.slug}">
//                     <th>${coin.name}</th>
//                     <td class="price"><span class="trend-icon"></span> ${coin.quote.USD.price.toFixed(2)}</td>
//                     <td class="delta_24h"><span class="trend-icon"></span> ${coin.quote.USD.percent_change_24h.toFixed(2)}</td>
//                     <td class="market_cap">${market_cap}</td>
//                 </tr>
//             `);
//         }
//     });
// });



