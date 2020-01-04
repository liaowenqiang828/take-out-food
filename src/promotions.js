function loadPromotions() {
  let data = getLocalData();
  let selectedItems = getSelectedItems(data);
  let inputData = selectedItems.map(item => item.id + "x" + item.count);
  let sumMoney = sum(selectedItems);
  let judge = judgement(sumMoney, selectedItems);

  let promotion = document.getElementById("promotions");
  let promotionPrint = document.createElement("p");

  promotionPrint.innerHTML = `
    已使用优惠：${judge["type"]}
  `;

  promotion.appendChild(promotionPrint);


  function getLocalData() {
    let storage = window.localStorage;
    return JSON.parse(storage.getItem("foodData"));
  }
  function getSelectedItems(data) {
    let selectedItems = data.filter(item => item.count > 0);
  
    return selectedItems;
  }
  function sum(selectedItems) {
    let sumMoney = 0;
    for (item of selectedItems) {
      sumMoney += item.count * item.price;
    }
    return sumMoney;
  }
  function judgement(sumMoney, selectedItems) {
    if (sumMoney >= 30) {
      let manJian = sumMoney - 6;
      let calResult = calculateBanJia(sumMoney, selectedItems);
      let banJia = calResult.sumMoney;

      if (banJia <= manJian) {
        return {type: '指定菜品半价', items: ['ITEM0001', 'ITEM0022']};
      } else {
        return {type: '满30减6元'};
      }

    } else {
      let manJian = sumMoney;
      let calResult = calculateBanJia(sumMoney, selectedItems);
      let banJia = calResult.sumMoney;

      if (banJia < manJian) {
        return {type: '指定菜品半价', items: ['ITEM0001', 'ITEM0022']};
      } else {
        return {type: '暂时未达到优惠条件'};
      }
    }
  }
  function calculateBanJia(sumMoney, selectedItems) {
    let discountMoney = 0;
    for (item of selectedItems) {
      if (item.id === "ITEM0001" || item.id === "ITEM0022") {
        sumMoney -= item.price * item.count * 0.5;
        discountMoney += item.price * item.count * 0.5;
      }
    }
    return {sumMoney: sumMoney, "discountMoney": discountMoney};
  }

  // return [{
  //   type: '满30减6元'
  // }, {
  //   type: '指定菜品半价',
  //   items: ['ITEM0001', 'ITEM0022']
  // }];
}

// loadPromotions();
// const _loadPromotions = loadPromotions;
// export { _loadPromotions as loadPromotions };