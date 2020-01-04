// import { loadPromotion as _loadPromotion } from "./promotion.js";

let data = getLocalData();
loadItems(data);

function getLocalData() {
  let storage = window.localStorage;
  return JSON.parse(storage.getItem("foodData"));
}

function saveToLocalData(data) {
  let storage = window.localStorage;
  let dataStr = JSON.stringify(data);
  storage.setItem("foodData", dataStr);
}

function loadItems(data) {
  let itemsContainer = document.getElementById("items");

  loadItemsHead();
  for (let i = 0, len =  data.length; i < len; i++) {
    let aItem = document.createElement("tr");
    aItem.innerHTML = `
    <td>${data[i]["name"]}</td>
    <td>${data[i]["price"]}</td>
    <td>
      <input id="countInput-${i}" oninput="inputAndUpdate(event)">
    </td>
    `;
    itemsContainer.appendChild(aItem);
    aItem.setAttribute("id", `food-${i}`);
  }
}

function loadItemsHead() {
  let itemsContainers = document.getElementById("items");
  let itemsHead = document.createElement("table");
  itemsHead.innerHTML = 
  `
    <tr>
      <td>名称</td>
      <td>价格</td>
      <td>数量</td>
    </tr>
  `;
  itemsContainers.appendChild(itemsHead);
}

function getSelectedItems(data) {
  let selectedItems = data.filter(item => item.count > 0);

  return selectedItems;
  }

function discountMessage(type) {
  let data = getLocalData();
  let selectedItems = getSelectedItems(data);

  if (type === "banJia") {
    let banJiaFood = selectedItems.filter(item => item.id === "ITEM0001" | item.id === "ITEM0022");
    let discountMoney = 0;
    for (item of banJiaFood) {
      discountMoney += item.count * 0.5 * item.price;
    }
    let discountMessage = `
    ---------------------------------
    使用优惠：
    指定菜品半价（黄焖鸡，凉皮），省${discountMoney}元。
    ---------------------------------
    `
    return discountMessage;

  } else if (type === "manJian") {
    let discountMessage = `
    ---------------------------------
    使用优惠：
    满30减6元，省6元。
    ---------------------------------
    `
    return discountMessage;

  } else {
    let discountMessage = "";
    return discountMessage;
  }
}

function calculatePrice() {
  let data =  getLocalData();
  let selectedItems = getSelectedItems(data);
  let sumMoney = sum(selectedItems);
  let judge = judgement(sumMoney, selectedItems);
  
  let message = document.getElementById("message");
  message.innerHTML = "";// 清空

  let orderTitle = document.createElement("span");
  orderTitle.innerHTML = `
  ====================订餐明细====================
  `;
  message.appendChild(orderTitle);
  // 添加点菜项目
  for (let i = 0, len = selectedItems.length; i < len; i++) {
    let aOrderItem = document.createElement("li");
    let aFood = selectedItems[i];
    aOrderItem.innerHTML = `
      ${aFood["name"]}  x  ${aFood["count"]}  =  ${aFood["price"] * aFood["count"]} 元
    `;

    message.appendChild(aOrderItem);
  }
  //添加优惠信息
  let discountDetail = document.createElement("span");
  discountDetail.innerHTML = `
  -----------------------------------------------
    已使用优惠：${judge["type"]}, 已省${judge["discountMoney"]}元
  -----------------------------------------------
  `;

  message.appendChild(discountDetail);
  // 添加总计
  let summay = document.createElement("span");
  summay.innerHTML = `
    总计：${sumMoney - judge["discountMoney"]}
  `;
  message.appendChild(summay);

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
      let discountMoney = calResult.discountMoney;

      if (banJia <= manJian) {
        return {type: '指定菜品半价', items: ['ITEM0001', 'ITEM0022'], discountMoney: discountMoney};
      } else {
        return {type: '满30减6元', discountMoney: 6};
      }

    } else {
      let manJian = sumMoney;
      let calResult = calculateBanJia(sumMoney, selectedItems);
      let banJia = calResult.sumMoney;
      let discountMoney = calResult.discountMoney;

      if (banJia < manJian) {
        return {type: '指定菜品半价', items: ['ITEM0001', 'ITEM0022'], discountMoney: discountMoney};
      } else {
        return {type: '暂时未达到优惠条件', discountMoney: 0};
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
}

function inputAndUpdate(event) {
  let targetId = event.target.id;
  let index = parseInt(targetId.substring(targetId.length - 1));

  // 先对数据更新
  let data = getLocalData();
  let inputValue = event.target.value;
  data[index]["count"] = inputValue;

  saveToLocalData(data);
  loadPromotions() // 打印优惠内容
}

function loadPromotions() {
  let data = getLocalData();
  let selectedItems = getSelectedItems(data);
  let inputData = selectedItems.map(item => item.id + "x" + item.count);
  let sumMoney = sum(selectedItems);
  let judge = judgement(sumMoney, selectedItems);

  let promotion = document.getElementById("promotions");
  let promotionPrint = document.createElement("p");
  promotion.innerHTML = ``;

  promotionPrint.innerHTML = `
    使用优惠：${judge["type"]}, 已优惠${judge["discountMoney"]}元
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
      let discountMoney = calResult.discountMoney;

      if (banJia <= manJian) {
        return {type: '指定菜品半价', items: ['ITEM0001', 'ITEM0022'], discountMoney: discountMoney};
      } else {
        return {type: '满30减6元', discountMoney: 6};
      }

    } else {
      let manJian = sumMoney;
      let calResult = calculateBanJia(sumMoney, selectedItems);
      let banJia = calResult.sumMoney;
      let discountMoney = calResult.discountMoney;

      if (banJia < manJian) {
        return {type: '指定菜品半价', items: ['ITEM0001', 'ITEM0022'], discountMoney: discountMoney};
      } else {
        return {type: '暂时未达到优惠条件', discountMoney: 0};
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

function clearAll() {
  let promotion = document.getElementById("promotions");
  promotion.innerHTML = "";

  let message = document.getElementById("message");
  message.innerHTML = "";

  let items = document.getElementById("items");
  items.innerHTML = "";

  loadAllItems();
  let data = getLocalData();
  loadItems(data);
}